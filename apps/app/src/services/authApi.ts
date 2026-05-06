import { AuthPayload, AuthResponse, User } from '../types/auth';
import { request } from './http';

export const authApi = {
  register: (payload: Required<AuthPayload>) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as Promise<AuthResponse>,
  login: (payload: Omit<AuthPayload, 'displayName'>) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as Promise<AuthResponse>,
  me: () => request('/auth/me') as Promise<User>,
};
