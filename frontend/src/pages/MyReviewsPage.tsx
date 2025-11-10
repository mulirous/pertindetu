import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reviewsApi, type ReviewsPageData, type ReviewData } from "../api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ReviewsList } from "../components/ReviewsList";
import { ReviewForm } from "../components/ReviewForm";
import { Star, Loader2, ChevronLeft } from "lucide-react";

export function MyReviewsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reviews, setReviews] = useState<ReviewsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Estado para edição
  const [editingReview, setEditingReview] = useState<ReviewData | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadReviews();
    } else {
      navigate("/login");
    }
  }, [user]);

  const loadReviews = async (page = 0) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await reviewsApi.getByUserId(user.id, page, 10);
      setReviews(data);
      setCurrentPage(page);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      alert("Erro ao carregar suas avaliações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (review: ReviewData) => {
    setEditingReview(review);
    setShowEditForm(true);
  };

  const handleDelete = async (reviewId: number) => {
    if (!user) return;

    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) {
      return;
    }

    try {
      await reviewsApi.delete(reviewId, user.id);
      alert("Avaliação excluída com sucesso!");
      loadReviews(currentPage);
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      alert("Erro ao excluir avaliação");
    }
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setEditingReview(null);
    loadReviews(currentPage);
    alert("Avaliação atualizada com sucesso!");
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingReview(null);
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

        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Minhas Avaliações</h1>
            <p className="text-muted-foreground">
              Gerencie suas avaliações de serviços
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      {showEditForm && editingReview && user && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Editar Avaliação</h2>
          <ReviewForm
            orderId={editingReview.orderId}
            userId={user.id}
            serviceId={editingReview.service.id}
            serviceName={editingReview.service.title}
            reviewId={editingReview.id}
            initialRating={editingReview.rating}
            initialComment={editingReview.comment || undefined}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
          />
        </Card>
      )}

      {/* Lista de Avaliações */}
      {!showEditForm && reviews && (
        <Card className="p-6">
          <ReviewsList
            reviews={reviews}
            isLoading={isLoading}
            showService={true}
            showUser={false}
            canEdit={true}
            canDelete={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={(page) => loadReviews(page)}
          />

          {reviews.totalElements === 0 && (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Você ainda não avaliou nenhum serviço
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete um pedido e avalie o serviço recebido
              </p>
              <Button onClick={() => navigate("/services")}>
                Explorar Serviços
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
