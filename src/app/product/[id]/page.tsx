"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts, Product } from "@/services/productService";
import CardProduit from "@/components/home/CardProduit";
import SidebarCategorie from "@/components/SidebarCategorie";

export default function Products() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "Tous";
  const sortBy = searchParams.get("sort") || "default";

  useEffect(() => {
    async function loadProducts() {
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  let filtered = category === "Tous"
    ? products
    : products.filter(p => p.category === category);

  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64"></div>
        <div className="flex-1 p-6">
          <div className="text-center py-20">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto gap-6 p-6">
      {/* Sidebar */}
      <SidebarCategorie />

      {/* Produits */}
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            {category === "Tous" ? "Tous les produits" : category}
          </h1>
          <p className="text-slate-600 mt-1">{filtered.length} produits trouvés</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <CardProduit key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}