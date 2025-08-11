"use client";

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
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { forgotPasswordSchema } from "@/schemas/auth/forgotPasswordSchema";
import { requestPasswordReset } from "@/services/authService";
import { ForgotPasswordData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function RecoveryPasswordPage() {
  const t = useTranslations("RecoveryPassword");
  const paths = useLocalizedPaths();

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
      await requestPasswordReset(data, t);
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
              <Button type="submit" className="w-full bg-accent">
                {t("submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-sm justify-center text-muted-foreground">
          <Link href={paths.auth.login} className="text-accent hover:underline">
            {t("goBackToLogin")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
