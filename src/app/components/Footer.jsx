
// ==================== Footer.jsx ====================
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-500">E-Shop</h3>
            <p className="text-slate-400 text-sm mb-4">
              Votre destination pour les meilleurs produits tech au Cameroun. 
              Qualité, prix compétitifs et livraison rapide garantis.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-amber-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-amber-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-amber-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-amber-500 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-amber-500 transition">Accueil</Link></li>
              <li><Link to="/products" className="hover:text-amber-500 transition">Produits</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition">Contact</Link></li>
              <li><Link to="/cart" className="hover:text-amber-500 transition">Panier</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/products?category=Téléphones" className="hover:text-amber-500 transition">Téléphones</Link></li>
              <li><Link to="/products?category=Laptops" className="hover:text-amber-500 transition">Laptops</Link></li>
              <li><Link to="/products?category=TV" className="hover:text-amber-500 transition">Télévisions</Link></li>
              <li><Link to="/products?category=Accessoires" className="hover:text-amber-500 transition">Accessoires</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>Douala, Littoral<br/>Cameroun</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-500" />
                <span>+237 6XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                <span>contact@eshop.cm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © 2026 E-Shop. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-slate-400 text-sm">
              <Link to="/privacy" className="hover:text-amber-500 transition">Politique de confidentialité</Link>
              <Link to="/terms" className="hover:text-amber-500 transition">Conditions d'utilisation</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}