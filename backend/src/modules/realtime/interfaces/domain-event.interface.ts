export interface DomainEventEnvelope<T = unknown> {
  id: string;
  type: string;
  timestamp: Date;
  version: number;
  data: T;
  correlationId: string;
  metadata?: Record<string, unknown>;
}

export interface DomainEventTypes {
  OrderPlaced: {
    orderId: string;
    orderNumber: string;
    userId: string;
    total: number;
    items: Array<{ productId: string; quantity: number; price: number }>;
  };
  OrderShipped: {
    orderId: string;
    orderNumber: string;
    trackingNumber: string;
    courier: string;
  };
  OrderDelivered: { orderId: string; orderNumber: string; deliveredAt: string };
  PaymentReceived: {
    orderId: string;
    transactionId: string;
    amount: number;
    method: string;
  };
  ProductCreated: {
    productId: string;
    name: string;
    sellerId: string;
    categoryId: string;
  };
  InventoryUpdated: {
    productId: string;
    warehouseId: string;
    oldQuantity: number;
    newQuantity: number;
    change: number;
  };
  UserRegistered: { userId: string; email: string; phone: string };
  SellerApproved: { sellerId: string; storeName: string; userId: string };
}

export type DomainEventName = keyof DomainEventTypes;
export type DomainEventHandler<T = unknown> = (
  event: DomainEventEnvelope<T>,
) => Promise<void>;
