import { api } from '@/services/api';
import type {
  FinanceDashboard,
  Settlement,
  PaginatedSettlements,
  Invoice,
  PaginatedInvoices,
  TaxReport,
  EscrowTransaction,
  PaginatedEscrow,
  CreditNote,
  CommissionEntry,
  PaginatedCommissions,
} from '@/types';

export function fetchFinanceDashboard(): Promise<FinanceDashboard> {
  return api.get<FinanceDashboard>('/admin/finance/dashboard');
}

// ─── Settlements ──────────────────────────────────────────

export function fetchSettlements(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedSettlements> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  return api.get<PaginatedSettlements>(`/admin/finance/settlements?${search.toString()}`);
}

export function generateSettlement(data: {
  sellerId: string;
  periodStart: string;
  periodEnd: string;
}): Promise<Settlement> {
  return api.post<Settlement>('/admin/finance/settlements', data);
}

export function processSettlement(id: string, data: { status: string }): Promise<unknown> {
  return api.put(`/admin/finance/settlements/${id}`, data);
}

// ─── Invoices ─────────────────────────────────────────────

export function fetchInvoices(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedInvoices> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedInvoices>(`/admin/finance/invoices?${search.toString()}`);
}

export function createInvoice(data: {
  orderId: string;
  sellerId: string;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  dueDate?: string;
  notes?: string;
}): Promise<Invoice> {
  return api.post<Invoice>('/admin/finance/invoices', data);
}

export function updateInvoice(id: string, data: unknown): Promise<Invoice> {
  return api.put<Invoice>(`/admin/finance/invoices/${id}`, data);
}

// ─── Tax ──────────────────────────────────────────────────

export function fetchTaxReport(quarter: string, year: string): Promise<TaxReport> {
  return api.get<TaxReport>(`/admin/finance/tax?quarter=${quarter}&year=${year}`);
}

// ─── Escrow ───────────────────────────────────────────────

export function fetchEscrowTransactions(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedEscrow> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedEscrow>(`/admin/finance/escrow?${search.toString()}`);
}

// ─── Credit Notes ─────────────────────────────────────────

export function fetchCreditNotes(): Promise<CreditNote[]> {
  return api.get<CreditNote[]>('/admin/finance/credit-notes');
}

// ─── Commissions ──────────────────────────────────────────

export function fetchCommissions(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedCommissions> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedCommissions>(`/admin/finance/commissions?${search.toString()}`);
}
