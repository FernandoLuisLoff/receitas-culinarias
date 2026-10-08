import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Center,
  Group,
  Loader,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeFormSchema, type RecipeFormValues } from '../../schemas/recipe.schema';
import { createRecipe, fetchRecipeById, updateRecipe } from '../../services/recipesService';

const EMPTY_VALUES: RecipeFormValues = {
  name: '',
  cuisine: '',
  difficulty: 'Easy',
  servings: 1,
  prepTimeMinutes: 10,
  cookTimeMinutes: 10,
  caloriesPerServing: 0,
  image: '',
  ingredients: '',
  instructions: '',
  tags: '',
  mealType: '',
};

export function RecipeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [isLoadingRecipe, setIsLoadingRecipe] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecipeFormValues>({
    initialValues: EMPTY_VALUES,
    validate: zod4Resolver(recipeFormSchema),
  });

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    fetchRecipeById(Number(id))
      .then((recipe) => {
        if (isCancelled) return;
        form.setValues({
          name: recipe.name,
          cuisine: recipe.cuisine,
          difficulty: recipe.difficulty as RecipeFormValues['difficulty'],
          servings: recipe.servings,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          caloriesPerServing: recipe.caloriesPerServing,
          image: recipe.image,
          ingredients: recipe.ingredients.join('\n'),
          instructions: recipe.instructions.join('\n'),
          tags: recipe.tags.join(', '),
          mealType: recipe.mealType.join(', '),
        });
      })
      .catch((err: unknown) => {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar receita.');
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingRecipe(false);
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(values: RecipeFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = recipeFormSchema.parse(values);
      if (isEditing && id) {
        await updateRecipe(Number(id), payload);
      } else {
        await createRecipe(payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar receita.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingRecipe) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="md" maw={640}>
      <Title order={3}>{isEditing ? 'Editar receita' : 'Nova receita'}</Title>

      {error && <Alert color="red">{error}</Alert>}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput label="Nome" withAsterisk {...form.getInputProps('name')} />
          <TextInput label="Cozinha" withAsterisk {...form.getInputProps('cuisine')} />
          <Select
            label="Dificuldade"
            withAsterisk
            data={['Easy', 'Medium', 'Hard']}
            {...form.getInputProps('difficulty')}
          />
          <Group grow>
            <NumberInput label="Porções" withAsterisk min={1} {...form.getInputProps('servings')} />
            <NumberInput label="Preparo (min)" withAsterisk min={0} {...form.getInputProps('prepTimeMinutes')} />
            <NumberInput label="Cozimento (min)" withAsterisk min={0} {...form.getInputProps('cookTimeMinutes')} />
          </Group>
          <NumberInput
            label="Calorias por porção"
            withAsterisk
            min={0}
            {...form.getInputProps('caloriesPerServing')}
          />
          <TextInput label="URL da imagem" withAsterisk {...form.getInputProps('image')} />
          <Textarea
            label="Ingredientes (um por linha)"
            withAsterisk
            minRows={4}
            {...form.getInputProps('ingredients')}
          />
          <Textarea
            label="Modo de preparo (um passo por linha)"
            withAsterisk
            minRows={4}
            {...form.getInputProps('instructions')}
          />
          <TextInput label="Tags (separadas por vírgula)" {...form.getInputProps('tags')} />
          <TextInput label="Tipo de refeição (separado por vírgula)" {...form.getInputProps('mealType')} />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => navigate('/admin')}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
