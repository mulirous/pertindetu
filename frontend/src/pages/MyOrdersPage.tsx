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
import Header from "../components/header";
import Footer from "../components/footer";

export function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrdersPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const loadOrders = async (page = 0, status: OrderStatus | "ALL" = "ALL") => {
    if (!user) return;

    setIsLoading(true);
    try {
      let data;
      if (status === "ALL") {
        data = await ordersApi.getByClientId(user.id, page, 10);
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
  }, [user, currentPage, statusFilter]);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) {
      return;
    }

    if (!user) return;

    try {
      await ordersApi.cancel(orderId, user.id);
      alert("Pedido cancelado com sucesso!");
      loadOrders(currentPage, statusFilter);
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      alert("Erro ao cancelar pedido");
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Você precisa estar logado para ver seus pedidos.
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
          <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">
            Acompanhe o status dos seus pedidos de serviços
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
              userRole="client"
              isLoading={isLoading}
              onCancel={handleCancelOrder}
              onViewDetails={handleViewDetails}
              onPageChange={handlePageChange}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
