"use client";

import { useRouter } from "next/navigation";
import { Smartphone, Laptop, Tv, Headphones, ChevronRight } from "lucide-react";

export default function CategoryRow() {
  const router = useRouter();

  const categories = [
    { 
      name: "Téléphones", 
      image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
      icon: Smartphone,
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      name: "Laptops", 
      image: "https://cdn.thewirecutter.com/wp-content/media/2024/07/laptopstopicpage-2048px-3685-3x2-1.jpg?auto=webp&quality=75&crop=3:2,smart&width=400",
      icon: Laptop,
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      name: "TV", 
      image: "https://www.sencor.com/Sencor/media/content/Products/SLE-65US800TCSB-2.jpg",
      icon: Tv,
      gradient: "from-orange-500 to-red-500"
    },
    { 
      name: "Accessoires", 
      image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
      icon: Headphones,
      gradient: "from-green-500 to-emerald-500"
    },
  ];

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleViewAll = () => {
    router.push('/products');
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Catégories</h2>
        <button 
          onClick={handleViewAll}
          className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm transition-colors"
        >
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image de fond avec overlay gradient */}
              <div className="relative h-40">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
              </div>
              
              {/* Contenu */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg text-center drop-shadow-lg">
                  {cat.name}
                </span>
              </div>

              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
}