import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../api/api";
import { AuthContext } from "./authContext";
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredSession,
  getStoredSession,
  storeSession,
} from "./sessionStorage";
import type { AuthSession } from "./sessionStorage";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession);

  useEffect(() => {
    const handleUnauthorized = () => setSession(null);
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const login = (authResponse: AuthResponse) => {
    const newSession: AuthSession = {
      token: authResponse.token,
      user: authResponse.data,
    };

    storeSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    clearStoredSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isAuthenticated: Boolean(session?.token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};