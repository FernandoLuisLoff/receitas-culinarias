import { z } from 'zod';

export const recipeSchema = z.object({
  id: z.number(),
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prepTimeMinutes: z.number(),
  cookTimeMinutes: z.number(),
  servings: z.number(),
  difficulty: z.string(),
  cuisine: z.string(),
  caloriesPerServing: z.number(),
  tags: z.array(z.string()),
  userId: z.number(),
  image: z.string(),
  rating: z.number(),
  reviewCount: z.number(),
  mealType: z.array(z.string()),
});

export type Recipe = z.infer<typeof recipeSchema>;

export const recipeListSchema = z.object({
  recipes: z.array(recipeSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type RecipeList = z.infer<typeof recipeListSchema>;

// Schema usado pelo formulário administrativo (Mantine + zodResolver).
export const recipeFormSchema = z.object({
  name: z.string().min(3, 'Informe ao menos 3 caracteres'),
  cuisine: z.string().min(1, 'Selecione a cozinha'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
    error: 'Selecione a dificuldade',
  }),
  servings: z.number({ error: 'Informe o número de porções' }).min(1, 'Mínimo de 1 porção'),
  prepTimeMinutes: z.number({ error: 'Informe o tempo de preparo' }).min(1, 'Informe um tempo válido'),
  cookTimeMinutes: z.number({ error: 'Informe o tempo de cozimento' }).min(0, 'Informe um tempo válido'),
  caloriesPerServing: z.number({ error: 'Informe as calorias' }).min(0, 'Informe um valor válido'),
  image: z.url('Informe uma URL de imagem válida'),
  ingredients: z
    .string()
    .min(1, 'Informe ao menos um ingrediente')
    .transform((value) => value.split('\n').map((item) => item.trim()).filter(Boolean)),
  instructions: z
    .string()
    .min(1, 'Informe ao menos um passo de preparo')
    .transform((value) => value.split('\n').map((item) => item.trim()).filter(Boolean)),
  tags: z
    .string()
    .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean)),
  mealType: z
    .string()
    .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean)),
});

export type RecipeFormValues = z.input<typeof recipeFormSchema>;
export type RecipeFormOutput = z.output<typeof recipeFormSchema>;
