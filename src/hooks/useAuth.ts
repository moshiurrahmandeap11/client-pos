"use client";

import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth.service";
import { LoginPayload, User } from "@/types/auth.types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isSubmitting,
    error,
    login,
    logout,
    checkAuth,
    setError,
  };
}
