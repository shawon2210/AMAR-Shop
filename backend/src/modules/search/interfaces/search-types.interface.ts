export interface VectorSearchResult {
  productId: string;
  score: number;
  matchedOn: string[];
}

export interface HybridSearchResult {
  textScore: number;
  vectorScore: number;
  finalScore: number;
  product: any;
}

export interface SearchIntent {
  primary: string;
  categoryIntent?: string;
  brandIntent?: string;
  priceIntent?: 'budget' | 'mid-range' | 'premium' | 'unknown';
  attributes: Record<string, string>;
  confidence: number;
}

export interface SearchAnalyticsEntry {
  id: string;
  query: string;
  userId: string | null;
  resultCount: number;
  clickCount: number;
  filters: Record<string, any>;
  sessionId: string;
  timestamp: Date;
}

export interface SearchClickEntry {
  searchId: string;
  productId: string;
  position: number;
  userId: string | null;
  timestamp: Date;
}

export interface LearningToRankSignal {
  query: string;
  productId: string;
  position: number;
  clicked: boolean;
  dwellTimeMs: number;
  features: Record<string, number>;
}

export interface SearchHeatmapDataPoint {
  date: string;
  hour: number;
  query: string;
  count: number;
}

export interface AutocompleteSuggestion {
  text: string;
  type: 'product' | 'query' | 'category' | 'brand' | 'ai-enhanced';
  score: number;
  metadata?: Record<string, unknown>;
}
