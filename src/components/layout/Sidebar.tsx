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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({
  isCollapsed: externalCollapsed,
  onToggleCollapse,
}: SidebarProps = {}) => {
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

  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Usar el estado externo si está disponible, sino usar el interno
  const isCollapsed =
    externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setIsCollapsed = onToggleCollapse || setInternalCollapsed;

  useEffect(() => {
    if (externalCollapsed === undefined) {
      const media = window.matchMedia('(max-width: 768px)');
      setInternalCollapsed(media.matches);
    }
  }, [externalCollapsed]);

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
        'border-r border-border min-h-screen flex flex-col transition-all duration-300 bg-card fixed left-0 top-0 z-40',
        isCollapsed ? 'w-24' : 'w-64',
        // En móviles, ocultar cuando está colapsado
        isCollapsed && 'md:translate-x-0 -translate-x-full'
      )}
    >
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        <Link
          href={paths.admin.dashboard}
          className={cn(
            'flex items-center min-w-0',
            isCollapsed ? 'flex-1' : 'gap-2'
          )}
        >
          <Image
            src="/images/logo-copexia.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain transition-all duration-300 flex-shrink-0"
          />
          {!isCollapsed && (
            <span className="font-bold text-sm sm:text-base lg:text-lg transition-opacity truncate">
              {t('panelTitle')}
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Toggle sidebar'}
          className={cn(
            'text-muted-foreground hover:text-foreground transition-colors',
            isCollapsed ? 'p-1' : 'ml-auto p-1'
          )}
          type="button"
        >
          <List className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Botón Ir al Inicio */}
      <div className="px-2 pt-3 pb-2">
        <Link
          href={paths.root}
          className={cn(
            'flex items-center gap-3 px-3 py-2 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <Home
            className={cn(
              'flex-shrink-0 transition-all duration-300',
              isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
            )}
          />
          {!isCollapsed && <span className="truncate">{t('goHome')}</span>}
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 py-2 overflow-y-auto border-t border-border pt-2">
        {(() => {
          // Primero determinar cuál enlace debe estar activo
          const activeLink = (() => {
            // Buscar coincidencia exacta primero
            const exactMatch = links.find(
              (link) => pathname === link.href || pathname === `${link.href}/`
            );
            if (exactMatch) return exactMatch;

            // Buscar la coincidencia más específica para rutas anidadas
            const pathSegments = pathname.split('/').filter(Boolean);
            let bestMatch = null;
            let maxMatchingSegments = 0;

            for (const link of links) {
              const hrefSegments = link.href.split('/').filter(Boolean);

              // Si la ruta actual comienza con esta href
              if (pathSegments.length >= hrefSegments.length) {
                const matchingSegments = hrefSegments.filter(
                  (segment, index) => pathSegments[index] === segment
                ).length;

                if (
                  matchingSegments === hrefSegments.length &&
                  matchingSegments > maxMatchingSegments
                ) {
                  bestMatch = link;
                  maxMatchingSegments = matchingSegments;
                }
              }
            }

            return bestMatch;
          })();

          return links.map(({ href, label, iconName }, idx) => {
            const Icon = IconMap[iconName as keyof typeof IconMap];
            const isActive = activeLink?.href === href;

            return (
              <Link
                key={`${href}#${idx}`}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent',
                  isActive && 'bg-accent text-accent-foreground',
                  isCollapsed && 'justify-center'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'transition-all duration-300',
                      isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
                    )}
                  />
                )}
                {!isCollapsed && <span>{label}</span>}
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
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <LogOut
            className={cn(
              'flex-shrink-0 transition-all duration-300',
              isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
            )}
          />
          {!isCollapsed && <span className="truncate">{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
};
