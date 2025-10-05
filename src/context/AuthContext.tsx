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
    } finally {
      authCache = null;
      setUser(null);
      router.push(paths.auth.signIn);
    }
  }, [router, paths.auth.signIn]);

  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  const setDataUser = useCallback(async () => {
    const profile = await getMyProfile();
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
        const now = Date.now();
        if (authCache && now - authCache.timestamp < CACHE_DURATION) {
          setUser(authCache.user);
          setIsLoading(false);
          return;
        }

        await isLoggedIn();

        const profile = await getMyProfile();

        authCache = {
          user: profile || null,
          timestamp: now,
          isLoading: false,
        };

        if (profile) {
          setUser(profile);
        }
      } catch (error) {
        authCache = null;
        setUser(null);
      } finally {
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
