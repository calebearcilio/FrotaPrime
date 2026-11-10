import axios from "axios";
import {
    AUTH_SESSION_KEY,
    AUTH_UNAUTHORIZED_EVENT,
    clearStoredSession,
} from "../auth/sessionStorage";

export type AuthResponse = {
    data: {
        id: number;
        name: string;
        email: string;
        createdAt: string;
    };
    token: string;
};

type ApiErrorResponse = {
    message?: string;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

const isPublicAuthRequest = (url?: string) =>
    /\/auth\/(login|signup|cadastro)(?:\?|$)/.test(url ?? "");

api.interceptors.request.use((config) => {
    if (!isPublicAuthRequest(config.url)) {
        const storedSession = window.localStorage.getItem(AUTH_SESSION_KEY);
        if (storedSession) {
            try {
                const { token } = JSON.parse(storedSession) as { token?: string };
                if (token) config.headers.Authorization = `Bearer ${token}`;
            } catch {
                clearStoredSession();
            }
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (
            axios.isAxiosError(error) &&
            error.response?.status === 401 &&
            !isPublicAuthRequest(error.config?.url)
        ) {
            clearStoredSession();
            window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
        }

        return Promise.reject(error);
    },
);

export const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return fallback;
};

export default api;