import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import {
  RealtimeEvent,
  RealtimePayload,
  PresenceData,
} from './interfaces/events.interface';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private gateway: RealtimeGateway) {}

  emitToUser<E extends RealtimeEvent>(
    userId: string,
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.gateway.sendToUser(userId, event, data);
  }

  emitToSeller<E extends RealtimeEvent>(
    sellerId: string,
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.gateway.sendToSeller(sellerId, event, data);
  }

  emitToAdmin<E extends RealtimeEvent>(
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.gateway.sendToAdmin(event, data);
  }

  emitToOrder<E extends RealtimeEvent>(
    orderId: string,
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.gateway.sendToOrderRoom(orderId, event, data);
  }

  broadcast<E extends RealtimeEvent>(event: E, data: RealtimePayload<E>): void {
    this.gateway.broadcastToAll(event, data);
  }

  getOnlineUsers(): number {
    return this.gateway.getOnlineUserCount();
  }

  getRoomUsers(room: string): string[] {
    return this.gateway.getUsersInRoom(room);
  }

  getUserStatus(userId: string): 'online' | 'offline' | 'away' | null {
    return this.gateway.getUserStatus(userId);
  }

  getPresenceData(): Map<string, PresenceData> {
    return this.gateway.getPresenceMap();
  }

  isUserOnline(userId: string): boolean {
    return this.gateway.isUserConnected(userId);
  }
}
