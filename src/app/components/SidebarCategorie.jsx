import { useNavigate } from "react-router-dom";
import { Smartphone, Laptop, Tv, Headphones, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function SidebarCategorie() {
  const navigate = useNavigate();

  const categories = [
    { 
      name: "Téléphones", 
      icon: Smartphone,
      count: 8,
      color: "text-blue-600 bg-blue-50"
    },
    { 
      name: "Laptops", 
      icon: Laptop,
      count: 6,
      color: "text-purple-600 bg-purple-50"
    },
    { 
      name: "TV", 
      icon: Tv,
      count: 4,
      color: "text-orange-600 bg-orange-50"
    },
    { 
      name: "Accessoires", 
      icon: Headphones,
      count: 4,
      color: "text-green-600 bg-green-50"
    },
  ];

  const priceRanges = [
    { label: "Prix croissant", value: "price-asc", icon: TrendingUp },
    { label: "Prix décroissant", value: "price-desc", icon: TrendingDown },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handlePriceSort = (sortValue) => {
    navigate(`/products?sort=${sortValue}`);
  };

  return (
    <aside className="w-64 space-y-6 hidden lg:block">
      {/* Section Catégories */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-600" />
          Catégories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/products')}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700 hover:text-amber-600"
          >
            Tous les produits
          </button>
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-amber-600">
                    {cat.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Trier par Prix */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm p-6 border border-amber-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          Trier par prix
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const IconComponent = range.icon;
            return (
              <button
                key={range.value}
                onClick={() => handlePriceSort(range.value)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:bg-amber-100 hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors">
                  <IconComponent className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-amber-700">
                  {range.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Promotions */}
      <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-2">🔥 Offres Spéciales</h3>
        <p className="text-sm text-white/90 mb-4">
          Jusqu'à -50% sur une sélection de produits
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="w-full bg-white text-orange-600 font-semibold py-2 rounded-lg hover:bg-orange-50 transition"
        >
          Voir les offres
        </button>
      </div>
    </aside>
  );
}