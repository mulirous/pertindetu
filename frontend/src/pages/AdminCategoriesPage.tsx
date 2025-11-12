import { useEffect, useState } from 'react'
import { adminApi, type CategoryData } from '../api'
import { AdminLayout } from '../components/AdminLayout'
import { Card } from '../components/ui/card'
import { Loader2, Search, Trash2, Package, Eye, EyeOff } from 'lucide-react'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })

  useEffect(() => {
    loadCategories()
    loadStats()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const response = await adminApi.categories.getAll(0, 100)
      setCategories(response.content || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      alert('Erro ao carregar lista de categorias')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = (await adminApi.categories.getStats()) as {
        total: number
        active: number
        inactive: number
      }
      if (response) {
        setStats({
          total: response.total ?? 0,
          active: response.active ?? 0,
          inactive: response.inactive ?? 0
        })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleToggleStatus = async (categoryId: number) => {
    try {
      const updatedCategory = await adminApi.categories.toggleStatus(categoryId)
      setCategories(
        categories.map(cat => (cat.id === categoryId ? updatedCategory : cat))
      )
      loadStats()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status da categoria')
    }
  }

  const handleDeleteClick = (category: CategoryData) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)
    try {
      await adminApi.categories.delete(categoryToDelete.id)
      setCategories(categories.filter(c => c.id !== categoryToDelete.id))
      loadStats()
      setShowDeleteModal(false)
      setCategoryToDelete(null)
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
      alert('Erro ao deletar categoria')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && category.active) ||
      (statusFilter === 'inactive' && !category.active)
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    )
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  Categorias Ativas
                </p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Eye className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Categorias Inativas
                </p>
                <p className="text-3xl font-bold">{stats.inactive}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <EyeOff className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
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
                  filteredCategories.map(category => (
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
                          {category.description || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(category.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            category.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {category.active ? 'Ativa' : 'Inativa'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            title="Deletar categoria"
                          >
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
              Tem certeza que deseja deletar a categoria{' '}
              <strong>{categoryToDelete.name}</strong>? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setCategoryToDelete(null)
                }}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Deletar
              </button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}
