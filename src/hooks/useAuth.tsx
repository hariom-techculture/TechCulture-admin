// src/hooks/useAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Install this package: npm install jwt-decode
import {AuthContextType,User} from "@/types/user"

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  signOut: () => {},
  loading: true,
  setUser: () => {},
  setToken: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearAllAuthData = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    sessionStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  };

  const signOut = () => {
    clearAllAuthData();
    setUser(null);
    setToken(null);
    router.push("/auth/sign-in");
  };

  const checkAuthExpiration = () => {
    try {
      // Check token expiration from localStorage
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (tokenExpiry && parseInt(tokenExpiry) < Date.now()) {
        signOut();
        return false;
      }

      // Check user data expiration
      const localStorageUser = localStorage.getItem("user");
      const sessionStorageUser = sessionStorage.getItem("user");
      const userData = localStorageUser || sessionStorageUser;

      if (userData) {
        const { expiry } = JSON.parse(userData);
        if (expiry && expiry < Date.now()) {
          signOut();
          return false;
        }
      }

      return true;
    } catch (error) {
      signOut();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const localStorageUser = localStorage.getItem("user");
      const sessionStorageUser = sessionStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedToken && (localStorageUser || sessionStorageUser)) {
        // Check if token and user data are still valid
        if (checkAuthExpiration()) {
          const userData = localStorageUser || sessionStorageUser;
          if (userData) {
            const parsedData = JSON.parse(userData);
            setUser(parsedData.user);
            setToken(storedToken);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Check expiration every minute
    const expiryCheckInterval = setInterval(() => {
      checkAuthExpiration();
    }, 60000);

    return () => clearInterval(expiryCheckInterval);

    return () => clearInterval(expiryCheckInterval);
  }, []);

  // Show loading state only during initial auth check
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      signOut, 
      loading,
      setUser,
      setToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
