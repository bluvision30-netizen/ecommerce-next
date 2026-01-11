"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts, searchProducts, Product } from "@/services/productService";
import CardProduit from "@/components/home/CardProduit";
import SidebarCategorie from "@/components/SidebarCategorie";

export default function Products() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "Tous";
  const sortBy = searchParams.get("sort") || "default";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        let allProducts: Product[];

        // Si recherche
        if (searchQuery) {
          allProducts = await searchProducts(searchQuery);
        } else {
          allProducts = await getProducts();
        }

        setProducts(allProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [searchQuery]);

  // Filtrer par catégorie
  let filtered = category === "Tous"
    ? products
    : products.filter(p => p.category === category);

  // Trier
  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return (
      <div className="flex max-w-7xl mx-auto gap-6 p-6 min-h-screen">
        <div className="w-64 hidden lg:block"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement des produits...</p>
          </div>
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
            {searchQuery 
              ? `Résultats pour "${searchQuery}"` 
              : category === "Tous" 
                ? "Tous les produits" 
                : category
            }
          </h1>
          <p className="text-slate-600 mt-1">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg mb-4">
              Aucun produit trouvé
            </p>
            <p className="text-slate-500">
              Essayez une autre recherche ou catégorie
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <CardProduit key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}