"use client";

import { useAuth } from "@/context/AuthContext";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { makeRecoverSchema, RecoverSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function RecoverPasswordForm() {
  const t = useTranslations("auth.recover");
  const tv = useTranslations("validations.recover");
  const { recoverPassword, loading } = useAuth();
  const { auth } = useLocalizedPaths();

  const schema = useMemo(() => makeRecoverSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, submitCount },
    setError,
    reset,
  } = useForm<RecoverSchema>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  });

  const [sent, setSent] = useState(false);

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await recoverPassword({ email });
      setSent(true);
      reset({ email: "" });
    } catch (e: any) {
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("correo") || msg.includes("email")) {
        setError("email", { type: "server", message: e.message });
      } else {
        setError("root", { type: "server", message: e.message });
      }
    }
  });

  const submitting = isSubmitting || loading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-md border border-border">
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
          {t("title")}
        </h1>

        {sent && (
          <div
            className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-600"
            role="status"
            aria-live="polite"
          >
            {t("sent")}
          </div>
        )}

        {"root" in errors && (errors as any).root?.message && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {(errors as any).root.message}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
              className={[
                "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary",
                errors.email
                  ? "border-destructive ring-destructive/40"
                  : "border-input",
              ].join(" ")}
              disabled={submitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            disabled={submitting || (submitCount > 0 && !isValid)}
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-primary">
          <Link href={auth.signIn} className="hover:underline">
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
