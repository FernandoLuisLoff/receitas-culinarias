import { api } from './api';
import { authUserSchema, type AuthUser } from '../schemas/auth.schema';

export interface LoginPayload {
  username: string;
  password: string;
}

export async function login({ username, password }: LoginPayload): Promise<AuthUser> {
  const { data } = await api.post('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  });
  const parsed = authUserSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Resposta inesperada da API de autenticação.');
  }
  return parsed.data;
}
