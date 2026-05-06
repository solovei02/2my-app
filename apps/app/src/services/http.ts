import { API_URL } from '../config/api';
import { tokenStore } from './tokenStore';

export async function request(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  const token = await tokenStore.get();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Request failed');
  }

  if (response.status === 204) {
    return undefined;
  }

  return await response.json();
}
