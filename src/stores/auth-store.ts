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

function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return;
  // Max-age 7 days, path / so middleware can see it on all routes
  document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Strict`;
}

function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Strict';
}

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
        setAuthCookie(res.accessToken);
      },

      demoLogin: (user) => {
        set({
          accessToken: 'demo-token-' + user.id,
          refreshToken: 'demo-refresh-' + user.id,
          user,
          isAuthenticated: true,
        });
        setAuthCookie('demo-token-' + user.id);
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
        setAuthCookie(res.accessToken);
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
        setAuthCookie(res.accessToken);
      },

      logout: () => {
        const token = get().accessToken;
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
        clearAuthCookie();
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
    if (useAuthStore.persist?.hasHydrated()) {
      setHydrated(true);
      syncCookieFromStore();
    }
    const unsub = useAuthStore.persist?.onFinishHydration(() => {
      setHydrated(true);
      syncCookieFromStore();
    });
    return unsub;
  }, []);
  return hydrated;
}

function syncCookieFromStore() {
  if (typeof document === 'undefined') return;
  const state = useAuthStore.getState();
  if (state.accessToken) {
    document.cookie = `accessToken=${state.accessToken}; path=/; max-age=604800; SameSite=Strict`;
  }
}
