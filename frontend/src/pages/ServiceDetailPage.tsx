import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicesApi, type ServiceData } from "../api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { OrderForm } from "../components/OrderForm";
import { formatCurrency } from "../utils/orderHelpers";
import {
  Clock,
  Star,
  User,
  ChevronLeft,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
} from "lucide-react";

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await servicesApi.getById(Number(id));
      setService(data);
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);
      alert("Erro ao carregar detalhes do serviço");
      navigate("/services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProvider = () => {
    if (service) {
      navigate(`/providers/${service.provider.id}`);
    }
  };

  const handleOrderSuccess = () => {
    setShowOrderForm(false);
    alert("Pedido criado! Acompanhe em 'Meus Pedidos'");
    navigate("/my-orders");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          Serviço não encontrado
        </p>
      </div>
    );
  }

  const hasImages = service.media && service.media.length > 0;
  const currentImage =
    hasImages && service.media ? service.media[selectedImage] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botão Voltar */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal - Imagens e Descrição */}
        <div className="lg:col-span-2 space-y-6">
          {/* Galeria de Imagens */}
          <Card className="overflow-hidden">
            {hasImages ? (
              <>
                {/* Imagem Principal */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={currentImage?.mediaUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Miniaturas */}
                {service.media && service.media.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {service.media.map((media, index) => (
                      <button
                        key={media.id}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={media.mediaUrl}
                          alt={`${service.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-primary/40" />
              </div>
            )}
          </Card>

          {/* Informações do Serviço */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {service.category.name}
                  </span>
                  {service.active && (
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Disponível
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Descrição
                </h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>Duração média: {service.avgDuration}h</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card do Prestador */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Sobre o Prestador
            </h3>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-lg">
                    {service.provider.bio || "Prestador de serviços"}
                  </p>
                  {service.provider.verified && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ID: #{service.provider.id}
                </p>
              </div>
              <Button variant="outline" onClick={handleViewProvider}>
                Ver Perfil
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar - Preço e Ação */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {!showOrderForm ? (
              <Card className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    Preço base
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(service.basePrice)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    * O valor final pode variar
                  </p>
                </div>

                {user ? (
                  <Button
                    onClick={() => setShowOrderForm(true)}
                    className="w-full"
                    size="lg"
                  >
                    Solicitar Serviço
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                      Faça login para solicitar este serviço
                    </p>
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full"
                      size="lg"
                    >
                      Fazer Login
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <OrderForm
                serviceId={service.id}
                providerId={service.provider.id}
                serviceName={service.title}
                basePrice={service.basePrice}
                onSuccess={handleOrderSuccess}
                onCancel={() => setShowOrderForm(false)}
              />
            )}

            {/* Informações Adicionais */}
            <Card className="p-6">
              <h4 className="font-semibold mb-3">Informações</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Pagamento após confirmação</p>
                <p>✓ Acompanhe o status do pedido</p>
                <p>✓ Comunicação direta com o prestador</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
