import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { realtimeConfig } from './realtime.config';
import {
  RealtimeEvent,
  RealtimePayload,
  SocketUser,
  PresenceData,
} from './interfaces/events.interface';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000,https://amarshop.vercel.app,https://amarshop-eight.vercel.app').split(',').map(o => o.trim()),
    credentials: true,
  },
  namespace: /\/\w+/,
  transports: ['websocket', 'polling'],
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private readonly userSockets = new Map<string, Set<string>>();
  private readonly socketUserMap = new Map<string, SocketUser>();
  private readonly presenceMap = new Map<string, PresenceData>();
  private readonly rateLimitMap = new Map<string, RateLimitEntry>();
  private readonly rateLimitConfig = realtimeConfig.rateLimit;

  constructor(private jwtService: JwtService) {}

  afterInit(_server: Server): void {
    this.logger.log('Realtime Gateway initialized');
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth?.token ||
        (client.handshake.query?.token as string);
      if (!token) {
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user: SocketUser = {
        userId: payload.id || payload.sub,
        role: payload.role || 'CUSTOMER',
        sellerId: payload.sellerId,
        storeId: payload.storeId,
      };

      this.socketUserMap.set(client.id, user);

      if (!this.userSockets.has(user.userId)) {
        this.userSockets.set(user.userId, new Set());
      }
      this.userSockets.get(user.userId)!.add(client.id);

      await this.joinNamespacedRooms(client, user);

      this.updatePresence(user.userId, 'online', client.id);

      client.emit('connected', { userId: user.userId, socketId: client.id });
      this.logger.log(
        `Client connected: ${user.userId} on namespace ${client.nsp.name}`,
      );
    } catch (error) {
      this.logger.warn(`Connection rejected: ${(error as Error).message}`);
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const user = this.socketUserMap.get(client.id);
    if (user) {
      const sockets = this.userSockets.get(user.userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(user.userId);
          this.updatePresence(user.userId, 'offline', client.id);
        }
      }
      this.socketUserMap.delete(client.id);
    }
    this.rateLimitMap.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:order')
  async handleJoinOrder(client: Socket, orderId: string): Promise<void> {
    const user = this.socketUserMap.get(client.id);
    if (!user) throw new WsException('Not authenticated');
    await client.join(`order:${orderId}`);
  }

  @SubscribeMessage('leave:order')
  async handleLeaveOrder(client: Socket, orderId: string): Promise<void> {
    await client.leave(`order:${orderId}`);
  }

  @SubscribeMessage('join:seller')
  async handleJoinSeller(client: Socket): Promise<void> {
    const user = this.socketUserMap.get(client.id);
    if (!user || !user.sellerId) throw new WsException('Not a seller');
    await client.join(`seller:${user.sellerId}`);
  }

  @SubscribeMessage('chat:typing')
  handleTyping(
    client: Socket,
    data: { conversationId: string; isTyping: boolean },
  ): void {
    const user = this.socketUserMap.get(client.id);
    if (!user) throw new WsException('Not authenticated');
    client.to(`conversation:${data.conversationId}`).emit('chat:typing', {
      conversationId: data.conversationId,
      userId: user.userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('chat:read')
  handleReadReceipt(
    client: Socket,
    data: { conversationId: string; messageId: string },
  ): void {
    const user = this.socketUserMap.get(client.id);
    if (!user) throw new WsException('Not authenticated');
    client.to(`conversation:${data.conversationId}`).emit('chat:read', {
      conversationId: data.conversationId,
      messageId: data.messageId,
      readBy: user.userId,
      readAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('presence:away')
  handleAway(client: Socket): void {
    const user = this.socketUserMap.get(client.id);
    if (!user) return;
    this.updatePresence(user.userId, 'away', client.id);
  }

  sendToUser<E extends RealtimeEvent>(
    userId: string,
    event: E,
    data: RealtimePayload<E>,
  ): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    sockets.forEach((socketId) => {
      const client = this.server.sockets.sockets.get(socketId);
      if (client) client.emit(event, data);
    });
  }

  sendToSeller<E extends RealtimeEvent>(
    sellerId: string,
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.server.to(`seller:${sellerId}`).emit(event, data);
  }

  sendToAdmin<E extends RealtimeEvent>(
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.server.of('/admin').emit(event, data);
  }

  sendToOrderRoom<E extends RealtimeEvent>(
    orderId: string,
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.server.to(`order:${orderId}`).emit(event, data);
  }

  broadcastToAll<E extends RealtimeEvent>(
    event: E,
    data: RealtimePayload<E>,
  ): void {
    this.server.emit(event, data);
  }

  getOnlineUserCount(): number {
    return this.userSockets.size;
  }

  getUsersInRoom(room: string): string[] {
    const roomSockets = this.server.sockets.adapter.rooms.get(room);
    if (!roomSockets) return [];
    return Array.from(roomSockets)
      .map((sid) => this.socketUserMap.get(sid)?.userId)
      .filter(Boolean) as string[];
  }

  getUserStatus(userId: string): 'online' | 'offline' | 'away' | null {
    return this.presenceMap.get(userId)?.status || null;
  }

  getPresenceMap(): Map<string, PresenceData> {
    return this.presenceMap;
  }

  isUserConnected(userId: string): boolean {
    return (
      this.userSockets.has(userId) &&
      (this.userSockets.get(userId)?.size ?? 0) > 0
    );
  }

  private async joinNamespacedRooms(
    client: Socket,
    user: SocketUser,
  ): Promise<void> {
    await client.join(`user:${user.userId}`);

    if (user.role === 'SELLER' || user.role === 'ADMIN') {
      if (user.sellerId) await client.join(`seller:${user.sellerId}`);
    }

    if (user.role === 'ADMIN') {
      await client.join('admin');
    }
  }

  private updatePresence(
    userId: string,
    status: PresenceData['status'],
    socketId: string,
  ): void {
    const existing = this.presenceMap.get(userId);
    this.presenceMap.set(userId, {
      userId,
      status,
      lastSeen: new Date(),
      socketId,
    });

    const previousStatus = existing?.status;
    this.server.emit('presence:online', {
      userId,
      status,
      lastSeen: new Date().toISOString(),
    });

    if (status === 'offline' && previousStatus !== 'offline') {
      this.server.emit('presence:offline', {
        userId,
        status: 'offline',
        lastSeen: new Date().toISOString(),
      });
    }
  }

  private checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const entry = this.rateLimitMap.get(clientId);
    if (!entry || now > entry.resetAt) {
      this.rateLimitMap.set(clientId, {
        count: 1,
        resetAt: now + this.rateLimitConfig.windowMs,
      });
      return true;
    }
    if (entry.count >= this.rateLimitConfig.maxEventsPerMinute) {
      return false;
    }
    entry.count++;
    return true;
  }
}
