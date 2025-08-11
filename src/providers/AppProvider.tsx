// src/providers/AppProvider.tsx
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface AppProviderProps {
  children: ReactNode;
  messages: AbstractIntlMessages; // Tipo de Next.js para los mensajes de i18n
  locale: string;
}

export function AppProvider({ children, messages, locale }: AppProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="America/Argentina/Buenos_Aires"
    >
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
