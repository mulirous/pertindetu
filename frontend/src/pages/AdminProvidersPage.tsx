import {
  Briefcase,
  CheckCircle,
  Loader2,
  Search,
  ShieldCheck,
  ShieldX,
  Trash2,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi, type ProviderProfileData } from '../api'
import { AdminLayout } from '../components/AdminLayout'
import { Card } from '../components/ui/card'

export function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderProfileData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [verificationFilter, setVerificationFilter] = useState<
    'all' | 'verified' | 'unverified'
  >('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [providerToDelete, setProviderToDelete] =
    useState<ProviderProfileData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 👇 Novos estados para estatísticas do backend
  const [stats, setStats] = useState({
    totalProviders: 0,
    verifiedProviders: 0,
    unverifiedProviders: 0
  })

  useEffect(() => {
    loadProviders()
    loadStats()
  }, [])

  const loadProviders = async () => {
    setIsLoading(true)
    try {
      const response = await adminApi.providers.getAll(0, 100)
      setProviders(response.content || [])
    } catch (error) {
      console.error('Erro ao carregar prestadores:', error)
      alert('Erro ao carregar lista de prestadores')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await adminApi.providers.getStats()
      setStats({
        totalProviders: response.totalProviders ?? 0,
        verifiedProviders: response.verifiedProviders ?? 0,
        unverifiedProviders: response.unverifiedProviders ?? 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas de prestadores:', error)
    }
  }

  const handleToggleVerification = async (providerId: number) => {
    try {
      const updatedProvider = await adminApi.providers.toggleVerification(
        providerId
      )
      setProviders(
        providers.map(provider =>
          provider.id === providerId ? updatedProvider : provider
        )
      )
      // 🔄 Atualiza estatísticas após mudança
      loadStats()
    } catch (error) {
      console.error('Erro ao atualizar verificação:', error)
      alert('Erro ao atualizar verificação do prestador')
    }
  }

  const handleDeleteClick = (provider: ProviderProfileData) => {
    setProviderToDelete(provider)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!providerToDelete) return

    setIsDeleting(true)
    try {
      await adminApi.providers.delete(providerToDelete.id)
      setProviders(providers.filter(p => p.id !== providerToDelete.id))
      setShowDeleteModal(false)
      setProviderToDelete(null)
      // 🔄 Atualiza estatísticas
      loadStats()
    } catch (error) {
      console.error('Erro ao deletar prestador:', error)
      alert('Erro ao deletar prestador')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredProviders = providers.filter(provider => {
    const matchesSearch =
      provider.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.categories.some(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesVerification =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && provider.verified) ||
      (verificationFilter === 'unverified' && !provider.verified)

    return matchesSearch && matchesVerification
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
            <h2 className="text-3xl font-bold mb-2">Gerenciar Prestadores</h2>
            <p className="text-muted-foreground">
              Gerencie e verifique todos os prestadores de serviços
            </p>
          </div>
        </div>

        {/* Stats Cards (agora com dados reais do backend) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total de Prestadores
                </p>
                <p className="text-3xl font-bold">{stats.totalProviders}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Prestadores Verificados
                </p>
                <p className="text-3xl font-bold">{stats.verifiedProviders}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Aguardando Verificação
                </p>
                <p className="text-3xl font-bold">
                  {stats.unverifiedProviders}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <ShieldX className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros e Tabela permanecem iguais */}
        {/* ... (mantém o mesmo restante do seu código) ... */}
      </div>
    </AdminLayout>
  )
}
