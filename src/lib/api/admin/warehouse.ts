import { api } from '@/services/api';
import type { WarehouseDashboard, StockAlert, CourierPerformance, Shipment } from '@/types';

export function fetchWarehouseDashboard(warehouseId?: string): Promise<WarehouseDashboard> {
  const id = warehouseId || 'wh-1';
  return api.get<WarehouseDashboard>(`/wms/dashboard/${id}`);
}

export function fetchStockAlerts(warehouseId?: string): Promise<StockAlert[]> {
  const id = warehouseId || 'wh-1';
  return api.get<StockAlert[]>(`/wms/stock-alerts/${id}`);
}

export function fetchCourierPerformance(start?: string, end?: string): Promise<CourierPerformance[]> {
  const search = new URLSearchParams();
  if (start) search.set('start', start);
  if (end) search.set('end', end);
  const qs = search.toString();
  return api.get<CourierPerformance[]>(`/fulfillment/courier-performance${qs ? `?${qs}` : ''}`);
}

export function fetchFulfillmentShipments(params?: { page?: number; limit?: number }): Promise<{ shipments: Shipment[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return api.get<{ shipments: Shipment[]; total: number }>(`/fulfillment/shipments${qs ? `?${qs}` : ''}`);
}
