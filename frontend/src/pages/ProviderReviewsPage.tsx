import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reviewsApi, type ReviewsPageData } from "../api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ReviewsList } from "../components/ReviewsList";
import { StarRating } from "../components/StarRating";
import { Star, Loader2, ChevronLeft, TrendingUp } from "lucide-react";

export function ProviderReviewsPage() {
  const navigate = useNavigate();
  const { user, provider } = useAuth();

  const [reviews, setReviews] = useState<ReviewsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    if (provider?.id) {
      loadReviews();
      loadStats();
    } else if (user && !provider) {
      navigate("/");
      alert("Você precisa ser um prestador para acessar esta página");
    }
  }, [user, provider]);

  const loadReviews = async (page = 0) => {
    if (!provider?.id) return;

    setIsLoading(true);
    try {
      const data = await reviewsApi.getByProviderId(provider.id, page, 10);
      setReviews(data);
      setTotalReviews(data.totalElements);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      alert("Erro ao carregar avaliações recebidas");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!provider?.id) return;

    try {
      const average = await reviewsApi.getAverageByProviderId(provider.id);
      setAverageRating(average);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Star className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Avaliações Recebidas</h1>
            <p className="text-muted-foreground">
              Veja o que seus clientes estão dizendo sobre seus serviços
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        {totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avaliação Média
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={averageRating} size="lg" />
                    <span className="text-2xl font-bold">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Avaliações
                  </p>
                  <p className="text-2xl font-bold mt-1">{totalReviews}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Lista de Avaliações */}
      {reviews && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Todas as Avaliações</h2>

          <ReviewsList
            reviews={reviews}
            isLoading={isLoading}
            showService={true}
            showUser={true}
            canEdit={false}
            canDelete={false}
            onPageChange={(page) => loadReviews(page)}
          />

          {reviews.totalElements === 0 && (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Ainda não há avaliações
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete seus primeiros pedidos e receba feedback dos seus
                clientes
              </p>
              <Button onClick={() => navigate("/provider/orders")}>
                Ver Pedidos
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
