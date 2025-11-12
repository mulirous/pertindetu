import {
  Briefcase,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, type AdminStats } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "../components/ui/card";

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      alert("Erro ao carregar estatísticas do dashboard");
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

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Erro ao carregar estatísticas</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} ativos`,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total de Prestadores",
      value: stats.totalProviders,
      subtitle: `${stats.verifiedProviders} verificados`,
      icon: Briefcase,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total de Serviços",
      value: stats.totalServices,
      subtitle: `${stats.activeServices} ativos`,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total de Pedidos",
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pendentes`,
      icon: ShoppingCart,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const orderStats = [
    {
      label: "Pedidos Pendentes",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Pedidos Concluídos",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema e estatísticas em tempo real
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold mb-1">{card.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Orders Stats */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Estatísticas de Pedidos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orderStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 bg-gray-100 rounded-full ${stat.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Activity Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Resumo de Atividades</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Ativação</p>
              <p className="text-lg font-semibold">
                {stats.totalUsers > 0
                  ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Taxa de Verificação
              </p>
              <p className="text-lg font-semibold">
                {stats.totalProviders > 0
                  ? Math.round(
                      (stats.verifiedProviders / stats.totalProviders) * 100
                    )
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serviços Ativos</p>
              <p className="text-lg font-semibold">
                {stats.totalServices > 0
                  ? Math.round(
                      (stats.activeServices / stats.totalServices) * 100
                    )
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-lg font-semibold">
                {stats.totalOrders > 0
                  ? Math.round(
                      (stats.completedOrders / stats.totalOrders) * 100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
