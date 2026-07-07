import { api } from '@/services/api';

export function updateSettings(data: unknown): Promise<unknown> {
  return api.put('/admin/settings', data);
}
