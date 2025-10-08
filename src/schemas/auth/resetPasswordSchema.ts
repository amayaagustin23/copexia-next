import { z } from 'zod';

// Schema para el formulario (solo password y confirmPassword)
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine((data) => data.password.length >= 8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
    path: ['password'],
  })
  .refine((data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password), {
    message:
      'La contraseña debe contener al menos un número, una letra minúscula y una letra mayúscula',
    path: ['password'],
  });

// Schema para el DTO que se envía al backend (password y confirmPassword)
export const resetPasswordDtoSchema = z
  .object({
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos un número, una letra minúscula y una letra mayúscula'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña')
      .min(8, 'La confirmación debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La confirmación debe contener al menos un número, una letra minúscula y una letra mayúscula'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>;
