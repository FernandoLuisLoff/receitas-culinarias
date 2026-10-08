import { AppShell, Burger, Group, NavLink as MantineNavLink, Title, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChefHat, IconLogout, IconSearch, IconLayoutDashboard } from '@tabler/icons-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function MainLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/');
  }

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconChefHat size={28} />
            <Title order={3}>Receitas Culinárias</Title>
          </Group>
          <Group>
            {isAuthenticated ? (
              <>
                <Text size="sm" visibleFrom="sm">
                  Olá, {user?.firstName}
                </Text>
                <Button variant="subtle" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                  Sair
                </Button>
              </>
            ) : (
              <Button component={NavLink} to="/login" variant="light">
                Login administrativo
              </Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <MantineNavLink
          component={NavLink}
          to="/"
          end
          label="Buscar receitas"
          leftSection={<IconSearch size={16} />}
          style={({ isActive }: { isActive: boolean }) => (isActive ? { fontWeight: 700 } : undefined)}
        />
        {isAuthenticated && (
          <MantineNavLink
            component={NavLink}
            to="/admin"
            label="Área administrativa"
            leftSection={<IconLayoutDashboard size={16} />}
            style={({ isActive }: { isActive: boolean }) => (isActive ? { fontWeight: 700 } : undefined)}
          />
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
