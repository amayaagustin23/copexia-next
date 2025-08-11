// src/schemas/auth/forgotPasswordSchema.ts
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Validations.ForgotPassword.emailRequired",
    })
    .email("Validations.ForgotPassword.emailInvalid"),
});
