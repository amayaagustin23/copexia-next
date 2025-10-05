import { z } from 'zod';

export enum Title {
  BACHELOR = 'BACHELOR',
  TECHNICIAN = 'TECHNICIAN',
}

export enum LicenseType {
  NATIONAL = 'NATIONAL',
  PROVINCIAL = 'PROVINCIAL',
}

export const registerProfessionalSchema = z
  .object({
    email: z
      .string({ required_error: 'Validations.Register.emailRequired' })
      .email('Validations.Register.emailInvalid'),

    password: z
      .string({ required_error: 'Validations.Register.passwordRequired' })
      .min(8, 'Validations.Register.passwordMin'),

    confirmPassword: z
      .string({
        required_error: 'Validations.Register.confirmPasswordRequired',
      })
      .min(8, 'Validations.Register.confirmPasswordMin'),

    firstName: z
      .string({ required_error: 'Validations.Register.firstNameRequired' })
      .min(1, 'Validations.Register.firstNameRequired'),

    lastName: z
      .string({ required_error: 'Validations.Register.lastNameRequired' })
      .min(1, 'Validations.Register.lastNameRequired'),

    birthDate: z
      .string({ required_error: 'Validations.Register.birthDateRequired' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Validations.Register.birthDateRequired'),

    dni: z
      .string({ required_error: 'Validations.Register.dniRequired' })
      .min(7, 'Validations.Register.dniMin'),

    phone: z
      .string({ required_error: 'Validations.Register.phoneRequired' })
      .min(7, 'Validations.Register.phoneMin'),

    title: z.nativeEnum(Title, {
      required_error: 'Validations.Register.titleRequired',
    }),

    licenseNumber: z
      .string({ required_error: 'Validations.Register.licenseNumberRequired' })
      .min(1, 'Validations.Register.licenseNumberRequired'),

    licenseType: z.nativeEnum(LicenseType, {
      required_error: 'Validations.Register.licenseTypeRequired',
    }),

    street: z
      .string({ required_error: 'Validations.Register.streetRequired' })
      .min(1, 'Validations.Register.streetRequired'),

    city: z
      .string({ required_error: 'Validations.Register.cityRequired' })
      .min(1, 'Validations.Register.cityRequired'),

    province: z
      .string({ required_error: 'Validations.Register.provinceRequired' })
      .min(1, 'Validations.Register.provinceRequired'),

    postalCode: z
      .string({ required_error: 'Validations.Register.postalCodeRequired' })
      .min(1, 'Validations.Register.postalCodeRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Validations.Register.passwordMismatch',
    path: ['confirmPassword'],
  });
