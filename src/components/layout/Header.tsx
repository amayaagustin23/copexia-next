"use client";

import { useAuth } from '@/context/AuthContext';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { getMenu } from '@/lib/menu/getMenu'; // asegura export de MenuItem
import { animate, stagger } from 'animejs';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  const t = useTranslations('Header');
  const rutas = useLocalizedPaths();
  const { user, logout } = useAuth();

  const menuPaths = {
    raiz: rutas.root,
    secciones: {
      servicios: rutas.sections.services,
      sobreNosotros: rutas.sections.aboutUs,
      contacto: rutas.sections.contact,
      valores: rutas.sections.values,
    },
    link: rutas.anchor,
  } as const;

  const baseMenu = getMenu(t, menuPaths, { showAuth: false });

  // Agregar opción de Admin si el usuario está logueado
  const menu = user
    ? [...baseMenu, { name: t('menu.admin'), href: rutas.admin.root }]
    : baseMenu;

  const handleLogout = async () => {
    await logout();
    setOpenMobile(false);
  };

  const pathname = usePathname() || '/';

  const [openMobile, setOpenMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerAlpha, setHeaderAlpha] = useState(0);
  const [dynamicProgress, setDynamicProgress] = useState(0);

  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = openMobile ? 'hidden' : prev || '';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [openMobile, mounted]);

  const handleNavigate = () => setOpenMobile(false);

  useEffect(() => {
    if (!headerRef.current || prefersReduced) return;
    primeStyles(headerRef.current, {
      opacity: '0',
      transform: 'translateY(-12px)',
    });
    const node = headerRef.current;
    animate(node, {
      opacity: [0, 1],
      translateY: [-12, 0],
      duration: 520,
      easing: 'easeOutQuad',
      complete: () => (node!.style.transform = ''),
    });

    const links = navRef.current?.querySelectorAll('[data-navlink]');
    if (links && links.length) {
      primeStyles(links, { opacity: '0', transform: 'translateY(8px)' });
      animate(links, {
        opacity: [0, 1],
        translateY: [8, 0],
        delay: stagger(70, { start: 180 }),
        duration: 360,
        easing: 'easeOutQuad',
      });
    }
  }, [prefersReduced]);

  useEffect(() => {
    let frameId: number;

    const onScroll = () => {
      const scrollY = window.scrollY || 0;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const maxScrollableDistance = documentHeight - windowHeight;
      const scrollProgress =
        maxScrollableDistance > 0
          ? Math.min(scrollY / maxScrollableDistance, 1)
          : 0;

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const currentProgress = dynamicProgress;
        const diff = scrollProgress - currentProgress;

        const dampening = 0.08;
        const newProgress = currentProgress + diff * dampening;

        setDynamicProgress(newProgress);
        setHeaderAlpha(scrollProgress);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
    };
  }, [dynamicProgress]);

  const hasAuth = Boolean((rutas as any).auth?.signIn);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          openMobile ? '' : 'backdrop-blur-lg'
        }`}
        aria-label={t('aria.siteHeader')}
        style={
          {
            backgroundColor: `rgba(0,0,0,${Math.min(
              0.8,
              0.1 + headerAlpha * 0.7
            )})`,
          } as React.CSSProperties
        }
      >
        <div className="w-full mx-2 px-3 xs:px-4 sm:px-6 relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 h-0.5 w-40 pointer-events-none z-10 opacity-70"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.6) 35%, rgba(255,215,0,0.9) 50%, rgba(255,215,0,0.6) 65%, transparent 100%)`,
              transform: `translateX(${dynamicProgress * 100}vw)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 h-1 w-32 pointer-events-none z-10 opacity-30"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,215,0,0.7), transparent)`,
              transform: `translateX(${dynamicProgress * 100}vw)`,
              filter: 'blur(2px)',
            }}
          />
          <div className="flex items-center justify-center relative py-3 md:hidden">
            <Link
              href={rutas.root}
              className="flex items-center gap-2 group transition-all duration-300 hover:scale-105"
              aria-label={t('aria.goHome')}
              onClick={handleNavigate}
              title={t('menu.goHome')}
            >
              <h2 className="text-secondary text-xl group-hover:text-[--accent] transition-colors duration-300">
                {t('brandAlt')}
              </h2>
            </Link>
            <button
              className="absolute left-0 rounded-lg p-2 hover:bg-white/10 text-white drop-shadow-sm transition-all duration-200"
              onClick={() => setOpenMobile(true)}
              aria-label={t('aria.openMenu')}
              aria-expanded={openMobile}
              type="button"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:justify-between md:gap-3 md:py-4">
            <Link
              href={rutas.root}
              className="inline-flex items-center justify-center group transition-all duration-300 hover:scale-105 relative"
              aria-label={t('aria.goHome')}
              title={t('menu.goHome')}
            >
              <h2 className="text-secondary text-xl group-hover:text-[--accent] transition-colors duration-300 relative">
                {t('brandAlt')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[--accent] transition-all duration-300 group-hover:w-full" />
              </h2>
            </Link>

            <nav
              ref={navRef}
              className="relative flex items-center justify-center gap-2"
              aria-label={t('aria.primaryNav')}
            >
              {menu.map((item) => {
                const active = isActive(item.href);
                return (
                  <div key={item.href} className="relative group" data-navlink>
                    <Link
                      href={item.href}
                      className={[
                        'relative rounded-md px-3 py-2 text-sm text-white drop-shadow-sm transition hover:text-[--accent]',
                        active ? 'text-[--accent]' : '',
                      ].join(' ')}
                    >
                      <span className="relative inline-flex items-center gap-1">
                        {item.name}
                        <span
                          className={[
                            'absolute -bottom-0.5 left-0 h-[2px] w-full origin-left',
                            'bg-[--accent] transition-transform duration-300 ease-out',
                            active
                              ? 'scale-x-100'
                              : 'scale-x-0 group-hover:scale-x-100',
                          ].join(' ')}
                          aria-hidden
                        />
                      </span>
                    </Link>
                  </div>
                );
              })}

              {/* Botones de autenticación */}
              {user && (
                <div className="flex items-center gap-2 ml-2" data-navlink>
                  <button
                    onClick={handleLogout}
                    className="rounded-md px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    {t('menu.logout')}
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      {mounted &&
        createPortal(
          <div
            aria-hidden={!openMobile}
            className={[
              'fixed inset-0 z-[9999] md:hidden',
              openMobile ? 'pointer-events-auto' : 'pointer-events-none',
            ].join(' ')}
          >
            <button
              onClick={() => setOpenMobile(false)}
              aria-label={t('aria.closeMenu')}
              className={[
                'absolute inset-0 bg-black/40 transition-opacity',
                openMobile ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
            />

            <div
              className={[
                'absolute left-0 top-0 w-full h-[100dvh] bg-background/90 backdrop-blur-lg text-white',
                'transition-transform duration-300 ease-out will-change-transform',
                openMobile ? 'translate-y-0' : '-translate-y-full',
              ].join(' ')}
            >
              <div className="w-full px-3 py-3 flex items-center justify-center relative border-b border-white/10">
                <Link
                  href={rutas.root}
                  onClick={handleNavigate}
                  className="inline-flex items-center gap-2 group transition-all duration-300 hover:scale-105"
                  title={t('menu.goHome')}
                >
                  <h2 className="text-secondary text-xl group-hover:text-[--accent] transition-colors duration-300">
                    {t('brandAlt')}
                  </h2>
                </Link>
                <button
                  onClick={() => setOpenMobile(false)}
                  className="absolute left-3 rounded-lg p-2 bg-white/10 hover:bg-white/15 transition-all duration-200"
                  type="button"
                  aria-label={t('aria.closeMenu')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="px-3 space-y-2 py-4">
                {/* Opción Inicio siempre visible */}
                <div>
                  <Link
                    href={rutas.root}
                    className={[
                      'block rounded-md px-3 py-2.5 hover:bg-white/10 text-white transition-all duration-200',
                      isActive(rutas.root) ? 'bg-white/10 font-semibold' : '',
                    ].join(' ')}
                    onClick={handleNavigate}
                  >
                    🏠 {t('menu.home')}
                  </Link>
                </div>

                {menu.map((item) => {
                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          'block rounded-md px-3 py-2.5 hover:bg-white/10 text-white transition-all duration-200',
                          isActive(item.href)
                            ? 'bg-white/10 font-semibold'
                            : '',
                        ].join(' ')}
                        onClick={handleNavigate}
                      >
                        {item.name}
                      </Link>
                    </div>
                  );
                })}

                {/* Botones de autenticación en móvil */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {user && (
                    <>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-md px-2 py-2 bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        {t('menu.logout')}
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
