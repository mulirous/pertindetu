import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfileTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-transparent border-b border-border h-auto p-0 gap-8">
          <TabsTrigger
            value="about"
            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-b-amber-600 data-[state=active]:bg-transparent rounded-none px-0 py-2"
          >
            Sobre
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-b-amber-600 data-[state=active]:bg-transparent rounded-none px-0 py-2"
          >
            Serviços
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-b-amber-600 data-[state=active]:bg-transparent rounded-none px-0 py-2"
          >
            Avaliações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6">
          <div className="space-y-4 text-foreground">
            <p>
              Bem-vindo à Delícias da Lúcia! Somos especializados em confeitaria artesanal com ingredientes de qualidade
              premium. Cada doce é preparado com cuidado e amor, garantindo o melhor sabor.
            </p>
            <p>
              Com mais de 10 anos de experiência, nos tornamos referência na região por nossas criações inovadoras e
              atendimento personalizado.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Bolos</h3>
              <p className="text-sm text-muted-foreground">Bolos personalizados para todas as ocasiões</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Doces Finos</h3>
              <p className="text-sm text-muted-foreground">Seleção de doces artesanais premium</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Encomendas</h3>
              <p className="text-sm text-muted-foreground">Aceita encomendas com antecedência</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">Maria Silva</p>
                  <p className="text-xs text-muted-foreground">Há 2 semanas</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Bolo maravilhoso! Superou minhas expectativas. Lúcia é uma artista!
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">João Santos</p>
                  <p className="text-xs text-muted-foreground">Há 1 mês</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                  <span className="text-muted-foreground text-sm">★</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Muito bom, chegou no horário. Voltarei a pedir!</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}