"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search,
  Eye,
  Filter,
  Download,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { getAllOrders, updateOrderStatus, Order } from "@/lib/supabase";
import toast from "react-hot-toast";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        toast.success("Statut mis à jour avec succès");
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus): { color: string; label: string; icon: React.ComponentType<{ className?: string }> } => {
    const styles: Record<OrderStatus, { color: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "En attente", icon: Clock },
      processing: { color: "bg-blue-100 text-blue-800", label: "En cours", icon: Package },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Expédié", icon: Truck },
      delivered: { color: "bg-green-100 text-green-800", label: "Livré", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", label: "Annulé", icon: XCircle },
    };
    return styles[status] || styles.pending;
  };

  const statusOptions: Array<{ value: OrderStatus | "all"; label: string }> = [
    { value: "all", label: "Tous" },
    { value: "pending", label: "En attente" },
    { value: "processing", label: "En cours" },
    { value: "shipped", label: "Expédié" },
    { value: "delivered", label: "Livré" },
    { value: "cancelled", label: "Annulé" },
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600 mt-1">{orders.length} commande(s) au total</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
          <Download className="h-5 w-5" />
          Exporter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-4">
          <div className="text-sm text-yellow-800">En attente</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-4">
          <div className="text-sm text-blue-800">En cours</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{stats.processing}</div>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-sm border border-purple-200 p-4">
          <div className="text-sm text-purple-800">Expédié</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{stats.shipped}</div>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-4">
          <div className="text-sm text-green-800">Livré</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{stats.delivered}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par client, email ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livraison
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                        {order.customer_phone && (
                          <div className="text-sm text-gray-500">{order.customer_phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.shipping_address}</div>
                        <div className="text-sm text-gray-500">
                          {order.shipping_city}, {order.shipping_country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {order.total_amount.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.payment_method || "Non spécifié"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color} border-0 focus:outline-none focus:ring-2 focus:ring-amber-500`}
                        >
                          <option value="pending">En attente</option>
                          <option value="processing">En cours</option>
                          <option value="shipped">Expédié</option>
                          <option value="delivered">Livré</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          Voir
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}