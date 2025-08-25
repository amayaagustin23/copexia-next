import { z } from "zod";

export type TFn = (key: string) => string;

export const makeLoginSchema = (t: TFn) =>
  z.object({
    email: z
      .string({ required_error: t("emailRequired") })
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),
    password: z
      .string({ required_error: t("passwordRequired") })
      .min(6, t("passwordMin")),
  });

export const makeRecoverSchema = (t: TFn) =>
  z.object({
    email: z
      .string({ required_error: t("emailRequired") })
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),
  });

export const makeChangeWithTokenSchema = (t: TFn) =>
  z
    .object({
      newPassword: z
        .string({ required_error: t("newRequired") })
        .min(8, t("newMin")),
      confirmPassword: z.string({ required_error: t("confirmRequired") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("confirmMatch"),
    });

export type RecoverSchema = z.infer<ReturnType<typeof makeRecoverSchema>>;
export type LoginSchema = z.infer<ReturnType<typeof makeLoginSchema>>;
export type ChangeWithTokenSchema = z.infer<
  ReturnType<typeof makeChangeWithTokenSchema>
>;
