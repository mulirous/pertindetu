import { useState, useEffect } from "react";
import { Package, Sparkles, UtensilsCrossed, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categoriesApi, type CategoryData } from "../api";

// Ícones padrão para categorias
const categoryIcons = [UtensilsCrossed, Package, Sparkles];

const getCategoryColor = (index: number) => {
  const colors = [
    "bg-yellow-100",
    "bg-orange-100",
    "bg-pink-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
  ];
  return colors[index % colors.length];
};

export default function CategoriesSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/services?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Limitar a 6 categorias na homepage
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Categorias Populares
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {displayCategories.map((category, index) => {
            const IconComponent = categoryIcons[index % categoryIcons.length];
            const colorClass = getCategoryColor(index);

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`${colorClass} rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow duration-200`}
              >
                <IconComponent className="w-10 h-10 text-foreground mb-3" />
                <h3 className="font-semibold text-foreground text-base mb-1">
                  {category.name}
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
