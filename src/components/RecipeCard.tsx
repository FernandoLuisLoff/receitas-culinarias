import { Badge, Card, Group, Image, Stack, Text, type MantineStyleProp } from '@mantine/core';
import type { ReactNode } from 'react';
import type { Recipe } from '../schemas/recipe.schema';

export interface RecipeCardProps {
  recipe: Recipe;
  onClick?: (recipe: Recipe) => void;
  /** Conteúdo extra renderizado no rodapé do card, como um botão de favoritar. */
  children?: ReactNode;
  style?: MantineStyleProp;
}

export function RecipeCard({ recipe, onClick, children, style }: RecipeCardProps) {
  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      style={{ cursor: onClick ? 'pointer' : undefined, ...style }}
      onClick={() => onClick?.(recipe)}
    >
      <Card.Section>
        <Image src={recipe.image} height={160} alt={recipe.name} fallbackSrc="https://placehold.co/400x200?text=Receita" />
      </Card.Section>

      <Stack gap={4} mt="md">
        <Text fw={600}>{recipe.name}</Text>
        <Group gap={6}>
          <Badge color="orange" variant="light">
            {recipe.cuisine}
          </Badge>
          <Badge color="gray" variant="light">
            {recipe.difficulty}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min • {recipe.servings} porções
        </Text>
      </Stack>

      {children}
    </Card>
  );
}
