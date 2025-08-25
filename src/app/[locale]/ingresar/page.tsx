"use client";

import { useAuth } from "@/context/AuthContext";
import { getSidebarLinks } from "@/lib/constants/navLinks";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  List,
  LogOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const IconMap = {
  LayoutDashboard,
  FileText,
  FolderTree,
} as const;

export const Sidebar = () => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const t = useTranslations("Sidebar");
  const paths = useLocalizedPaths();
  const { logout } = useAuth();

  const rawLinks = getSidebarLinks(t, paths);
  const links = useMemo(() => {
    const seen = new Set<string>();
    return rawLinks.filter((l) => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  }, [rawLinks]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsCollapsed(media.matches);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace(paths.auth.signIn);
    }
  };

  return (
    <aside
      className={cn(
        "border-r border-border min-h-screen flex flex-col transition-all duration-300 bg-card",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href={paths.admin.dashboard} className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="object-contain"
            style={{ height: "auto" }}
          />
          {!isCollapsed && (
            <span className="font-bold text-lg transition-opacity">
              {t("panelTitle")}
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed((p) => !p)}
          aria-label="Toggle sidebar"
          className="ml-auto text-muted-foreground hover:text-foreground"
          type="button"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 py-2 overflow-y-auto">
        {links.map(({ href, label, iconName }, idx) => {
          const Icon = IconMap[iconName];
          const isActive =
            pathname === href ||
            pathname === `${href}/` ||
            pathname.startsWith(`${href}/`);
          const key = `${href}#${idx}`;
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                isActive && "bg-accent text-accent-foreground",
                isCollapsed && "justify-center"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          type="button"
          className={cn(
            "flex items-center gap-3 px-3 py-2 w-full text-sm text-destructive hover:underline",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && t("logout")}
        </button>
      </div>
    </aside>
  );
};
