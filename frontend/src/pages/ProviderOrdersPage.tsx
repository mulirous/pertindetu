import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ordersApi, type OrderStatus, type OrdersPageData } from "../api";
import { OrdersList } from "../components/OrdersList";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";

export function ProviderOrdersPage() {
  const { user, provider } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrdersPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const loadOrders = async (page = 0, status: OrderStatus | "ALL" = "ALL") => {
    if (!provider) return;

    setIsLoading(true);
    try {
      let data;
      if (status === "ALL") {
        data = await ordersApi.getByProviderId(provider.id, page, 10);
      } else {
        data = await ordersApi.getByStatus(status, page, 10);
      }
      setOrders(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      alert("Erro ao carregar pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(currentPage, statusFilter);
  }, [provider, currentPage, statusFilter]);

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    if (!provider) return;

    const confirmMessages: Record<string, string> = {
      ACCEPTED: "Confirmar aceitação do pedido?",
      REJECTED: "Tem certeza que deseja rejeitar este pedido?",
      IN_PROGRESS: "Marcar pedido como em andamento?",
      COMPLETED: "Confirmar conclusão do pedido?",
      CANCELLED: "Tem certeza que deseja cancelar este pedido?",
    };

    const message =
      confirmMessages[newStatus] || "Confirmar alteração de status?";
    if (!window.confirm(message)) {
      return;
    }

    try {
      await ordersApi.updateStatus(orderId, { status: newStatus }, provider.id);
      alert("Status atualizado com sucesso!");
      loadOrders(currentPage, statusFilter);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };

  const handleViewDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    const newStatus = status as OrderStatus | "ALL";
    setStatusFilter(newStatus);
    setCurrentPage(0);
  };

  if (!user || !provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          Você precisa ter um perfil de prestador para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pedidos Recebidos</h1>
        <p className="text-muted-foreground">
          Gerencie os pedidos dos seus serviços
        </p>
      </div>

      <Tabs value={statusFilter} onValueChange={handleStatusFilterChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="ALL">Todos</TabsTrigger>
          <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
          <TabsTrigger value="ACCEPTED">Aceitos</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">Em Andamento</TabsTrigger>
          <TabsTrigger value="COMPLETED">Concluídos</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelados</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejeitados</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter}>
          <OrdersList
            orders={orders}
            userRole="provider"
            isLoading={isLoading}
            onUpdateStatus={handleUpdateStatus}
            onViewDetails={handleViewDetails}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
