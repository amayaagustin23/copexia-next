import type { Locale } from '@/schemas/path';

export const SUPPORTED_LOCALES: readonly Locale[] = ['es', 'en'] as const;

export const PUBLIC_ROUTES_BASE = ['/', '/foro', '/foro/categoria'] as const;

export const AUTH_ROUTES_BASE = [
  '/login',
  '/ingresar',
  '/forgot-password',
  '/recuperar-contrasena',
  '/reset-password',
  '/cambiar-contrasena',
] as const;

export const LOCALIZED_ROUTES = {
  es: {
    login: '/ingresar',
    forgotPassword: '/recuperar-contrasena',
    resetPassword: '/reset-password',
    changePassword: '/cambiar-contrasena',
  },
  en: {
    login: '/login',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    changePassword: '/change-password',
  },
} as const;

export const SPANISH_TO_ENGLISH_ROUTES = {
  '/ingresar': '/login',
  '/recuperar-contrasena': '/forgot-password',
  '/cambiar-contrasena': '/reset-password',
} as const;

export const ROUTE_MAPPING = {
  '/login': '/login',
  '/ingresar': '/login',
  '/forgot-password': '/forgot-password',
  '/recuperar-contrasena': '/forgot-password',
  '/reset-password': '/reset-password',
  '/cambiar-contrasena': '/reset-password',
  '/admin': '/admin',
  '/panel-control': '/admin',
  '/admin/posts': '/admin/posts',
  '/admin/categories': '/admin/categories',
  '/': '/',
} as const;

export const ADMIN_ROUTES_BASE = ['/panel-control', '/admin'] as const;

export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(es|en)(?=\/|$)/);
  return m ? pathname.replace(m[0], '') || '/' : pathname || '/';
}

export function pathHasPrefix(pathNoLocale: string, bases: readonly string[]) {
  return bases.some((base) =>
    base === '/'
      ? pathNoLocale === '/'
      : pathNoLocale === base || pathNoLocale.startsWith(base + '/')
  );
}

export function isAuthPath(pathname: string) {
  const p = stripLocale(pathname);
  return pathHasPrefix(p, AUTH_ROUTES_BASE);
}

export function isAdminPath(pathname: string) {
  const p = stripLocale(pathname);
  return pathHasPrefix(p, ADMIN_ROUTES_BASE);
}

export function isPublicPath(pathname: string) {
  const p = stripLocale(pathname);
  return pathHasPrefix(p, PUBLIC_ROUTES_BASE);
}

export function getLocalizedPath(
  path: 'login' | 'forgotPassword' | 'resetPassword' | 'changePassword',
  locale: string
): string {
  const validLocale = SUPPORTED_LOCALES.includes(locale as Locale)
    ? locale
    : 'es';
  return LOCALIZED_ROUTES[validLocale as keyof typeof LOCALIZED_ROUTES][path];
}

export function getLocaleFromPath(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)[0];
  return SUPPORTED_LOCALES.includes(seg as Locale) ? seg : 'es';
}

/**
 */
export function mapToEnglishRoute(pathWithoutLocale: string): string {
  if (pathWithoutLocale === '/' || pathWithoutLocale in ROUTE_MAPPING) {
    return (
      ROUTE_MAPPING[pathWithoutLocale as keyof typeof ROUTE_MAPPING] ||
      pathWithoutLocale
    );
  }

  const segments = pathWithoutLocale.split('/');
  const firstSegment = segments[0];

  if (firstSegment && firstSegment in ROUTE_MAPPING) {
    const mappedFirstSegment =
      ROUTE_MAPPING[firstSegment as keyof typeof ROUTE_MAPPING];
    return mappedFirstSegment + segments.slice(1).join('/');
  }

  return pathWithoutLocale;
}

/**
 */
export function shouldRedirectToEnglishRoute(
  pathWithoutLocale: string
): boolean {
  return pathWithoutLocale in SPANISH_TO_ENGLISH_ROUTES;
}
