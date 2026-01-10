"use client";


// src/components/home/Features.jsx
export default function Features() {
  const features = [
    { title: "Livraison rapide", icon: "🚀" },
    { title: "Paiement sécurisé", icon: "💳" },
    { title: "Produits premium", icon: "⭐" },
  ];

  return (
    <section className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {features.map((f, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-2xl shadow-card flex flex-col items-center text-center hover:-translate-y-1 transition"
        >
          <div className="text-4xl mb-4">{f.icon}</div>
          <h3 className="font-semibold text-lg">{f.title}</h3>
        </div>
      ))}
    </section>
  );
}
