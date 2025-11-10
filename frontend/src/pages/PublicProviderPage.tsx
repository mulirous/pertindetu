import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, servicesApi, type ServicesPageData } from "../api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatCurrency } from "../utils/orderHelpers";
import {
  CheckCircle,
  Briefcase,
  ChevronLeft,
  Loader2,
  Star,
} from "lucide-react";

interface ProviderPublicData {
  id: number;
  bio: string;
  verified: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export function PublicProviderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<ProviderPublicData | null>(null);
  const [services, setServices] = useState<ServicesPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (id) {
      loadProvider();
      loadServices();
    }
  }, [id, currentPage]);

  const loadProvider = async () => {
    if (!id) return;

    try {
      const response = await api.get<ProviderPublicData>(
        `/providers/${id}/public`
      );
      setProvider(response.data);
    } catch (error) {
      console.error("Erro ao carregar prestador:", error);
      alert("Erro ao carregar informações do prestador");
      navigate("/services");
    }
  };

  const loadServices = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await servicesApi.getPublic(
        { providerId: Number(id) },
        currentPage,
        12
      );
      setServices(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewService = (serviceId: number) => {
    navigate(`/services/${serviceId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botão Voltar */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Card do Prestador */}
      <Card className="p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {provider.user.name[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">{provider.user.name}</h1>
                  {provider.verified && (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Prestador de Serviços
                </p>
              </div>
            </div>

            {provider.bio && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Sobre</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {provider.bio}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <p className="text-3xl font-bold text-primary">
              {services?.totalElements || 0}
            </p>
            <p className="text-sm text-muted-foreground">Serviços Oferecidos</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <p className="text-3xl font-bold">4.8</p>
            </div>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {provider.verified ? "Verificado" : "Pendente"}
            </p>
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
        </div>
      </Card>

      {/* Lista de Serviços */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Serviços Oferecidos</h2>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && services && services.content.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Este prestador ainda não cadastrou nenhum serviço.
          </p>
        </div>
      )}

      {!isLoading && services && services.content.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.content.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewService(service.id)}
              >
                {service.media && service.media.length > 0 ? (
                  <img
                    src={service.media[0].mediaUrl}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-4xl">{service.category.name[0]}</span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {service.title}
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {service.category.name}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        A partir de
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(service.basePrice)}
                      </p>
                    </div>
                    <Button size="sm">Ver Detalhes</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {services.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {currentPage + 1} de {services.totalPages} (
                {services.totalElements} serviços)
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= services.totalPages - 1}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
