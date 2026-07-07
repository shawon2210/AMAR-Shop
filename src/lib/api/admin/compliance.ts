import { api } from '@/services/api';
import type { ComplianceDashboard } from '@/types';

export function fetchComplianceDashboard(): Promise<ComplianceDashboard> {
  return api.get<ComplianceDashboard>('/admin/compliance');
}
