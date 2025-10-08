"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { PasswordInput } from '@/components/PasswordInput';
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
import { LoadingSpinner } from '@/components/ui/loading';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import type { ResetPasswordSchema } from '@/schemas/auth/resetPasswordSchema';
import { resetPasswordSchema } from '@/schemas/auth/resetPasswordSchema';
import { resetPassword } from '@/services/authService';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('auth.reset');
  const paths = useLocalizedPaths();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token de restablecimiento no válido');
      return;
    }
    console.log('Token from URL:', tokenParam);
    setToken(tokenParam);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    // Get token directly from URL params
    const currentToken = searchParams.get('token');
    
    if (!currentToken) {
      setError('Token de restablecimiento no válido');
      return;
    }

    setError(null);
    
    const response = await resetPassword(currentToken, { password: data.password, confirmPassword: data.confirmPassword }, t);
    if (response) {
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(paths.auth.signIn);
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-2xl shadow-sm bg-card text-card-foreground">
          <CardHeader className="flex flex-col items-center pb-0">
            <Image
              src="/images/logo-copexia.png"
              alt="Copexia"
              width={150}
              height={50}
              className="mb-1"
            />
            <h1 className="text-2xl font-bold mt-4 mb-10">{t('successTitle')}</h1>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              {t('successMessage')}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
            <Button asChild className="w-full bg-primary">
              <Link href={paths.auth.signIn}>
                Ir al inicio de sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm bg-card text-card-foreground">
        <CardHeader className="flex flex-col items-center pb-0">
          <Image
            src="/images/logo-copexia.png"
            alt="Copexia"
            width={150}
            height={50}
            className="mb-1"
          />
          <h1 className="text-2xl font-bold mt-4 mb-10">{t('title')}</h1>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive font-medium mb-2">Errores de validación:</p>
              <ul className="text-sm text-destructive space-y-1">
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <li key={field}>• {error?.message}</li>
                ))}
              </ul>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('newPasswordLabel')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('newPasswordPlaceholder')}
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
                    <FormLabel>{t('confirmPasswordLabel')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('confirmPasswordPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <TranslatedFormMessage name="confirmPassword" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary"
              >
                {form.formState.isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('submit')
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Link
              href={paths.auth.signIn}
              className="text-sm text-primary hover:underline"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
