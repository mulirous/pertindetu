import { AnnouncementsCarousel } from "../components/announcements-carousel"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import Header from "../components/header"
import { ReviewsList } from "../components/reviews-list"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Esquerda */}
          <div className="lg:col-span-1">
            <DashboardSidebar />
          </div>

          {/* Conteúdo - Direita */}
          <div className="lg:col-span-3 space-y-6">
            <ReviewsList />
            <AnnouncementsCarousel />
          </div>
        </div>
      </main>
    </div>
  )
}
