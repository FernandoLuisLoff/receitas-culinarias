import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Center,
  Grid,
  Group,
  Loader,
  Pagination,
  Select,
  Stack,
  Text,
  Title,
  TextInput,
  ActionIcon,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconHeart, IconHeartFilled, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipeExplorer } from '../hooks/useRecipeExplorer';
import { useFavorites } from '../hooks/useFavorites';
import { fetchRecipeTags } from '../services/recipesService';

const PAGE_SIZE = 9;

export function HomePage() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);

  const { recipes, isLoading, error } = useRecipeExplorer({ search: debouncedSearch, cuisine });

  useEffect(() => {
    let isCancelled = false;
    fetchRecipeTags()
      .then((result) => {
        if (!isCancelled) setTags(result);
      })
      .catch(() => {
        if (!isCancelled) setTags([]);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, cuisine]);

  const totalPages = Math.max(1, Math.ceil(recipes.length / PAGE_SIZE));
  const paginatedRecipes = useMemo(
    () => recipes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [recipes, page],
  );

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={2}>Explore receitas</Title>
        <Text c="dimmed" size="sm">
          Busque por nome, filtre por cozinha e descubra novos pratos.
        </Text>
      </Stack>

      <Group>
        <TextInput
          placeholder="Buscar receita pelo nome..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filtrar por cozinha/tag"
          data={tags}
          value={cuisine}
          onChange={setCuisine}
          clearable
          searchable
          w={220}
        />
      </Group>

      {error && (
        <Alert color="red" title="Erro ao carregar">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : paginatedRecipes.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Nenhuma receita encontrada.
        </Text>
      ) : (
        <>
          <Grid>
            {paginatedRecipes.map((recipe) => (
              <Grid.Col key={recipe.id} span={{ base: 12, sm: 6, md: 4 }}>
                <RecipeCard recipe={recipe} onClick={(r) => navigate(`/receitas/${r.id}`)}>
                  <Group justify="flex-end" mt="sm">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      aria-label={isFavorite(recipe.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(recipe.id);
                      }}
                    >
                      {isFavorite(recipe.id) ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                    </ActionIcon>
                  </Group>
                </RecipeCard>
              </Grid.Col>
            ))}
          </Grid>

          <Center>
            <Pagination value={page} onChange={setPage} total={totalPages} />
          </Center>
        </>
      )}
    </Stack>
  );
}
