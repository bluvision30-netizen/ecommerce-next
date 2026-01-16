"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getProductBySlug, getProductById, Product } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, Share2, Star, ArrowLeft, Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  async function loadProduct() {
    try {
      const slugOrId = params.slug as string;
      let foundProduct: Product | null = null;

      // Essayer d'abord avec le slug
      foundProduct = await getProductBySlug(slugOrId);

      // Si pas trouvé et que c'est un nombre, essayer avec l'ID
      if (!foundProduct && !isNaN(Number(slugOrId))) {
        foundProduct = await getProductById(parseInt(slugOrId));
      }

      setProduct(foundProduct);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, qty);
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20 text-center">
        <p className="text-xl text-slate-600 mb-4">Produit introuvable</p>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux produits
        </Link>
      </div>
    );
  }

  const hasDiscount = product.original_price !== null && product.original_price !== undefined && product.original_price > product.price;
  const discountPercent = hasDiscount && product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
        <Link href="/" className="hover:text-amber-600">Accueil</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-600">Produits</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-amber-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{product.name}</span>
      </div>

      {/* Notification de succès */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          ✓ Produit ajouté au panier !
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image du produit */}
        <div className="flex-1 bg-white rounded-2xl shadow-card p-8">
          <div className="relative">
            {hasDiscount && (
              <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold z-10">
                -{discountPercent}% OFF
              </div>
            )}
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-96 object-contain"
            />
          </div>

          {/* Actions supplémentaires */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <Heart className="w-5 h-5" />
              Ajouter aux favoris
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <Share2 className="w-5 h-5" />
              Partager
            </button>
          </div>
        </div>

        {/* Détails du produit */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Catégorie */}
          <div className="text-sm text-amber-600 font-medium">
            {product.category}
          </div>

          {/* Nom */}
          <h1 className="text-4xl font-bold text-slate-800">
            {product.name}
          </h1>

          {/* Note */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-slate-600">({product.reviews_count || 0} avis)</span>
          </div>

          {/* Prix */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-amber-600">
              {product.price.toLocaleString()} FCFA
            </span>
            {product.original_price && (
              <span className="text-2xl text-slate-400 line-through mb-1">
                {product.original_price.toLocaleString()} FCFA
              </span>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-b border-slate-200 py-4">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-slate-700 leading-relaxed">
              {product.description || "Description détaillée du produit non disponible pour le moment."}
            </p>
          </div>

          {/* Quantité */}
          <div className="flex items-center gap-4">
            <label className="font-medium text-slate-700">Quantité :</label>
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 hover:bg-slate-100 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-x border-slate-300 py-2 focus:outline-none"
              />
              <button 
                onClick={() => setQty(qty + 1)}
                className="px-4 py-2 hover:bg-slate-100 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total :</span>
              <span className="text-2xl font-bold text-slate-800">
                {(product.price * qty).toLocaleString()} FCFA
              </span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-700 text-white py-4 rounded-lg hover:bg-slate-800 transition-all duration-300 font-semibold"
            >
              <ShoppingCart className="w-5 h-5" />
              Ajouter au panier
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Acheter maintenant
            </button>
          </div>

          {/* Informations de livraison */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900">🚚 Livraison gratuite</p>
              <p className="text-xs text-blue-700 mt-1">Pour toute commande</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-900">✓ {product.in_stock ? 'En stock' : 'Rupture'}</p>
              <p className="text-xs text-green-700 mt-1">
                {product.in_stock ? 'Expédition sous 24-48h' : 'Bientôt disponible'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}