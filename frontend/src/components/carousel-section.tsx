import { ChevronRight } from "lucide-react"
import { useRef } from "react"
import ProductCard from "./product-card"

interface CarouselSectionProps {
  title: string
  items: Array<{
    id: number
    image: string
    title: string
    category: string
    rating: number
    reviews: number
    distance: number
  }>
}

export default function CarouselSection({ title, items }: CarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
            Ver Tudo <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)] [mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)]"
          >
            {items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-64">
                <ProductCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
