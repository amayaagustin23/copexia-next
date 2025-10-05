export const PUBLIC_ROUTES = [
  '/es/register',
  '/en/register',
  // Rutas de autenticación - ambas versiones (español e inglés) apuntan al mismo componente
  '/es/recuperar-contrasena', // -> /es/forgot-password (componente)
  '/es/forgot-password',
  '/en/forgot-password',
  '/es/cambiar-contrasena', // -> /es/change-password (componente)
  '/es/change-password',
  '/en/change-password',
  '/es/ingresar', // -> /es/login (componente)
  '/es/login',
  '/en/login',
];
