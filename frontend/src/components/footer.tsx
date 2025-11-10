import { Facebook, Heart, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg text-background">PERTINDETU</span>
          </div>
          <p className="text-sm text-background/80 max-w-md">
            Conectando você aos melhores artesanatos e produtos locais. Descubra a qualidade e a dedicação de pequenos
            produtores.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <p className="text-xs text-background/60">Copyright © PERTINDETU 2025. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button className="text-background/80 hover:text-background transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="text-background/80 hover:text-background transition-colors">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="text-background/80 hover:text-background transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
