import { OrderCard } from "./OrderCard";
import { Button } from "./ui/button";
import type { OrderStatus, OrdersPageData } from "../api";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface OrdersListProps {
  orders: OrdersPageData | null;
  userRole: "client" | "provider";
  isLoading: boolean;
  onUpdateStatus?: (orderId: number, newStatus: OrderStatus) => void;
  onCancel?: (orderId: number) => void;
  onViewDetails?: (orderId: number) => void;
  onPageChange?: (page: number) => void;
}

export function OrdersList({
  orders,
  userRole,
  isLoading,
  onUpdateStatus,
  onCancel,
  onViewDetails,
  onPageChange,
}: OrdersListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders || orders.content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {userRole === "client"
            ? "Você ainda não tem pedidos."
            : "Você ainda não recebeu pedidos."}
        </p>
      </div>
    );
  }

  const currentPage = orders.number;
  const totalPages = orders.totalPages;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  return (
    <div className="space-y-6">
      {/* Lista de pedidos */}
      <div className="grid gap-4">
        {orders.content.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            userRole={userRole}
            onUpdateStatus={onUpdateStatus}
            onCancel={onCancel}
            onViewDetails={(orderId) => {
              console.log("📤 OrdersList propagando onViewDetails:", orderId);
              onViewDetails?.(orderId);
            }}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages} ({orders.totalElements}{" "}
            {orders.totalElements === 1 ? "pedido" : "pedidos"})
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={!hasPreviousPage}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={!hasNextPage}>
              Próxima
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
