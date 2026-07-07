// ─── Warehouse / WMS ────────────────────────────────────

export interface WarehouseDashboard {
  warehouseId: string;
  warehouseName: string;
  totalBins: number;
  totalInventoryItems: number;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  activePicks: number;
  todayPicks: number;
  todayPacks: number;
  lowStockItems: number;
  pickRate: number;
  packRate: number;
  accuracy: number;
  throughput: number;
}

export interface StockAlert {
  id: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  status: string;
}

// ─── Fulfillment / Courier ──────────────────────────────

export interface CourierPerformance {
  name: string;
  shipments: number;
  delivered: number;
  rate: number;
  onTime: number;
}

export interface Shipment {
  trackingId: string;
  courier: string;
  status: string;
  estimatedDelivery: string;
  createdAt: string;
}

// ─── Compliance ─────────────────────────────────────────

export interface ComplianceDashboard {
  totalSellers: number;
  kycVerified: number;
  pendingVerification: number;
  flaggedProducts: number;
  openDisputes: number;
  returnRequests: number;
  recentReports: number;
  lastUpdated: string;
}

// ─── BI: RFM & Cohorts ──────────────────────────────────

export interface RFMSegment {
  segment: string;
  count: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
}

export interface CohortRow {
  cohort: string;
  base: number;
  period_0: number;
  period_1: number;
  period_2: number;
  period_3: number;
}
