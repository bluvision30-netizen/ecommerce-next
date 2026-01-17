'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Eye
} from "lucide-react";
import { getProducts, deleteProduct, Product } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      toast.success("Produit supprimé avec succès");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Erreur lors de la suppression du produit");
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-8 h-8" />
                Gestion des Produits
              </h1>
              <p className="text-gray-600 mt-1">
                {products.length} produit{products.length > 1 ? 's' : ''} au total
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "Aucun produit trouvé" : "Aucun produit"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Essayez avec d'autres termes de recherche"
                : "Commencez par ajouter votre premier produit"}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajouter un produit
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const discountedPrice = product.discount
                ? product.price * (1 - product.discount / 100)
                : product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          Rupture de stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="text-xs text-blue-600 font-semibold mb-1 uppercase">
                      {product.category}
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-gray-800">
                        {discountedPrice.toFixed(2)} FCFA
                      </span>
                      {product.discount && product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.price.toFixed(2)} FCFA
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="mb-4">
                      <span className={`text-sm font-semibold ${
                        product.stock > 10
                          ? 'text-green-600'
                          : product.stock > 0
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>

                    {/* Sections */}
                    {product.sections && product.sections.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {product.sections.map((section) => (
                          <span
                            key={section}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </Link>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}