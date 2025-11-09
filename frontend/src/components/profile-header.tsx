import { Star } from "lucide-react"
import Image from "next/image"

interface ProfileHeaderProps {
  storeName: string
  ownerName: string
  rating: number
  reviews: number
  tags: string[]
  imageUrl: string
}

export default function ProfileHeader({ storeName, ownerName, rating, reviews, tags, imageUrl }: ProfileHeaderProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex gap-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={storeName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{storeName}</h1>
          <p className="text-sm text-muted-foreground mb-3">{ownerName}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < fullStars
                      ? "fill-amber-400 text-amber-400"
                      : i === fullStars && hasHalfStar
                        ? "fill-amber-200 text-amber-400"
                        : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews} avaliações)</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
