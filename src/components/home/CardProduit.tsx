"use client";

import { ShoppingCart, TrendingUp, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Product } from "@/services/productService";
import { useState } from "react";

interface CardProduitProps {
  product: Product;
}

export default function CardProduit({ product }: CardProduitProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100/50 h-full flex flex-col cursor-pointer"
    >
      {/* Notification succès */}
      {showSuccess && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
          ✓ Ajouté au panier !
        </div>
      )}

      {/* Badge de réduction */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Zap className="w-3 h-3" />
          -{discountPercent}%
        </div>
      )}

      {/* Bouton panier avec effet moderne */}
      <button
        onClick={handleAddToCart}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-slate-700 p-2.5 rounded-xl hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 group/btn"
        title="Ajouter au panier"
      >
        <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
      </button>

      <div className="block p-5">
        {/* Image avec effet de zoom */}
        <div className="relative h-44 mb-4 flex items-center justify-center overflow-hidden rounded-2xl bg-white/50">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-40 object-contain group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient overlay subtil au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Nom du produit */}
        <h3 className="text-sm font-semibold text-slate-800 mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>

        {/* Section prix avec design moderne */}
        <div className="flex items-end gap-2 mb-2">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {product.originalPrice.toLocaleString()} FCFA
              </span>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              {product.price.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        {/* Barre de progression "trending" subtile */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Populaire
            </span>
            <span className="text-amber-600 font-medium">En stock</span>
          </div>
        </div>
      </div>

      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
}