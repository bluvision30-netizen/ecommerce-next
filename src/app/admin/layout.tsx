"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  Store
} from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/admin/dashboard" 
    },
    { 
      icon: Package, 
      label: "Produits", 
      href: "/admin/products" 
    },
    { 
      icon: ShoppingCart, 
      label: "Commandes", 
      href: "/admin/orders" 
    },
    { 
      icon: Users, 
      label: "Clients", 
      href: "/admin/customers" 
    },
    { 
      icon: Settings, 
      label: "Paramètres", 
      href: "/admin/settings" 
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-amber-600" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 w-64
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200">
          <Store className="h-8 w-8 text-amber-600" />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.href)
                    ? 'bg-amber-50 text-amber-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Store className="h-5 w-5" />
            <span>Voir le site</span>
          </Link>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}