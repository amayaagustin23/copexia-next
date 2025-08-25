export type LocalizedPaths = ReturnType<
  typeof import("@/lib/hooks/useLocalizedPaths").useLocalizedPaths
>;

export type SidebarLink = {
  label: string;
  href: string;
  iconName: "LayoutDashboard" | "FileText" | "FolderTree";
  icon: React.ReactNode;
};
