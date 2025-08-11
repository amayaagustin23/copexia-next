export type SubItem = { name: string; href: string; description?: string };
export type MenuItem =
  | { name: string; href: string; submenu?: never }
  | { name: string; href: string; submenu: SubItem[] };

type Paths = {
  raiz: string;
  secciones: Record<string, string>;
  sub: {
    servicios: {
      transformacion: string;
      adopcion: string;
      optimizacion: string;
      investigaciones: string;
    };
    learning: {
      powerbi: string;
      adopcionTecnologica: string;
      metodologias: string;
      dinamicas: string;
    };
  };
  link: (id: string) => string;
};

export const getMenu = (
  t: (key: string) => string,
  paths: Paths
): MenuItem[] => [

  {
    name: t("menu.services"),
    href: paths.secciones.servicios,
    submenu: [
      {
        name: t("submenu.services.transformation"),
        href: paths.sub.servicios.transformacion,
      },
      {
        name: t("submenu.services.adoption"),
        href: paths.sub.servicios.adopcion,
      },
      {
        name: t("submenu.services.optimization"),
        href: paths.sub.servicios.optimizacion,
      },
      {
        name: t("submenu.services.research"),
        href: paths.sub.servicios.investigaciones,
      },
    ],
  },

  { name: t("menu.about"), href: paths.secciones.sobreNosotros },

  {
    name: t("menu.learning"),
    href: paths.secciones.learning,
    submenu: [
      { name: t("submenu.learning.powerbi"), href: paths.sub.learning.powerbi },
      {
        name: t("submenu.learning.adoption"),
        href: paths.sub.learning.adopcionTecnologica,
      },
      {
        name: t("submenu.learning.methods"),
        href: paths.sub.learning.metodologias,
      },
      {
        name: t("submenu.learning.dynamics"),
        href: paths.sub.learning.dinamicas,
      },
    ],
  },

  { name: t("menu.contact"), href: paths.secciones.contacto },
];
