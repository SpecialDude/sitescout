
import { GoogleGenAI, Type } from "@google/genai";
import { SiteAnalysis } from "../types";

export class GeminiService {
  private _ai: GoogleGenAI | null = null;

  private get ai(): GoogleGenAI {
    if (!this._ai) {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found in process.env.API_KEY. Intelligence functions will be unavailable.");
      }
      this._ai = new GoogleGenAI({ apiKey });
    }
    return this._ai;
  }

  async analyzeWebsite(url: string): Promise<SiteAnalysis> {
    const prompt = `Perform an deep, exhaustive analysis of the website: ${url}. 
    First, use Google Search to find all main pages and subdirectories. 
    Then, synthesize a comprehensive report covering:
    1. A high-level executive summary.
    2. What the website does (Business Goals).
    3. How it works (Technical architecture, user flows, and integrations).
    4. Full requirements list (Functional, Technical, UX).
    5. A mapping of the site structure (Main pages and their roles).
    
    Ensure you find real page URLs from the domain.
    IMPORTANT: Return ONLY the JSON object. Do not include markdown formatting or citations in the JSON string itself.`;

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

    let resultText = response.text || "{}";
    
    // Cleanup possible markdown code blocks if the model ignores the instruction
    if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    try {
      // Robust sanitization: remove citations like [1], [2] which models occasionally inject into JSON strings
      const sanitizedJson = resultText.replace(/\[\d+\]/g, '');
      const resultJson = JSON.parse(sanitizedJson) as SiteAnalysis;
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || ""
      })).filter((s: any) => s.uri) || [];

      return { ...resultJson, sources };
    } catch (e) {
      console.error("Critical: Failed to parse AI intelligence payload.", e);
      throw new Error("Intelligence synthesis failed. The model output was non-compliant with the schema.");
    }
  }

  async askFollowUp(url: string, analysis: SiteAnalysis, question: string): Promise<{ answer: string; isDeepDive: boolean; sources: { title: string; uri: string }[] }> {
    const prompt = `
      Context: You have already performed an initial scan of the website ${url}.
      Initial Analysis: ${JSON.stringify(analysis)}
      
      The user is now asking a follow-up question: "${question}"
      
      Instructions:
      1. If the question asks for details not present in the initial analysis, use Google Search to deep-dive.
      2. Provide a detailed, professional answer.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const answer = response.text || "I couldn't find more information on that.";
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
