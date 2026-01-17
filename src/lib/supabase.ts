import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string; // ✅ Changé de 'image' à 'image_url'
  category: string;
  stock: number;
  discount?: number;
  original_price?: number; // ✅ Ajouté
  sections?: string[];
  created_at?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface CategoryStat {
  category: string;
  product_count: number;
}

// Récupérer tous les produits
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
}

// Récupérer les produits par section avec limite optionnelle
export async function getProductsBySection(section: string, limit?: number) {
  let query = supabase
    .from('products')
    .select('*')
    .contains('sections', [section])
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching products for section ${section}:`, error);
    return [];
  }

  return data as Product[];
}

// Récupérer un produit par son slug
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  return data as Product;
}

// Récupérer un produit par son ID
export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }

  return data as Product;
}

// Récupérer les produits en promotion (discount >= 50%)
export async function getDealsProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gte('discount', 50)
    .order('discount', { ascending: false });

  if (error) {
    console.error('Error fetching deals products:', error);
    return [];
  }

  return data as Product[];
}

// Récupérer les produits par catégorie
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data as Product[];
}

// Récupérer les stats des catégories
export async function getCategoryStats() {
  const { data, error } = await supabase
    .from('category_stats')
    .select('*')
    .order('product_count', { ascending: false });

  if (error) {
    console.error('Error fetching category stats:', error);
    return [];
  }

  return data as CategoryStat[];
}

// Récupérer toutes les commandes
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data as Order[];
}

// Récupérer une commande par ID
export async function getOrderById(id: number) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data as Order;
}

// Récupérer les items d'une commande
export async function getOrderItems(orderId: number) {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error('Error fetching order items:', error);
    return [];
  }

  return data as OrderItem[];
}

// Créer une commande
export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  return data as Order;
}

// Créer les items d'une commande
export async function createOrderItems(items: {
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}[]) {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items)
    .select();

  if (error) {
    console.error('Error creating order items:', error);
    throw error;
  }

  return data as OrderItem[];
}

// Mettre à jour le statut d'une commande
export async function updateOrderStatus(orderId: number, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  return data as Order;
}

// Créer un produit
export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data as Product;
}

// Mettre à jour un produit
export async function updateProduct(id: number, productData: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data as Product;
}

// Supprimer un produit
export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }

  return true;
}

// Rechercher des produits
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data as Product[];
}