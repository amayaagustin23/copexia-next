"use client";

import { getSidebarLinks } from "@/lib/constants/navLinks";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/authService";
import { LayoutDashboard, List, LogOut, Settings, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const icons = {
  dashboard: <LayoutDashboard className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
};

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Sidebar");
  const paths = useLocalizedPaths();
  const links = getSidebarLinks(t, paths);

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Colapsar por defecto en mobile
  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsCollapsed(media.matches);
  }, []);

  const handleLogout = async () => {
    await logoutUser(t);
    router.replace(paths.auth.login);
  };

  return (
    <aside
      className={cn(
        "bg-blue-100 bg-blend-hue border-r border-border min-h-screen flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
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
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-2 overflow-y-auto">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
              pathname === href && "bg-accent text-accent-foreground",
              isCollapsed && "justify-center"
            )}
          >
            {icons[icon as keyof typeof icons]}
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
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
