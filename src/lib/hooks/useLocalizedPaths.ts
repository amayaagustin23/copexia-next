"use client";
import { useLocale } from "next-intl";

type SeccionId =
  | "inicio"
  | "servicios"
  | "sobre-nosotros"
  | "learning"
  | "valores"
  | "contacto";

export const useLocalizedPaths = () => {
  const locale = useLocale();
  const base = `/${locale}`;
  const link = (id: SeccionId) => `${base}#${id}`;

  const serviciosIds = {
    transformacion: `${base}#servicios-transformacion`,
    adopcion: `${base}#servicios-adopcion`,
    optimizacion: `${base}#servicios-optimizacion`,
    investigaciones: `${base}#servicios-investigaciones`,
  } as const;

  const learningIds = {
    powerbi: `${base}#learning-powerbi`,
    adopcionTecnologica: `${base}#learning-adopcion-tecnologica`,
    metodologias: `${base}#learning-metodologias`,
    dinamicas: `${base}#learning-dinamicas`,
  } as const;

  return {
    raiz: base,
    secciones: {
      inicio: link("inicio"),
      servicios: link("servicios"),
      sobreNosotros: link("sobre-nosotros"), // <- esta es la que vas a usar
      learning: link("learning"),
      valores: link("valores"),
      contacto: link("contacto"),
    },
    sub: {
      servicios: serviciosIds,
      learning: learningIds,
    },
    link,
  };
};
