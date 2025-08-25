// middleware.ts
import {
  isAdminPath,
  isAuthPath,
  SUPPORTED_LOCALES,
} from "@/lib/config/routes";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intl = createMiddleware({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

const SESSION_COOKIE = "session";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) i18n primero (gestiona prefixing/rewrite de locales)
  const intlRes = intl(req);
  if (intlRes instanceof NextResponse && intlRes.redirected) {
    return intlRes;
  }

  // 2) Forzar "/" -> "/es"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  // Helpers de locale
  const seg = pathname.split("/").filter(Boolean)[0];
  const locale = SUPPORTED_LOCALES.includes(seg as any) ? seg : "es";

  const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value;

  // 3) Si intenta ir al login estando autenticado -> enviar a /:locale/admin
  if (isAuthPath(pathname) && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/admin`;
    url.search = ""; // limpiamos query
    return NextResponse.redirect(url);
  }

  // 4) Proteger rutas admin (ignorar páginas de auth)
  if (isAdminPath(pathname) && !isAuthPath(pathname)) {
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/ingresar`;
      // Conservamos la ruta original + query como redirect
    }
  }

  // 5) Continuar normalmente
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluímos assets/next/api/etc.
    "/((?!_next|api|static|assets|images|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
