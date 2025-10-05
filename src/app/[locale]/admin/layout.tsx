"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from '@/context/AuthContext';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { cn } from '@/lib/utils';
// import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const paths = useLocalizedPaths();
  // const t = useTranslations('AdminDashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && user && user.role !== 'ADMIN') {
      router.replace(paths.root);
    }
  }, [user, isLoading, router, paths.root]);

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     router.replace(paths.auth.signIn);
  //   } catch (error) {
  //     console.error('Error al cerrar sesión:', error);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Overlay para móviles cuando el sidebar está abierto */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      <main
        className={cn(
          'min-h-screen flex flex-col transition-all duration-300',
          // Desktop: margen fijo
          'md:ml-64',
          // Mobile: sin margen (overlay)
          'ml-0',
          // Desktop colapsado
          isSidebarCollapsed && 'md:ml-16'
        )}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
