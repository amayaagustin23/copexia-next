import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AppProvider } from "@/providers/AppProvider";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import PropTypes from "prop-types";
import getRequestConfig from "../../i18n/request";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://alliviarte.com"),
  title: "Alliviarte | Sistema de gestión para podólogos",
  description:
    "Alliviarte es un sistema profesional de gestión de pacientes, turnos e historias clínicas, diseñado para podólogos en Tucumán, Argentina.",
  keywords: [
    "Alliviarte",
    "Sistema podología",
    "Gestión de pacientes",
    "Turnos online",
    "Historia clínica digital",
    "Software médico",
    "Podólogos Tucumán",
    "Software Argentina",
  ],
  author: "Alliviarte",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Alliviarte | Sistema de gestión para podólogos",
    description:
      "Software de gestión de pacientes y turnos pensado para profesionales de la podología. 100% digital y accesible desde cualquier dispositivo.",
    url: "https://alliviarte.com",
    siteName: "Alliviarte",
    images: [
      {
        url: "/og-image.jpg", // Cambialo si tenés una imagen real
        width: 1200,
        height: 630,
        alt: "Vista previa de Alliviarte",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alliviarte | Sistema de gestión para podólogos",
    description:
      "Gestión moderna de pacientes, historias clínicas y turnos para profesionales podólogos.",
    images: {
      url: "/twitter-image.jpg", // Cambialo si tenés una imagen real
      alt: "Imagen para Twitter de Alliviarte",
    },
    creator: "@alliviarte", // Podés dejarlo o eliminarlo si aún no existe
    site: "@alliviarte",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children, params }) {
  const awaitedParams = await params;
  if (!awaitedParams) notFound();

  const locale = awaitedParams.locale;

  let messages;
  try {
    const { messages: loadedMessages } = await getRequestConfig({
      requestLocale: locale,
    });
    messages = loadedMessages;
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppProvider locale={locale} messages={messages}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    locale: PropTypes.string,
  }).isRequired,
};
