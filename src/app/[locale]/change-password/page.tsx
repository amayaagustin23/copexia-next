"use client";

import { LoadingSpinner } from '@/components/ui/loading';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import {
  ChangeWithTokenSchema,
  makeChangeWithTokenSchema,
} from '@/lib/validators/auth';
import { resetPassword } from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ChangePasswordForm() {
  const t = useTranslations('auth.change');
  const tv = useTranslations('validations.change');
  const { auth } = useLocalizedPaths();
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();

  const token = params.get('token') || '';

  const schema = useMemo(() => makeChangeWithTokenSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, submitCount },
    setError,
    reset,
  } = useForm<ChangeWithTokenSchema>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('root', { type: 'missing-token', message: t('missingToken') });
    }
  }, [token, setError, t]);

  const onSubmit = handleSubmit(async ({ newPassword }) => {
    if (!token) {
      setError('root', { type: 'missing-token', message: t('missingToken') });
      return;
    }
    try {
      setLoading(true);
      await resetPassword(
        token,
        { password: newPassword, confirmPassword: newPassword },
        t
      );
      setDone(true);
      reset();
    } catch (e: any) {
      const msg = e?.message || t('genericError');
      setError('root', { type: 'server', message: msg });
    } finally {
      setLoading(false);
    }
  });

  const submitting = isSubmitting || loading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-md border border-border">
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
          {t('title')}
        </h1>

        {done && (
          <div
            className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-600"
            role="status"
            aria-live="polite"
          >
            {t('done')}
          </div>
        )}

        {/* Error global */}
        {'root' in errors && (errors as any).root?.message && (
          <div
            className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {(errors as any).root.message}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-foreground"
            >
              {t('newLabel')}
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              {...register('newPassword')}
              className={[
                'mt-1 w-full rounded-lg border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary',
                errors.newPassword
                  ? 'border-destructive ring-destructive/40'
                  : 'border-input',
              ].join(' ')}
              disabled={submitting}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground"
            >
              {t('confirmLabel')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
              className={[
                'mt-1 w-full rounded-lg border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary',
                errors.confirmPassword
                  ? 'border-destructive ring-destructive/40'
                  : 'border-input',
              ].join(' ')}
              disabled={submitting}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
            disabled={!token || submitting || (submitCount > 0 && !isValid)}
          >
            {submitting ? <LoadingSpinner size="sm" /> : t('submit')}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-primary">
          <Link href={auth.signIn} className="hover:underline">
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
