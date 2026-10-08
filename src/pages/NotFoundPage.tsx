import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Center mih="60vh">
      <Stack align="center" gap="xs">
        <Title order={1}>404</Title>
        <Text c="dimmed">Página não encontrada.</Text>
        <Button mt="md" onClick={() => navigate('/')}>
          Voltar para o início
        </Button>
      </Stack>
    </Center>
  );
}
