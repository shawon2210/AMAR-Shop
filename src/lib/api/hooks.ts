'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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

  const fetch = useCallback(async () => {
    const id = ++fetchId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (id === fetchId.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err: any) {
      if (id === fetchId.current) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
