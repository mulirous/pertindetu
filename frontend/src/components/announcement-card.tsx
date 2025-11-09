import { Card } from "@/components/ui/card"
import { Star, X } from "lucide-react"
import { useState } from "react"

interface AnnouncementCardProps {
  announcement: {
    id: string
    image: string
    title: string
    category: string
    rating: number
    reviews: number
    price: string
  }
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isDeleted, setIsDeleted] = useState(false)

  if (isDeleted) return null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="relative">
        <img
          src={announcement.image || "/placeholder.svg"}
          alt={announcement.title}
          className="w-full h-48 object-cover"
        />

        {/* Delete Button */}
        <button
          onClick={() => setIsDeleted(true)}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:shadow-md transition-all hover:bg-neutral-100"
        >
          <X size={16} className="text-neutral-600" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 truncate">{announcement.title}</h3>

        <p className="text-sm text-neutral-600 mb-3">{announcement.category}</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(announcement.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-300"}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-600">({announcement.reviews})</span>
        </div>

        <p className="text-sm font-medium text-neutral-900 mt-2">{announcement.price}</p>
      </div>
    </Card>
  )
}
