import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "./services/authService";

const PUBLIC_ROUTES = [
  "/es/register",
  "/en/register",
  "/es/recovery-password",
  "/en/recovery-password",
  "/es/reset-password",
  "/en/reset-password",
];

const LOGIN_ROUTES = ["/es/login", "/en/login"];

const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 1. Primero aplicar next-intl
  const intlResponse = intlMiddleware(req);
  if (intlResponse instanceof NextResponse && intlResponse.redirected) {
    return intlResponse;
  }

  const segments = pathname.split("/");
  const locale = segments[1] || "es";

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  const isAuthPage =
    LOGIN_ROUTES.includes(pathname) ||
    pathname.includes("register") ||
    pathname.includes("recovery-password");

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/_next");

  if (isPublicRoute) return NextResponse.next();

  if (!token && !LOGIN_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // ...

  // 2. 🚨 Verificamos rutas admin
  const isAdminRoute = pathname.startsWith(`/${locale}/admin`);

  if (isAdminRoute && token) {
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(
        Buffer.from(base64Payload, "base64").toString()
      );

      if (decodedPayload.role !== Role.ADMIN) {
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
      }
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  // 3. 🚫 Bloquear acceso a rutas públicas si sos admin
  if (!isAdminRoute && token) {
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(
        Buffer.from(base64Payload, "base64").toString()
      );

      if (decodedPayload.role === Role.ADMIN) {
        return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
      }
    } catch (error) {
      console.error("Error al verificar rol para redirección:", error);
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
