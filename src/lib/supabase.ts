import { createClient } from '@supabase/supabase-js';

// Types pour la base de données
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount: number | null;
  category: string;
  image_url: string;
  rating: number | null;
  reviews_count: number | null;
  in_stock: boolean;
  stock_quantity: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  created_at: string;
}

export interface Order {
  id: number;
  customer_id: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  product_count: number;
  created_at: string;
}

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// FONCTIONS POUR LES PRODUITS
// ============================================

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }

  return data || [];
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }

  return data;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    return [];
  }

  return data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .eq('in_stock', true);

  if (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    return [];
  }

  return data || [];
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création du produit:', error);
    return null;
  }

  return data;
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return null;
  }

  return data;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return false;
  }

  return true;
}

// ============================================
// FONCTIONS POUR LES COMMANDES
// ============================================

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]): Promise<Order | null> {
  // Créer la commande
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (orderError) {
    console.error('Erreur lors de la création de la commande:', orderError);
    return null;
  }

  // Ajouter les articles
  const orderItems = items.map(item => ({
    ...item,
    order_id: orderData.id,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Erreur lors de l\'ajout des articles:', itemsError);
    return null;
  }

  return orderData;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return [];
  }

  return data || [];
}

export async function getOrderById(id: number): Promise<(Order & { items: OrderItem[] }) | null> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError) {
    console.error('Erreur lors de la récupération de la commande:', orderError);
    return null;
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  if (itemsError) {
    console.error('Erreur lors de la récupération des articles:', itemsError);
    return null;
  }

  return {
    ...orderData,
    items: itemsData || [],
  };
}

export async function updateOrderStatus(id: number, status: Order['status']): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return false;
  }

  return true;
}

// ============================================
// FONCTIONS POUR LES CATÉGORIES
// ============================================

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }

  return data || [];
}

// ============================================
// FONCTIONS POUR LES STATISTIQUES
// ============================================

export async function getDashboardStats() {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
    .single();

  if (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return null;
  }

  return data;
}