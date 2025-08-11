import api from "@/lib/axios";
import { BackendEndpoints } from "@/lib/config/apiPath";
import { ApiErrorResponse, isAxiosErrorType } from "@/types/api";
import {
  ForgotPasswordData,
  LoginData,
  RegisterProfessionalData,
  ResetPasswordData,
} from "@/types/auth";
import { toast } from "sonner";

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum Title {
  BACHELOR = "BACHELOR",
  TECHNICIAN = "TECHNICIAN",
}

export enum LicenseType {
  NATIONAL = "NATIONAL",
  PROVINCIAL = "PROVINCIAL",
}

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  birthDate: Date;
  dni: string;
  phone: string;
  professionalId: string;
  title: Title;
  licenseNumber: string;
  licenseType: LicenseType;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

interface LoginResponse {
  message: string;
  user: UserProfile;
}

function getErrorMessage(error: unknown): string {
  if (isAxiosErrorType<ApiErrorResponse>(error)) {
    const axiosError = error;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    } else if (axiosError.response) {
      return `Error del servidor: ${
        axiosError.response.statusText || "Desconocido"
      } (Estado: ${axiosError.response.status})`;
    } else if (axiosError.request) {
      return "No se pudo conectar al servidor. Verifica tu conexión a internet o la URL del backend.";
    } else {
      return "Error al configurar la petición.";
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado.";
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
    toast.error(t?.("loginError") || getErrorMessage(error));
  }
}

export async function registerUser(
  userData: RegisterProfessionalData,
  t?: (key: string) => string
): Promise<RegisterResponse | undefined> {
  try {
    const response = await api.post<RegisterResponse>(
      BackendEndpoints.auth.register,
      userData
    );
    return response.data;
  } catch (error: unknown) {
    toast.error(t?.("registerError") || getErrorMessage(error));
  }
}

export async function logoutUser(t?: (key: string) => string): Promise<void> {
  try {
    await api.post(BackendEndpoints.auth.logout, {}, { withCredentials: true });
  } catch (error: unknown) {
    toast.error(t?.("logoutError") || getErrorMessage(error));
  }
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const res = await api.get<{ isAuthenticated: boolean }>(
      BackendEndpoints.auth.status
    );
    return res.data.isAuthenticated;
  } catch {
    return false;
  }
}

export async function getMyProfile(
  t?: (key: string) => string
): Promise<UserProfile | undefined> {

  const authenticated = await isLoggedIn();
  try {
    if (authenticated) {
      const response = await api.get<UserProfile>(BackendEndpoints.auth.me);
      return response.data;
    }
  } catch (error: unknown) {
    if (
      isAxiosErrorType<ApiErrorResponse>(error) &&
      error.response?.status === 403
    ) {
      await logoutUser(t);
    }
  }
}

export async function requestPasswordReset(
  data: ForgotPasswordData,
  t?: (key: string) => string
): Promise<void> {
  try {
    await api.post(BackendEndpoints.auth.recoveryPassword, data);
    toast.success(t?.("passwordResetSuccess"));
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
    toast.success(t?.("passwordChangeSuccess"));
    return res.data;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
    throw error;
  }
}
