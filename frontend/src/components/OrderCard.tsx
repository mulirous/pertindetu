import { Card } from "./ui/card";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Button } from "./ui/button";
import type { OrderData, OrderStatus } from "../api";
import {
  formatOrderDate,
  formatCurrency,
  canClientCancel,
  canProviderUpdateStatus,
  getNextStatuses,
} from "../utils/orderHelpers";
import { Calendar, MapPin, User, Briefcase, X } from "lucide-react";

interface OrderCardProps {
  order: OrderData;
  userRole: "client" | "provider";
  onUpdateStatus?: (orderId: number, newStatus: OrderStatus) => void;
  onCancel?: (orderId: number) => void;
  onViewDetails?: (orderId: number) => void;
}

export function OrderCard({
  order,
  userRole,
  onUpdateStatus,
  onCancel,
  onViewDetails,
}: OrderCardProps) {
  const showCancelButton =
    userRole === "client" && canClientCancel(order.status);
  const showStatusActions =
    userRole === "provider" && canProviderUpdateStatus(order.status);
  const nextStatuses = getNextStatuses(order.status);

  console.log("🎴 OrderCard renderizado:", {
    orderId: order.id,
    status: order.status,
    userRole,
    showStatusActions,
    nextStatuses,
    hasUpdateStatusHandler: !!onUpdateStatus,
  });

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{order.service.title}</h3>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(order.value * order.quantity)}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.quantity}x {formatCurrency(order.value)}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        {userRole === "client" ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>
              Prestador: {order.provider.name}
              {order.provider.verified && " ✓"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>
              Cliente: {order.client.name} - {order.client.email}
            </span>
          </div>
        )}

        {order.eventDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Data do evento: {formatOrderDate(order.eventDate)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Categoria: {order.service.categoryName}</span>
        </div>
      </div>

      {order.details && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Detalhes:</span> {order.details}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Criado em {formatOrderDate(order.createdAt)}
        </p>

        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(
                  "🔘 OrderCard: Botão Detalhes clicado, orderId:",
                  order.id
                );
                console.log(
                  "🔘 OrderCard: onViewDetails existe?",
                  !!onViewDetails
                );
                onViewDetails(order.id);
              }}>
              Detalhes
            </Button>
          )}

          {showCancelButton && onCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(order.id)}>
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
          )}

          {showStatusActions && onUpdateStatus && (
            <>
              {nextStatuses.map((status) => (
                <Button
                  key={status}
                  variant={
                    status.includes("REJECT") || status.includes("CANCEL")
                      ? "destructive"
                      : "default"
                  }
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("🔄 Botão de status clicado:", {
                      orderId: order.id,
                      newStatus: status,
                    });
                    onUpdateStatus(order.id, status);
                  }}>
                  {status === "ACCEPTED" && "Aceitar"}
                  {status === "REJECTED" && "Rejeitar"}
                  {status === "IN_PROGRESS" && "Iniciar"}
                  {status === "COMPLETED" && "Concluir"}
                  {status === "CANCELLED" && "Cancelar"}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
