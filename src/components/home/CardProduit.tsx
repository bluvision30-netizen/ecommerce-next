"use client";

import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Product } from "@/services/productService";

interface CardProduitProps {
  product: Product;
}

export default function CardProduit({ product }: CardProduitProps) {
  const {
    id,
    name,
    price,
    originalPrice,
    discount,
    image,
    rating = 0,
    reviews = 0,
  } = product;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image avec badge de réduction */}
      <div className="relative">
        <Link href={`/products/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {discount && discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({reviews})</span>
        </div>

        {/* Prix */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-blue-600">{price}€</p>
            {originalPrice && originalPrice > price && (
              <p className="text-sm text-gray-500 line-through">
                {originalPrice}€
              </p>
            )}
          </div>
        </div>

        {/* Bouton Ajouter au panier */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200">
          <ShoppingCart className="h-5 w-5" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}