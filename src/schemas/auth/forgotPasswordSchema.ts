import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
