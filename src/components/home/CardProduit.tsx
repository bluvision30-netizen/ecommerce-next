'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/supabase';

interface CardProduitProps {
  product: Product;
}

export default function CardProduit({ product }: CardProduitProps) {
  const { addToCart } = useCart();

  // ✅ Validation de l'URL d'image
  const imageUrl = product.image_url && product.image_url.trim() !== '' 
    ? product.image_url 
    : '/placeholder-product.jpg'; // Image par défaut

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  // Rating par défaut
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 100) + 10;

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {imageUrl !== '/placeholder-product.jpg' ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Afficher un placeholder en cas d'erreur
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-xs">Image non disponible</div>
              </div>
            </div>
          )}
          
          {/* Badge de réduction */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              -{product.discount}%
            </div>
          )}

          {/* Badge de stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
              <span className="text-white font-bold text-sm">Rupture de stock</span>
            </div>
          )}

          {/* Badge nouveau */}
          {product.created_at && 
           new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              NEW
            </div>
          )}

          {/* Bouton panier au survol */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`absolute bottom-3 right-3 bg-orange-500 text-white p-2.5 rounded-full shadow-lg transform translate-y-16 group-hover:translate-y-0 transition-all duration-300 z-10 ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Catégorie */}
          <div className="text-xs text-blue-600 font-semibold mb-1.5 uppercase tracking-wide">
            {product.category}
          </div>

          {/* Nom du produit */}
          <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {rating} ({reviewCount})
            </span>
          </div>

          {/* Prix */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-lg font-bold text-gray-900">
                {discountedPrice.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs text-gray-600">FCFA</span>
            </div>
            
            {product.discount && product.discount > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-gray-500 line-through">
                  {product.price.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  Économie: {(product.price - discountedPrice).toLocaleString('fr-FR')} F
                </span>
              </div>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="mt-2 text-xs text-orange-600 font-semibold">
              ⚠️ Plus que {product.stock} !
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}