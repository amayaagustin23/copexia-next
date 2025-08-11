import { forgotPasswordSchema } from "@/schemas/auth/forgotPasswordSchema";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { registerProfessionalSchema } from "@/schemas/auth/registerProfessionalSchema";
import { resetPasswordSchema } from "@/schemas/auth/resetPasswordSchema";
import { z } from "zod";

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export type RegisterProfessionalData = z.infer<
  typeof registerProfessionalSchema
>;

export type LoginData = z.infer<typeof loginSchema>;

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
