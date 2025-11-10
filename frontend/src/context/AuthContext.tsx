import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, userApi, providerApi } from "../api";
import type { UserData, ProviderProfileData } from "../api";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | null;
  user: UserData | null;
  provider: ProviderProfileData | null;
  isProvider: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loadUserData: () => Promise<void>;
  refreshProvider: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [provider, setProvider] = useState<ProviderProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Carregar dados do usuário
  const loadUserData = async () => {
    if (!userId) return;

    try {
      const userData = await userApi.getById(userId);
      setUser(userData.data);
    } catch (err: any) {
      console.error("Erro ao carregar dados do usuário:", err);
    }
  };

  // Carregar dados do provider
  const refreshProvider = async () => {
    if (!userId) return;

    try {
      const providerData = await providerApi.getByUserId(userId);
      setProvider(providerData);
    } catch (err: any) {
      console.error("Erro ao carregar dados do provider:", err);
      setProvider(null);
    }
  };

  // Carregar dados quando o userId mudar
  useEffect(() => {
    if (userId) {
      loadUserData();
      refreshProvider();
    }
  }, [userId]);

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
    setUser(null);
    setProvider(null);
    setError(null);
    navigate("/login");
  };

  const value = {
    isLoggedIn,
    userId,
    user,
    provider,
    isProvider: !!provider,
    login,
    logout,
    error,
    loadUserData,
    refreshProvider,
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
