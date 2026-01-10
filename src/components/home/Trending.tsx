"use client";

import { useState, useEffect } from "react";
import { ChevronRight, TrendingUp } from "lucide-react";
import { getProducts, Product } from "@/services/productService"; // ✅ Bon chemin
import CardProduit from "./CardProduit"; // ✅ Sans extension

export default function Trending() {
  const [products, setProducts] = useState<Product[]>([]); // ✅ Typage correct
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const allProducts = await getProducts(); // ✅ Await
        // Filtrer les produits en tendance (avec discount ou haute note)
        const trending = allProducts
          .filter((p) => (p.discount && p.discount > 0) || (p.rating && p.rating >= 4.5))
          .slice(0, 4);
        setProducts(trending);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Chargement...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Tendances du Moment
              </h2>
              <p className="text-gray-600 mt-2">
                Les produits les plus recherchés
              </p>
            </div>
          </div>
          <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
            Voir tout
            <ChevronRight className="ml-1 h-5 w-5" />
          </button>
        </div>

        {/* Grid de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <CardProduit key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}