import type { OrderStatus } from "../api";

// Mapa de cores para cada status
export const orderStatusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

// Mapa de labels em português
export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  REJECTED: "Rejeitado",
  IN_PROGRESS: "Em Andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

// Verificar se o status pode ser atualizado pelo provider
export const canProviderUpdateStatus = (
  currentStatus: OrderStatus
): boolean => {
  return ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(currentStatus);
};

// Verificar se o cliente pode cancelar
export const canClientCancel = (currentStatus: OrderStatus): boolean => {
  return ["PENDING", "ACCEPTED"].includes(currentStatus);
};

// Obter próximos status possíveis
export const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  switch (currentStatus) {
    case "PENDING":
      return ["ACCEPTED", "REJECTED"];
    case "ACCEPTED":
      return ["IN_PROGRESS", "CANCELLED"];
    case "IN_PROGRESS":
      return ["COMPLETED", "CANCELLED"];
    default:
      return [];
  }
};

// Formatar data para exibição
export const formatOrderDate = (dateString: string | null): string => {
  if (!dateString) return "Data não definida";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Formatar valor monetário
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
