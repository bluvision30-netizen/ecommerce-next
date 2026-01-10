"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/services/productService";
import CardProduit from "@/components/home/CardProduit";

export default function Products() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "Tous";
  const sortBy = searchParams.get("sort") || "default";

  const products = getProducts();

  let filtered = category === "Tous"
    ? products
    : products.filter(p => p.category === category);

  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r">
        <h3 className="font-semibold mb-3">Catégories</h3>
        {["Tous","Téléphones","Accessoires","Laptops","TV"].map(cat => (
          <Link
            key={cat}
            href={`/products?category=${cat}`}
            className={`block mb-2 ${cat === category ? "text-orange-500 font-bold" : ""}`}
          >
            {cat}
          </Link>
        ))}
      </aside>

      {/* Produits */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <CardProduit key={product.id} product={product} />
        ))}
      </main>
    </div>
  );
}