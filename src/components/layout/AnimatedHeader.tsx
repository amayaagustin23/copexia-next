"use client";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AnimatedHeader({
  menuItems,
}: {
  menuItems: Array<{
    href: string;
    name: string;
    submenu?: Array<{ href: string; name: string }>;
  }>;
}) {
  const rutas = useLocalizedPaths();
  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = 220;
      setOpacity(Math.min(0.4 + y / max, 0.9));
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md transition-colors duration-300"
      style={{ backgroundColor: `rgba(0,0,0,${opacity})` }}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* mobile top bar */}
        <div className="flex items-center justify-between py-3 md:hidden">
          <Link href={rutas.raiz} className="mx-auto">
            <Image
              src="/images/logo-copexia.png"
              alt="Copexia"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <button
            className="absolute right-4 rounded-lg p-2 hover:bg-secondary/60"
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

        {/* desktop: logo arriba + nav centrado */}
        <div className="hidden md:flex md:flex-col md:items-center md:gap-3 md:py-4">
          <Link
            href={rutas.raiz}
            className="inline-flex items-center justify-center"
          >
            <Image
              src="/images/logo-copexia.png"
              alt="Copexia"
              width={150}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              sizes="150px"
            />
          </Link>
          <nav className="relative flex items-center justify-center gap-6">
            {menuItems.map((item) =>
              item.submenu ? (
                <div key={item.href} className="relative group">
                  <button
                    onClick={() =>
                      setOpenDropdown((prev) =>
                        prev === item.name ? null : item.name
                      )
                    }
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-white/90 hover:text-white transition"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute left-1/2 top-full mt-2 hidden min-w-[220px] -translate-x-1/2 rounded-md border border-border bg-background/95 shadow-lg group-hover:block">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-foreground/90 hover:bg-secondary/70"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
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

      {/* drawer mobile */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 transform border-l border-border bg-background/95 px-5 pb-8 pt-20 shadow-xl backdrop-blur transition-transform duration-200 ${
          openMobile ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) =>
            item.submenu ? (
              <div key={item.href}>
                <button
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium hover:bg-secondary/70"
                  onClick={() =>
                    setOpenDropdown((prev) =>
                      prev === item.name ? null : item.name
                    )
                  }
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
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="rounded-lg px-3 py-2 text-sm hover:bg-secondary/70"
                        onClick={() => setOpenMobile(false)}
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
                className="rounded-lg px-3 py-2 text-base hover:bg-secondary/70"
                onClick={() => setOpenMobile(false)}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
