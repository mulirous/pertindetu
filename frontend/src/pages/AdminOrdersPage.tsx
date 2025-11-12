import { useEffect, useState } from 'react'
import {
  Loader2,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw
} from 'lucide-react'
import {
  adminApi,
  ordersApi,
  type OrderData,
  type OrdersPageData
} from '../api'
import { AdminLayout } from '../components/AdminLayout'
import { Card } from '../components/ui/card'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data: OrdersPageData = await ordersApi.getAll(0, 20)
      console.log('Retorno da API de pedidos:', data)

      // Garante que o conteúdo é um array
      const content = Array.isArray(data) ? data : data?.content || []
      setOrders(content)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      alert('Erro ao carregar lista de pedidos')
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
            <h2 className="text-3xl font-bold mb-2">Pedidos</h2>
            <p className="text-muted-foreground">
              Gerencie e acompanhe os pedidos realizados na plataforma.
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhum pedido encontrado.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <Card key={order.id} className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pedido #{order.id}
                    </p>
                    <p className="text-xl font-semibold">
                      {order.service?.name || 'Serviço não especificado'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full text-primary">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Cliente:</strong>{' '}
                    {order.user?.name || 'Usuário desconhecido'}
                  </p>
                  <p>
                    <strong>Prestador:</strong>{' '}
                    {order.provider?.name || 'Não informado'}
                  </p>
                  <p>
                    <strong>Data:</strong>{' '}
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <StatusBadge status={order.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-gray-100 text-gray-700'
  let icon = Clock

  switch (status) {
    case 'PENDING':
      color = 'bg-yellow-100 text-yellow-700'
      icon = Clock
      break
    case 'COMPLETED':
      color = 'bg-green-100 text-green-700'
      icon = CheckCircle
      break
    case 'CANCELLED':
      color = 'bg-red-100 text-red-700'
      icon = XCircle
      break
    default:
      break
  }

  const Icon = icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}
    >
      <Icon className="w-4 h-4" />
      {status === 'PENDING'
        ? 'Pendente'
        : status === 'COMPLETED'
        ? 'Concluído'
        : status === 'CANCELLED'
        ? 'Cancelado'
        : status}
    </span>
  )
}
