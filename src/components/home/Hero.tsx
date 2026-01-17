'use client';

import { useEffect, useState } from 'react';
import { getProductsBySection } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Hero() {
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadHeroProducts() {
      try {
        const products = await getProductsBySection('hero', 5);
        console.log('Hero products loaded:', products);
        setHeroProducts(products);
      } catch (error) {
        console.error('Error loading hero products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHeroProducts();
  }, []);

  // Auto-play du carrousel
  useEffect(() => {
    if (heroProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
      setImageError(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? heroProducts.length - 1 : prev - 1
    );
    setImageError(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    setImageError(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setImageError(false);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12 shadow-2xl h-[500px] md:h-[600px]">
        <div className="animate-pulse flex items-center justify-center h-full">
          <div className="text-white text-2xl">Chargement...</div>
        </div>
      </section>
    );
  }

  if (heroProducts.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12 shadow-2xl">
        <div className="text-center text-white py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue sur notre boutique
          </h1>
          <p className="text-xl mb-8">
            Découvrez nos produits exceptionnels
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Voir tous les produits
          </Link>
        </div>
      </section>
    );
  }

  const currentProduct = heroProducts[currentIndex];
  const discountedPrice = currentProduct.discount
    ? currentProduct.price * (1 - currentProduct.discount / 100)
    : currentProduct.price;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl">
      {/* Motifs d'arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Contenu du carrousel */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8 min-h-[500px] md:min-h-[600px]">
          {/* Contenu textuel */}
          <div className="flex-1 text-white space-y-6">
            {/* Badge promotion */}
            {currentProduct.discount && currentProduct.discount > 0 && (
              <div className="inline-block">
                <span className="bg-red-500 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  🔥 -{currentProduct.discount}% DE RÉDUCTION
                </span>
              </div>
            )}

            {/* Catégorie */}
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
              {currentProduct.category}
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {currentProduct.name}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 max-w-xl line-clamp-3">
              {currentProduct.description}
            </p>

            {/* Prix */}
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-4xl md:text-5xl font-bold text-white">
                {discountedPrice.toLocaleString('fr-FR')} FCFA
              </span>
              {currentProduct.discount && currentProduct.discount > 0 && (
                <>
                  <span className="text-2xl text-white/60 line-through">
                    {currentProduct.price.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Économisez {(currentProduct.price - discountedPrice).toLocaleString('fr-FR')} FCFA
                  </span>
                </>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => handleAddToCart(currentProduct)}
                disabled={currentProduct.stock === 0}
                className={`${
                  currentProduct.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-yellow-50 hover:scale-105'
                } text-orange-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2`}
              >
                <ShoppingCart className="w-5 h-5" />
                {currentProduct.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
              
              <Link
                href={`/product/${currentProduct.slug}`}
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                Voir les détails →
              </Link>
            </div>

            {/* Stock warning */}
            {currentProduct.stock > 0 && currentProduct.stock <= 10 && (
              <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-300 text-white px-4 py-2 rounded-lg inline-block">
                ⚠️ Plus que {currentProduct.stock} en stock !
              </div>
            )}
          </div>

          {/* Image du produit */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
              {!imageError ? (
                <Image
                  src={currentProduct.image_url}
                  alt={currentProduct.name}
                  width={500}
                  height={500}
                  className="relative w-full h-auto object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
                  priority
                  onError={() => {
                    console.error('Image failed to load:', currentProduct.image_url);
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="relative w-full h-96 bg-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p>Image non disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Boutons de navigation */}
      {heroProducts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 group"
            aria-label="Produit précédent"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 group"
            aria-label="Produit suivant"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Indicateurs de pagination */}
      {heroProducts.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'bg-white w-8 h-3'
                  : 'bg-white/50 w-3 h-3 hover:bg-white/70'
              }`}
              aria-label={`Aller au produit ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Effet de brillance animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
    </section>
  );
}