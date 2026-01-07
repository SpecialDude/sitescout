
import { GoogleGenAI, Type } from "@google/genai";
import { SiteAnalysis } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  async analyzeWebsite(url: string): Promise<SiteAnalysis> {
    // Using gemini-3-pro-preview for complex reasoning and synthesis tasks
    const prompt = `Perform an deep, exhaustive analysis of the website: ${url}. 
    First, use Google Search to find all main pages and subdirectories. 
    Then, synthesize a comprehensive report covering:
    1. A high-level executive summary.
    2. What the website does (Business Goals).
    3. How it works (Technical architecture, user flows, and integrations).
    4. Full requirements list (Functional, Technical, UX).
    5. A mapping of the site structure (Main pages and their roles).
    
    Ensure you find real page URLs from the domain.
    IMPORTANT: Return ONLY the JSON object. Do not include markdown formatting or citations in the JSON string itself. Citations are handled separately via grounding metadata.`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            url: { type: Type.STRING },
            summary: { type: Type.STRING },
            purpose: { type: Type.STRING },
            howItWorks: { type: Type.STRING },
            requirements: {
              type: Type.OBJECT,
              properties: {
                functional: { type: Type.ARRAY, items: { type: Type.STRING } },
                technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                userExperience: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["functional", "technical", "userExperience"]
            },
            structure: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  page: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["page", "description"]
              }
            }
          },
          required: ["url", "summary", "purpose", "howItWorks", "requirements", "structure"]
        }
      }
    });

    const resultText = response.text || "{}";
    // Attempt parsing but handle the possibility of grounding citations interfering if not properly isolated
    const resultJson = JSON.parse(resultText.replace(/\[\d+\]/g, '')) as SiteAnalysis;
    
    // Always extract URLs from groundingChunks as per rules
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || ""
    })).filter((s: any) => s.uri) || [];

    return { ...resultJson, sources };
  }

  async askFollowUp(url: string, analysis: SiteAnalysis, question: string): Promise<{ answer: string; isDeepDive: boolean; sources: { title: string; uri: string }[] }> {
    const prompt = `
      Context: You have already performed an initial scan of the website ${url}.
      Initial Analysis: ${JSON.stringify(analysis)}
      
      The user is now asking a follow-up question: "${question}"
      
      Instructions:
      1. If the question asks for details not present in the initial analysis (like specific form fields, pricing tiers, API documentation details, or content on a specific sub-page), use the Google Search tool to deep-dive into the site and find the exact answer.
      2. If you use the search tool to find new information, consider this a "Deep Dive".
      3. Provide a detailed, professional answer.
      4. Indicate if a deep-dive search was required to answer.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const answer = response.text || "I couldn't find more information on that.";
    // Extract sources for display in chat as per requirement
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || ""
    })).filter((s: any) => s.uri) || [];

    const usedSearch = !!(response.candidates?.[0]?.groundingMetadata?.searchEntryPoint || sources.length > 0);

    return { 
      answer, 
      isDeepDive: usedSearch,
      sources
    };
  }
}

export const geminiService = new GeminiService();
