import { useEffect, useState } from 'react'
import { Loader2, Package, PlusCircle } from 'lucide-react'
import { adminApi, servicesApi, type ServiceData } from '../api'
import { AdminLayout } from '../components/AdminLayout'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export function AdminServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Buscar serviços mais recentes
      const servicesData = await servicesApi.getPublic({}, 0, 8)
      setServices(servicesData.content || [])
    } catch (error) {
      console.error('Erro ao carregar dados da homepage:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
            <h2 className="text-3xl font-bold mb-2">Serviços</h2>
            <p className="text-muted-foreground">
              Gerencie os serviços cadastrados no sistema
            </p>
          </div>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Lista de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Nenhum serviço encontrado.
            </Card>
          ) : (
            services.map(service => (
              <Card
                key={service.id}
                className="p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description || 'Sem descrição'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Categoria:{' '}
                    <span className="font-medium">
                      {service.category?.name || '—'}
                    </span>
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      service.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {service.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
