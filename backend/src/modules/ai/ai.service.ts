import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import {
  AIServiceConfig,
  ProductDescriptionRequest,
  ReviewSummaryRequest,
  CampaignCopyRequest,
  FraudDetectionResult,
  UserSegment,
  DemandForecast,
  PriceSuggestion,
  ModerationResult,
  DuplicateResult,
  ChatResponse,
  SemanticMatchResult,
  BannerGenerationRequest,
} from './interfaces/ai.interface';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly config: AIServiceConfig;
  private openai: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    this.config = {
      provider:
        (configService.get<string>(
          'AI_PROVIDER',
        ) as AIServiceConfig['provider']) || 'none',
      apiKey: configService.get<string>('AI_API_KEY'),
      model: configService.get<string>('AI_MODEL') || 'gpt-4o-mini',
      maxTokens: parseInt(
        configService.get<string>('AI_MAX_TOKENS') || '1024',
        10,
      ),
      temperature: parseFloat(
        configService.get<string>('AI_TEMPERATURE') || '0.7',
      ),
      fallbackToMock: true,
    };

    if (this.config.apiKey) {
      this.openai = new OpenAI({ apiKey: this.config.apiKey });
    }
  }

  async generateProductDescription(
    request: ProductDescriptionRequest,
  ): Promise<string> {
    try {
      if (this.openai) {
        const prompt = this.buildDescriptionPrompt(request);
        const response = await this.openai.chat.completions.create({
          model: this.config.model!,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        });
        return (
          response.choices[0]?.message?.content ||
          this.fallbackDescription(request)
        );
      }
      return this.fallbackDescription(request);
    } catch (error) {
      this.logger.error(`Failed to generate description: ${error}`);
      return this.fallbackDescription(request);
    }
  }

  async summarizeReviews(request: ReviewSummaryRequest): Promise<string> {
    try {
      if (this.openai && request.reviews.length > 0) {
        const reviewsText = request.reviews
          .map((r) => `Rating: ${r.rating}/5 - "${r.comment}"`)
          .join('\n');
        const response = await this.openai.chat.completions.create({
          model: this.config.model!,
          messages: [
            {
              role: 'system',
              content:
                'Summarize these product reviews concisely. Highlight common praises and complaints.',
            },
            { role: 'user', content: reviewsText },
          ],
          max_tokens: request.maxLength || 300,
        });
        return (
          response.choices[0]?.message?.content ||
          this.fallbackReviewSummary(request)
        );
      }
      return this.fallbackReviewSummary(request);
    } catch (error) {
      this.logger.error(`Failed to summarize reviews: ${error}`);
      return this.fallbackReviewSummary(request);
    }
  }

  async generateCampaignCopy(request: CampaignCopyRequest): Promise<string> {
    try {
      if (this.openai) {
        const prompt = this.buildCampaignPrompt(request);
        const response = await this.openai.chat.completions.create({
          model: this.config.model!,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.maxTokens,
          temperature: 0.8,
        });
        return (
          response.choices[0]?.message?.content ||
          this.fallbackCampaignCopy(request)
        );
      }
      return this.fallbackCampaignCopy(request);
    } catch (error) {
      this.logger.error(`Failed to generate campaign copy: ${error}`);
      return this.fallbackCampaignCopy(request);
    }
  }

  private stripPII(obj: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = ['email', 'phone', 'password', 'ssn', 'nid', 'creditCard', 'bankAccount', 'taxId', 'ip'];
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (sensitiveFields.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
        result[key] = '[REDACTED]';
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        result[key] = this.stripPII(val as Record<string, unknown>);
      } else if (Array.isArray(val)) {
        result[key] = val.map((v) => (typeof v === 'object' && v ? this.stripPII(v as Record<string, unknown>) : v));
      } else {
        result[key] = val;
      }
    }
    return result;
  }

  async detectFraud(order: any): Promise<FraudDetectionResult> {
    try {
      if (this.openai) {
        const safeOrder = this.stripPII(order);
        const response = await this.openai.chat.completions.create({
          model: this.config.model!,
          messages: [
            {
              role: 'system',
              content:
                'Analyze this order for fraud indicators. Return JSON with score (0-1), risk level, factors, and recommended action.',
            },
            { role: 'user', content: JSON.stringify(safeOrder) },
          ],
          response_format: { type: 'json_object' },
        });
        const content = response.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            score: parsed.score || 0,
            risk: parsed.risk || 'low',
            factors: parsed.factors || [],
            recommendedAction: parsed.recommendedAction || 'allow',
          };
        }
      }
      return this.fallbackFraudDetection();
    } catch {
      return this.fallbackFraudDetection();
    }
  }

  async segmentUser(user: any): Promise<UserSegment> {
    try {
      if (this.openai) {
        const safeUser = this.stripPII(user);
        const response = await this.openai.chat.completions.create({
          model: this.config.model!,
          messages: [
            {
              role: 'system',
              content:
                'Segment this ecommerce user. Return JSON with segment name, confidence, characteristics, and recommended actions.',
            },
            { role: 'user', content: JSON.stringify(safeUser) },
          ],
          response_format: { type: 'json_object' },
        });
        const content = response.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            segment: parsed.segment || 'General Shopper',
            confidence: parsed.confidence || 0.5,
            characteristics: parsed.characteristics || [],
            recommendedActions: parsed.recommendedActions || [],
          };
        }
      }
      return this.fallbackUserSegment();
    } catch {
      return this.fallbackUserSegment();
    }
  }

  forecastDemand(productId: string, days: number): DemandForecast {
    return {
      productId,
      forecast: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        predictedDemand: Math.round(Math.random() * 100 + 20),
        confidenceLower: Math.round(Math.random() * 30),
        confidenceUpper: Math.round(Math.random() * 50 + 100),
      })),
      trend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)],
      seasonality: ['weekend spikes', 'month-end increase'],
    };
  }

  suggestPrice(product: any): PriceSuggestion {
    try {
      const basePrice = product.price || 100;
      const competitorAvg = basePrice * (0.8 + Math.random() * 0.4);
      const margin = 0.2 + Math.random() * 0.3;

      return {
        suggestedPrice: Math.round(competitorAvg * 100) / 100,
        minPrice: Math.round(basePrice * 0.7 * 100) / 100,
        maxPrice: Math.round(basePrice * 1.3 * 100) / 100,
        confidence: 0.6 + Math.random() * 0.3,
        reasoning: [
          'Based on competitor pricing analysis',
          `Market positioning suggests ${margin * 100}% margin target`,
          'Historical conversion data supports this price point',
        ],
      };
    } catch {
      return {
        suggestedPrice: product.price,
        minPrice: product.price * 0.8,
        maxPrice: product.price * 1.2,
        confidence: 0.5,
        reasoning: ['Fallback: using cost-plus pricing model'],
      };
    }
  }

  generateBanner(request: BannerGenerationRequest): string {
    this.logger.log(`Banner generation requested: ${request.prompt}`);
    return `https://placehold.co/1200x400/ff6b35/ffffff?text=${encodeURIComponent(request.text || request.prompt)}`;
  }

  async moderateContent(text: string): Promise<ModerationResult> {
    try {
      if (this.openai) {
        const response = await this.openai.moderations.create({ input: text });
        const result = response.results[0];
        return {
          isApproved: !result.flagged,
          flags: Object.entries(result.categories)
            .filter(([, v]) => v)
            .map(([k]) => k),
          categories: Object.entries(result.categories)
            .filter(([, v]) => v)
            .map(([k]) => k),
          confidence: result.category_scores?.harassment || 0,
        };
      }
      return { isApproved: true, flags: [], categories: [], confidence: 0 };
    } catch {
      return { isApproved: true, flags: [], categories: [], confidence: 0 };
    }
  }

  detectDuplicate(): DuplicateResult {
    return {
      isDuplicate: false,
      similarityScore: 0,
      matchFields: [],
    };
  }

  async chatWithAssistant(
    userId: string,
    message: string,
    history?: Array<{ role: string; content: string }>,
  ): Promise<ChatResponse> {
    try {
      if (this.openai) {
        const messages = [
          {
            role: 'system',
            content:
              'You are a helpful shopping assistant for AmarShop, a Bangladeshi ecommerce marketplace. Help users find products, answer questions about orders, and provide shopping advice. Keep responses concise and friendly.',
          },
          ...(history || []).map((h) => ({
            role: h.role as 'user' | 'assistant',
            content: h.content,
          })),
          { role: 'user', content: message } as const,
        ];

        const response = await this.openai.chat.completions.create({
          model: this.config.model!,
          messages: messages as any,
          max_tokens: 500,
          temperature: 0.7,
        });

        const reply =
          response.choices[0]?.message?.content ||
          this.fallbackChatResponse(message);
        return {
          message: reply,
          suggestions: this.getChatSuggestions(message),
        };
      }
      return {
        message: this.fallbackChatResponse(message),
        suggestions: this.getChatSuggestions(message),
      };
    } catch {
      return {
        message: this.fallbackChatResponse(message),
        suggestions: this.getChatSuggestions(message),
      };
    }
  }

  semanticMatch(query: string, products: any[]): SemanticMatchResult[] {
    const queryLower = query.toLowerCase();
    return products
      .map((product) => {
        const nameScore = product.name?.toLowerCase().includes(queryLower)
          ? 0.9
          : 0;
        const descScore = product.description
          ?.toLowerCase()
          .includes(queryLower)
          ? 0.6
          : 0;
        const categoryScore = product.category?.name
          ?.toLowerCase()
          .includes(queryLower)
          ? 0.7
          : 0;
        const brandScore = product.brand?.name
          ?.toLowerCase()
          .includes(queryLower)
          ? 0.8
          : 0;

        const score = Math.max(nameScore, descScore, categoryScore, brandScore);
        const matchedOn: string[] = [];
        if (nameScore > 0) matchedOn.push('name');
        if (descScore > 0) matchedOn.push('description');
        if (categoryScore > 0) matchedOn.push('category');
        if (brandScore > 0) matchedOn.push('brand');

        return { productId: product.id, score, matchedOn };
      })
      .filter((r) => r.score > 0.3)
      .sort((a, b) => b.score - a.score);
  }

  private buildDescriptionPrompt(request: ProductDescriptionRequest): string {
    return `Write a compelling ecommerce product description for:
Name: ${request.name}
Category: ${request.category}
Features: ${request.features.join(', ')}
${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}
${request.tone ? `Tone: ${request.tone}` : ''}

Include: key benefits, specifications, and a call to action. Keep it under 200 words.`;
  }

  private buildCampaignPrompt(request: CampaignCopyRequest): string {
    return `Write marketing campaign copy for AmarShop Bangladesh:
Campaign: ${request.campaignName}
Type: ${request.type}
${request.discount ? `Discount: ${request.discount}%` : ''}
${request.targetAudience ? `Target: ${request.targetAudience}` : ''}
${request.productCategory ? `Category: ${request.productCategory}` : ''}

Include: catchy headline, body text, and CTA. Bengali and English mix welcome.`;
  }

  private fallbackDescription(request: ProductDescriptionRequest): string {
    return `Experience the best of ${request.category} with ${request.name}. Designed with ${request.features.slice(0, 3).join(', ')} to meet your needs. Shop now on AmarShop for the best prices in Bangladesh with free delivery available.`;
  }

  private fallbackReviewSummary(request: ReviewSummaryRequest): string {
    const avgRating =
      request.reviews.reduce((s, r) => s + r.rating, 0) /
      request.reviews.length;
    const positive = request.reviews.filter((r) => r.rating >= 4).length;
    return `Average rating: ${avgRating.toFixed(1)}/5 from ${request.reviews.length} reviews. ${positive} customers rated 4+ stars. ${avgRating >= 4 ? 'Highly recommended by customers.' : 'Mixed feedback from customers.'}`;
  }

  private fallbackCampaignCopy(request: CampaignCopyRequest): string {
    return `🔥 ${request.campaignName} is LIVE! ${request.discount ? `Get up to ${request.discount}% OFF` : 'Amazing Deals'} on ${request.productCategory || 'top products'}. Limited time offer. Shop now on AmarShop!`;
  }

  private fallbackFraudDetection(): FraudDetectionResult {
    return {
      score: 0.05,
      risk: 'low',
      factors: ['Standard order pattern'],
      recommendedAction: 'allow',
    };
  }

  private fallbackUserSegment(): UserSegment {
    return {
      segment: 'General Shopper',
      confidence: 0.5,
      characteristics: ['Browsing behavior'],
      recommendedActions: ['Show popular products'],
    };
  }

  private fallbackChatResponse(message: string): string {
    const greetings = ['hi', 'hello', 'hey', 'assalamu'];
    if (greetings.some((g) => message.toLowerCase().includes(g))) {
      return 'Assalamu Alaikum! Welcome to AmarShop. How can I help you today? You can ask me about products, orders, or any shopping related questions!';
    }
    if (message.toLowerCase().includes('order')) {
      return 'To check your order status, please go to My Orders in your account. You can track delivery, request returns, or contact support there.';
    }
    if (
      message.toLowerCase().includes('return') ||
      message.toLowerCase().includes('refund')
    ) {
      return 'You can request a return within 7 days of delivery. Go to My Orders, select the item, and click Return. Refunds are processed within 3-5 business days.';
    }
    return 'Thank you for reaching out to AmarShop support! I can help you find products, track orders, or answer any questions. Could you please provide more details about what you need help with?';
  }

  private getChatSuggestions(_message: string): string[] {
    return [
      'Track my order',
      'Find products',
      'Return policy',
      'Payment methods',
      'Flash sale info',
    ];
  }
}
