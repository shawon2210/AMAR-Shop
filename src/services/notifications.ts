'use client';

import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const NOTIFICATION_QUERY_KEYS = {
  notifications: 'notifications',
};

export interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

async function fetchNotifications(): Promise<NotificationsResponse> {
  try {
    return await api.get<NotificationsResponse>('/notifications');
  } catch {
    return { notifications: [], total: 0, unreadCount: 0 };
  }
}

async function markAllRead(): Promise<void> {
  await api.post('/notifications/read-all');
}

export function useGetNotifications() {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEYS.notifications],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEYS.notifications] });
    },
  });
}
