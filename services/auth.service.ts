import { AuthResponse, User } from '@/types';

import { api } from './api';

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    return (await api.post<AuthResponse>('/auth/register', input)).data;
  },
  async login(input: { email: string; password: string }) {
    return (await api.post<AuthResponse>('/auth/login', input)).data;
  },
  async me() {
    return (await api.get<{ user: User }>('/auth/me')).data.user;
  },
};
