"use client";

import { PasswordInput } from "@/components/PasswordInput";
import { TranslatedFormMessage } from "@/components/translated-form-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { resetPasswordSchema } from "@/schemas/auth/resetPasswordSchema";
import { resetPassword } from "@/services/authService";
import { ResetPasswordData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPassword");
  const router = useRouter();
  const paths = useLocalizedPaths();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    const res = await resetPassword(token, data, t);
    if (res) router.push(paths.auth.login);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm bg-card text-card-foreground">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordLabel")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("passwordPlaceholder")}
                        className=""
                        {...field}
                      />
                    </FormControl>
                    <TranslatedFormMessage name="password" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("confirmPasswordPlaceholder")}
                        className=""
                        {...field}
                      />
                    </FormControl>
                    <TranslatedFormMessage name="password" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent">
                {t("submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground justify-center">
          {t("note")}
        </CardFooter>
      </Card>
    </main>
  );
}
