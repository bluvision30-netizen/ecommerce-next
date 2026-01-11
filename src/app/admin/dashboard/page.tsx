"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from "lucide-react";
import { getDashboardStats, getAllOrders, Order } from "@/lib/supabase";
import Link from "next/link";

interface Stats {
  total_products: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  revenue_last_30_days: number;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await getDashboardStats();
        const ordersData = await getAllOrders();
        
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Produits",
      value: stats?.total_products || 0,
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up" as const
    },
    {
      title: "Commandes",
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: "bg-green-500",
      change: "+8%",
      trend: "up" as const
    },
    {
      title: "En attente",
      value: stats?.pending_orders || 0,
      icon: Users,
      color: "bg-orange-500",
      change: "-3%",
      trend: "down" as const
    },
    {
      title: "Revenus (30j)",
      value: `${(stats?.revenue_last_30_days || 0).toLocaleString()} FCFA`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: "+23%",
      trend: "up" as const
    },
  ];

  const getStatusBadge = (status: OrderStatus): string => {
    const styles: Record<OrderStatus, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status] || styles.pending;
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: "En attente",
      processing: "En cours",
      shipped: "Expédié",
      delivered: "Livré",
      cancelled: "Annulé",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vue ensemble de votre boutique</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">{card.change}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Commandes récentes</h2>
            <p className="text-gray-600 text-sm mt-1">Dernières commandes passées</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            Voir tout
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucune commande pour le moment
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total_amount.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products/new"
          className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <Package className="h-8 w-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">Ajouter un produit</h3>
          <p className="text-white/90 text-sm">Créer un nouveau produit</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <ShoppingCart className="h-8 w-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">Gérer les commandes</h3>
          <p className="text-white/90 text-sm">Voir toutes les commandes</p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <Users className="h-8 w-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">Paramètres</h3>
          <p className="text-white/90 text-sm">Configurer la boutique</p>
        </Link>
      </div>
    </div>
  );
}