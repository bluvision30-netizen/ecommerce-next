import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20">
        <div className="text-center py-20">
          <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Votre panier est vide</h2>
          <p className="text-slate-600 mb-8">Ajoutez des produits pour commencer vos achats</p>
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Mon Panier</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl shadow-sm p-6 flex gap-6 border border-slate-100 hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <div className="w-32 h-32 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-110 transition-transform"
                  />
                </div>
              </Link>

              {/* Détails */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-lg font-semibold text-slate-800 hover:text-amber-600 transition">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">{item.category}</p>
                  <p className="text-xl font-bold text-amber-600 mt-2">
                    {item.price.toLocaleString()} FCFA
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Contrôles de quantité */}
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      className="p-2 hover:bg-white rounded-lg transition"
                    >
                      <Minus className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="w-12 text-center font-semibold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="p-2 hover:bg-white rounded-lg transition"
                    >
                      <Plus className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sous-total */}
              <div className="flex-shrink-0 text-right">
                <p className="text-sm text-slate-600 mb-2">Sous-total</p>
                <p className="text-2xl font-bold text-slate-800">
                  {(item.price * item.qty).toLocaleString()} FCFA
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-100 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-700">
                <span>Sous-total ({cart.reduce((sum, item) => sum + item.qty, 0)} article{cart.length > 1 ? 's' : ''})</span>
                <span className="font-semibold">{cartTotal.toLocaleString()} FCFA</span>
              </div>
              
              <div className="flex justify-between text-slate-700">
                <span>Livraison</span>
                <span className="font-semibold text-green-600">Gratuite</span>
              </div>

              <div className="border-t border-amber-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-slate-800">
                  <span>Total</span>
                  <span className="text-2xl text-amber-600">{cartTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
            >
              Procéder au paiement
            </button>

            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 font-medium py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Continuer mes achats
            </Link>

            {/* Informations supplémentaires */}
            <div className="mt-6 pt-6 border-t border-amber-200 space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-green-600">✓</span>
                <span>Livraison gratuite pour toute commande</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-green-600">✓</span>
                <span>Retour gratuit sous 30 jours</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-green-600">✓</span>
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}