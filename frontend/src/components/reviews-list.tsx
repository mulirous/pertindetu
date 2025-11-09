import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: string
  text: string
  rating: number
  reviewer: string
  date: string
}

export function ReviewsList() {
  const reviews: Review[] = [
    {
      id: "1",
      text: "Muito bom! Vós comprar novamente, super honesto!",
      rating: 4,
      reviewer: "Matheus Fernandes",
      date: "10/10/25",
    },
    {
      id: "2",
      text: "Muito bom! Vós comprar novamente, super honesto!",
      rating: 4,
      reviewer: "Matheus Fernandes",
      date: "08/10/25",
    },
    {
      id: "3",
      text: "Muito bom! Vós comprar novamente, super honesto!",
      rating: 4,
      reviewer: "Matheus Fernandes",
      date: "05/10/25",
    },
    {
      id: "4",
      text: "Muito bom! Vós comprar novamente, super honesto!",
      rating: 4,
      reviewer: "Matheus Fernandes",
      date: "02/10/25",
    },
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Últimas avaliações recebidas</h2>
        <button className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Avaliações ↓</button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {reviews.map((review) => (
          <div key={review.id} className="pb-4 border-b border-neutral-200 last:border-0">
            <p className="text-neutral-700 text-sm mb-3">"{review.text}"</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-neutral-900">{review.rating}.0</span>
              </div>

              <div className="text-right">
                <p className="text-xs text-neutral-600">{review.date}</p>
                <p className="text-sm font-medium text-neutral-900">{review.reviewer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
