"use client";

import { useState, useEffect } from "react";
import { getAllProducts, Product } from "@/lib/supabase";
import CardProduit from "@/components/home/CardProduit";
import { Zap, TrendingUp } from "lucide-react";

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      const allProducts = await getAllProducts();
      // Filtrer les produits avec 50% ou plus de réduction
      const deals = allProducts.filter(p => p.discount && p.discount >= 50);
      setProducts(deals);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full mb-4">
          <Zap className="h-5 w-5" />
          <span className="font-bold">SUPER PROMOTIONS</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Jusqu'à -50% et plus !
        </h1>
        <p className="text-xl text-gray-600">
          {products.length} produit{products.length > 1 ? 's' : ''} en promotion exceptionnelle
        </p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 rounded-3xl p-8 md:p-12 mb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8" />
            <span className="text-2xl font-bold">Offres Limitées</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ne ratez pas ces prix exceptionnels !
          </h2>
          <p className="text-white/90 text-lg max-w-2xl">
            Des réductions massives sur une sélection de produits. 
            Stock limité, profitez-en maintenant !
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Aucune promotion pour le moment
          </h3>
          <p className="text-gray-600">
            Revenez bientôt pour découvrir nos prochaines offres !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <CardProduit key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}