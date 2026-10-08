import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import { LoginPage } from './LoginPage';
import * as authService from '../services/authService';

vi.mock('../services/authService');

describe('LoginPage', () => {
  it('exibe erros de validação ao submeter o formulário vazio', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Informe o usuário')).toBeInTheDocument();
    expect(await screen.findByText('Informe a senha')).toBeInTheDocument();
  });

  it('chama o serviço de login com os dados informados', async () => {
    const loginSpy = vi.spyOn(authService, 'login').mockResolvedValue({
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

    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Usuário'), 'emilys');
    await user.type(screen.getByLabelText('Senha'), 'emilyspass');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(loginSpy).toHaveBeenCalledWith({ username: 'emilys', password: 'emilyspass' });
  });
});
