import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const authUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  image: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
