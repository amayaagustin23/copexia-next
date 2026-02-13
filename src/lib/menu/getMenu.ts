export type MenuItem = { name: string; href: string };

type Paths = {
  raiz: string;
  secciones: {
    home: string;
    identificacion: string;
    servicios: string;
    sobreNosotros: string;
    contacto: string;
    valores: string;
    faro: string;
    blog: string;
    [k: string]: string;
  };
  link: (id: string) => string;

  auth?: {
    signIn: string;
    recoverPassword: string;
    changePassword: string;
  };
};

type MenuOptions = {
  showAuth?: boolean;
  showRecover?: boolean;
  showChange?: boolean;
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
    { name: t('menu.home'), href: paths.secciones.home },
    { name: t('menu.identification'), href: paths.secciones.identificacion },
    { name: t('menu.about'), href: paths.secciones.sobreNosotros },
    { name: t('menu.services'), href: paths.secciones.servicios },
    { name: t('menu.faro'), href: paths.secciones.faro },
    { name: t('menu.values'), href: paths.secciones.valores },
    { name: t('menu.blog'), href: paths.secciones.blog },
    { name: t('menu.contact'), href: paths.secciones.contacto },
  ];

  if (showAuth && paths.auth) {
    items.push({
      name: t('menu.account'),
      href: paths.auth.signIn,
    });
  }

  return items;
};
