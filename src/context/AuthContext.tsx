// src/context/AuthContext.tsx
"use client";

import { getMyProfile, UserProfile } from "@/services/authService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (user) => void; // Ya no se pasa el token aquí
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    const loadAuthStatus = async () => {
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (error) {
        console.error("Error al revalidar sesión o cargar perfil:", error);
        logout();
      }
      setIsLoading(false);
    };

    loadAuthStatus();
  }, [logout]);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
