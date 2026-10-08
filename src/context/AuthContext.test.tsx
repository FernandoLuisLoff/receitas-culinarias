import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';

vi.mock('../services/authService');

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

describe('AuthContext / useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('lança erro quando usado fora do AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth deve ser usado dentro de um AuthProvider.',
    );
  });

  it('autentica o usuário e persiste o token após signIn', async () => {
    vi.spyOn(authService, 'login').mockResolvedValue({
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'https://example.com/avatar.png',
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ username: 'emilys', password: 'emilyspass' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.username).toBe('emilys');
    expect(localStorage.getItem('receitas:accessToken')).toBe('token-123');
  });

  it('limpa o estado de autenticação após signOut', async () => {
    vi.spyOn(authService, 'login').mockResolvedValue({
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'https://example.com/avatar.png',
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ username: 'emilys', password: 'emilyspass' });
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('receitas:accessToken')).toBeNull();
  });
});
