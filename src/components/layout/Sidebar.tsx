"use client";

import { useAuth } from "@/context/AuthContext";
import { getSidebarLinks } from "@/lib/constants/navLinks";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderTree,
  Home,
  LayoutDashboard,
  List,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const IconMap = {
  LayoutDashboard,
  FileText,
  FolderTree,
  MessageCircle,
} as const;

interface SidebarProps {
  isMobileOpen?: boolean;
  isDesktopCollapsed?: boolean;
  onMobileClose?: () => void;
  onDesktopToggle?: () => void;
}

export const Sidebar = ({
  isMobileOpen = false,
  isDesktopCollapsed = false,
  onMobileClose,
  onDesktopToggle,
}: SidebarProps) => {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const t = useTranslations('Sidebar');
  const paths = useLocalizedPaths();
  const { logout } = useAuth();

  const rawLinks = getSidebarLinks(t, paths);

  // Desduplicar por href para evitar keys repetidas
  const links = useMemo(() => {
    const seen = new Set<string>();
    return rawLinks.filter((l) => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  }, [rawLinks]);

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
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border flex flex-col transition-all duration-300',
        // Width Control
        isDesktopCollapsed ? 'w-20' : 'w-64',
        // Mobile visibility (Off-canvas)
        'transform',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop visibility (Always visible, reset transform)
        'md:translate-x-0'
      )}
    >
      <div className={cn("flex items-center p-4 border-b border-border", isDesktopCollapsed ? "justify-center" : "justify-between")}>
        <Link
          href={paths.admin.dashboard}
          className={cn(
            'flex items-center min-w-0 transition-opacity',
            isDesktopCollapsed ? 'hidden' : 'flex gap-2'
          )}
        >
          <Image
            src="/images/logo-copexia.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-bold text-sm sm:text-base lg:text-lg truncate">
            {t('panelTitle')}
          </span>
        </Link>

        {/* Logo icon only when collapsed */}
        {isDesktopCollapsed && (
          <Link href={paths.admin.dashboard}>
            <Image
              src="/images/logo-copexia.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </Link>
        )}

        {/* Desktop Toggle Button */}
        <button
          onClick={onDesktopToggle}
          aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex text-muted-foreground hover:text-foreground transition-colors p-1"
          type="button"
        >
          <List className="w-5 h-5" />
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          aria-label="Close sidebar"
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
          type="button"
        >
          <List className="w-6 h-6" />
        </button>
      </div>

      {/* Botón Ir al Inicio */}
      <div className="px-2 pt-3 pb-2">
        <Link
          href={paths.root}
          className={cn(
            'flex items-center gap-3 px-3 py-2 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors',
            isDesktopCollapsed ? 'justify-center' : ''
          )}
          title={isDesktopCollapsed ? t('goHome') : undefined}
        >
          <Home
            className={cn(
              'flex-shrink-0 transition-all duration-300',
              isDesktopCollapsed ? 'w-6 h-6' : 'w-5 h-5'
            )}
          />
          {!isDesktopCollapsed && <span className="truncate">{t('goHome')}</span>}
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 py-2 overflow-y-auto border-t border-border pt-2">
      {/* Calcula el link activo más específico (href más largo que coincide) */}
        {(() => {
          const activeHref = links
            .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
            .sort((a, b) => b.href.length - a.href.length)[0]?.href;

          return links.map(({ href, label, iconName }, idx) => {
            const Icon = IconMap[iconName as keyof typeof IconMap];
            const isActive = href === activeHref;

            return (
              <Link
                key={`${href}#${idx}`}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent',
                  isActive && 'bg-accent text-accent-foreground',
                  isDesktopCollapsed && 'justify-center'
                )}
                title={isDesktopCollapsed ? label : undefined}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'transition-all duration-300',
                      isDesktopCollapsed ? 'w-6 h-6' : 'w-5 h-5'
                    )}
                  />
                )}
                {!isDesktopCollapsed && <span>{label}</span>}
              </Link>
            );
          });
        })()}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          type="button"
          className={cn(
            'flex items-center gap-3 px-3 py-2 w-full text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors',
            isDesktopCollapsed ? 'justify-center' : ''
          )}
          title={isDesktopCollapsed ? t('logout') : undefined}
        >
          <LogOut
            className={cn(
              'flex-shrink-0 transition-all duration-300',
              isDesktopCollapsed ? 'w-6 h-6' : 'w-5 h-5'
            )}
          />
          {!isDesktopCollapsed && <span className="truncate">{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
};
