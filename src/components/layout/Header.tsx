"use client";

import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { getMenu } from "@/lib/menu/getMenu";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const t = useTranslations("Header");
  const rutas = useLocalizedPaths();
  const menuItems = getMenu(t, rutas);
  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <Link href={rutas.raiz} className="flex items-center gap-3">
            <div className="relative h-20 w-20 shrink-0">
              <Image
                src="/images/logo-copexia.png"
                alt="Copexia"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            <span className="text-lg font-semibold tracking-tight bg-[var(--gold-gradient)] bg-clip-text text-transparent">
              {t("brandName") || "Copexia"}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {menuItems.map((item) =>
              item.submenu ? (
                <div key={item.href} className="relative group">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 text-sm text-foreground/90 hover:text-foreground transition"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute left-0 top-full hidden min-w-[200px] rounded-md border border-border bg-background shadow-lg group-hover:block">
                    {item.submenu.map((sub) => (
                      <a
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2 text-sm hover:bg-secondary/70"
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative text-sm text-foreground/90 transition hover:text-foreground"
                >
                  <span className="after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                    {item.name}
                  </span>
                </a>
              )
            )}
          </nav>

          <button
            className="md:hidden rounded-lg p-2 hover:bg-secondary/60"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={openMobile}
          >
            {openMobile ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 transform border-l border-border bg-background/95 px-5 pb-8 pt-20 shadow-xl backdrop-blur transition-transform duration-200 ${
          openMobile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) =>
            item.submenu ? (
              <div key={item.href}>
                <button
                  className="w-full text-left rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary/70 flex justify-between items-center"
                  onClick={() => toggleDropdown(item.name)}
                >
                  {item.name}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === item.name && (
                  <div className="ml-4 flex flex-col gap-1">
                    {item.submenu.map((sub) => (
                      <a
                        key={sub.href}
                        href={sub.href}
                        className="rounded-lg px-3 py-2 text-sm hover:bg-secondary/70"
                        onClick={() => setOpenMobile(false)}
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-base hover:bg-secondary/70"
                onClick={() => setOpenMobile(false)}
              >
                {item.name}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
};
