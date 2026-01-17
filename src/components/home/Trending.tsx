'use client';

import { useEffect, useState } from 'react';
import { getProductsBySection } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import CardProduit from './CardProduit';

export default function Trending() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrendingProducts() {
      try {
        const products = await getProductsBySection('trending', 8);
        // ✅ Filtrer les produits sans image valide
        const validProducts = products.filter(
          (product) => product.image_url && product.image_url.trim() !== ''
        );
        setTrendingProducts(validProducts);
      } catch (error) {
        console.error('Error loading trending products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTrendingProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (trendingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          📈 Tendances du Moment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <CardProduit key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}