'use client';

import { useEffect, useState } from 'react';
import { getProductsBySection } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import CardProduit from './CardProduit';
import Link from 'next/link';

export default function Deals() {
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDealsProducts() {
      try {
        const products = await getProductsBySection('deals', 8);
        // ✅ Filtrer les produits sans image valide
        const validProducts = products.filter(
          (product) => product.image_url && product.image_url.trim() !== ''
        );
        setDealsProducts(validProducts);
      } catch (error) {
        console.error('Error loading deals products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDealsProducts();
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

  if (dealsProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🔥 Offres Spéciales
          </h2>
          <Link
            href="/deals"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealsProducts.map((product) => (
            <CardProduit key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}