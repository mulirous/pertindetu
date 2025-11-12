import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-amber-50 to-yellow-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Bem-vindo ao Pertindetu
        </h1>
        <p className="text-muted-foreground text-xl mb-8">
          Descubra os melhores serviços e profissionais para o seu evento
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/services")}
          className="text-lg px-8 py-6"
        >
          <Search className="w-5 h-5 mr-2" />
          Explorar Serviços
        </Button>
      </div>
    </section>
  );
}
