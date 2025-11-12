import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ordersApi,
  type OrderStatus,
  type OrdersPageData,
  type OrderData,
} from "../api";
import { OrdersList } from "../components/OrdersList";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import Header from "../components/header";
import Footer from "../components/footer";

export function ProviderOrdersPage() {
  const { user, provider } = useAuth();
  const [orders, setOrders] = useState<OrdersPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  console.log("🔐 Auth context:", { user, provider });

  const loadOrders = async (page = 0, status: OrderStatus | "ALL" = "ALL") => {
    if (!provider) {
      console.log("❌ Provider não encontrado");
      return;
    }

    console.log("🔄 Carregando pedidos...", {
      providerId: provider.id,
      page,
      status,
    });
    setIsLoading(true);
    try {
      // Sempre buscar pedidos do provider
      const data = await ordersApi.getByProviderId(provider.id, page, 10);
      console.log("✅ Pedidos carregados:", data);

      // Se tiver filtro de status, filtrar localmente
      if (status !== "ALL") {
        const filtered = {
          ...data,
          content: data.content.filter((order) => order.status === status),
        };
        console.log(
          `📊 Filtrados por ${status}:`,
          filtered.content.length,
          "pedidos"
        );
        setOrders(filtered);
      } else {
        console.log("📊 Todos os pedidos:", data.content.length);
        setOrders(data);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar pedidos:", error);
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
    console.log("🔧 handleUpdateStatus chamado:", {
      orderId,
      newStatus,
      providerId: provider?.id,
    });

    if (!provider) {
      console.error("❌ Provider não encontrado no handleUpdateStatus");
      return;
    }

    const confirmMessages: Record<string, string> = {
      ACCEPTED: "Confirmar aceitação do pedido?",
      REJECTED: "Tem certeza que deseja rejeitar este pedido?",
      IN_PROGRESS: "Marcar pedido como em andamento?",
      COMPLETED: "Confirmar conclusão do pedido?",
      CANCELLED: "Tem certeza que deseja cancelar este pedido?",
    };

    const message =
      confirmMessages[newStatus] || "Confirmar alteração de status?";

    console.log("❓ Mostrando confirmação:", message);

    if (!window.confirm(message)) {
      console.log("❌ Usuário cancelou a operação");
      return;
    }

    console.log("✅ Usuário confirmou, atualizando status...");

    try {
      await ordersApi.updateStatus(orderId, { status: newStatus }, provider.id);
      console.log("✅ Status atualizado com sucesso!");
      alert("Status atualizado com sucesso!");
      loadOrders(currentPage, statusFilter);
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };

  const handleViewDetails = (orderId: number) => {
    console.log("👁️ Visualizar detalhes do pedido:", orderId);
    const order = orders?.content.find((o) => o.id === orderId);
    console.log("📋 Pedido encontrado:", order);
    if (order) {
      setSelectedOrder(order);
      console.log("✅ Modal aberto para pedido:", order.id);
    } else {
      console.error("❌ Pedido não encontrado na lista atual");
    }
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Você precisa ter um perfil de prestador para acessar esta página.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
      <Footer />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          userRole="provider"
        />
      )}
    </div>
  );
}
