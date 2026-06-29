export interface PlaceOrderCommand {
  type: 'PLACE_ORDER';
  payload: {
    userId: string;
    items: { productId: string; variantId?: string; quantity: number }[];
    addressId: string;
    paymentMethod: string;
    couponCode?: string;
    note?: string;
    correlationId: string;
  };
}

export interface CancelOrderCommand {
  type: 'CANCEL_ORDER';
  payload: {
    orderId: string;
    userId: string;
    reason: string;
    correlationId: string;
  };
}

export interface ProcessPaymentCommand {
  type: 'PROCESS_PAYMENT';
  payload: {
    orderId: string;
    userId: string;
    amount: number;
    method: string;
    correlationId: string;
  };
}

export interface UpdateInventoryCommand {
  type: 'UPDATE_INVENTORY';
  payload: {
    productId: string;
    warehouseId: string;
    quantity: number;
    type: 'RESERVE' | 'RELEASE' | 'DEDUCT' | 'RESTOCK';
    correlationId: string;
  };
}

export interface SendNotificationCommand {
  type: 'SEND_NOTIFICATION';
  payload: {
    userId: string;
    title: string;
    body: string;
    type: string;
    data?: Record<string, unknown>;
    correlationId: string;
  };
}

export type Command =
  | PlaceOrderCommand
  | CancelOrderCommand
  | ProcessPaymentCommand
  | UpdateInventoryCommand
  | SendNotificationCommand;

export interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}
