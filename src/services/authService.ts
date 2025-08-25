// src/lib/services/auth.ts
"use client";

import api from "@/lib/axios";
import { AxiosError } from "axios";

// ===== Tipos =====
export type LoginPayload = { email: string; password: string };
export type RecoverPasswordPayload = { email: string };
export type ChangePasswordPayload =
  | { token: string; newPassword: string } // reset por token
  | { currentPassword: string; newPassword: string }; // cambio logueado

export type User = { id: string; email: string; name?: string };

export type LoginResponse = { user: User };
export type GenericResponse = { ok: boolean; message?: string };

// ===== Helpers =====
function toMessage(err: unknown, fallback = "Ocurrió un error") {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof AxiosError) {
    const data = err.response?.data as any;
    return data?.message || err.message || fallback;
  }
  if (err instanceof Error) return err.message || fallback;
  try {
    return JSON.stringify(err);
  } catch {
    return fallback;
  }
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await api.post<T>(url, body, { withCredentials: true });
  return res.data;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await api.get<T>(url, { withCredentials: true });
  return res.data;
}

// ===== Endpoints =====
// Ajustá los paths si en tu backend son otros
export const authService = {
  async login(data: LoginPayload): Promise<LoginResponse> {
    try {
      return await postJSON<LoginResponse>("/auth/login", data);
    } catch (e) {
      throw new Error(toMessage(e, "No se pudo iniciar sesión"));
    }
  },

  async recoverPassword(
    data: RecoverPasswordPayload
  ): Promise<GenericResponse> {
    try {
      return await postJSON<GenericResponse>("/auth/recover-password", data);
    } catch (e) {
      throw new Error(toMessage(e, "No se pudo enviar la recuperación"));
    }
  },

  async changePassword(data: ChangePasswordPayload): Promise<GenericResponse> {
    try {
      return await postJSON<GenericResponse>("/auth/change-password", data);
    } catch (e) {
      throw new Error(toMessage(e, "No se pudo cambiar la contraseña"));
    }
  },

  async me(): Promise<LoginResponse> {
    try {
      return await getJSON<LoginResponse>("/auth/me");
    } catch (e) {
      // si no hay sesión, devolvemos error normal para que el context limpie user
      throw new Error(toMessage(e, "Sesión no válida"));
    }
  },

  async logout(): Promise<GenericResponse> {
    try {
      return await postJSON<GenericResponse>("/auth/logout", {});
    } catch (e) {
      throw new Error(toMessage(e, "No se pudo cerrar sesión"));
    }
  },
};
