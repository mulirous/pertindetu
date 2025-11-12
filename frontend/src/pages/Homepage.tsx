import { useState, useEffect } from "react";
import CarouselSection from "../components/carousel-section";
import CategoriesSection from "../components/categories-section";
import Footer from "../components/footer";
import Header from "../components/header";
import HeroSection from "../components/hero-section";
import { servicesApi, type ServiceData } from "../api";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [recentServices, setRecentServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Buscar serviços mais recentes
      const servicesData = await servicesApi.getPublic({}, 0, 8);
      setRecentServices(servicesData.content || []);
    } catch (error) {
      console.error("Erro ao carregar dados da homepage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Converter serviços para o formato do carousel
  const servicesItems = recentServices.map((service) => ({
    id: service.id,
    image:
      service.media && service.media.length > 0
        ? service.media[0].mediaUrl
        : "/placeholder-service.jpg",
    title: service.title,
    category: service.category.name,
    rating: 4.5, // Poderia vir da API de reviews
    reviews: 0,
    distance: 0,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        {servicesItems.length > 0 && (
          <>
            <CarouselSection
              title="Serviços Disponíveis"
              items={servicesItems.slice(0, 4)}
            />
            {servicesItems.length > 4 && (
              <CarouselSection
                title="Mais Serviços"
                items={servicesItems.slice(4, 8)}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
