import { AnnouncementCard } from "@/components/announcement-card"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useRef, useState } from "react"

interface Announcement {
  id: string
  image: string
  title: string
  category: string
  rating: number
  reviews: number
  price: string
}

export function AnnouncementsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const announcements: Announcement[] = [
    {
      id: "1",
      image: "/decadent-chocolate-cake.png",
      title: "Delícias da Lúcia",
      category: "Confeitaria especial",
      rating: 4.8,
      reviews: 156,
      price: "1.2 km",
    },
    {
      id: "2",
      image: "/jewelry-necklace.jpg",
      title: "Delícias da Lúcia",
      category: "Confeitaria especial",
      rating: 4.8,
      reviews: 98,
      price: "1.2 km",
    },
    {
      id: "3",
      image: "/makeup-cosmetics-flatlay.png",
      title: "Delícias da Lúcia",
      category: "Confeitaria especial",
      rating: 4.8,
      reviews: 156,
      price: "1.2 km",
    },
  ]

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 320
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-neutral-900">Seus anúncios</h2>
          <button className="p-1 hover:bg-neutral-200 rounded transition-colors">
            <Plus size={20} className="text-neutral-600" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        >
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex-shrink-0 w-64">
              <AnnouncementCard announcement={announcement} />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow hover:shadow-md transition-all"
          >
            <ChevronLeft size={20} className="text-neutral-600" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow hover:shadow-md transition-all"
          >
            <ChevronRight size={20} className="text-neutral-600" />
          </button>
        )}
      </div>
    </div>
  )
}
