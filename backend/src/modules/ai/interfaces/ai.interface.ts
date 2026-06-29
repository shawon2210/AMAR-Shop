export interface AIServiceConfig {
  provider: 'openai' | 'gemini' | 'none';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  fallbackToMock: boolean;
}

export interface ProductDescriptionRequest {
  name: string;
  category: string;
  features: string[];
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'luxury' | 'budget';
}

export interface ReviewSummaryRequest {
  reviews: Array<{ rating: number; comment: string; date: string }>;
  maxLength?: number;
}

export interface CampaignCopyRequest {
  campaignName: string;
  type: string;
  discount?: number;
  targetAudience?: string;
  productCategory?: string;
  startDate?: string;
  endDate?: string;
}

export interface FraudDetectionResult {
  score: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendedAction: 'allow' | 'review' | 'block';
}

export interface UserSegment {
  segment: string;
  confidence: number;
  characteristics: string[];
  recommendedActions: string[];
}

export interface DemandForecast {
  productId: string;
  forecast: Array<{
    date: string;
    predictedDemand: number;
    confidenceLower: number;
    confidenceUpper: number;
  }>;
  trend: 'up' | 'down' | 'stable';
  seasonality: string[];
}

export interface PriceSuggestion {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  reasoning: string[];
}

export interface ModerationResult {
  isApproved: boolean;
  flags: string[];
  categories: string[];
  confidence: number;
}

export interface DuplicateResult {
  isDuplicate: boolean;
  similarProductId?: string;
  similarityScore: number;
  matchFields: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  products?: Array<{ id: string; name: string; price: number }>;
  intent?: string;
}

export interface SemanticMatchResult {
  productId: string;
  score: number;
  matchedOn: string[];
}

export interface BannerGenerationRequest {
  prompt: string;
  size?: 'small' | 'medium' | 'large';
  style?: string;
  text?: string;
}

export interface EmbeddingVector {
  vector: number[];
  dimensions: number;
  model: string;
}
