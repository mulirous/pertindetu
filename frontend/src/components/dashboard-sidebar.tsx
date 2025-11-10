import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export function DashboardSidebar() {
  const user = {
    name: "Lúcia Souza",
    memberSince: "29/09/2025",
    avgRating: 4.8,
    totalReviews: 109,
    description: "Há uma hora",
  }

  const verifications = [
    { label: "Email", status: "Verificado" as const },
    { label: "Membro desde", status: "Verificado" as const },
    { label: "Membro desde", status: "Pendente" as const },
  ]

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>

          <h2 className="text-xl font-semibold text-neutral-900">{user.name}</h2>

          <div className="mt-4 space-y-2 text-sm text-neutral-600">
            <p>
              <span className="font-medium">Membro desde</span>
              <br />
              {user.memberSince}
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(user.avgRating) ? "fill-amber-400 text-amber-400" : "text-neutral-300"}
                  />
                ))}
              </div>
              <span className="font-semibold text-neutral-900">{user.avgRating}</span>
            </div>

            <p>
              <span className="font-medium">Número de avaliações</span>
              <br />
              {user.totalReviews} avaliações
            </p>

            <p>
              <span className="font-medium">Último acesso</span>
              <br />
              {user.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Verifications Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Verificações</h3>

        <div className="space-y-3">
          {verifications.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-200 last:border-0">
              <span className="text-sm text-neutral-600">{item.label}</span>
              <span
                className={`text-sm font-medium ${item.status === "Verificado" ? "text-green-600" : "text-amber-600"}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <button className="mt-4 text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors">
          Editar
        </button>
      </Card>
    </div>
  )
}