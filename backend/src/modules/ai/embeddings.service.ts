import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingVector } from './interfaces/ai.interface';

interface EmbeddingCache {
  vector: number[];
  expiresAt: number;
}

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private readonly cache = new Map<string, EmbeddingCache>();
  private readonly cacheTtl = 24 * 60 * 60 * 1000;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = configService.get<string>('AI_API_KEY') || '';
  }

  async generateEmbedding(text: string): Promise<EmbeddingVector> {
    const cacheKey = `emb:${this.hashText(text)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return {
        vector: cached.vector,
        dimensions: cached.vector.length,
        model: 'text-embedding-ada-002',
      };
    }

    try {
      if (this.apiKey) {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: text,
            model: 'text-embedding-ada-002',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const vector = data.data[0].embedding as number[];
          this.cache.set(cacheKey, {
            vector,
            expiresAt: Date.now() + this.cacheTtl,
          });
          return {
            vector,
            dimensions: vector.length,
            model: 'text-embedding-ada-002',
          };
        }
      }
      return this.fallbackEmbedding(text);
    } catch (error) {
      this.logger.error(`Embedding generation failed: ${error}`);
      return this.fallbackEmbedding(text);
    }
  }

  async batchGenerateEmbeddings(texts: string[]): Promise<EmbeddingVector[]> {
    const results: EmbeddingVector[] = [];
    const batchSize = 20;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((t) => this.generateEmbedding(t)),
      );
      results.push(...batchResults);
    }

    return results;
  }

  searchSimilar(
    embedding: number[],
    _limit = 10,
    _threshold = 0.7,
  ): Array<{ id: string; score: number }> {
    return [];
  }

  cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private hashText(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private fallbackEmbedding(text: string): EmbeddingVector {
    const dims = 128;
    const seed = this.hashText(text);
    const vector = Array.from({ length: dims }, (_, i) => {
      const val =
        Math.sin((i + 1) * seed.charCodeAt(i % seed.length) || 1) * 0.5 + 0.5;
      return parseFloat(val.toFixed(6));
    });
    return { vector, dimensions: dims, model: 'fallback-tf-idf' };
  }
}
