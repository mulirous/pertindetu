import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  servicesApi,
  categoriesApi,
  type ServicesPageData,
  type ServiceFilters,
  type CategoryData,
} from "../api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2, Search, Filter, X } from "lucide-react";
import { formatCurrency } from "../utils/orderHelpers";
import Header from "../components/header";
import Footer from "../components/footer";

export function ServicesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState<ServicesPageData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<ServiceFilters>({
    categoryId: searchParams.get("category")
      ? Number(searchParams.get("category"))
      : undefined,
    search: searchParams.get("search") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  });

  const loadServices = async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await servicesApi.getPublic(filters, page, 12);
      setServices(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      alert("Erro ao carregar serviços");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadServices(currentPage);

    // Atualizar URL com filtros
    const params: any = {};
    if (filters.categoryId) params.category = filters.categoryId;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    setSearchParams(params);
  }, [filters, currentPage]);

  const handleFilterChange = (key: keyof ServiceFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(0);
  };

  const handleViewService = (serviceId: number) => {
    navigate(`/services/${serviceId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Serviços Disponíveis</h1>
          <p className="text-muted-foreground">
            Encontre o profissional perfeito para o seu evento
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar serviços..."
                value={filters.search || ""}
                onChange={(e) =>
                  handleFilterChange("search", e.target.value || undefined)
                }
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <Card className="p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Filtros Avançados</h3>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Categoria
                  </label>
                  <select
                    value={filters.categoryId || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "categoryId",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preço Mínimo */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preço Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="R$ 0"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Preço Máximo */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preço Máximo
                  </label>
                  <input
                    type="number"
                    placeholder="R$ 10000"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && services && services.content.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum serviço encontrado com os filtros aplicados.
            </p>
          </div>
        )}

        {/* Grid de Serviços */}
        {!isLoading && services && services.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.content.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewService(service.id)}
                >
                  {/* Imagem do serviço */}
                  {service.media && service.media.length > 0 ? (
                    <img
                      src={service.media[0].mediaUrl}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl">
                        {service.category.name[0]}
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {service.title}
                      </h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {service.category.name}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          A partir de
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(service.basePrice)}
                        </p>
                      </div>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            {services.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Página {currentPage + 1} de {services.totalPages} (
                  {services.totalElements} serviços)
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= services.totalPages - 1}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
