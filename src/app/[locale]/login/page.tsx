"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { TranslatedFormMessage } from '@/components/translated-form-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';

import { PasswordInput } from '@/components/PasswordInput';
import { useAuth } from '@/context/AuthContext';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { loginSchema } from '@/schemas/auth/loginSchema';
import { loginUser } from '@/services/authService';
import { LoginData } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const t = useTranslations('auth.login');
  const paths = useLocalizedPaths();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@copexia.com',
      password: 'Pass1234',
    },
  });

  const onSubmit = async (data: LoginData) => {
    const response = await loginUser(data);
    if (response) {
      login(response.user);

      const redirectTo = searchParams.get('redirect') || paths.admin.root;

      await new Promise((resolve) => setTimeout(resolve, 100));

      window.location.href = redirectTo;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm bg-card text-card-foreground">
        <CardHeader className="flex flex-col items-center pb-0">
          <Image
            src="/images/logo-copexia.png"
            alt="Copexia"
            width={250}
            height={50}
            className="mb-1"
          />

          <h1 className="text-2xl font-bold mt-4 mb-10">{t('title')}</h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('emailLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('emailPlaceholder')}
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
                    <FormLabel>{t('passwordLabel')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('passwordPlaceholder')}
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
                  href={paths.auth.recoverPassword}
                  className="text-sm text-primary hover:underline"
                >
                  {t('forgotPasswordLink')}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('submitButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
