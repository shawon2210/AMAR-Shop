const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const stored = localStorage.getItem('amarshop-auth');
      if (!stored) return false;
      const parsed = JSON.parse(stored);
      const refreshToken = parsed?.state?.refreshToken;
      if (!refreshToken) return false;
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const current = JSON.parse(localStorage.getItem('amarshop-auth') || '{}');
      current.state = {
        ...current.state,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      };
      localStorage.setItem('amarshop-auth', JSON.stringify(current));
      window.dispatchEvent(new CustomEvent('amarshop-auth-refreshed', { detail: data }));
      return true;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('amarshop-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.accessToken || parsed?.state?.token || null;
    }
  } catch {}
  return null;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      const newToken = getToken();
      if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('amarshop-auth');
      window.dispatchEvent(new CustomEvent('amarshop-auth-logout'));
      const currentPath = window.location.pathname + window.location.search;
      if (!path.startsWith('/auth/')) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      }
      throw new Error('Session expired. Redirecting to login...');
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
