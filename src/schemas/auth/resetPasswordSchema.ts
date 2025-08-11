import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "Validations.ResetPassword.passwordRequired",
      })
      .min(8, "Validations.ResetPassword.passwordMin"),
    confirmPassword: z
      .string({
        required_error: "Validations.ResetPassword.confirmPasswordRequired",
      })
      .min(8, "Validations.ResetPassword.confirmPasswordMin"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Validations.ResetPassword.passwordsDoNotMatch",
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
