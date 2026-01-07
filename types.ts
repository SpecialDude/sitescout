
export interface SiteAnalysis {
  url: string;
  summary: string;
  purpose: string;
  howItWorks: string;
  requirements: {
    functional: string[];
    technical: string[];
    userExperience: string[];
  };
  structure: {
    page: string;
    description: string;
  }[];
  sources: {
    title: string;
    uri: string;
  }[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  CRAWLING = 'CRAWLING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum AppView {
  ANALYZER = 'ANALYZER',
  DOCS = 'DOCS',
  HISTORY = 'HISTORY'
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  data: SiteAnalysis;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isDeepDive?: boolean;
  sources?: {
    title: string;
    uri: string;
  }[];
}
