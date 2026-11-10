import axios from "axios";

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

export const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return fallback;
};

export default api;