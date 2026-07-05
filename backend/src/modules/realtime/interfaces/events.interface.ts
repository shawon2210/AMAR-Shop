import { OrderStatus } from '@prisma/client';

export interface RealtimeEvents {
  'order:created': {
    orderId: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
  };
  'order:status:updated': {
    orderId: string;
    orderNumber: string;
    status: OrderStatus;
    previousStatus: OrderStatus;
    updatedAt: string;
  };
  'notification:new': {
    id: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    createdAt: string;
  };
  'chat:message': {
    conversationId: string;
    messageId: string;
    senderId: string;
    content: string;
    attachments: string[];
    createdAt: string;
  };
  'chat:typing': { conversationId: string; userId: string; isTyping: boolean };
  'chat:read': {
    conversationId: string;
    messageId: string;
    readBy: string;
    readAt: string;
  };
  'inventory:low': {
    productId: string;
    productName: string;
    currentStock: number;
    lowStockQty: number;
    warehouseId: string;
  };
  'flash-sale:tick': {
    campaignId: string;
    productId: string;
    soldPercent: number;
    remainingMinutes: number;
  };
  'campaign:metrics': {
    campaignId: string;
    views: number;
    sales: number;
    revenue: number;
    conversion: number;
  };
  'presence:online': {
    userId: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: string;
  };
  'presence:offline': { userId: string; status: 'offline'; lastSeen: string };
}

export type RealtimeEvent = keyof RealtimeEvents;
export type RealtimePayload<E extends RealtimeEvent> = RealtimeEvents[E];

export interface SocketUser {
  userId: string;
  role: string;
  sellerId?: string;
  storeId?: string;
}

export interface PresenceData {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  socketId: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface ReadReceipt {
  conversationId: string;
  messageId: string;
  userId: string;
  readAt: string;
}
