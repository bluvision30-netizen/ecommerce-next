"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Truck, ShoppingBag, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Confirmation

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Cameroun",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  const totalAmount = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données de la commande
      const orderData = {
        customer_email: formData.email,
        customer_name: formData.fullName,
        customer_phone: formData.phone || null,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_country: formData.country,
        total_amount: totalAmount,
        status: 'pending' as const,
        payment_method: formData.paymentMethod,
        payment_status: 'pending' as const,
        notes: formData.notes || null,
        customer_id: null,
      };

      // Préparer les articles
      const items = cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_image: item.image || null,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      // Créer la commande dans Supabase
      const result = await createOrder(orderData, items);

      if (result) {
        toast.success("Commande passée avec succès !");
        clearCart();
        setStep(2);
        
        // Rediriger après 3 secondes
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error("Erreur lors de la création de la commande");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step === 1) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20">
        <div className="text-center py-20">
          <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Votre panier est vide</h2>
          <p className="text-slate-600 mb-8">Ajoutez des produits avant de passer commande</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre commande. Nous vous avons envoyé un email de confirmation à{" "}
            <span className="font-semibold">{formData.email}</span>
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Montant total</p>
            <p className="text-3xl font-bold text-amber-600">{totalAmount.toLocaleString()} FCFA</p>
          </div>
          <Link
            href="/"
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            Retour à laccueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/cart"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
          <p className="text-gray-600 mt-1">Complétez vos informations pour finaliser votre achat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Informations de livraison
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean@exemple.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Rue de la République"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Douala"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Cameroun">Cameroun</option>
                    <option value="France">France</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte dIvoire</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Méthode de paiement
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Paiement à la livraison</p>
                    <p className="text-sm text-gray-500">Payez en espèces à la réception</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="mobile_money"
                    checked={formData.paymentMethod === "mobile_money"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Mobile Money</p>
                    <p className="text-sm text-gray-500">Orange Money, MTN MoMo</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes de commande (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Instructions spéciales pour la livraison..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Confirmer la commande
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Résumé de la commande</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total</span>
                <span>{totalAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Livraison</span>
                <span className="text-green-600 font-semibold">Gratuite</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-600">{totalAmount.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Livraison gratuite</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Retour gratuit sous 30 jours</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}