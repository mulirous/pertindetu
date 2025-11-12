import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderData } from "../api";
import { formatOrderDate, formatCurrency } from "../utils/orderHelpers";
import {
  X,
  Calendar,
  MapPin,
  User,
  Briefcase,
  Mail,
  DollarSign,
  Package,
  FileText,
} from "lucide-react";

interface OrderDetailsModalProps {
  order: OrderData;
  onClose: () => void;
  userRole: "client" | "provider";
}

export function OrderDetailsModal({
  order,
  onClose,
  userRole,
}: OrderDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Detalhes do Pedido #{order.id}
            </h2>
            <p className="text-sm text-muted-foreground">
              Criado em {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Status do Pedido
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Serviço */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Serviço
            </h3>
            <Card className="p-4 bg-gray-50">
              <p className="font-bold text-lg">{order.service.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.service.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Categoria: {order.service.categoryName}</span>
              </div>
            </Card>
          </div>

          {/* Cliente (se for provider) ou Prestador (se for cliente) */}
          {userRole === "provider" ? (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Informações do Cliente
              </h3>
              <Card className="p-4 bg-gray-50">
                <p className="font-semibold">{order.client.name}</p>
                <div className="space-y-1 mt-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{order.client.email}</span>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Informações do Prestador
              </h3>
              <Card className="p-4 bg-gray-50">
                <p className="font-semibold">
                  {order.provider.name}
                  {order.provider.verified && (
                    <span className="ml-2 text-green-600">✓ Verificado</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.provider.bio}
                </p>
              </Card>
            </div>
          )}

          {/* Valores */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valores
            </h3>
            <Card className="p-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Preço unitário:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order.value)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantidade:
                  </span>
                  <span className="font-medium">{order.quantity}x</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(order.value * order.quantity)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Data do Evento */}
          {order.eventDate && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data do Evento
              </h3>
              <Card className="p-4 bg-gray-50">
                <p className="font-medium">
                  {formatOrderDate(order.eventDate)}
                </p>
              </Card>
            </div>
          )}

          {/* Detalhes/Observações */}
          {order.details && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Detalhes / Observações
              </h3>
              <Card className="p-4 bg-gray-50">
                <p className="text-sm whitespace-pre-wrap">{order.details}</p>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </Card>
    </div>
  );
}
