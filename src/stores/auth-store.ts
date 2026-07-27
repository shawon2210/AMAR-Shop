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
          set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
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

