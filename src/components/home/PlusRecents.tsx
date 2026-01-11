"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { getProducts, Product } from "@/services/productService"; // ✅ Bon chemin
import CardProduit from "./CardProduit"; // ✅ Sans extension

export default function PlusRecents() {
  const [products, setProducts] = useState<Product[]>([]); // ✅ Typage correct
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const allProducts = await getProducts(); // ✅ Await
        setProducts(allProducts.slice(0, 4)); // ✅ Prendre les 4 premiers
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Chargement...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Produits Récents
            </h2>
            <p className="text-gray-600 mt-2">
              Découvrez nos dernières nouveautés
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