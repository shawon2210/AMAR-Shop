'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getErrorMessage } from '@/lib/error-helper';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook to fetch admin data with loading/error states.
 * Automatically refetches when dependencies change.
 */
export function useAdminData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchId = useRef(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const [fetchToken, setFetchToken] = useState(0);

  const fetch = useCallback(async () => {
    const id = ++fetchId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (id === fetchId.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (id === fetchId.current) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetchToken]);

  useEffect(() => {
    setFetchToken((t) => t + 1);
  }, deps);

  const refetch = useCallback(() => {
    setFetchToken((t) => t + 1);
  }, []);

  return { data, loading, error, refetch };
}

/**
 * Like useAdminData but manages pagination (page/limit) internally.
 * Passes `{ page, limit }` to the fetcher. `deps` should NOT include `page`.
 */
export function useAdminPage<T>(
  fetcher: (params: { page: number; limit: number }) => Promise<T>,
  deps: unknown[] = [],
  options?: { limit?: number; defaultPage?: number },
) {
  const limit = options?.limit ?? 15;
  const [page, setPage] = useState(options?.defaultPage ?? 1);

  const { data, loading, error, refetch } = useAdminData(
    () => fetcher({ page, limit }),
    [page, limit, ...deps],
  );

  return { data, loading, error, refetch, page, setPage, limit };
}
