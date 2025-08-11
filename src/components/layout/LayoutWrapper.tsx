"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PUBLIC_ROUTES } from "@/lib/config/routesPublics";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type LayoutWrapperProps = {
  children: ReactNode;
};

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname();

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const isAdmin = pathname.includes("/admin");

  const shouldHideLayout = isPublic || isAdmin;

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
};
