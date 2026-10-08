import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Center,
  Group,
  Image,
  List,
  Loader,
  Stack,
  Text,
  Title,
  Alert,
} from '@mantine/core';
import { IconArrowLeft, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Recipe } from '../schemas/recipe.schema';
import { fetchRecipeById } from '../services/recipesService';
import { useFavorites } from '../hooks/useFavorites';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetchRecipeById(Number(id))
      .then((result) => {
        if (!isCancelled) setRecipe(result);
      })
      .catch((err: unknown) => {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Receita não encontrada.');
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (error || !recipe) {
    return <Alert color="red">{error ?? 'Receita não encontrada.'}</Alert>;
  }

  return (
    <Stack gap="md">
      <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)} w="fit-content">
        Voltar
      </Button>

      <Image src={recipe.image} alt={recipe.name} radius="md" h={280} fit="cover" />

      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{recipe.name}</Title>
          <Group gap={6} mt={4}>
            <Badge color="orange">{recipe.cuisine}</Badge>
            <Badge color="gray">{recipe.difficulty}</Badge>
            {recipe.mealType.map((meal) => (
              <Badge key={meal} color="blue" variant="light">
                {meal}
              </Badge>
            ))}
          </Group>
        </div>
        <Button
          variant={isFavorite(recipe.id) ? 'filled' : 'outline'}
          color="red"
          leftSection={isFavorite(recipe.id) ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
          onClick={() => toggleFavorite(recipe.id)}
        >
          {isFavorite(recipe.id) ? 'Favoritado' : 'Favoritar'}
        </Button>
      </Group>

      <Group gap="xl">
        <Text size="sm">Preparo: {recipe.prepTimeMinutes} min</Text>
        <Text size="sm">Cozimento: {recipe.cookTimeMinutes} min</Text>
        <Text size="sm">Porções: {recipe.servings}</Text>
        <Text size="sm">Calorias/porção: {recipe.caloriesPerServing}</Text>
      </Group>

      <Title order={4}>Ingredientes</Title>
      <List>
        {recipe.ingredients.map((ingredient) => (
          <List.Item key={ingredient}>{ingredient}</List.Item>
        ))}
      </List>

      <Title order={4}>Modo de preparo</Title>
      <List type="ordered">
        {recipe.instructions.map((step) => (
          <List.Item key={step}>{step}</List.Item>
        ))}
      </List>
    </Stack>
  );
}
