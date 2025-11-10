import { Package, Sparkles, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    icon: UtensilsCrossed,
    title: "Comida e Hobbie",
    description: "Comidas feitas na sua cozinha",
    color: "bg-yellow-100",
  },
  {
    id: 2,
    icon: Package,
    title: "Artesanato",
    description: "Artigos feitos mano na sua criatividade",
    color: "bg-orange-100",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Serviços",
    description: "Cuide-se com o maior cuidado",
    color: "bg-pink-100",
  },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Categorias Populares
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`${category.color} rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow duration-200`}
              >
                <IconComponent className="w-10 h-10 text-foreground mb-3" />
                <h3 className="font-semibold text-foreground text-base mb-1">
                  {category.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Ver Todas Categorias */}
        <div className="text-center">
          <button
            onClick={() => navigate("/services")}
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            VER TODAS AS CATEGORIAS
          </button>
        </div>
      </div>
    </section>
  );
}
