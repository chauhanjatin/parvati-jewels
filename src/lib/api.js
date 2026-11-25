const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const memoryCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes client cache

/** Empty VITE_API_URL uses same-origin `/api` (Vite proxy in dev). */
export function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalized}` : normalized;
}

export async function fetchJson(path, options = {}) {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const url = apiUrl(path);

  // Return cached result immediately if available and fresh
  if (isGet) {
    const cached = memoryCache.get(url);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }
  }

  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  if (!contentType.includes('application/json')) {
    throw new Error(
      'API returned HTML instead of JSON. Set VITE_API_URL to your deployed backend on Vercel.',
    );
  }

  const data = await res.json();

  if (isGet) {
    memoryCache.set(url, { data, timestamp: Date.now() });
  }

  return data;
}

export function clearApiCache() {
  memoryCache.clear();
}
