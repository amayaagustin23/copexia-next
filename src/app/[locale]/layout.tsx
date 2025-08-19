import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AppProvider } from "@/providers/AppProvider";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { notFound } from "next/navigation";
import PropTypes from "prop-types";
import getRequestConfig from "../../i18n/request";
import "../globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Copexia | Creamos soluciones a medida",
  description:
    "En Copexia, desde San Miguel de Tucumán - Argentina, acompañamos a organizaciones que quieren evolucionar combinando herramientas tecnológicas con metodologías de gestión, enfoque humano y visión estratégica.",
  keywords: [
    "Copexia",
    "Tucumán",
    "San Miguel de Tucumán",
    "Argentina",
    "transformación cultural",
    "soluciones digitales",
    "optimización de procesos",
    "consultoría organizacional",
    "capacitación empresarial",
    "Power BI",
    "Kaizen",
    "metodologías ágiles",
    "gestión del cambio",
    "formación en acción",
  ],
  openGraph: {
    type: "website",
    url: "https://copexia.com",
    title: "Copexia | Soluciones humanas y tecnológicas para tu organización",
    description:
      "Impulsamos la excelencia de tu organización desde San Miguel de Tucumán, Argentina, mediante consultoría estratégica, adopción tecnológica, optimización de procesos y formación con impacto.",
    siteName: "Copexia",
    images: [
      {
        url: "https://copexia.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Copexia - Transformamos tu organización en Tucumán, Argentina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Copexia | Soluciones humanas y tecnológicas",
    description:
      "Desde San Miguel de Tucumán, Argentina, acompañamos a empresas y equipos en su camino hacia la mejora continua, la adopción tecnológica y el desarrollo de habilidades internas.",
    images: ["https://copexia.com/og-image.jpg"],
  },
  metadataBase: new URL("https://copexia.com"),
  alternates: { canonical: "/" },
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const awaitedParams = await params;
  if (!awaitedParams) notFound();

  const locale = awaitedParams.locale;

  try {
    const { messages } = await getRequestConfig({
      requestLocale: Promise.resolve(locale),
    });

    return (
      <html
        lang={locale}
        suppressHydrationWarning
        className={`${lato.variable} `}
      >
        <body suppressHydrationWarning>
          <AppProvider locale={locale} messages={messages}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AppProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    locale: PropTypes.string,
  }).isRequired,
};
