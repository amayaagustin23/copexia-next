"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from '@/context/AuthContext';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { cn } from '@/lib/utils';
// import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const paths = useLocalizedPaths();
  // const t = useTranslations('AdminDashboard');

  // State for mobile drawer
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // State for desktop sidebar (collapsed/expanded)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  useEffect(() => {
    // Optional: Auto-collapse desktop sidebar on smaller desktop screens if needed
    // For now, we just handle the mobile check locally or rely on CSS media queries
  }, []);

  useEffect(() => {
    if (!isLoading && user && user.role !== 'ADMIN') {
      router.replace(paths.root);
    }
  }, [user, isLoading, router, paths.root]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [router]);

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
        isMobileOpen={isMobileOpen}
        isDesktopCollapsed={isDesktopCollapsed}
        onMobileClose={() => setIsMobileOpen(false)}
        onDesktopToggle={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
      />

      {/* Overlay para móviles cuando el sidebar está abierto */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <main
        className={cn(
          'min-h-screen flex flex-col transition-all duration-300',
          // Desktop: margen ajustado según estado
          isDesktopCollapsed ? 'md:ml-20' : 'md:ml-64', // ml-20 = 5rem (w-20)
          // Mobile: sin margen (overlay)
          'ml-0'
        )}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 flex items-center gap-4 border-b border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Open Sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold text-slate-100 text-lg">Copexia Panel</span>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
