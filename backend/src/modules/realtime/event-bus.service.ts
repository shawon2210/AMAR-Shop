import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DomainEventEnvelope, DomainEventName, DomainEventTypes, DomainEventHandler } from './interfaces/domain-event.interface';

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private readonly handlers = new Map<string, Set<DomainEventHandler>>();
  private readonly retryCount = 3;
  private readonly retryDelay = 1000;

  async publish<T extends DomainEventName>(
    type: T,
    data: DomainEventTypes[T],
    correlationId?: string,
  ): Promise<void> {
    const envelope: DomainEventEnvelope = {
      id: uuidv4(),
      type,
      timestamp: new Date(),
      version: 1,
      data,
      correlationId: correlationId || uuidv4(),
    };

    const handlers = this.handlers.get(type);
    if (!handlers || handlers.size === 0) {
      this.logger.debug(`No handlers for event ${type}`);
      return;
    }

    const promises: Promise<void>[] = [];
    handlers.forEach(handler => {
      promises.push(this.executeWithRetry(handler, envelope));
    });

    await Promise.allSettled(promises);
  }

  subscribe<T extends DomainEventName>(
    eventType: T,
    handler: DomainEventHandler<DomainEventTypes[T]>,
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as DomainEventHandler);
    this.logger.debug(`Handler registered for event ${eventType}`);
  }

  unsubscribe<T extends DomainEventName>(
    eventType: T,
    handler: DomainEventHandler<DomainEventTypes[T]>,
  ): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler as DomainEventHandler);
      if (handlers.size === 0) this.handlers.delete(eventType);
    }
  }

  private async executeWithRetry(
    handler: DomainEventHandler,
    event: DomainEventEnvelope,
    attempt = 1,
  ): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      this.logger.error(`Handler failed for event ${event.type} (attempt ${attempt}/${this.retryCount}): ${error}`);
      if (attempt < this.retryCount) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.executeWithRetry(handler, event, attempt + 1);
      }
      this.logger.error(`Handler permanently failed for event ${event.type} after ${this.retryCount} attempts`);
    }
  }
}
