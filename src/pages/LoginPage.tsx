import { Alert, Button, Center, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginFormSchema, type LoginFormValues } from '../schemas/auth.schema';
import { useAuth } from '../hooks/useAuth';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { signIn, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    validate: zod4Resolver(loginFormSchema),
  });

  async function handleSubmit(values: LoginFormValues) {
    try {
      await signIn(values);
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? '/admin', { replace: true });
    } catch {
      // erro já é exposto via contexto de autenticação (campo `error`)
    }
  }

  return (
    <Center mih="70vh">
      <Paper withBorder shadow="sm" p="xl" radius="md" w={360}>
        <Stack gap="md">
          <Title order={3}>Login administrativo</Title>
          <Text size="sm" c="dimmed">
            Use um usuário válido da DummyJSON, por exemplo: <strong>emilys</strong> / <strong>emilyspass</strong>
          </Text>

          {error && <Alert color="red">{error}</Alert>}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="sm">
              <TextInput
                label="Usuário"
                placeholder="emilys"
                {...form.getInputProps('username')}
              />
              <TextInput
                label="Senha"
                type="password"
                placeholder="emilyspass"
                {...form.getInputProps('password')}
              />
              <Button type="submit" loading={isLoading} fullWidth mt="sm">
                Entrar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}
