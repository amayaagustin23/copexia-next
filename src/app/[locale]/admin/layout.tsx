import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
