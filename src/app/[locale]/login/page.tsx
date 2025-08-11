"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";

import { PasswordInput } from "@/components/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { loginUser, Role } from "@/services/authService";
import { LoginData } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const t = useTranslations("Login");
  const paths = useLocalizedPaths();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "juan@clinica.com",
      password: "Pass1234",
    },
  });

  const onSubmit = async (data: LoginData) => {
    const response = await loginUser(data);
    if (response) {
      login(response.user);
      if (response.user.role === Role.ADMIN) router.push(paths.admin.root);
      else router.push(paths.root);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm bg-card text-card-foreground">
        <CardHeader className="flex flex-col items-center pb-0">
          <Image
            src="/images/logo-letter.png"
            alt="Aliviarte"
            width={250}
            height={50}
            className="mb-1"
          />

          <h1 className="text-2xl font-bold mt-4 mb-10">{t("title")}</h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <TranslatedFormMessage name="email" />
                  </FormItem>
                )}
              />

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

              <div className="flex justify-end">
                <Link
                  href={paths.auth.recoveryPassword}
                  className="text-sm text-accent hover:underline"
                >
                  {t("forgotPasswordLink")}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Iniciando sesión..."
                  : t("submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-sm justify-center text-muted-foreground">
          {t("noAccountPrompt")}
          <Link
            href={paths.auth.register}
            className="ml-1 text-accent hover:underline"
          >
            {t("registerLink")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
