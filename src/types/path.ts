export type { Locale, LocalizedPaths, SectionId } from '@/schemas/path';

export type SidebarLink = {
  label: string;
  href: string;
  iconName: 'LayoutDashboard' | 'FileText' | 'FolderTree';
  icon: React.ReactNode;
};
