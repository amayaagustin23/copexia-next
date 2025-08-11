import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Primero aplicar next-intl
  const intlResponse = intlMiddleware(req);
  if (intlResponse instanceof NextResponse && intlResponse.redirected) {
    return intlResponse;
  }

  // 2. Redirigir "/" a "/es"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  // 3. Permitir libre acceso a todo lo demás
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
