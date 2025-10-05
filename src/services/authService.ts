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
    console.log(
      'isLoggedIn: Checking auth status at:',
      BackendEndpoints.auth.status
    );
    const res = await api.get<{ isAuthenticated: boolean }>(
      BackendEndpoints.auth.status
    );
    console.log('isLoggedIn: Response:', res.data);
    return res.data.isAuthenticated;
  } catch (error) {
    console.error('isLoggedIn: Error checking auth status:', error);
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
  router?: ReturnType<typeof useRouter>,
  redirectTo?: string
): Promise<UserProfile | undefined> {
  console.log('getMyProfile: Starting profile fetch...');
  const authenticated = await isLoggedIn();
  console.log('getMyProfile: isLoggedIn result:', authenticated);

  try {
    if (authenticated) {
      console.log(
        'getMyProfile: User is authenticated, fetching profile from:',
        BackendEndpoints.auth.me
      );
      const response = await api.get<UserProfile>(BackendEndpoints.auth.me);
      console.log('getMyProfile: Profile response:', response.data);
      return response.data;
    } else {
      console.log(
        'getMyProfile: User is not authenticated, skipping profile fetch'
      );
    }
  } catch (error: unknown) {
    console.error('getMyProfile: Error fetching profile:', error);
    if (
      isAxiosErrorType<ApiErrorResponse>(error) &&
      error.response?.status === 403
    ) {
      console.log('getMyProfile: 403 error, calling logout');
      await logoutUser(router, redirectTo);
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
