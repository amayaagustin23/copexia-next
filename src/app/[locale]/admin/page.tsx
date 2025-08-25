"use client";

import { useTranslations } from "next-intl";

export default function AdminDashboardPage() {
  const t = useTranslations("AdminDashboard");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
      </header>
    </div>
  );
}
