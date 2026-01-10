"use client";  // Ajoute ça si le composant utilise des hooks ou événements (probable)

import Link from "next/link";
import { Smartphone, Laptop, Tv, Headphones, Watch, Camera } from "lucide-react";

const categories = [
  { name: "Téléphones", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { name: "Laptops", icon: Laptop, color: "bg-purple-100 text-purple-600" },
  { name: "TV", icon: Tv, color: "bg-green-100 text-green-600" },
  { name: "Accessoires", icon: Headphones, color: "bg-pink-100 text-pink-600" },
  { name: "Montres", icon: Watch, color: "bg-yellow-100 text-yellow-600" },
  { name: "Caméras", icon: Camera, color: "bg-red-100 text-red-600" },
];

export default function CategoryRow() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Catégories populaires</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow hover:scale-105"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-8 h-8" />
              </div>
              <p className="font-semibold text-slate-800">{cat.name}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}