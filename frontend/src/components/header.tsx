import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Link para a Homepage no Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-lg text-foreground">
                PERTINDETU
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="O que você procura agora..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              to={isLoggedIn ? "/providers/new" : "/login"}
              title={isLoggedIn ? "Seja um Prestador" : "Fazer Login"}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-foreground" />
            </Link>

            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Heart className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="O que você procura..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
