import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["en", "es"];
const defaultLocale = "es";

export default getRequestConfig(async ({ locale }) => {
  const effectiveLocale = locale || defaultLocale;

  if (!locales.includes(effectiveLocale)) {
    console.error(
      `Locale efectivo "${effectiveLocale}" no está en la lista de locales soportados:`,
      locales
    );
    notFound();
  }

  try {
    return {
      messages: (await import(`../../messages/${effectiveLocale}.json`))
        .default,
      locale: effectiveLocale,
      timeZone: "America/Argentina/Buenos_Aires",
    };
  } catch (error) {
    console.error(
      `No se pudieron cargar los mensajes para el locale "${effectiveLocale}":`,
      error
    );
    throw error;
  }
});
