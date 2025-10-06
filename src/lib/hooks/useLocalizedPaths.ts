"use client";
import { getLocalizedPath } from '@/lib/config/routes';
import { useLocale } from 'next-intl';

type SectionId =
  | 'inicio'
  | 'servicios'
  | 'sobre-nosotros'
  | 'valores'
  | 'contacto'

type ServicesAnchors = {
  transformacion: string;
  adopcion: string;
  optimizacion: string;
  investigaciones: string;
};

type AuthPaths = {
  signIn: string;
  recoverPassword: string;
  changePassword: string;
};

type Sections = {
  home: string;
  services: string;
  aboutUs: string;
  values: string;
  contact: string;
};

type AdminPaths = {
  root: string; // /:locale/admin
  dashboard: string; // /:locale/admin
  posts: string; // /:locale/admin/posts
  categories: string; // /:locale/admin/categories
  comments: string; // /:locale/admin/comments
};

export const useLocalizedPaths = () => {
  const locale = useLocale();
  const base = `/${locale}`;

  const anchor = (id: SectionId) => `${base}#${id}`;

  const servicesAnchors: ServicesAnchors = {
    transformacion: `${base}#servicios-transformacion`,
    adopcion: `${base}#servicios-adopcion`,
    optimizacion: `${base}#servicios-optimizacion`,
    investigaciones: `${base}#servicios-investigaciones`,
  } as const;

  const auth: AuthPaths = {
    signIn: `${base}${getLocalizedPath('login', locale)}`,
    recoverPassword: `${base}${getLocalizedPath('forgotPassword', locale)}`,
    changePassword: `${base}${getLocalizedPath('changePassword', locale)}`,
  } as const;

  const admin: AdminPaths = {
    root: `${base}/admin`,
    dashboard: `${base}/admin`,
    posts: `${base}/admin/posts`,
    categories: `${base}/admin/categories`,
    comments: `${base}/admin/comments`,
  } as const;

  const sections: Sections = {
    home: anchor('inicio'),
    services: anchor('servicios'),
    aboutUs: anchor('sobre-nosotros'),
    values: anchor('valores'),
    contact: anchor('contacto'),
  } as const;

  const path = (subpath = '') =>
    subpath ? `${base}/${subpath.replace(/^\/+/, '')}` : base;

  return {
    root: base,
    sections,
    sub: { services: servicesAnchors },
    auth,
    admin,
    anchor,
    path,
  };
};
