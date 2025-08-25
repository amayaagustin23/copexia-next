"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1">
        {/* Topbar simple (opcional) */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <h2 className="text-sm text-muted-foreground">
              Panel de administración
            </h2>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
