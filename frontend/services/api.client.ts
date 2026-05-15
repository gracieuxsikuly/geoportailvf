import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001',
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    // eslint-disable-next-line no-console
    console.error('[apiClient]', error?.response?.status, error?.message);
    return Promise.reject(error);
  },
);
