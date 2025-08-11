"use client";
import { useLocale } from "next-intl";

export const useLocalizedPaths = () => {
  const locale = useLocale();

  return {
    root: `/${locale}`,
    about: `/${locale}/about`,
    contact: `/${locale}/contact`,
    account: `/${locale}/account`,
    auth: {
      login: `/${locale}/login`,
      register: `/${locale}/register`,
      recoveryPassword: `/${locale}/recovery-password`,
      resetPassword: `/${locale}/reset-password`,
    },
    admin: {
      root: `/${locale}/admin`,
      dashboard: `/${locale}/admin/dashboard`,
      users: `/${locale}/admin/users`,
      settings: `/${locale}/admin/settings`,
    },
  };
};
