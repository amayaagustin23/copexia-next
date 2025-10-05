"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { isAdminPath, isAuthPath } from "@/lib/config/routes";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type LayoutWrapperProps = { children: ReactNode };

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname() || '/';

  const hideForAuth = isAuthPath(pathname);
  const hideForAdmin = isAdminPath(pathname);

  const hideForPublic = false; // o: isPublicPath(pathname)

  const shouldHideLayout = hideForAuth || hideForAdmin || hideForPublic;

  // For auth pages, we still need the basic layout but without Header/Footer
  const isAuthPage = hideForAuth;

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
};
