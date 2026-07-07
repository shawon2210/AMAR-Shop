import type { PaginatedResponse } from './common';

// ─── Finance Dashboard ──────────────────────────────────

export interface PendingSettlement {
  id: string;
  settlementNumber: string;
  grossAmount: number;
  netAmount: number;
  status: string;
  createdAt: string;
  seller: { id: string; name: string };
}

export interface FinanceDashboard {
  totalRevenue: number;
  pendingSettlementAmount: number;
  totalCommission: number;
  netCashFlow: number;
  pendingSettlements: PendingSettlement[];
}

// ─── Settlements ────────────────────────────────────────

export interface SettlementSeller {
  id: string;
  name: string;
}

export interface Settlement {
  id: string;
  settlementNumber: string;
  sellerId: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  commission: number;
  fee: number;
  netAmount: number;
  status: string;
  createdAt: string;
  seller: SettlementSeller;
}

export type PaginatedSettlements = PaginatedResponse<Settlement> & { settlements: Settlement[] };

// ─── Invoices ───────────────────────────────────────────

export interface InvoiceSeller {
  id: string;
  name: string;
}

export interface InvoiceOrder {
  id: string;
  orderNumber: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  sellerId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  seller: InvoiceSeller;
  order: InvoiceOrder;
}

export type PaginatedInvoices = PaginatedResponse<Invoice> & { invoices: Invoice[] };

// ─── Tax Report ─────────────────────────────────────────

export interface TaxMonthly {
  month: string;
  revenue: number;
  taxable: number;
  vat: number;
}

export interface TaxReport {
  quarter: number;
  year: number;
  totalRevenue: number;
  vatRate: number;
  totalVat: number;
  totalOrders: number;
  monthly: TaxMonthly[];
  period: { from: string; to: string };
}

// ─── Escrow ─────────────────────────────────────────────

export interface EscrowOrder {
  id: string;
  orderNumber: string;
  total: number;
}

export interface EscrowTransaction {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  heldAt: string;
  releasedAt: string | null;
  order: EscrowOrder;
}

export type PaginatedEscrow = PaginatedResponse<EscrowTransaction> & { transactions: EscrowTransaction[] };

// ─── Credit Notes ───────────────────────────────────────

export interface CreditNoteOrder {
  id: string;
  orderNumber: string;
  total: number;
}

export interface ReturnRequest {
  id: string;
  reason: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  amount: number;
  reason: string | null;
  status: string;
  createdAt: string;
  order: CreditNoteOrder;
  returnRequest: ReturnRequest | null;
}

// ─── Commissions ────────────────────────────────────────

export interface CommissionSeller {
  id: string;
  name: string;
}

export interface CommissionOrder {
  id: string;
  orderNumber: string;
}

export interface CommissionEntry {
  id: string;
  orderId: string;
  sellerId: string;
  amount: number;
  rate: number;
  status: string;
  createdAt: string;
  seller: CommissionSeller;
  order: CommissionOrder;
}

export type PaginatedCommissions = PaginatedResponse<CommissionEntry> & { commissions: CommissionEntry[] };
