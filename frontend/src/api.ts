import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Importante para CORS com credenciais
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  token: string;
  userId: number;
}

export interface RegisterResponse {
  statusCode: number;
  message: string;
  userId?: number;
}

// User interfaces
export type UserRole = "ADMIN" | "CLIENT" | "PROVIDER";

export interface UserData {
  id: number;
  name: string;
  email: string;
  cellphoneNumber: string;
  dateCreation: string;
  active: boolean;
  role: UserRole;
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

// Tipo de retorno real da API
export interface PagedResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
}

// Provider interfaces
export interface CategoryData {
  id: number;
  name: string;
  description: string;
}

export interface CategoryRequestData {
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

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // A página atual
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
      role: "CLIENT" | "PROVIDER" | "ADMIN";
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

  becomeProvider: async (id: number) => {
    const response = await api.patch<ApiResponse<UserData>>(
      `/users/${id}/become-provider`
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

export interface ServicesPageData {
  content: ServiceData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ServiceFilters {
  categoryId?: number;
  providerId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Services API
export const servicesApi = {
  // Buscar serviços públicos com filtros
  getPublic: async (filters: ServiceFilters = {}, page = 0, size = 12) => {
    const params: any = { page, size, sort: "createdAt,desc" };

    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.providerId) params.providerId = filters.providerId;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;

    const response = await api.get<ServicesPageData>("/services/public", {
      params,
    });
    return response.data;
  },

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

// Order interfaces
export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderClientInfo {
  id: number;
  name: string;
  email: string;
}

export interface OrderProviderInfo {
  id: number;
  name: string;
  bio: string;
  verified: boolean;
}

export interface OrderServiceInfo {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  categoryName: string;
}

export interface OrderData {
  id: number;
  status: OrderStatus;
  details: string | null;
  quantity: number;
  value: number;
  eventDate: string | null;
  createdAt: string;
  client: OrderClientInfo;
  provider: OrderProviderInfo;
  service: OrderServiceInfo;
}

export interface OrderCreateData {
  serviceId: number;
  clientId: number;
  providerId: number;
  details?: string;
  quantity: number;
  value: number;
  eventDate?: number;
}

export interface OrderUpdateStatusData {
  status: OrderStatus;
}

export interface OrdersPageData {
  content: OrderData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Orders API
export const ordersApi = {
  // Listar todos os pedidos (admin)
  getAll: async (page = 0, size = 10) => {
    const response = await api.get<OrdersPageData>("/orders", {
      params: { page, size, sort: "createdAt,desc" },
    });
    return response.data;
  },

  // Buscar pedido por ID
  getById: async (id: number) => {
    const response = await api.get<OrderData>(`/orders/${id}`);
    return response.data;
  },

  // Buscar pedidos do cliente (paginado)
  getByClientId: async (clientId: number, page = 0, size = 10) => {
    const response = await api.get<OrdersPageData>(
      `/orders/client/${clientId}`,
      {
        params: { page, size, sort: "createdAt,desc" },
      }
    );
    return response.data;
  },

  // Buscar pedidos do provider (paginado)
  getByProviderId: async (providerId: number, page = 0, size = 10) => {
    const response = await api.get<OrdersPageData>(
      `/orders/provider/${providerId}`,
      {
        params: { page, size, sort: "createdAt,desc" },
      }
    );
    return response.data;
  },

  // Buscar pedidos por status (paginado)
  getByStatus: async (status: OrderStatus, page = 0, size = 10) => {
    const response = await api.get<OrdersPageData>(`/orders/status/${status}`, {
      params: { page, size, sort: "createdAt,desc" },
    });
    return response.data;
  },

  // Criar novo pedido
  create: async (orderData: OrderCreateData) => {
    const response = await api.post<OrderData>("/orders", orderData);
    return response.data;
  },

  // Atualizar status do pedido (provider)
  updateStatus: async (
    id: number,
    statusData: OrderUpdateStatusData,
    providerId: number
  ) => {
    const response = await api.patch<OrderData>(
      `/orders/${id}/status`,
      statusData,
      {
        params: { providerId },
      }
    );
    return response.data;
  },

  // Cancelar pedido (cliente)
  cancel: async (id: number, clientId: number) => {
    const response = await api.patch<OrderData>(`/orders/${id}/cancel`, null, {
      params: { clientId },
    });
    return response.data;
  },

  // Deletar pedido
  delete: async (id: number) => {
    await api.delete(`/orders/${id}`);
  },
};

// Review interfaces
export interface ReviewUserInfo {
  id: number;
  name: string;
  email: string;
}

export interface ReviewServiceInfo {
  id: number;
  title: string;
  categoryName: string;
}

export interface ReviewData {
  id: number;
  rating: number;
  comment: string | null;
  orderId: number;
  createdAt: string;
  user: ReviewUserInfo;
  service: ReviewServiceInfo;
}

export interface ReviewCreateData {
  rating: number;
  comment?: string;
  orderId: number;
  userId: number;
  serviceId: number;
}

export interface ReviewsPageData {
  content: ReviewData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Reviews API
export const reviewsApi = {
  // Listar todas as reviews (admin)
  getAll: async (page = 0, size = 10) => {
    const response = await api.get<ReviewsPageData>("/reviews", {
      params: { page, size, sort: "createdAt,desc" },
    });
    return response.data;
  },

  // Buscar reviews de um serviço
  getByServiceId: async (serviceId: number, page = 0, size = 10) => {
    const response = await api.get<ReviewsPageData>(
      `/reviews/service/${serviceId}`,
      {
        params: { page, size, sort: "createdAt,desc" },
      }
    );
    return response.data;
  },

  // Buscar reviews de um usuário
  getByUserId: async (userId: number, page = 0, size = 10) => {
    const response = await api.get<ReviewsPageData>(`/reviews/user/${userId}`, {
      params: { page, size, sort: "createdAt,desc" },
    });
    return response.data;
  },

  // Buscar reviews de um provider
  getByProviderId: async (providerId: number, page = 0, size = 10) => {
    const response = await api.get<ReviewsPageData>(
      `/reviews/provider/${providerId}`,
      {
        params: { page, size, sort: "createdAt,desc" },
      }
    );
    return response.data;
  },

  // Buscar review por ID
  getById: async (id: number) => {
    const response = await api.get<ReviewData>(`/reviews/${id}`);
    return response.data;
  },

  // Obter média de rating de um serviço
  getAverageByServiceId: async (serviceId: number) => {
    const response = await api.get<number>(
      `/reviews/service/${serviceId}/average`
    );
    return response.data;
  },

  // Obter média de rating de um provider
  getAverageByProviderId: async (providerId: number) => {
    const response = await api.get<number>(
      `/reviews/provider/${providerId}/average`
    );
    return response.data;
  },

  // Obter total de reviews de um serviço
  getCountByServiceId: async (serviceId: number) => {
    const response = await api.get<number>(
      `/reviews/service/${serviceId}/count`
    );
    return response.data;
  },

  // Criar nova review
  create: async (reviewData: ReviewCreateData) => {
    const response = await api.post<ReviewData>("/reviews", reviewData);
    return response.data;
  },

  // Atualizar review
  update: async (id: number, reviewData: ReviewCreateData) => {
    const response = await api.put<ReviewData>(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Deletar review
  delete: async (id: number, userId: number) => {
    await api.delete(`/reviews/${id}`, {
      params: { userId },
    });
  },
};

// ============================================
// ADMIN API
// ============================================

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  totalServices: number;
  activeServices: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get<AdminStats>("/admin/stats/dashboard");
    return response.data;
  },

  // Users Management
  users: {
    getAll: async (
      page = 0,
      size = 10,
      sortBy = "dateCreation",
      direction = "DESC"
    ) => {
      const response = await api.get("/admin/users", {
        params: { page, size, sortBy, direction },
      });
      return response.data;
    },

    getById: async (id: number) => {
      const response = await api.get<UserData>(`/admin/users/${id}`);
      return response.data;
    },

    toggleStatus: async (id: number) => {
      const response = await api.patch<UserData>(
        `/admin/users/${id}/toggle-status`
      );
      return response.data;
    },

    delete: async (id: number) => {
      await api.delete(`/admin/users/${id}`);
    },

    getStats: async () => {
      const total = await api.get<number>("/admin/users/stats/total");
      const active = await api.get<number>("/admin/users/stats/active");
      return { total: total.data, active: active.data };
    },
  },

  // Providers Management
  providers: {
    getAll: async (page = 0, size = 10, sortBy = "id", direction = "ASC") => {
      const response = await api.get("/admin/providers", {
        params: { page, size, sortBy, direction },
      });
      return response.data;
    },

    getById: async (id: number) => {
      const response = await api.get<ProviderProfileData>(
        `/admin/providers/${id}`
      );
      return response.data;
    },

    toggleVerification: async (id: number) => {
      const response = await api.patch<ProviderProfileData>(
        `/admin/providers/${id}/toggle-verification`
      );
      return response.data;
    },

    delete: async (id: number) => {
      await api.delete(`/admin/providers/${id}`);
    },

    getStats: async () => {
      const total = await api.get<number>("/admin/providers/stats/total");
      const verified = await api.get<number>("/admin/providers/stats/verified");
      return { total: total.data, verified: verified.data };
    },
  },

  // Services Management
  services: {
    getAll: async () => {
      const response = await api.get("/admin/services");
      const data = response.data;

      // 🔧 Garante que retorna sempre um array
      return Array.isArray(data) ? data : data?.content || [];
    },

    getById: async (id: number) => {
      const response = await api.get<ServiceData>(`/admin/services/${id}`);
      return response.data;
    },

    toggleStatus: async (id: number) => {
      const response = await api.patch<ServiceData>(
        `/admin/services/${id}/toggle-status`
      );
      return response.data;
    },

    delete: async (id: number) => {
      await api.delete(`/admin/services/${id}`);
    },

    getStats: async () => {
      const total = await api.get<number>("/admin/services/stats/total");
      const active = await api.get<number>("/admin/services/stats/active");
      return { total: total.data, active: active.data };
    },
  },

  // Orders Stats
  orders: {
    getStats: async () => {
      const response = await api.get("/admin/stats/orders");
      return response.data;
    },
  },

  // Categories Management
  categories: {
    getAll: async () => {
      const response = await api.get<Page<CategoryData>>("/admin/categories", {
        params: { page: 0, size: 1000 }, // Busca todas as categorias
      });
      // Retorna o array de categorias do objeto Page
      return response.data.content;
    },
    getById: async (id: number) => {
      const response = await api.get<CategoryData>(`/admin/categories/${id}`);
      return response.data;
    },

    create: async (categoryData: CategoryRequestData) => {
      const response = await api.post<CategoryData>(
        "/admin/categories",
        categoryData
      );
      return response.data;
    },

    update: async (id: number, categoryData: CategoryRequestData) => {
      const response = await api.put<CategoryData>(
        `/admin/categories/${id}`,
        categoryData
      );
      return response.data;
    },

    delete: async (id: number) => {
      await api.delete(`/admin/categories/${id}`);
    },

    getStats: async () => {
      const total = await api.get<number>("/admin/categories/stats/total");
      return { total: total.data };
    },
  },
};
