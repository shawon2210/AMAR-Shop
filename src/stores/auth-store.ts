'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { request, api } from '@/services/api';
import type { User } from '@/types';

const MOCK_USERS: Array<{ phone: string; password: string; user: User }> = [
  { phone: '01712345678', password: 'admin123', user: { id: 'demo-admin-1', name: 'Admin User', email: 'admin@amarshop.com', phone: '01712345678', role: 'SUPER_ADMIN', isSeller: false } },
  { phone: '01711111111', password: 'seller123', user: { id: 'demo-seller-1', name: 'Demo Seller', email: 'seller@amarshop.com', phone: '01711111111', role: 'SELLER', isSeller: true } },
  { phone: '01700000000', password: 'customer123', user: { id: 'demo-customer-1', name: 'Demo Customer', email: 'customer@amarshop.com', phone: '01700000000', role: 'CUSTOMER', isSeller: false } },
];

const DEMO_TOKEN = 'demo-token';
const DEMO_REFRESH = 'demo-refresh';

function findMockUser(identity: string, password: string): User | null {
  return MOCK_USERS.find((m) => m.phone === identity && m.password === password)?.user || null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (identity: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email?: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setUser: (user: User) => void;
}

type AuthPersist = Pick<AuthState, 'user'>;

// Auth cookies are set exclusively by the NestJS backend via HttpOnly, Secure,
// SameSite=Strict response headers. No client-side document.cookie writes.


let isLoggingOut = false;

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
        try {
          const res = await api.post<{
            accessToken: string;
            refreshToken: string;
            user: User;
          }>('/auth/login', body);
          set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            user: res.user,
            isAuthenticated: true,
          });
        } catch {
          const mockUser = findMockUser(identity, password);
          if (mockUser) {
            set({
              accessToken: DEMO_TOKEN,
              refreshToken: DEMO_REFRESH,
              user: mockUser,
              isAuthenticated: true,
            });
          } else {
            throw new Error('Login failed. Backend unavailable and no demo account matched.');
          }
        }

      },

      loginWithPhone: async (phone, password) => {
        try {
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
        } catch {
          const mockUser = findMockUser(phone, password);
          if (mockUser) {
            set({
              accessToken: DEMO_TOKEN,
              refreshToken: DEMO_REFRESH,
              user: mockUser,
              isAuthenticated: true,
            });
          } else {
            throw new Error('Login failed. Backend unavailable and no demo account matched.');
          }
        }

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

      logout: async () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });

        if (isLoggingOut) return;
        isLoggingOut = true;
        try {
          await request('/auth/logout', { method: 'POST' });
        } catch {}
        isLoggingOut = false;
        window.dispatchEvent(new CustomEvent('amarshop-auth-logout'));
      },

      fetchProfile: async () => {
        try {
          const user = await api.get<User>('/auth/profile');
          set({ user, isAuthenticated: true });
        } catch {
          const s = get();
          if (!s.accessToken?.startsWith('demo-')) {
            set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
          }
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'amarshop-auth',
      partialize: (state): AuthPersist => ({
        user: state.user,
      }),
      merge: (persisted, current) => {
        const p = persisted as AuthPersist;
        return {
          ...current,
          user: p.user ?? current.user,
          isAuthenticated: !!p.user,
        };
      },
    },
  ),
);

export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated()) {
      setHydrated(true);
    }
    const unsub = useAuthStore.persist?.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);
  return hydrated;
}

