"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems } = useCart();
  const router = useRouter();

  const cartItemsCount = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">EcoShop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Produits
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User */}
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <User className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}