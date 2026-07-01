'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';
import type { User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: async (phone, password) => {
        const res = await api.post<{ token: string; user: User }>('/auth/login', {
          phone,
          password,
        });
        set({ token: res.token, user: res.user });
      },

      register: async (name, phone, password) => {
        const res = await api.post<{ token: string; user: User }>('/auth/register', {
          name,
          phone,
          password,
        });
        set({ token: res.token, user: res.user });
      },

      logout: () => set({ token: null, user: null }),
    }),
    { name: 'amarshop-auth' },
  ),
);

/** Returns true once Zustand persist has finished rehydrating from localStorage.
 *  Returns false during SSR (window is not defined). */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return useAuthStore.persist?.hasHydrated() ?? false;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const unsub = useAuthStore.persist?.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist?.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}
