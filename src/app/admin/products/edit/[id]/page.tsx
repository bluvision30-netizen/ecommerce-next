"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { getProductById, updateProduct } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [productLoading, setProductLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "Téléphones",
    image_url: "",
    in_stock: true,
    stock_quantity: "",
    rating: "",
    reviews_count: "",
    tags: "",
  });

  const categories = ["Téléphones", "Laptops", "TV", "Accessoires"];

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const id = parseInt(params.id as string);
      const product = await getProductById(id);

      if (product) {
        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          original_price: product.original_price?.toString() || "",
          category: product.category,
          image_url: product.image_url,
          in_stock: product.in_stock,
          stock_quantity: product.stock_quantity?.toString() || "",
          rating: product.rating?.toString() || "",
          reviews_count: product.reviews_count?.toString() || "",
          tags: product.tags?.join(", ") || "",
        });
        setImagePreview(product.image_url);
      } else {
        toast.error("Produit introuvable");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement du produit");
    } finally {
      setProductLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary n'est pas configuré. Utilisez une URL d'image à la place.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setImagePreview(data.secure_url);
        setFormData((prev) => ({ ...prev, image_url: data.secure_url }));
        toast.success("Image téléchargée avec succès !");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url) {
      toast.error("Veuillez ajouter une image ou une URL d'image");
      return;
    }

    setLoading(true);

    try {
      const price = parseFloat(formData.price);
      const originalPrice = formData.original_price
        ? parseFloat(formData.original_price)
        : null;
      const discount = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : null;

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price,
        original_price: originalPrice,
        discount,
        category: formData.category,
        image_url: formData.image_url,
        in_stock: formData.in_stock,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : null,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : null,
      };

      const id = parseInt(params.id as string);
      const result = await updateProduct(id, productData);

      if (result) {
        toast.success("Produit modifié avec succès !");
        router.push("/admin/products");
      } else {
        toast.error("Erreur lors de la modification du produit");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la modification du produit");
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier le Produit</h1>
          <p className="text-gray-600 mt-1">Modifier les informations du produit</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Image du produit</h2>

          <div className="space-y-4">
            {/* Preview */}
            {imagePreview && (
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setFormData((prev) => ({ ...prev, image_url: "" }));
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            {!imagePreview && (
              <div>
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-3" />
                    ) : (
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    )}
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG jusquà 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            )}

            {/* URL Alternative */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de limage
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, image_url: e.target.value }));
                  setImagePreview(e.target.value);
                }}
                placeholder="https://exemple.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: iPhone 14 Pro"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Description détaillée du produit..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Étiquettes
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="nouveau, promo, tendance (séparés par des virgules)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prix</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix actuel (FCFA) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="800000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix original (FCFA)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                placeholder="950000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pour afficher une réduction
              </p>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, in_stock: e.target.checked }))}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Produit en stock
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité en stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
                placeholder="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Avis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                placeholder="4.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre davis
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviews_count}
                onChange={(e) => setFormData((prev) => ({ ...prev, reviews_count: e.target.value }))}
                placeholder="256"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/admin/products"
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Modification..." : "Modifier le produit"}
          </button>
        </div>
      </form>
    </div>
  );
}