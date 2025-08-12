"use client";

import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { getMenu } from "@/lib/menu/getMenu";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Header = () => {
  const t = useTranslations("Header");
  const rutas = useLocalizedPaths();
  const menuItems = getMenu(t, rutas);

  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(0.4);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleScroll = () => {
      const max = 220;
      const o = Math.min(0.4 + window.scrollY / max, 0.9);
      setScrollOpacity(o);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  useEffect(() => {
    if (openMobile) setOpenDropdown(null);
  }, [openMobile]);

  const handleNavigate = () => {
    setOpenMobile(false);
    setOpenDropdown(null);
  };

  const ariaForSubmenu = (name: string) =>
    openDropdown === name
      ? t("aria.closeSubmenu", { item: name })
      : t("aria.openSubmenu", { item: name });

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        openMobile ? "" : "backdrop-blur-md"
      }`}
      style={{ backgroundColor: `rgba(0,0,0,${scrollOpacity})` }}
      aria-label={t("aria.siteHeader")}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* MOBILE TOP BAR */}
        <div className="flex items-center justify-between py-3 md:hidden">
          <Link
            href={rutas.raiz}
            className="flex items-center gap-2"
            aria-label={t("aria.goHome")}
            onClick={handleNavigate}
          >
            <Image
              src="/images/logo-copexia.png"
              alt={t("brandAlt")}
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <button
            className="rounded-lg p-2 hover:bg-secondary/60"
            onClick={() => {
              setOpenDropdown(null);
              setOpenMobile(true);
            }}
            aria-label={t("aria.openMenu")}
            aria-expanded={openMobile}
            aria-controls="mobile-sheet"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex md:flex-col md:items-center md:gap-3 md:py-4">
          <Link
            href={rutas.raiz}
            className="inline-flex items-center justify-center"
            aria-label={t("aria.goHome")}
          >
            <Image
              src="/images/logo-copexia.png"
              alt={t("brandAlt")}
              width={150}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              sizes="150px"
            />
          </Link>

          <nav
            className="relative flex items-center justify-center gap-6"
            aria-label={t("aria.primaryNav")}
          >
            {menuItems.map((item) =>
              item.submenu ? (
                <div key={item.href} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-white/90 transition hover:text-white"
                    aria-expanded={openDropdown === item.name}
                    aria-label={ariaForSubmenu(item.name)}
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {openDropdown === item.name && (
                    <div
                      className="absolute left-1/2 top-full mt-2 min-w-[220px] -translate-x-1/2 rounded-md border border-border bg-[#0b1220] shadow-lg"
                      role="menu"
                      aria-label={t("aria.submenuOf", { item: item.name })}
                    >
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-foreground/90 hover:bg-secondary/70"
                          role="menuitem"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative rounded-md px-2 py-1 text-sm text-white/90 transition hover:text-white"
                >
                  <span className="after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                    {item.name}
                  </span>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* MOBILE SHEET */}
      <div
        id="mobile-sheet"
        className={`md:hidden fixed inset-0 z-[60] transition-transform duration-300
          ${
            openMobile
              ? "translate-y-0 pointer-events-auto"
              : "-translate-y-full pointer-events-none"
          }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!openMobile}
        aria-label={t("aria.mobileMenu")}
      >
        {/* Fondo sólido */}
        <div className="absolute inset-0 bg-[#0b1220]" />

        {/* Contenedor */}
        <div className="relative flex h-full flex-col bg-[#0b1220]">
          {/* Top bar con X */}
          <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 border-b border-border/60">
            <Link
              href={rutas.raiz}
              onClick={handleNavigate}
              className="flex items-center gap-2"
              aria-label={t("aria.goHome")}
            >
              <Image
                src="/images/logo-copexia.png"
                alt={t("brandAlt")}
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
            <button
              className="rounded-lg p-2 text-white hover:bg-secondary/60"
              onClick={() => {
                setOpenMobile(false);
                setOpenDropdown(null);
              }}
              aria-label={t("aria.closeMenu")}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Contenido scrollable */}
          <nav
            className="flex-1 overflow-y-auto px-3 py-4"
            aria-label={t("aria.primaryNav")}
          >
            {menuItems.map((item) =>
              item.submenu ? (
                <div key={item.href} className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 text-left rounded-lg px-3 py-3 text-base font-medium flex justify-between items-center hover:bg-secondary/70 text-white"
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === item.name ? null : item.name
                        )
                      }
                      aria-expanded={openDropdown === item.name}
                      aria-label={ariaForSubmenu(item.name)}
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 transition-transform ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      openDropdown === item.name
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    } bg-[#0b1220] border-t border-border/60`}
                    role="region"
                    aria-label={t("aria.submenuOf", { item: item.name })}
                  >
                    <div className="overflow-hidden">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block rounded-md px-4 py-2.5 text-sm text-white hover:bg-secondary/60"
                          onClick={handleNavigate}
                          role="menuitem"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base text-white hover:bg-secondary/70 block"
                  onClick={handleNavigate}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
