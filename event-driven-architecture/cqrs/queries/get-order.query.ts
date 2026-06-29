export interface GetOrderQuery {
  type: 'GET_ORDER';
  payload: {
    orderId: string;
    userId: string;
  };
}

export interface GetUserOrdersQuery {
  type: 'GET_USER_ORDERS';
  payload: {
    userId: string;
    page: number;
    limit: number;
    status?: string;
  };
}

export interface GetProductQuery {
  type: 'GET_PRODUCT';
  payload: {
    productId: string;
    userId?: string;
  };
}

export interface SearchProductsQuery {
  type: 'SEARCH_PRODUCTS';
  payload: {
    query: string;
    category?: string;
    page: number;
    limit: number;
    sort?: string;
    filters?: Record<string, unknown>;
  };
}

export interface GetDashboardStatsQuery {
  type: 'GET_DASHBOARD_STATS';
  payload: {
    userId: string;
    role: string;
    dateRange: { start: string; end: string };
  };
}

export type Query =
  | GetOrderQuery
  | GetUserOrdersQuery
  | GetProductQuery
  | SearchProductsQuery
  | GetDashboardStatsQuery;

export interface QueryHandler<T extends Query, R = unknown> {
  handle(query: T): Promise<R>;
}
