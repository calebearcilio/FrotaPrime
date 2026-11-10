export const AUTH_SESSION_KEY = "frotaprime.auth";
export const AUTH_UNAUTHORIZED_EVENT = "frotaprime:unauthorized";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

export const getStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedSession = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!storedSession) return null;

    const session = JSON.parse(storedSession) as AuthSession;
    if (
      typeof session.token !== "string" ||
      typeof session.user?.id !== "number" ||
      typeof session.user?.name !== "string" ||
      typeof session.user?.email !== "string"
    ) {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
};

export const storeSession = (session: AuthSession) => {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
  }
};