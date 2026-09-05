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
  async forgotPassword(email: string) {
    return (await api.post<{ message: string; developmentCode?: string }>('/auth/forgot-password', { email })).data;
  },
  async resetPassword(input: { email: string; code: string; newPassword: string }) {
    return (await api.post<{ message: string }>('/auth/reset-password', input)).data;
  },
  async changePassword(input: { currentPassword: string; newPassword: string }) {
    return (await api.patch<{ message: string }>('/auth/password', input)).data;
  },
  async deleteAccount() {
    await api.delete('/auth/me');
  },
};
