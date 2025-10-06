import { LocalizedPaths } from "@/types/path";

export type SidebarIconName =
  | 'LayoutDashboard'
  | 'FileText'
  | 'FolderTree'
  | 'MessageCircle';

export type SidebarLink = {
  label: string;
  href: string;
  iconName: SidebarIconName;
  key?: string;
};

export const getNavLinks = (
  t: (key: string) => string,
  paths: LocalizedPaths
) => [
  { name: t("homeLink"), href: paths.sections.home },
  { name: t("aboutLink"), href: paths.sections.aboutUs },
  { name: t("contactLink"), href: paths.sections.contact },
];

export const getSidebarLinks = (
  t: (key: string) => string,
  paths: LocalizedPaths
): SidebarLink[] => [
  {
    label: t('dashboardLink'),
    href: paths.admin.dashboard,
    iconName: 'LayoutDashboard',
  },
  {
    label: t('postsLink'),
    href: paths.admin.posts,
    iconName: 'FileText',
  },
  {
    label: t('categoriesLink'),
    href: paths.admin.categories,
    iconName: 'FolderTree',
  },
  {
    label: t('commentsLink'),
    href: paths.admin.comments,
    iconName: 'MessageCircle',
  },
];
