// src/lib/context/AuthContext.tsx
"use client";

import {
  authService,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  RecoverPasswordPayload,
  User,
} from "@/services/authService";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  recoverPassword: (payload: RecoverPasswordPayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const res: LoginResponse = await authService.me();
      setUser(res.user);
      setError(null);
    } catch {
      setUser(null);
      setError(null); // no mostramos error en boot
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const res = await authService.login(payload);
      setUser(res.user);
      setError(null);
    } catch (e: any) {
      setUser(null);
      setError(e?.message || "No se pudo iniciar sesión");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "No se pudo cerrar sesión");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const recoverPassword = useCallback(
    async (payload: RecoverPasswordPayload) => {
      setLoading(true);
      try {
        await authService.recoverPassword(payload);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "No se pudo enviar la recuperación");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    setLoading(true);
    try {
      await authService.changePassword(payload);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "No se pudo cambiar la contraseña");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      recoverPassword,
      changePassword,
      refreshSession,
      clearError,
    }),
    [
      user,
      loading,
      error,
      login,
      logout,
      recoverPassword,
      changePassword,
      refreshSession,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
