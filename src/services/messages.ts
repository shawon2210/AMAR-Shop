'use client';

import { api } from './api';
import { useQuery } from '@tanstack/react-query';

export const MESSAGE_QUERY_KEYS = {
  conversations: 'conversations',
};

export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  unreadCount: number;
}

async function fetchConversations(): Promise<ConversationsResponse> {
  try {
    return await api.get<ConversationsResponse>('/messages/conversations');
  } catch {
    return { conversations: [], total: 0, unreadCount: 0 };
  }
}

export function useGetConversations() {
  return useQuery({
    queryKey: [MESSAGE_QUERY_KEYS.conversations],
    queryFn: fetchConversations,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}
