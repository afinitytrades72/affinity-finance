import type { Email, NewEmailInput, ThreadSummary } from './types';

const BASE = '/api';
const STORAGE_KEY = 'gmail-sim-auth';

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) { onUnauthorized = fn; }

export function getStoredAuth(): string | null {
  if (typeof window === 'undefined') return null;
  try { return sessionStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export function storeAuth(username: string, password: string): string {
  const token = btoa(`${username}:${password}`);
  sessionStorage.setItem(STORAGE_KEY, token);
  return token;
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getStoredAuth();
  return token ? { ...extra, Authorization: `Basic ${token}` } : extra;
}

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: authHeaders((opts.headers as Record<string, string>) || {}),
  });
  if (res.status === 401) {
    clearAuth();
    if (onUnauthorized) onUnauthorized();
    throw new Error('Unauthorized');
  }
  return res;
}

export async function login(username: string, password: string): Promise<boolean> {
  const token = btoa(`${username}:${password}`);
  const res = await fetch(`${BASE}/auth/check`, {
    headers: { Authorization: `Basic ${token}` },
  });
  if (!res.ok) return false;
  storeAuth(username, password);
  return true;
}

export async function fetchThreads(): Promise<ThreadSummary[]> {
  const res = await request('/threads');
  return res.json();
}

export async function fetchThread(threadId: string): Promise<Email[]> {
  const res = await request(`/threads/${threadId}`);
  return res.json();
}

export async function createEmail(data: NewEmailInput): Promise<Email> {
  const res = await request('/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteThread(threadId: string, password: string) {
  const res = await request(`/threads/${threadId}`, {
    method: 'DELETE',
    headers: { 'X-Delete-Password': password },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Delete failed');
  return body;
}

export async function searchEmails(query: string): Promise<Email[]> {
  const res = await request(`/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function exportThreadJSON(threadId: string): Promise<Email[]> {
  const res = await request(`/threads/${threadId}/export`);
  return res.json();
}

export async function importThreadJSON(emails: Email[]): Promise<Email[]> {
  const res = await request('/threads/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  });
  return res.json();
}
