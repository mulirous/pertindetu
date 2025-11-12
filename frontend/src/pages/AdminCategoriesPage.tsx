import { useEffect, useState } from "react";
import { adminApi, type CategoryData, type CategoryRequestData } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "../components/ui/card";
import { Loader2, Search, Trash2, Package, Plus, X } from "lucide-react";

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryRequestData>({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.categories.getAll();
      // Garante que sempre seja um array
      const categoriesArray = Array.isArray(response) ? response : [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      alert("Erro ao carregar lista de categorias");
      setCategories([]); // Garante array vazio em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminApi.categories.getStats();
      if (response) {
        setStats({
          total: response.total ?? 0,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    const errors: { name?: string } = {};
    if (!newCategory.name.trim()) {
      errors.name = "Nome é obrigatório";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsCreating(true);
    try {
      const created = await adminApi.categories.create(newCategory);
      setCategories([...categories, created]);
      setShowCreateModal(false);
      setNewCategory({ name: "", description: "" });
      setFormErrors({});
      loadStats();
      alert("Categoria criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (category: CategoryData) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await adminApi.categories.delete(categoryToDelete.id);
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      loadStats();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      alert("Erro ao deletar categoria");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((category) => {
        const matchesSearch = category.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
    : [];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gerenciar Categorias</h2>
            <p className="text-muted-foreground">
              Gerencie e visualize todas as categorias de serviços
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total de Categorias
                </p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Categorias Cadastradas
                </p>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-5 h-5" />
              Nova Categoria
            </button>
          </div>
        </Card>

        {/* Categories Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-muted-foreground">
                        Nenhuma categoria encontrada
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {category.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {category.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {category.description || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            title="Deletar categoria">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Results Count */}
        {filteredCategories.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Exibindo {filteredCategories.length} de {stats.total} categorias
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Confirmar Exclusão</h3>
            <p className="text-muted-foreground mb-6">
              Tem certeza que deseja deletar a categoria{" "}
              <strong>{categoryToDelete.name}</strong>? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Deletar
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Nova Categoria</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCategory({ name: "", description: "" });
                  setFormErrors({});
                }}
                disabled={isCreating}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome da Categoria <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: Limpeza"
                  disabled={isCreating}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Descreva os serviços desta categoria..."
                  rows={4}
                  disabled={isCreating}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCategory({ name: "", description: "" });
                    setFormErrors({});
                  }}
                  disabled={isCreating}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Criar Categoria
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
