"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth.service";
import { LoginPayload, User } from "@/types/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setError(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (payload: LoginPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const data = await authService.login(payload);
      setUser(data.user);
      return data;
    } catch (err: any) {
      const msg = err.message || "Failed to log in";
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      setIsSubmitting(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to log out");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSubmitting,
        error,
        login,
        logout,
        checkAuth,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
