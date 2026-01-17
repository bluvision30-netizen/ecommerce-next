'use client';

import { useEffect, useState } from 'react';
import { getProductsBySection } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import CardProduit from './CardProduit';

export default function PopularProducts() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopularProducts() {
      try {
        const products = await getProductsBySection('popular', 8);
        // ✅ Filtrer les produits sans image valide
        const validProducts = products.filter(
          (product) => product.image_url && product.image_url.trim() !== ''
        );
        setPopularProducts(validProducts);
      } catch (error) {
        console.error('Error loading popular products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPopularProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (popularProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          ⭐ Produits Populaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <CardProduit key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}