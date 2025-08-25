export type SubItem = { name: string; href: string; description?: string };
export type MenuItem =
  | { name: string; href: string; submenu?: never }
  | { name: string; href: string; submenu: SubItem[] };

// Mantengo tu shape base y agrego auth opcional
type Paths = {
  raiz: string;
  secciones: {
    servicios: string;
    sobreNosotros: string;
    contacto: string;
    // opcionalmente podrías tener: learning, valores
    [k: string]: string; // para no romper si agregás más
  };
  sub: {
    servicios: {
      transformacion: string;
      adopcion: string;
      optimizacion: string;
      investigaciones: string;
    };
  };
  link: (id: string) => string;

  // Nuevas rutas opcionales (si no existen, no se muestra el menú de auth)
  auth?: {
    signIn: string; // /ingresar
    recoverPassword: string; // /recuperar-contrasena
    changePassword: string; // /cambiar-contrasena
  };
};

// Flags para mostrar/ocultar items
type MenuOptions = {
  showAuth?: boolean; // default: true si paths.auth existe
  showRecover?: boolean; // default: true
  showChange?: boolean; // default: true
};

export const getMenu = (
  t: (key: string) => string,
  paths: Paths,
  opts: MenuOptions = {}
): MenuItem[] => {
  const {
    showAuth = Boolean(paths.auth),
    showRecover = true,
    showChange = true,
  } = opts;

  const items: MenuItem[] = [
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
    { name: t("menu.contact"), href: paths.secciones.contacto },
  ];

  // Auth (opcional): si hay rutas en paths.auth y showAuth = true
  if (showAuth && paths.auth) {
    const authSubmenu: SubItem[] = [
      { name: t("auth.signIn"), href: paths.auth.signIn },
    ];

    if (showRecover) {
      authSubmenu.push({
        name: t("auth.recoverPassword"),
        href: paths.auth.recoverPassword,
      });
    }
    if (showChange) {
      authSubmenu.push({
        name: t("auth.changePassword"),
        href: paths.auth.changePassword,
      });
    }

    items.push({
      name: t("menu.account"),
      href: paths.auth.signIn,
      submenu: authSubmenu,
    });
  }

  return items;
};
