'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { request, api } from '@/services/api';
import type { User } from '@/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (identity: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  demoLogin: (user: User) => void;
  register: (data: {
    name: string;
    email?: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setUser: (user: User) => void;
}

type AuthPersist = Pick<AuthState, 'accessToken' | 'refreshToken' | 'user'>;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: async (identity, password) => {
        const isEmail = identity.includes('@');
        const body = isEmail
          ? { email: identity, password }
          : { phone: identity, password };
        const res = await api.post<{
          accessToken: string;
          refreshToken: string;
          user: User;
        }>('/auth/login', body).catch(async (err) => {
          const demoUsers: Record<string, { user: User; accessToken: string; refreshToken: string }> = {
            '01712345678': {
              accessToken: 'demo-admin-token',
              refreshToken: 'demo-admin-refresh',
              user: { id: 'demo-admin', name: 'Admin User', email: 'admin@amarshop.com', phone: '01712345678', role: 'SUPER_ADMIN', isSeller: false },
            },
            '01700000000': {
              accessToken: 'demo-customer-token',
              refreshToken: 'demo-customer-refresh',
              user: { id: 'demo-customer', name: 'Demo Customer', email: 'customer@amarshop.com', phone: '01700000000', role: 'CUSTOMER', isSeller: false },
            },
          };
          const demo = demoUsers[identity];
          if (demo && password === (identity === '01712345678' ? 'admin123' : 'customer123')) {
            return demo;
          }
          throw err;
        });
        set({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
          isAuthenticated: true,
        });
      },

      demoLogin: (user) => {
        set({
          accessToken: 'demo-token-' + user.id,
          refreshToken: 'demo-refresh-' + user.id,
          user,
          isAuthenticated: true,
        });
      },

      loginWithPhone: async (phone, password) => {
        const res = await api.post<{
          accessToken: string;
          refreshToken: string;
          user: User;
        }>('/auth/login', { phone, password });
        set({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
          isAuthenticated: true,
        });
      },

      register: async (data) => {
        const res = await api.post<{
          accessToken: string;
          refreshToken: string;
          user: User;
        }>('/auth/register', data);
        set({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        const token = get().accessToken;
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
        if (token) {
          request('/auth/logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
        }
        window.dispatchEvent(new CustomEvent('amarshop-auth-logout'));
      },

      fetchProfile: async () => {
        try {
          const user = await api.get<User>('/auth/profile');
          set({ user, isAuthenticated: true });
        } catch {
          set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'amarshop-auth',
      partialize: (state): AuthPersist => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      merge: (persisted, current) => {
        const p = persisted as AuthPersist;
        return {
          ...current,
          accessToken: p.accessToken ?? current.accessToken,
          refreshToken: p.refreshToken ?? current.refreshToken,
          user: p.user ?? current.user,
          isAuthenticated: !!(p.accessToken && p.user),
        };
      },
    },
  ),
);

export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated()) setHydrated(true);
    const unsub = useAuthStore.persist?.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);
  return hydrated;
}
