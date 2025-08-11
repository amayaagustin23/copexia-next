import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("AdminDashboard");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>
    </div>
  );
}
