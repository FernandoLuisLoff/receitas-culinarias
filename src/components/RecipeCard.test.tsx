import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../schemas/recipe.schema';

const recipe: Recipe = {
  id: 1,
  name: 'Pizza Margherita',
  ingredients: ['Massa', 'Molho de tomate'],
  instructions: ['Asse por 15 minutos'],
  prepTimeMinutes: 20,
  cookTimeMinutes: 15,
  servings: 4,
  difficulty: 'Easy',
  cuisine: 'Italian',
  caloriesPerServing: 300,
  tags: ['Pizza'],
  userId: 1,
  image: 'https://example.com/pizza.jpg',
  rating: 4.5,
  reviewCount: 10,
  mealType: ['Dinner'],
};

describe('RecipeCard', () => {
  it('exibe nome, cozinha e dificuldade da receita', () => {
    renderWithProviders(<RecipeCard recipe={recipe} />);

    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('chama onClick com a receita ao ser clicado', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(<RecipeCard recipe={recipe} onClick={handleClick} />);

    await user.click(screen.getByText('Pizza Margherita'));

    expect(handleClick).toHaveBeenCalledWith(recipe);
  });
});
