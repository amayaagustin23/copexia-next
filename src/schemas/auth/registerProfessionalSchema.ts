import { z } from 'zod';

export const registerProfessionalSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z
      .string()
      .min(1, 'El apellido es requerido')
      .min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Formato de email inválido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    company: z.string().min(1, 'La empresa es requerida'),
    position: z.string().min(1, 'El cargo es requerido'),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterProfessionalSchema = z.infer<
  typeof registerProfessionalSchema
>;
