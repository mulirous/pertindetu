import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);

      if (response.statusCode === 200 && response.userId) {
        setIsLoggedIn(true);
        setUserId(response.userId);
        setError(null);
        navigate("/");
      } else {
        setError(response.message || "Erro ao fazer login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setError(null);
    navigate("/login");
  };

  const value = {
    isLoggedIn,
    userId,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
