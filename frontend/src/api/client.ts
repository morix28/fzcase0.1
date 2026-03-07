const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function apiRequest(
  endpoint: string,
  initData?: string,
  options: RequestInit = {}
) {
  const headers = {
    'Content-Type': 'application/json',
    ...(initData ? { 'Authorization': initData } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}/api${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  return res.json();
}