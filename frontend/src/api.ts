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

// User interfaces
export interface UserData {
  id: number;
  name: string;
  email: string;
  cellphoneNumber: string;
  dateCreation: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface UserUpdateData {
  name: string;
  email: string;
  password?: string;
  cellphoneNumber: string;
}

// Provider interfaces
export interface CategoryData {
  id: number;
  name: string;
  description: string;
}

export interface ProviderProfileData {
  id: number;
  bio: string;
  verified: boolean;
  pixKey: string;
  profilePhotoUrl: string | null;
  userId: number;
  userName: string;
  categories: CategoryData[];
}

export interface ProviderProfileCreateData {
  bio: string;
  verified: boolean;
  pixKey: string;
  profilePhotoUrl?: string;
  userId: number;
  categoryIds: number[];
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

// User API
export const userApi = {
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<UserData>>(`/users/${id}`);
    return response.data;
  },

  update: async (id: number, userData: UserUpdateData) => {
    const response = await api.put<ApiResponse<UserData>>(
      `/users/${id}`,
      userData
    );
    return response.data;
  },
};

// Provider API
export const providerApi = {
  getByUserId: async (userId: number) => {
    try {
      // Buscar todos os providers e filtrar pelo userId
      const response = await api.get<
        ApiResponse<{ content: ProviderProfileData[] }>
      >("/providers");
      const provider = response.data.data.content.find(
        (p) => p.userId === userId
      );
      return provider || null;
    } catch (error) {
      return null;
    }
  },

  getById: async (id: number) => {
    const response = await api.get<ProviderProfileData>(`/providers/${id}`);
    return response.data;
  },

  create: async (providerData: ProviderProfileCreateData) => {
    const response = await api.post<ProviderProfileData>(
      "/providers",
      providerData
    );
    return response.data;
  },

  update: async (
    id: number,
    providerData: Partial<ProviderProfileCreateData>
  ) => {
    const response = await api.put<ProviderProfileData>(
      `/providers/${id}`,
      providerData
    );
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get<CategoryData[]>("/categories");
    return response.data;
  },
};

// Service interfaces
export interface ServiceMediaData {
  id: number;
  type: "PHOTO" | "VIDEO";
  mediaUrl: string;
  shortDescription: string | null;
  order: number;
}

export interface ServiceData {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  active: boolean;
  avgDuration: number;
  provider: {
    id: number;
    bio: string;
    verified: boolean;
  };
  category: CategoryData;
  media?: ServiceMediaData[];
}

export interface ServiceCreateData {
  title: string;
  description: string;
  basePrice: number;
  active: boolean;
  avgDuration: number;
  providerId: number;
  categoryId: number;
}

// Services API
export const servicesApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<{ content: ServiceData[] }>>(
      "/services"
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ServiceData>(`/services/${id}`);
    return response.data;
  },

  getByProviderId: async (providerId: number) => {
    const response = await api.get<ApiResponse<{ content: ServiceData[] }>>(
      `/services?providerId=${providerId}`
    );
    return response.data;
  },

  create: async (serviceData: ServiceCreateData) => {
    const response = await api.post<ServiceData>("/services", serviceData);
    return response.data;
  },

  update: async (id: number, serviceData: Partial<ServiceCreateData>) => {
    const response = await api.put<ServiceData>(`/services/${id}`, serviceData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/services/${id}`);
  },

  uploadMedia: async (id: number, file: File, description?: string) => {
    const formData = new FormData();
    formData.append("image", file);
    if (description) {
      formData.append("description", description);
    }

    const response = await api.post<ServiceMediaData>(
      `/services/${id}/media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getMedia: async (id: number) => {
    const response = await api.get<ServiceMediaData[]>(`/services/${id}/media`);
    return response.data;
  },
};
