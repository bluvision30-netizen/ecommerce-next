"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { getDeals, Product } from "@/services/productService"; // ✅ Utilisez @/ alias
import CardProduit from "./CardProduit"; // ✅ Pas d'extension .jsx

export default function Deals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const deals = await getDeals();
        setProducts(deals);
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
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Offres Spéciales
            </h2>
            <p className="text-gray-600 mt-2">
              Ne manquez pas nos meilleures promotions
            </p>
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