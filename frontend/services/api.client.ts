import axios, { type AxiosError } from 'axios';
import { getApiBaseUrl } from '@/lib/api-config';

let backendUnavailableLogged = false;

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const isNetwork =
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error' ||
      !error.response;

    if (isNetwork) {
      if (process.env.NODE_ENV === 'development' && !backendUnavailableLogged) {
        backendUnavailableLogged = true;
        // eslint-disable-next-line no-console
        console.warn(
          '[apiClient] Backend injoignable — mode démo actif. Lancez : npm run dev:backend',
        );
      }
    } else if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[apiClient]', error.response?.status, error.message);
    }

    return Promise.reject(error);
  },
);
