import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { StarRating } from "./StarRating";
import type { ReviewData } from "../api";
import { formatOrderDate } from "../utils/orderHelpers";
import { User, Edit, Trash2 } from "lucide-react";

interface ReviewCardProps {
  review: ReviewData;
  showService?: boolean;
  showUser?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (review: ReviewData) => void;
  onDelete?: (reviewId: number) => void;
}

export function ReviewCard({
  review,
  showService = true,
  showUser = true,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {showUser && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{review.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatOrderDate(review.createdAt)}
                  </p>
                </div>
              </div>
            )}
            {!showUser && (
              <p className="text-xs text-muted-foreground">
                {formatOrderDate(review.createdAt)}
              </p>
            )}
          </div>

          <StarRating rating={review.rating} size="sm" />

          {showService && (
            <p className="text-sm text-muted-foreground mt-2">
              Serviço: <span className="font-medium">{review.service.title}</span>
              <span className="text-xs ml-2">({review.service.categoryName})</span>
            </p>
          )}
        </div>

        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(review.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        )}
      </div>

      {review.comment && (
        <p className="text-sm text-foreground mt-2">{review.comment}</p>
      )}
    </Card>
  );
}
