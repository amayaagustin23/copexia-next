import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim(),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Debe proporcionar un correo electrónico válido')
    .trim(),
  subject: z
    .string()
    .min(1, 'El asunto es requerido')
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'El asunto no puede exceder los 200 caracteres')
    .trim(),
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder los 2000 caracteres')
    .trim(),
});

export type ContactSchema = z.infer<typeof contactSchema>;

