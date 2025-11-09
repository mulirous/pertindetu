"use client"

import { Clock, MapPin } from "lucide-react"
import { useState } from "react"
import Footer from "../components/footer"
import Header from "../components/header"
import ProfileHeader from "../components/profile-header"
import ProfileTabs from "../components/profile-tabs"
import SidebarCard from "../components/sidebar-card"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileHeader
                storeName="Delícias da Lúcia"
                ownerName="Lúcia Souza"
                rating={4.8}
                reviews={348}
                tags={["Favorito Tótó", "Especialize Produtos Artesanais"]}
                imageUrl="/decadent-chocolate-cake.png"
              />

              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <SidebarCard
                title="Horário de Funcionamento"
                icon={<Clock className="w-5 h-5 text-amber-600" />}
                content={
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Seg - Sábado:</span> 14:30 às 17:00
                    </p>
                    <p>
                      <span className="font-medium">Domingo - Segundo:</span> Fechado
                    </p>
                  </div>
                }
              />

              <SidebarCard
                title="Localização"
                icon={<MapPin className="w-5 h-5 text-amber-600" />}
                content={
                  <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-muted-foreground" />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
