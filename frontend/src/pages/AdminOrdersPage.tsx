import { useEffect, useState } from "react";
import {
  Loader2,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Eye,
  X,
  User,
  Briefcase,
  Calendar,
  DollarSign,
} from "lucide-react";
import { ordersApi, type OrderData, type OrdersPageData } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data: OrdersPageData = await ordersApi.getAll(0, 50);
      console.log("Retorno da API de pedidos:", data);

      // Garante que o conteúdo é um array
      const content = Array.isArray(data) ? data : data?.content || [];
      setOrders(content);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      alert("Erro ao carregar lista de pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Pedidos</h2>
            <p className="text-muted-foreground">
              Gerencie e acompanhe os pedidos realizados na plataforma (
              {orders.length} pedidos)
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhum pedido encontrado.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pedido #{order.id}
                    </p>
                    <p className="text-xl font-semibold">
                      {order.service?.title || "Serviço não especificado"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full text-primary">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Cliente:</strong>{" "}
                    {order.client?.name || "Usuário desconhecido"}
                  </p>
                  <p>
                    <strong>Prestador:</strong>{" "}
                    {order.provider?.name || "Não informado"}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Valor:</strong>{" "}
                    <span className="text-primary font-medium">
                      R$ {order.value?.toFixed(2) || "0.00"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <StatusBadge status={order.status} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  Pedido #{selectedOrder.id}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>

                {/* Serviço */}
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Serviço
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Título</label>
                      <p className="font-medium">
                        {selectedOrder.service?.title || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Categoria</label>
                      <p className="font-medium">
                        {selectedOrder.service?.categoryName || "—"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-muted-foreground">Descrição</label>
                      <p>
                        {selectedOrder.service?.description || "Sem descrição"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cliente e Prestador */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                      <User className="w-4 h-4" />
                      Cliente
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Nome:</strong>{" "}
                        {selectedOrder.client?.name || "—"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedOrder.client?.email || "—"}
                      </p>
                      <p>
                        <strong>ID:</strong> {selectedOrder.client?.id || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                      <Briefcase className="w-4 h-4" />
                      Prestador
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Nome:</strong>{" "}
                        {selectedOrder.provider?.name || "—"}
                      </p>
                      <p>
                        <strong>Verificado:</strong>{" "}
                        {selectedOrder.provider?.verified ? (
                          <span className="text-green-600">Sim ✓</span>
                        ) : (
                          <span className="text-gray-500">Não</span>
                        )}
                      </p>
                      <p>
                        <strong>ID:</strong> {selectedOrder.provider?.id || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detalhes do Pedido */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-bold text-primary">
                      R$ {selectedOrder.value?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="font-bold">{selectedOrder.quantity || 1}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="font-bold text-sm">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Data Evento</p>
                    <p className="font-bold text-sm">
                      {selectedOrder.eventDate
                        ? new Date(selectedOrder.eventDate).toLocaleDateString(
                            "pt-BR"
                          )
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Observações */}
                {selectedOrder.details && (
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Observações
                    </label>
                    <p className="mt-1 p-3 bg-secondary rounded-lg">
                      {selectedOrder.details}
                    </p>
                  </div>
                )}

                {/* Fechar */}
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = "bg-gray-100 text-gray-700";
  let icon = Clock;

  switch (status) {
    case "PENDING":
      color = "bg-yellow-100 text-yellow-700";
      icon = Clock;
      break;
    case "ACCEPTED":
      color = "bg-blue-100 text-blue-700";
      icon = CheckCircle;
      break;
    case "IN_PROGRESS":
      color = "bg-purple-100 text-purple-700";
      icon = Clock;
      break;
    case "COMPLETED":
      color = "bg-green-100 text-green-700";
      icon = CheckCircle;
      break;
    case "CANCELLED":
    case "REJECTED":
      color = "bg-red-100 text-red-700";
      icon = XCircle;
      break;
    default:
      break;
  }

  const Icon = icon;
  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    ACCEPTED: "Aceito",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
    REJECTED: "Rejeitado",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}
    >
      <Icon className="w-4 h-4" />
      {statusLabels[status] || status}
    </span>
  );
}
