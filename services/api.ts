import axios, { AxiosError } from 'axios';

import { tokenStorage } from './token-storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:4000/api';

export const api = axios.create({ baseURL, timeout: 10_000, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    if (!error.response) return 'Cannot reach the server. Check your network and API URL.';
    const message = (error.response.data as { message?: unknown })?.message;
    if (typeof message === 'string') return message;
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
}
