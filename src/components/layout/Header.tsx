"use client";

import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { getMenu } from "@/lib/menu/getMenu";
import { ChevronDown, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { animate, createSpring, stagger } from "animejs";

function primeStyles(
  targets: Element | NodeListOf<Element> | Element[] | null | undefined,
  styles: Partial<CSSStyleDeclaration>
) {
  if (!targets) return;
  const list =
    targets instanceof NodeList
      ? Array.from(targets)
      : Array.isArray(targets)
      ? targets
      : [targets];

  for (const el of list) {
    const node = el as HTMLElement;
    for (const [k, v] of Object.entries(styles)) {
      node.style[k] = String(v);
    }
  }
}

export const Header = () => {
  const t = useTranslations("Header");
  const rutas = useLocalizedPaths();
  const menuItems = getMenu(t, rutas);

  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileSheetRef = useRef<HTMLDivElement | null>(null);

  const underlineSpring = useMemo(
    () => createSpring({ stiffness: 340, damping: 24 }),
    []
  );
  const liftSpring = useMemo(
    () => createSpring({ stiffness: 260, damping: 22 }),
    []
  );

  const onHoverIn = (el: HTMLElement | null) => {
    if (!el) return;
    const u = el.querySelector<HTMLElement>(".underline-el");
    if (u) animate(u, { scaleX: 1, duration: 280, easing: underlineSpring });
    animate(el, { translateY: -2, duration: 220, easing: liftSpring });
  };

  const onHoverOut = (el: HTMLElement | null) => {
    if (!el) return;
    const u = el.querySelector<HTMLElement>(".underline-el");
    if (u) animate(u, { scaleX: 0, duration: 220, easing: underlineSpring });
    animate(el, { translateY: 0, duration: 180, easing: liftSpring });
  };

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

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

  useEffect(() => {
    if (!headerRef.current) return;

    primeStyles(headerRef.current, {
      opacity: "0",
      transform: "translateY(-12px)",
    });
    animate(headerRef.current, {
      opacity: [0, 1],
      translateY: [-12, 0],
      duration: 520,
      easing: "easeOutQuad",
    });

    const links = navRef.current?.querySelectorAll("[data-navlink]");
    if (links && links.length) {
      primeStyles(links, { opacity: "0", transform: "translateY(8px)" });
      animate(links, {
        opacity: [0, 1],
        translateY: [8, 0],
        delay: stagger(70, { start: 180 }),
        duration: 360,
        easing: "easeOutQuad",
      });
    }
  }, []);

  useEffect(() => {
    const panel = dropdownRef.current?.querySelector<HTMLElement>(
      "[data-dropdown-panel]"
    );
    if (!panel) return;

    if (openDropdown) {
      primeStyles(panel, {
        opacity: "0",
        transform: "translateY(6px) scale(0.98)",
      });
      animate(panel, {
        opacity: [0, 1],
        translateY: [6, 0],
        scale: [0.98, 1],
        duration: 220,
        easing: "easeOutQuad",
      });
    } else {
      animate(panel, {
        opacity: [1, 0],
        translateY: [0, 6],
        scale: [1, 0.98],
        duration: 180,
        easing: "easeInQuad",
      });
    }
  }, [openDropdown]);

  // ▶️ Mobile sheet
  useEffect(() => {
    const node = mobileSheetRef.current;
    if (!node) return;

    if (openMobile) {
      primeStyles(node, { transform: "translateY(-100%)" });
      animate(node, {
        translateY: "0%",
        duration: 260,
        easing: "easeOutQuad",
      });
    } else {
      animate(node, {
        translateY: "-100%",
        duration: 220,
        easing: "easeInQuad",
      });
    }
  }, [openMobile]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        openMobile ? "" : "backdrop-blur-md"
      } bg-secondary`}
      aria-label={t("aria.siteHeader")}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between py-3 md:hidden">
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
            className="rounded-lg p-2 hover:bg-[--secondary]/60 text-secondary-foreground drop-shadow-sm"
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
        <div className="hidden md:flex  md:justify-between md:gap-3 md:py-4">
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
            ref={navRef}
            className="relative flex items-center justify-center gap-6"
            aria-label={t("aria.primaryNav")}
          >
            {menuItems.map((item) =>
              item.submenu ? (
                <div key={item.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-secondary-foreground drop-shadow-sm transition hover:text-[--accent]"
                    aria-expanded={openDropdown === item.name}
                    aria-label={ariaForSubmenu(item.name)}
                    data-navlink
                    onMouseEnter={(e) => onHoverIn(e.currentTarget)}
                    onMouseLeave={(e) => onHoverOut(e.currentTarget)}
                  >
                    <span className="relative inline-flex items-center">
                      {item.name}
                      <span
                        className="underline-el absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0"
                        style={{ background: "var(--accent)" }}
                        aria-hidden
                      />
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {openDropdown === item.name && (
                    <div
                      className="absolute left-1/2 top-full mt-2 min-w-[220px] -translate-x-1/2 rounded-md border border-border bg-secondary shadow-lg"
                      role="menu"
                      aria-label={t("aria.submenuOf", { item: item.name })}
                      data-dropdown-panel
                    >
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-secondary-foreground drop-shadow-sm hover:bg-white/10"
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
                  className="relative rounded-md px-2 py-1 text-sm text-secondary-foreground drop-shadow-sm transition"
                  data-navlink
                  onMouseEnter={(e) => onHoverIn(e.currentTarget)}
                  onMouseLeave={(e) => onHoverOut(e.currentTarget)}
                >
                  <span className="relative inline-block">
                    {item.name}
                    <span
                      className="underline-el absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0"
                      style={{ background: "var(--accent)" }}
                      aria-hidden
                    />
                  </span>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
