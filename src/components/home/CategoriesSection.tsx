"use client";

const categories = [
  { name: "Téléphones", image: "https://buyam.co/storage/products/original_ae21b140-dae6-41b6-b336-8a05ce9acd2a.png" },
  { name: "Laptops", image: "https://cdn.thewirecutter.com/wp-content/media/2024/07/laptopstopicpage-2048px-3685-3x2-1.jpg?auto=webp&quality=75&crop=4:3,smart&width=1024" },
  { name: "Télévisions", image: "https://www.sencor.com/Sencor/media/content/Products/SLE-65US800TCSB-2.jpg" },
  { name: "Accessoires", image: "https://www.sencor.com/Sencor/media/content/Products/SLE-65US800TCSB-2.jpg" },
];

export default function CategoriesSection() {
  return (
    <section className="mt-24">
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Catégories populaires
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="group relative overflow-hidden rounded-2xl shadow-card cursor-pointer"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="h-48 w-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
