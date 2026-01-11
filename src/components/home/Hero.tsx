"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowRight, ShoppingCart } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const { addToCart } = useCart();

  // Produit vedette
  const featuredProduct = {
    id: 1,
    name: "iPhone 14",
    category: "Téléphones",
    price: 800000,
    originalPrice: 950000,
    image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
    description: "Le dernier iPhone avec puce A15 Bionic et caméra améliorée",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  };

  const handleLearnMore = () => {
    router.push(`/product/${featuredProduct.id}`);
  };

  const handleBuyNow = () => {
    addToCart(featuredProduct);
    router.push('/cart');
  };

  const discountPercent = Math.round(((featuredProduct.originalPrice - featuredProduct.price) / featuredProduct.originalPrice) * 100);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 md:p-12 shadow-2xl">
      {/* Motifs d'arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Contenu textuel */}
        <div className="flex-1 text-white space-y-6">
          <div className="inline-block">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
              🔥 Offre limitée - {discountPercent}% de réduction
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Découvrez le nouveau
            <span className="block text-yellow-200">{featuredProduct.name}</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-xl">
            {featuredProduct.description}
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold text-white">
              {featuredProduct.price.toLocaleString()} FCFA
            </span>
            <span className="text-2xl text-white/60 line-through">
              {featuredProduct.originalPrice.toLocaleString()} FCFA
            </span>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleBuyNow}
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Acheter maintenant
            </button>
            <button
              onClick={handleLearnMore}
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              En savoir plus
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image du produit */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <img
              src={featuredProduct.image}
              alt={featuredProduct.name}
              className="relative w-full max-w-md h-auto object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Effet de brillance animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
    </section>
  );
}