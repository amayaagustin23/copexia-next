import { LocalizedPaths } from "@/types/path";

export const getNavLinks = (
  t: (key: string) => string,
  paths: LocalizedPaths
) => [
  { name: t("homeLink"), href: paths.root },
  { name: t("aboutLink"), href: paths.about},
  { name: t("contactLink"), href: paths.contact },
];

export const getSidebarLinks = (
  t: (key: string) => string,
  paths: LocalizedPaths
) => [
  {
    label: t("dashboardLink"),
    href: paths.admin.dashboard,
    icon: "dashboard",
  },
  {
    label: t("usersLink"),
    href: paths.admin.users,
    icon: "users",
  },
  {
    label: t("settingsLink"),
    href: paths.admin.settings,
    icon: "settings",
  },
];
