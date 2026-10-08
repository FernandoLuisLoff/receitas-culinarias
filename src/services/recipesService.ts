import { api } from './api';
import { recipeListSchema, recipeSchema, type Recipe, type RecipeList } from '../schemas/recipe.schema';

export interface RecipeQueryParams {
  limit?: number;
  skip?: number;
  q?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export async function fetchRecipes(params: RecipeQueryParams = {}): Promise<RecipeList> {
  const { q, ...rest } = params;
  const endpoint = q ? '/recipes/search' : '/recipes';
  const { data } = await api.get(endpoint, { params: q ? { q, ...rest } : rest });
  const parsed = recipeListSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Resposta inesperada da API de receitas.');
  }
  return parsed.data;
}

export async function fetchRecipeById(id: number): Promise<Recipe> {
  const { data } = await api.get(`/recipes/${id}`);
  const parsed = recipeSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Resposta inesperada da API de receitas.');
  }
  return parsed.data;
}

export async function fetchRecipeTags(): Promise<string[]> {
  const { data } = await api.get<string[]>('/recipes/tags');
  return data;
}

export async function fetchRecipesByTag(tag: string): Promise<RecipeList> {
  const { data } = await api.get(`/recipes/tag/${encodeURIComponent(tag)}`);
  const parsed = recipeListSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Resposta inesperada da API de receitas.');
  }
  return parsed.data;
}

export interface RecipePayload {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  image: string;
  mealType: string[];
}

export async function createRecipe(payload: RecipePayload): Promise<Recipe> {
  const { data } = await api.post('/recipes/add', payload);
  return data as Recipe;
}

export async function updateRecipe(id: number, payload: Partial<RecipePayload>): Promise<Recipe> {
  const { data } = await api.put(`/recipes/${id}`, payload);
  return data as Recipe;
}

export async function deleteRecipe(id: number): Promise<void> {
  await api.delete(`/recipes/${id}`);
}
