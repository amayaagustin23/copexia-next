"use client";

import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t border-border py-6 text-center">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 space-y-2 text-sm">
        <p>{t('description')}</p>
        <p>
          © {year} {t('brandName')}. {t('rightsReserved')}
        </p>
      </div>
    </footer>
  );
};
