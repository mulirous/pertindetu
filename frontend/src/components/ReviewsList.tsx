import { ReviewCard } from "./ReviewCard";
import { Button } from "./ui/button";
import type { ReviewData, ReviewsPageData } from "../api";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface ReviewsListProps {
  reviews: ReviewsPageData | null;
  isLoading: boolean;
  showService?: boolean;
  showUser?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (review: ReviewData) => void;
  onDelete?: (reviewId: number) => void;
  onPageChange?: (page: number) => void;
}

export function ReviewsList({
  reviews,
  isLoading,
  showService = true,
  showUser = true,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  onPageChange,
}: ReviewsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reviews || reviews.content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Nenhuma avaliação encontrada.
        </p>
      </div>
    );
  }

  const currentPage = reviews.number;
  const totalPages = reviews.totalPages;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  return (
    <div className="space-y-6">
      {/* Lista de reviews */}
      <div className="space-y-4">
        {reviews.content.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showService={showService}
            showUser={showUser}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages} ({reviews.totalElements}{" "}
            {reviews.totalElements === 1 ? "avaliação" : "avaliações"})
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={!hasPreviousPage}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={!hasNextPage}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
