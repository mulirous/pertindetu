import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  ShoppingCart,
  Shield,
  Tags,
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    {
      path: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/admin/users",
      icon: Users,
      label: "Usuários",
    },
    {
      path: "/admin/providers",
      icon: Briefcase,
      label: "Prestadores",
    },
    {
      path: "/admin/categories",
      icon: Tags,
      label: "Categorias",
    },
    {
      path: "/admin/services",
      icon: Package,
      label: "Serviços",
    },
    {
      path: "/admin/orders",
      icon: ShoppingCart,
      label: "Pedidos",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Pertindetu</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
