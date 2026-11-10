import { createContext } from "react";
import type { AuthResponse } from "../api/api";
import type { AuthUser } from "./sessionStorage";

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);