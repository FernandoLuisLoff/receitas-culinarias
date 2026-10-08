import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe, fetchRecipes } from '../../services/recipesService';
import type { Recipe } from '../../schemas/recipe.schema';

const PAGE_SIZE = 10;

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetchRecipes({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE })
      .then((result) => {
        if (!isCancelled) {
          setRecipes(result.recipes);
          setTotal(result.total);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar receitas.');
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [page]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Remover esta receita?');
    if (!confirmed) return;
    try {
      await deleteRecipe(id);
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover receita.');
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Gestão de receitas</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/admin/novo')}>
          Nova receita
        </Button>
      </Group>

      {error && <Alert color="red">{error}</Alert>}

      <div style={{ position: 'relative', minHeight: 200 }}>
        <LoadingOverlay visible={isLoading} />
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Cozinha</Table.Th>
              <Table.Th>Dificuldade</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recipes.map((recipe) => (
              <Table.Tr key={recipe.id}>
                <Table.Td>{recipe.name}</Table.Td>
                <Table.Td>{recipe.cuisine}</Table.Td>
                <Table.Td>{recipe.difficulty}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      aria-label={`Editar ${recipe.name}`}
                      onClick={() => navigate(`/admin/${recipe.id}/editar`)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      aria-label={`Remover ${recipe.name}`}
                      onClick={() => handleDelete(recipe.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {!isLoading && recipes.length === 0 && (
          <Text c="dimmed" ta="center" py="md">
            Nenhuma receita cadastrada.
          </Text>
        )}
      </div>

      <Group justify="flex-end">
        <Pagination value={page} onChange={setPage} total={totalPages} />
      </Group>
    </Stack>
  );
}
