import type { PaginatedResponse } from './common';

// ─── Support Tickets ────────────────────────────────────

export interface TicketUser {
  id: string;
  name: string;
  phone: string;
  avatar: string | null;
}

export interface SupportMessage {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  createdAt: string;
  user: TicketUser;
  messages?: SupportMessage[];
}

export type PaginatedTickets = PaginatedResponse<SupportTicket> & { tickets: SupportTicket[] };
