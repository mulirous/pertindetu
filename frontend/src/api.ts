import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Importante para CORS com credenciais
});
const MOCK_USER = {
  userId: 1,

  providerId: 1,
};

export const getMockUserId = () => {
  return MOCK_USER.userId;
};

export const getMockProviderId = () => {
  return MOCK_USER.providerId;
};

export interface LoginResponse {
  statusCode: number;
  message: string;
  userId?: number;
}

export interface RegisterResponse {
  statusCode: number;
  message: string;
  userId?: number;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    user: {
      name: string;
      email: string;
      password: string;
      cellphoneNumber: string;
    };
    address: {
      street: string;
      number: number;
      neighborhood: string;
      city: string;
      federativeUnit: string;
      postalCode: string;
      latitude?: number;
      longitude?: number;
    };
  }) => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },
};
