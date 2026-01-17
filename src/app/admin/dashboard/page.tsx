'use client';

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from "lucide-react";
import { getOrders, getProducts, Order } from "@/lib/supabase";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      
      // Charger les produits et commandes
      const [products, orders] = await Promise.all([
        getProducts(),
        getOrders()
      ]);

      // Calculer les statistiques
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const completedOrders = orders.filter(o => o.status === 'completed').length;
      const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      });

      // Prendre les 5 dernières commandes
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Complétée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de votre boutique en ligne
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Produits
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalProducts}
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Commandes
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalOrders}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Revenu Total
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalRevenue.toLocaleString('fr-FR')} FCFA
            </p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">En attente</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Commandes en Attente
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.pendingOrders}
            </p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Completed Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    Commandes Complétées
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.completedOrders}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Taux de réussite</p>
                <p className="text-lg font-bold text-green-600">
                  {stats.totalOrders > 0
                    ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    Commandes Annulées
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.cancelledOrders}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Taux d'annulation</p>
                <p className="text-lg font-bold text-red-600">
                  {stats.totalOrders > 0
                    ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Commandes Récentes
              </h2>
              <Link
                href="/admin/orders"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                Voir tout
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {order.total_amount.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-lg mb-1">Nouveau Produit</h3>
              <p className="text-blue-100 text-sm">
                Ajouter un produit à la boutique
              </p>
            </div>
            <Package className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/admin/orders"
            className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-lg mb-1">Gérer Commandes</h3>
              <p className="text-purple-100 text-sm">
                Voir toutes les commandes
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/admin/products"
            className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-lg mb-1">Voir Produits</h3>
              <p className="text-green-100 text-sm">
                Gérer l'inventaire
              </p>
            </div>
            <Package className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}