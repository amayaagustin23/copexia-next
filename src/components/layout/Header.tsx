"use client";

import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { getMenu } from "@/lib/menu/getMenu"; // asegura export de MenuItem
import { animate, stagger } from "animejs";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
      // @ts-ignore
      node.style[k] = String(v);
    }
  }
}

export const Header = () => {
  const t = useTranslations("Header");
  const rutas = useLocalizedPaths();

  // 🔧 Adaptamos el shape inglés → español que espera getMenu
  const menuPaths = {
    raiz: rutas.root,
    secciones: {
      servicios: rutas.sections.services,
      sobreNosotros: rutas.sections.aboutUs,
      contacto: rutas.sections.contact,
      // opcionalmente, si existen:
      ...((rutas.sections as any).values && {
        valores: (rutas.sections as any).values,
      }),
      ...((rutas.sections as any).learning && {
        learning: (rutas.sections as any).learning,
      }),
    },
    sub: { servicios: rutas.sub.services },
    link: rutas.anchor,
  } as const;

  const menu = getMenu(t, menuPaths);

  const pathname = usePathname() || "/";

  const [openMobile, setOpenMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerAlpha, setHeaderAlpha] = useState(0);

  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => setMounted(true), []);

  // bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = openMobile ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [openMobile, mounted]);

  const handleNavigate = () => setOpenMobile(false);

  // animación de entrada del header + links
  useEffect(() => {
    if (!headerRef.current || prefersReduced) return;
    primeStyles(headerRef.current, {
      opacity: "0",
      transform: "translateY(-12px)",
    });
    const node = headerRef.current;
    animate(node, {
      opacity: [0, 1],
      translateY: [-12, 0],
      duration: 520,
      easing: "easeOutQuad",
      complete: () => (node!.style.transform = ""),
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
  }, [prefersReduced]);

  // oscurecer al scrollear
  useEffect(() => {
    const onScroll = () =>
      setHeaderAlpha(Math.min(0.85, (window.scrollY || 0) / 280));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasAuth = Boolean((rutas as any).auth?.signIn);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          openMobile ? "" : "backdrop-blur-xl"
        } border-b border-border/40`}
        aria-label={t("aria.siteHeader")}
        style={
          {
            // @ts-ignore
            "--header-a": headerAlpha,
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,${Math.max(0, headerAlpha * 0.9)}) 0%,
              rgba(0,0,0,${Math.max(0, headerAlpha * 0.55)}) 60%,
              rgba(0,0,0,0) 100%
            )`,
          } as React.CSSProperties
        }
      >
        <div className="mx-auto max-w-7xl px-4 bg-[linear-gradient(to_bottom,rgba(0,0,0,calc(var(--header-a)*0.9))_0%,rgba(0,0,0,calc(var(--header-a)*0.55))_60%,rgba(0,0,0,0)_100%)]">
          {/* MOBILE TOP BAR */}
          <div className="flex justify-between py-3 md:hidden">
            <Link
              href={rutas.root}
              className="flex items-center gap-2"
              aria-label={t("aria.goHome")}
              onClick={handleNavigate}
            >
              <h2 className="text-secondary text-xl">{t("brandAlt")}</h2>
            </Link>
            <button
              className="rounded-lg p-2 hover:bg-white/10 text-white drop-shadow-sm"
              onClick={() => setOpenMobile(true)}
              aria-label={t("aria.openMenu")}
              aria-expanded={openMobile}
              type="button"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-3 md:py-4">
            <Link
              href={rutas.root}
              className="inline-flex items-center justify-center"
              aria-label={t("aria.goHome")}
            >
              <h2 className="text-secondary text-xl">{t("brandAlt")}</h2>
            </Link>

            <nav
              ref={navRef}
              className="relative flex items-center justify-center gap-2"
              aria-label={t("aria.primaryNav")}
            >
              {menu.map((item) => {
                const active = isActive(item.href);
                const hasSub = "submenu" in item && Array.isArray(item.submenu);
                return (
                  <div key={item.href} className="relative group" data-navlink>
                    <Link
                      href={item.href}
                      className={[
                        "relative rounded-md px-3 py-2 text-sm text-white drop-shadow-sm transition hover:text-[--accent]",
                        active ? "text-[--accent]" : "",
                        hasSub ? "pr-7" : "",
                      ].join(" ")}
                    >
                      <span className="relative inline-flex items-center gap-1">
                        {item.name}
                        {hasSub && (
                          <ChevronDown className="h-4 w-4 opacity-80 transition group-hover:translate-y-[1px]" />
                        )}
                        <span
                          className={[
                            "absolute -bottom-0.5 left-0 h-[2px] w-full origin-left",
                            "bg-[--accent] transition-transform duration-300 ease-out",
                            active
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100",
                          ].join(" ")}
                          aria-hidden
                        />
                      </span>
                    </Link>

                    {/* Dropdown */}
                    {hasSub && (
                      <div
                        className={[
                          "invisible absolute left-0 top-[calc(100%+8px)] min-w-[220px]",
                          "rounded-xl border border-white/10 bg-black/60 backdrop-blur-md",
                          "opacity-0 shadow-lg ring-1 ring-black/10 transition-all",
                          "group-hover:visible group-hover:opacity-100 group-hover:translate-y-0",
                          "translate-y-1",
                        ].join(" ")}
                      >
                        <ul className="py-2">
                          {item.submenu!.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                className={[
                                  "block px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10",
                                  isActive(sub.href)
                                    ? "bg-white/10 text-white"
                                    : "",
                                ].join(" ")}
                              >
                                <span className="block">{sub.name}</span>
                                {sub.description && (
                                  <span className="block text-xs text-white/60">
                                    {sub.description}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {mounted &&
        createPortal(
          <div
            aria-hidden={!openMobile}
            className={[
              "fixed inset-0 z-[9999] md:hidden",
              openMobile ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
          >
            <button
              onClick={() => setOpenMobile(false)}
              aria-label={t("aria.closeMenu")}
              className={[
                "absolute inset-0 bg-black/40 transition-opacity",
                openMobile ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />

            <div
              className={[
                "absolute inset-x-0 top-0 h-[100dvh] bg-background/95 backdrop-blur-md text-white",
                "transition-transform duration-300 ease-out will-change-transform",
                openMobile ? "translate-y-0" : "-translate-y-full",
              ].join(" ")}
            >
              <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between">
                <Link
                  href={rutas.root}
                  onClick={handleNavigate}
                  className="inline-flex items-center gap-2"
                >
                  <h2 className="text-secondary text-xl">{t("brandAlt")}</h2>
                </Link>
                <button
                  onClick={() => setOpenMobile(false)}
                  className="rounded-lg p-2 bg-white/10 hover:bg-white/15"
                  type="button"
                  aria-label={t("aria.closeMenu")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="px-6 space-y-2">
                {menu.map((item) => {
                  const hasSub =
                    "submenu" in item && Array.isArray(item.submenu);
                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          "block rounded-md px-2 py-2 hover:bg-white/10 text-white",
                          isActive(item.href) ? "bg-white/10" : "",
                        ].join(" ")}
                        onClick={handleNavigate}
                      >
                        {item.name}
                      </Link>

                      {hasSub && (
                        <div className="pl-4">
                          {item.submenu!.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={[
                                "block rounded-md px-2 py-2 text-sm text-white/90 hover:bg-white/10",
                                isActive(sub.href)
                                  ? "bg-white/10 text-white"
                                  : "",
                              ].join(" ")}
                              onClick={handleNavigate}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
