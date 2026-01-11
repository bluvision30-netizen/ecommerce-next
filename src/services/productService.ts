// Types pour les produits
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

// Données de démonstration
const mockProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: 800000,
    originalPrice: 950000,
    discount: 16,
    image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
    category: "Téléphones",
    description: "Dernier iPhone avec puce A16 Bionic et caméra haute résolution 48MP",
    rating: 4.8,
    reviews: 256,
    inStock: true,
  },
  {
    id: 2,
    name: "MacBook Pro 14\"",
    price: 1450000,
    originalPrice: 1800000,
    discount: 19,
    image: "https://cdn.thewirecutter.com/wp-content/media/2024/07/laptopstopicpage-2048px-3685-3x2-1.jpg?auto=webp&quality=75&crop=3:2,smart&width=400",
    category: "Laptops",
    description: "PC portable performant avec puce M2 Pro pour le travail et le jeu",
    rating: 4.9,
    reviews: 189,
    inStock: true,
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    price: 650000,
    originalPrice: 750000,
    discount: 13,
    image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
    category: "Téléphones",
    description: "Smartphone Android premium avec écran AMOLED 120Hz",
    rating: 4.7,
    reviews: 312,
    inStock: true,
  },
  {
    id: 4,
    name: "AirPods Pro",
    price: 180000,
    originalPrice: 220000,
    discount: 18,
    image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
    category: "Accessoires",
    description: "Écouteurs sans fil avec réduction de bruit active",
    rating: 4.6,
    reviews: 478,
    inStock: true,
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 1200000,
    originalPrice: 1450000,
    discount: 17,
    image: "https://cdn.thewirecutter.com/wp-content/media/2024/07/laptopstopicpage-2048px-3685-3x2-1.jpg?auto=webp&quality=75&crop=3:2,smart&width=400",
    category: "Laptops",
    description: "Ordinateur portable professionnel haute performance",
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
  {
    id: 6,
    name: "Samsung QLED 55\"",
    price: 950000,
    originalPrice: 1150000,
    discount: 17,
    image: "https://www.sencor.com/Sencor/media/content/Products/SLE-65US800TCSB-2.jpg",
    category: "TV",
    description: "Téléviseur 4K QLED avec HDR et smart TV",
    rating: 4.8,
    reviews: 234,
    inStock: true,
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    price: 250000,
    originalPrice: 300000,
    discount: 17,
    image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
    category: "Accessoires",
    description: "Casque sans fil premium avec ANC",
    rating: 4.9,
    reviews: 567,
    inStock: true,
  },
  {
    id: 8,
    name: "iPad Air 11\"",
    price: 720000,
    originalPrice: 850000,
    discount: 15,
    image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png",
    category: "Téléphones",
    description: "Tablette Apple avec puce M1",
    rating: 4.7,
    reviews: 289,
    inStock: true,
  },
];

// Fonction pour récupérer tous les produits
export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts;
}

// Fonction pour récupérer un produit par ID
export async function getProductById(id: number): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.find((product) => product.id === id);
}

// Fonction pour récupérer les produits par catégorie
export async function getProductsByCategory(category: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

// Fonction pour récupérer les produits en promotion
export async function getDeals(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.filter((product) => product.discount && product.discount > 0);
}

// Fonction pour rechercher des produits
export async function searchProducts(query: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
  );
}