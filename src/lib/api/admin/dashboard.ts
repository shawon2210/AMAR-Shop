import { api } from '@/services/api';
import type { DashboardStats } from '@/types/admin';

export async function fetchDashboard(): Promise<DashboardStats> {
  return await api.get<DashboardStats>('/admin/dashboard');
}
