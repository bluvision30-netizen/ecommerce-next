"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  Truck,
  CheckCircle
} from "lucide-react";
import { getOrderById, updateOrderStatus, Order, OrderItem } from "@/lib/supabase";
import toast from "react-hot-toast";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const id = parseInt(params.id as string);
      const data = await getOrderById(id);
      
      if (data) {
        setOrder(data);
      } else {
        toast.error("Commande introuvable");
        router.push("/admin/orders");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement de la commande");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: OrderStatus) {
    if (!order) return;

    setUpdating(true);
    try {
      const success = await updateOrderStatus(order.id, newStatus);
      if (success) {
        toast.success("Statut mis à jour avec succès");
        setOrder({ ...order, status: newStatus });
      } else {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(false);
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Commande #{order.id}</h1>
          <p className="text-gray-600 mt-1">
            Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produits commandés
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Quantité: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Prix unitaire: {item.price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {item.subtotal.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-600">{order.total_amount.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900">Commande passée</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {order.status !== 'pending' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full ${
                      order.status === 'cancelled' ? 'bg-red-100' : 'bg-green-100'
                    } flex items-center justify-center`}>
                      <CheckCircle className={`h-4 w-4 ${
                        order.status === 'cancelled' ? 'text-red-600' : 'text-green-600'
                      }`} />
                    </div>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-900">Statut actuel: {getStatusLabel(order.status)}</p>
                    <p className="text-sm text-gray-500">Mise à jour le {new Date(order.updated_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations client
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </p>
                <p className="font-medium text-gray-900">{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Téléphone
                  </p>
                  <p className="font-medium text-gray-900">{order.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse de livraison
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900">{order.shipping_address}</p>
              <p className="text-gray-700">{order.shipping_city}</p>
              <p className="text-gray-700">{order.shipping_country}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paiement
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Méthode</p>
                <p className="font-medium text-gray-900">{order.payment_method || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  order.payment_status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Mettre à jour le statut
            </h2>
            <div className="space-y-2">
              {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || order.status === status}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    order.status === status
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}