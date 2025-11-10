import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { StarRating } from "./StarRating";
import { reviewsApi, type ReviewCreateData } from "../api";

interface ReviewFormProps {
  orderId: number;
  userId: number;
  serviceId: number;
  serviceName: string;
  initialRating?: number;
  initialComment?: string;
  reviewId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  orderId,
  userId,
  serviceId,
  serviceName,
  initialRating = 0,
  initialComment = "",
  reviewId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!reviewId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Por favor, selecione uma avaliação");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: ReviewCreateData = {
        rating,
        comment: comment || undefined,
        orderId,
        userId,
        serviceId,
      };

      if (isEditing) {
        await reviewsApi.update(reviewId, reviewData);
        alert("Avaliação atualizada com sucesso!");
      } else {
        await reviewsApi.create(reviewData);
        alert("Avaliação enviada com sucesso!");
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao enviar avaliação. Tente novamente.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? "Editar Avaliação" : "Avaliar Serviço"}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">{serviceName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Avaliação <span className="text-red-500">*</span>
          </label>
          <StarRating
            rating={rating}
            editable
            onChange={setRating}
            size="lg"
            showNumber
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Compartilhe sua experiência com este serviço..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting
              ? "Enviando..."
              : isEditing
              ? "Atualizar Avaliação"
              : "Enviar Avaliação"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
