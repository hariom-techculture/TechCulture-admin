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

  const signOut = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setUser(null);
    setToken(null);
    router.push("/auth/sign-in");
  };

  const checkTokenExpiration = (token: string) => {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        signOut();
        return false;
      }
      return true;
    } catch (error) {
      signOut();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedToken && storedUser) {
        // Check if token is valid and not expired
        if (checkTokenExpiration(storedToken)) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Set up periodic token check (every minute)
    const tokenCheckInterval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        checkTokenExpiration(currentToken);
      }
    }, 60000);

    return () => clearInterval(tokenCheckInterval);
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
