import CarouselSection from "../components/carousel-section"
import CategoriesSection from "../components/categories-section"
import Footer from "../components/footer"
import Header from "../components/header"
import HeroSection from "../components/hero-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CarouselSection title="Descobertas Perto de Você" items={nearbyItems} />
        <CategoriesSection />
        <CarouselSection title="Em Alta Agora" items={trendingItems} />
        <CarouselSection title="Avaliações Recentes" items={recentReviewsItems} />
      </main>
      <Footer />
    </div>
  )
}

const nearbyItems = [
  {
    id: 1,
    image: "/decadent-chocolate-cake.png",
    title: "Delícias da Lúcia",
    category: "Doces e Artesanato",
    rating: 4.8,
    reviews: 348,
    distance: 1.2,
  },
  {
    id: 2,
    image: "/jewelry-necklace.jpg",
    title: "Pulseiras Artesanais",
    category: "A Roupa Imperial",
    rating: 4.6,
    reviews: 123,
    distance: 2.1,
  },
  {
    id: 3,
    image: "/makeup-cosmetics-flatlay.png",
    title: "Coisas do P1",
    category: "Cosméticos Virais",
    rating: 4.6,
    reviews: 256,
    distance: 2.3,
  },
  {
    id: 4,
    image: "/handmade-craft.jpg",
    title: "Arte Manual",
    category: "Artesanato Premium",
    rating: 4.7,
    reviews: 189,
    distance: 3.5,
  },
]

const trendingItems = [
  {
    id: 5,
    image: "/chocolate-cake-dessert.jpg",
    title: "Delícias da Lúcia",
    category: "Doces Artesanais",
    rating: 4.8,
    reviews: 780,
    distance: 1.2,
  },
  {
    id: 6,
    image: "/elegant-jewelry.jpg",
    title: "Pulseiras Artesanais",
    category: "Jóias Premium",
    rating: 4.6,
    reviews: 432,
    distance: 2.1,
  },
  {
    id: 7,
    image: "/assorted-cosmetics.png",
    title: "Coisas do P1",
    category: "Cosméticos Virais",
    rating: 4.6,
    reviews: 556,
    distance: 2.3,
  },
]

const recentReviewsItems = [
  {
    id: 8,
    image: "/delicious-cake.jpg",
    title: "Delícias da Lúcia",
    category: "Doces Artesanais",
    rating: 4.7,
    reviews: 1423,
    distance: 1.2,
  },
  {
    id: 9,
    image: "/silver-jewelry-accessories.jpg",
    title: "Pulseiras Artesanais",
    category: "A roupa imperial",
    rating: 4.6,
    reviews: 892,
    distance: 2.1,
  },
  {
    id: 10,
    image: "/makeup-cosmetics-palette.jpg",
    title: "Coisas do P1",
    category: "Cosméticos Virais",
    rating: 4.6,
    reviews: 2123,
    distance: 2.3,
  },
]
