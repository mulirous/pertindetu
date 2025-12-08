import {
  Briefcase,
  CheckCircle,
  Loader2,
  Search,
  ShieldCheck,
  ShieldX,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, type ProviderProfileData } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "../components/ui/card";

export function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [providerToDelete, setProviderToDelete] =
    useState<ProviderProfileData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 👇 Novos estados para estatísticas do backend
  const [stats, setStats] = useState({
    totalProviders: 0,
    verifiedProviders: 0,
    unverifiedProviders: 0,
  });

  useEffect(() => {
    loadProviders();
    loadStats();
  }, []);

  const loadProviders = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.providers.getAll(0, 100);
      setProviders(response.content || []);
    } catch (error) {
      console.error("Erro ao carregar prestadores:", error);
      alert("Erro ao carregar lista de prestadores");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminApi.providers.getStats();
      const total = response.total ?? 0;
      const verified = response.verified ?? 0;
      setStats({
        totalProviders: total,
        verifiedProviders: verified,
        unverifiedProviders: total - verified,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas de prestadores:", error);
    }
  };

  const handleToggleVerification = async (providerId: number) => {
    try {
      const updatedProvider = await adminApi.providers.toggleVerification(
        providerId
      );
      setProviders(
        providers.map((provider) =>
          provider.id === providerId ? updatedProvider : provider
        )
      );
      // 🔄 Atualiza estatísticas após mudança
      loadStats();
    } catch (error) {
      console.error("Erro ao atualizar verificação:", error);
      alert("Erro ao atualizar verificação do prestador");
    }
  };

  const handleDeleteClick = (provider: ProviderProfileData) => {
    setProviderToDelete(provider);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!providerToDelete) return;

    setIsDeleting(true);
    try {
      await adminApi.providers.delete(providerToDelete.id);
      setProviders(providers.filter((p) => p.id !== providerToDelete.id));
      setShowDeleteModal(false);
      setProviderToDelete(null);
      // 🔄 Atualiza estatísticas
      loadStats();
    } catch (error) {
      console.error("Erro ao deletar prestador:", error);
      alert("Erro ao deletar prestador");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const userName = provider.userName || "";
    const bio = provider.bio || "";
    const categories = provider.categories || [];

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.some((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && provider.verified) ||
      (verificationFilter === "unverified" && !provider.verified);

    return matchesSearch && matchesVerification;
  });

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
            <h2 className="text-3xl font-bold mb-2">Gerenciar Prestadores</h2>
            <p className="text-muted-foreground">
              Gerencie e verifique todos os prestadores de serviços
            </p>
          </div>
        </div>

        {/* Stats Cards (agora com dados reais do backend) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total de Prestadores
                </p>
                <p className="text-3xl font-bold">{stats.totalProviders}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Prestadores Verificados
                </p>
                <p className="text-3xl font-bold">{stats.verifiedProviders}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Aguardando Verificação
                </p>
                <p className="text-3xl font-bold">
                  {stats.unverifiedProviders}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <ShieldX className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome, bio ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <select
            value={verificationFilter}
            onChange={(e) =>
              setVerificationFilter(
                e.target.value as "all" | "verified" | "unverified"
              )
            }
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            <option value="all">Todos</option>
            <option value="verified">Verificados</option>
            <option value="unverified">Não Verificados</option>
          </select>
        </div>

        {/* Tabela de Prestadores */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Prestador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Categorias
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Nenhum prestador encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProviders.map((provider) => (
                    <tr key={provider.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {provider.userName || "Sem nome"}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {provider.bio || "Sem descrição"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(provider.categories || [])
                            .slice(0, 2)
                            .map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                              >
                                {cat.name}
                              </span>
                            ))}
                          {(provider.categories || []).length > 2 && (
                            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                              +{provider.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {provider.verified ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleToggleVerification(provider.id)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              provider.verified
                                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                : "bg-green-100 text-green-600 hover:bg-green-200"
                            }`}
                            title={
                              provider.verified
                                ? "Remover verificação"
                                : "Verificar prestador"
                            }
                          >
                            {provider.verified ? (
                              <ShieldX className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(provider)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Excluir prestador"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && providerToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
              <p className="text-muted-foreground mb-4">
                Tem certeza que deseja excluir o prestador{" "}
                <strong>{providerToDelete.userName || "Sem nome"}</strong>? Esta
                ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProviderToDelete(null);
                  }}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
