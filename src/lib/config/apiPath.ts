const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000/api';
export const BackendEndpoints = {
  auth: {
    login: `${BACKEND_API_BASE_URL}/auth/login`,
    status: `${BACKEND_API_BASE_URL}/auth/status`,
    register: `${BACKEND_API_BASE_URL}/auth/register`,
    me: `${BACKEND_API_BASE_URL}/auth/me`,
    logout: `${BACKEND_API_BASE_URL}/auth/logout`,
    recoveryPassword: `${BACKEND_API_BASE_URL}/auth/recover-password`,
    resetPassword: `${BACKEND_API_BASE_URL}/auth/reset-password`,
  },
  googlePlaces: {
    autocomplete: `${BACKEND_API_BASE_URL}/google-places/autocomplete`,
    details: `${BACKEND_API_BASE_URL}/google-places/details`,
  },
};
