"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 space-y-6">
      {/* Catégories */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-bold mb-3">Catégories</h3>
        {["Téléphones", "Laptops", "TV", "Accessoires"].map(cat => (
          <button
            key={cat}
            onClick={() => router.push(`/products?category=${cat}`)}
            className="block w-full text-left py-2 hover:text-orange-500"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtre prix */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-bold mb-3">Prix</h3>
        <button
          onClick={() => router.push("/products?sort=asc")}
          className="block py-2"
        >
          Prix croissant
        </button>
        <button
          onClick={() => router.push("/products?sort=desc")}
          className="block py-2"
        >
          Prix décroissant
        </button>
      </div>

      {/* Promo */}
      <div className="bg-orange-500 text-white p-5 rounded-xl shadow">
        <h3 className="font-bold mb-2">🔥 Promotions</h3>
        <p>-30% sur une sélection</p>
      </div>
    </aside>
  );
}
