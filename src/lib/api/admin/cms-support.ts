import { api } from '@/services/api';
import type {
  CMSPage,
  Announcement,
  SupportTicket,
  SupportMessage,
  PaginatedTickets,
} from '@/types';

// ─── CMS Pages ────────────────────────────────────────────

export function fetchCMSPages(): Promise<CMSPage[]> {
  return api.get<CMSPage[]>('/admin/cms/pages');
}

export function createCMSPage(data: {
  title: string;
  slug?: string;
  content?: string;
  metaTitle?: string;
  metaDesc?: string;
}): Promise<CMSPage> {
  return api.post<CMSPage>('/admin/cms/pages', data);
}

export function updateCMSPage(id: string, data: unknown): Promise<CMSPage> {
  return api.put<CMSPage>(`/admin/cms/pages/${id}`, data);
}

export function deleteCMSPage(id: string): Promise<unknown> {
  return api.delete(`/admin/cms/pages/${id}`);
}

// ─── Announcements ────────────────────────────────────────

export function fetchAnnouncements(): Promise<Announcement[]> {
  return api.get<Announcement[]>('/admin/cms/announcements');
}

export function createAnnouncement(data: {
  title: string;
  message: string;
  type?: string;
  expiresAt?: string;
}): Promise<Announcement> {
  return api.post<Announcement>('/admin/cms/announcements', data);
}

export function updateAnnouncement(id: string, data: unknown): Promise<Announcement> {
  return api.put<Announcement>(`/admin/cms/announcements/${id}`, data);
}

export function deleteAnnouncement(id: string): Promise<unknown> {
  return api.delete(`/admin/cms/announcements/${id}`);
}

// ─── Support Tickets ──────────────────────────────────────

export function fetchSupportTickets(params: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}): Promise<PaginatedTickets> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  if (params.priority) search.set('priority', params.priority);
  return api.get<PaginatedTickets>(`/admin/support-tickets?${search.toString()}`);
}

export function fetchSupportTicket(id: string): Promise<SupportTicket> {
  return api.get<SupportTicket>(`/admin/support-tickets/${id}`);
}

export function replyToSupportTicket(id: string, content: string): Promise<SupportMessage> {
  return api.post<SupportMessage>(`/admin/support-tickets/${id}/reply`, { content });
}

export function updateSupportTicket(
  id: string,
  data: { status?: string; priority?: string; assignedTo?: string },
): Promise<SupportTicket> {
  return api.put<SupportTicket>(`/admin/support-tickets/${id}`, data);
}
