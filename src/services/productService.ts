import { supabase, Product as SupabaseProduct } from "@/lib/supabase";

// Types pour les produits (compatible avec CartContext)
export interface Product extends SupabaseProduct {
  image: string; // Alias pour compatibilité
  originalPrice?: number;
  reviews?: number;
  inStock?: boolean;
}

// Interface pour les données Supabase
interface SupabaseProductRaw {
  id: number;
  name: string;
  price: number | string;
  original_price?: number | string | null;
  discount?: number | null;
  image_url: string;
  category: string;
  description?: string | null;
  rating?: number | string | null;
  reviews_count?: number | null;
  in_stock: boolean;
  slug: string;
  sections?: string[] | null;
}

// Fonction pour convertir les données Supabase au format attendu
function mapSupabaseProduct(dbProduct: SupabaseProductRaw): Product {
  return {
    ...dbProduct,
    id: dbProduct.id,
    name: dbProduct.name,
    price: typeof dbProduct.price === 'string' ? parseFloat(dbProduct.price) : dbProduct.price,
    original_price: dbProduct.original_price 
      ? (typeof dbProduct.original_price === 'string' 
          ? parseFloat(dbProduct.original_price) 
          : dbProduct.original_price)
      : null,
    originalPrice: dbProduct.original_price 
      ? (typeof dbProduct.original_price === 'string' 
          ? parseFloat(dbProduct.original_price) 
          : dbProduct.original_price)
      : undefined,
    discount: dbProduct.discount || null,
    image: dbProduct.image_url, // Mapper vers image pour compatibilité
    image_url: dbProduct.image_url,
    category: dbProduct.category,
    description: dbProduct.description || null,
    rating: dbProduct.rating 
      ? (typeof dbProduct.rating === 'string' 
          ? parseFloat(dbProduct.rating) 
          : dbProduct.rating)
      : null,
    reviews_count: dbProduct.reviews_count || null,
    reviews: dbProduct.reviews_count || undefined,
    in_stock: dbProduct.in_stock,
    inStock: dbProduct.in_stock,
    slug: dbProduct.slug,
    sections: dbProduct.sections || null,
    stock_quantity: null,
    tags: null,
    created_at: '',
    updated_at: '',
  };
}

// Fonction pour récupérer tous les produits
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }

    return data ? data.map(mapSupabaseProduct) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
}

// Fonction pour récupérer un produit par ID
export async function getProductById(id: number): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return undefined;
    }

    return data ? mapSupabaseProduct(data) : undefined;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return undefined;
  }
}

// Fonction pour récupérer les produits par catégorie
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('in_stock', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }

    return data ? data.map(mapSupabaseProduct) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    return [];
  }
}

// Fonction pour récupérer les produits en promotion
export async function getDeals(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('discount', 0)
      .eq('in_stock', true)
      .order('discount', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }

    return data ? data.map(mapSupabaseProduct) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions:', error);
    return [];
  }
}

// Fonction pour rechercher des produits
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .eq('in_stock', true);

    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }

    return data ? data.map(mapSupabaseProduct) : [];
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    return [];
  }
}