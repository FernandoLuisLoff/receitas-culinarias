import { useEffect, useState } from 'react';
import { fetchRecipes, fetchRecipesByTag } from '../services/recipesService';
import type { Recipe } from '../schemas/recipe.schema';

interface UseRecipeExplorerParams {
  search: string;
  cuisine: string | null;
}

interface UseRecipeExplorerResult {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
}

// Busca todas as receitas compatíveis com o filtro atual (busca por texto OU cozinha)
// e deixa a paginação a cargo do componente consumidor, já que a API retorna poucos itens.
export function useRecipeExplorer({ search, cuisine }: UseRecipeExplorerParams): UseRecipeExplorerResult {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    const request = cuisine
      ? fetchRecipesByTag(cuisine)
      : fetchRecipes({ q: search || undefined, limit: 0 });

    request
      .then((result) => {
        if (!isCancelled) setRecipes(result.recipes);
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
  }, [search, cuisine]);

  return { recipes, isLoading, error };
}
