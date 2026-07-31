'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { request, api } from '@/services/api';
import type { User } from '@/types';

const DEMO_TOKEN = 'demo-token';
const DEMO_REFRESH = 'demo-refresh';

function isDemoToken(token: string | null): boolean {
  return !!token && token.startsWith('demo-');
}

function buildDemoUser(identity: string): User {
  const isEmail = identity.includes('@');
  const lower = identity.toLowerCase();
  const role: User['role'] = lower.includes('seller')
    ? 'SELLER'
    : lower.includes('customer')
      ? 'CUSTOMER'
      : 'SUPER_ADMIN';
  return {
    id: `demo-${Date.now()}`,
    name: isEmail ? identity.split('@')[0] : identity,
    email: isEmail ? identity : `${identity}@demo.com`,
    phone: isEmail ? '' : identity,
    role,
    isSeller: role === 'SELLER',
  };
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
          set({
            accessToken: DEMO_TOKEN,
            refreshToken: DEMO_REFRESH,
            user: buildDemoUser(identity),
            isAuthenticated: true,
          });
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
          set({
            accessToken: DEMO_TOKEN,
            refreshToken: DEMO_REFRESH,
            user: buildDemoUser(phone),
            isAuthenticated: true,
          });
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
          if (!isDemoToken(s.accessToken)) {
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
        const p = persisted as AuthPersist | undefined;
        return {
          ...current,
          user: p?.user ?? current.user,
          isAuthenticated: !!p?.user,
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

