// src/lib/config/routes.ts
export const SUPPORTED_LOCALES = ["es", "en"] as const;

// Definí los prefijos **sin** locale
export const PUBLIC_ROUTES_BASE = [
  "/", // landing (se convertirá a /es o /en según tu intl)
  "/foro",
  "/foro/categoria", // usaremos startsWith
] as const;

export const AUTH_ROUTES_BASE = [
  "/ingresar",
  "/recuperar-contrasena",
  "/cambiar-contrasena",
] as const;

export const ADMIN_ROUTES_BASE = [
  "/panel-control", // ejemplo: dashboard admin
  "/admin", // si usás /admin también
] as const;

/** Quita el locale inicial del path: /es/ingresar -> /ingresar */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(es|en)(?=\/|$)/);
  return m ? pathname.replace(m[0], "") || "/" : pathname || "/";
}

/** true si el path (sin locale) comienza con alguno de los prefijos dados */
export function pathHasPrefix(pathNoLocale: string, bases: readonly string[]) {
  return bases.some((base) =>
    base === "/"
      ? pathNoLocale === "/"
      : pathNoLocale === base || pathNoLocale.startsWith(base + "/")
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
