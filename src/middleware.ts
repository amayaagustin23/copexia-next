import {
  getLocaleFromPath,
  getLocalizedPath,
  isAdminPath,
  isAuthPath,
  mapToEnglishRoute,
  shouldRedirectToEnglishRoute,
  stripLocale,
  SUPPORTED_LOCALES,
} from '@/lib/config/routes';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intl = createMiddleware({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: 'es',
  localePrefix: 'always',
});

const SESSION_COOKIE = 'token';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Debug logs
  console.log('Middleware pathname:', pathname);
  console.log('Decoded pathname:', decodeURIComponent(pathname));

  // Redirigir automáticamente desde la raíz a /es
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/es';
    return NextResponse.redirect(url);
  }

  const intlRes = intl(req);
  if (intlRes instanceof NextResponse && intlRes.redirected) {
    return intlRes;
  }

  // Ensure we check against decoded path to handle special chars (ñ, etc.)
  const decodedPathname = decodeURIComponent(pathname);

  const locale = getLocaleFromPath(decodedPathname);
  const pathWithoutLocale = stripLocale(decodedPathname);

  if (shouldRedirectToEnglishRoute(pathWithoutLocale)) {
    const englishRoute = mapToEnglishRoute(pathWithoutLocale);

    // Construct new URL with locale and mapped route
    // Preserve query string (e.g. ?token=...)
    const newPath = `/${locale}${englishRoute}`;

    // Check if we are already there to avoid redirect loops (though should use different route map)
    if (decodedPathname !== newPath) {
      const url = req.nextUrl.clone();
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
  }

  const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value;

  // Regla 1: Si existe token, nunca permitir acceso a rutas de autenticación (login, forgot-password, etc.)
  if (isAuthPath(pathname) && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/admin`;
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Regla 2: Solo permitir acceso a rutas admin si existe token
  if (isAdminPath(pathname) && !isAuthPath(pathname)) {
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}${getLocalizedPath('login', locale)}`;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|static|assets|images|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)',
  ],
};
