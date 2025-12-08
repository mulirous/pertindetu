import { useEffect, useState } from "react";
import {
  Loader2,
  Package,
  PlusCircle,
  Eye,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { adminApi, servicesApi, type ServiceData } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function AdminServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Buscar serviços mais recentes
      const servicesData = await servicesApi.getPublic({}, 0, 50);
      setServices(servicesData.content || []);
    } catch (error) {
      console.error("Erro ao carregar dados da homepage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (service: ServiceData) => {
    try {
      await adminApi.services.toggleStatus(service.id);
      loadData();
      if (selectedService?.id === service.id) {
        setSelectedService({ ...service, active: !service.active });
      }
    } catch (error) {
      console.error("Erro ao atualizar status do serviço:", error);
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
            <h2 className="text-3xl font-bold mb-2">Serviços</h2>
            <p className="text-muted-foreground">
              Gerencie os serviços cadastrados no sistema ({services.length}{" "}
              serviços)
            </p>
          </div>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Lista de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Nenhum serviço encontrado.
            </Card>
          ) : (
            services.map((service) => (
              <Card
                key={service.id}
                className="p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {service.description || "Sem descrição"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Categoria:{" "}
                      <span className="font-medium">
                        {service.category?.name || "—"}
                      </span>
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        service.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {service.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-primary">
                      R$ {service.basePrice?.toFixed(2) || "0.00"}
                    </span>
                    <span className="text-muted-foreground">
                      ~{service.avgDuration || 0} min
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedService(service)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button
                      variant={service.active ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleActive(service)}
                      className="flex-1"
                    >
                      {service.active ? (
                        <>
                          <ToggleRight className="w-4 h-4 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Modal de Detalhes */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  {selectedService.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedService(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">ID</label>
                    <p className="font-medium">{selectedService.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Status
                    </label>
                    <p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedService.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedService.active ? "Ativo" : "Inativo"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Preço Base
                    </label>
                    <p className="font-medium text-primary">
                      R$ {selectedService.basePrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Duração Média
                    </label>
                    <p className="font-medium">
                      {selectedService.avgDuration || 0} minutos
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Categoria
                    </label>
                    <p className="font-medium">
                      {selectedService.category?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Prestador
                    </label>
                    <p className="font-medium">
                      ID: {selectedService.provider?.id || "—"}
                      {selectedService.provider?.verified && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Verificado
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    Descrição
                  </label>
                  <p className="mt-1">
                    {selectedService.description || "Sem descrição"}
                  </p>
                </div>

                {selectedService.provider?.bio && (
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Bio do Prestador
                    </label>
                    <p className="mt-1">{selectedService.provider.bio}</p>
                  </div>
                )}

                {selectedService.media && selectedService.media.length > 0 && (
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Mídias ({selectedService.media.length})
                    </label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {selectedService.media.map((m, idx) => (
                        <img
                          key={idx}
                          src={m.mediaUrl}
                          alt={m.shortDescription || `Mídia ${idx + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant={selectedService.active ? "destructive" : "default"}
                    onClick={() => handleToggleActive(selectedService)}
                    className="flex-1"
                  >
                    {selectedService.active
                      ? "Desativar Serviço"
                      : "Ativar Serviço"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    className="flex-1"
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
