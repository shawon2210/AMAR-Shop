import { api } from '@/services/api';
import type { RFMSegment, CohortRow } from '@/types';

export function fetchRFMAnalysis(): Promise<RFMSegment[]> {
  return api.get<RFMSegment[]>('/bi/rfm-segments');
}

export function fetchCohortAnalysis(period?: string): Promise<CohortRow[]> {
  const qs = period ? `?period=${period}` : '';
  return api.get<CohortRow[]>(`/bi/cohorts${qs}`);
}
