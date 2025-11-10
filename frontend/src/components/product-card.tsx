import { Star } from "lucide-react"

interface ProductCardProps {
  image: string
  title: string
  category: string
  rating: number
  reviews: number
  distance: number
}

export default function ProductCard({ image, title, category, rating, reviews, distance }: ProductCardProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="bg-card rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{category}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < fullStars
                    ? "fill-amber-400 text-amber-400"
                    : i === fullStars && hasHalfStar
                      ? "fill-amber-400 text-amber-400 opacity-50"
                      : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Distance */}
        <p className="text-xs text-muted-foreground">📍 {distance} km</p>
      </div>
    </div>
  )
}
