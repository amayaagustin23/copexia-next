import api from '@/lib/axios';
import { BackendEndpoints } from '@/lib/config/apiPath';
import { getErrorMessage } from '@/lib/config/getErrorMessage';
import { ApiErrorResponse, isAxiosErrorType } from '@/types/api';
import { ForgotPasswordData, LoginData, ResetPasswordData } from '@/types/auth';
import { UserProfile } from '@/types/user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LoginResponse {
  message: string;
  user: UserProfile;
}

export async function loginUser(
  credentials: LoginData,
  t?: (key: string) => string
): Promise<LoginResponse | undefined> {
  try {
    const response = await api.post<LoginResponse>(
      BackendEndpoints.auth.login,
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    toast.error(t?.('loginError') || getErrorMessage(error));
  }
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    BackendEndpoints.auth.status;
    const res = await api.get<{ isAuthenticated: boolean }>(
      BackendEndpoints.auth.status
    );
    return res.data.isAuthenticated;
  } catch (error) {
    return false;
  }
}

export async function logoutUser(
  router?: ReturnType<typeof useRouter>,
  redirectTo?: string
): Promise<void> {
  try {
    await api.post(BackendEndpoints.auth.logout, {}, { withCredentials: true });
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  } finally {
    if (router) {
      router.push(redirectTo || '/es/ingresar');
    }
  }
}

export async function getMyProfile(
  hasGlobalUser?: boolean
): Promise<UserProfile | undefined> {
  // Si se pasa el estado del usuario global y no hay usuario, no hacer la llamada
  if (hasGlobalUser === false) {
    return undefined;
  }

  try {
    const response = await api.get<UserProfile>(BackendEndpoints.auth.me);
    return response.data;
  } catch (error: unknown) {
    if (
      isAxiosErrorType<ApiErrorResponse>(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
    }
  }

  return undefined;
}

export async function requestPasswordReset(
  data: ForgotPasswordData,
  t?: (key: string) => string
): Promise<void> {
  try {
    await api.post(BackendEndpoints.auth.recoveryPassword, data);
    toast.success(t?.('passwordResetSuccess'));
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
}

export async function resetPassword(
  token: string,
  data: ResetPasswordData,
  t?: (key: string) => string
): Promise<{ message: string }> {
  try {
    const res = await api.post<{ message: string }>(
      `${BackendEndpoints.auth.resetPassword}/${token}`,
      data
    );
    toast.success(t?.('passwordChangeSuccess'));
    return res.data;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
    throw error;
  }
}

export async function updateProfile(
  data: Partial<UserProfile>,
  t?: (key: string) => string
): Promise<UserProfile | undefined> {
  try {
    const response = await api.patch<UserProfile>(
      BackendEndpoints.auth.me,
      data
    );
    toast.success(t?.('profileUpdateSuccess'));
    return response.data;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
}
