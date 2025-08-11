import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Validations.Login.emailRequired",
    })
    .email("Validations.Login.emailInvalid"),
  password: z
    .string({
      required_error: "Validations.Login.passwordRequired",
    })
    .min(8, "Validations.Login.passwordMin"),
});
