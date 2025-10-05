'use client';

import { setLogoutCallback } from '@/lib/authManager';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { getMyProfile, isLoggedIn, logoutUser } from '@/services/authService';
import { UserProfile } from '@/types/user';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (user: UserProfile) => void;
  setDataUser: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthCache: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache simple para evitar llamadas innecesarias
let authCache: {
  user: UserProfile | null;
  timestamp: number;
  isLoading: boolean;
} | null = null;

const CACHE_DURATION = 30000; // 30 segundos

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const paths = useLocalizedPaths();

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    } finally {
      // Limpiar caché al hacer logout
      authCache = null;
      setUser(null);
      router.push(paths.auth.signIn); // redirige al login según idioma
    }
  }, [router, paths.auth.signIn]);

  useEffect(() => {
    setLogoutCallback(logout); // ← lo registra globalmente
  }, [logout]);

  const setDataUser = useCallback(async () => {
    const profile = await getMyProfile(); // Removido router y redirectTo
    // Actualizar caché cuando se actualiza el usuario
    authCache = {
      user: profile || null,
      timestamp: Date.now(),
      isLoading: false,
    };
    setUser(profile);
  }, []);

  const clearAuthCache = useCallback(() => {
    console.log('AuthContext: Clearing auth cache');
    authCache = null;
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Verificar si tenemos datos en caché válidos
        const now = Date.now();
        if (authCache && now - authCache.timestamp < CACHE_DURATION) {
          console.log('AuthContext: Using cached auth data');
          setUser(authCache.user);
          setIsLoading(false);
          return;
        }

        console.log('AuthContext: Loading user profile...');
        if (typeof window !== 'undefined') {
          console.log('AuthContext: Document cookies:', document.cookie);
        }

        // Verificar primero si está logueado
        const isLoggedInStatus = await isLoggedIn();
        console.log('AuthContext: isLoggedIn status:', isLoggedInStatus);

        const profile = await getMyProfile(); // Removido router y redirectTo
        console.log('AuthContext: Profile loaded:', profile);

        // Actualizar caché
        authCache = {
          user: profile || null,
          timestamp: now,
          isLoading: false,
        };

        if (profile) {
          setUser(profile);
        }
      } catch (error) {
        console.error('AuthContext: Error loading profile:', error);
        // Limpiar caché en caso de error
        authCache = null;
        setUser(null); // Solo limpiar usuario, no hacer logout automático
      } finally {
        console.log('AuthContext: Setting isLoading to false');
        setIsLoading(false);
      }
    };

    loadUser();
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login: setUser,
      setDataUser,
      logout,
      clearAuthCache,
    }),
    [user, isLoading, logout, setDataUser, clearAuthCache]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};
