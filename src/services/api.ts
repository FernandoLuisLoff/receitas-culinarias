import axios, { AxiosError } from 'axios';

export const TOKEN_STORAGE_KEY = 'receitas:accessToken';

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

// Injeta o token JWT salvo no localStorage em todas as requisições autenticadas.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Centraliza o tratamento de falhas de rede/HTTP em uma mensagem amigável para a UI.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (!error.response) {
      return Promise.reject(new ApiError('Não foi possível conectar à API. Verifique sua conexão.', status));
    }

    if (status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return Promise.reject(new ApiError('Sessão expirada. Faça login novamente.', status));
    }

    return Promise.reject(new ApiError(serverMessage ?? 'Ocorreu um erro ao comunicar com a API.', status));
  },
);
