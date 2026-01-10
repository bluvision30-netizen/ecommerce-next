"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
// Suppose que tu as un service similaire ; sinon adapte avec localStorage direct
// import { getCart, clearCart, addOrder } from "@/services/orderService";

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart, total } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleCheckout = () => {
    // Logique d'ordre (simulée, adapte avec Supabase plus tard)
    const order = {
      id: Date.now(),
      name,
      email,
      items: cart,
      total,
      date: new Date().toISOString(),
    };
    // addOrder(order); // si tu as le service
    localStorage.setItem("lastOrder", JSON.stringify(order)); // temporaire
    clearCart();
    alert("Commande passée avec succès !");
    router.push("/");
  };

  if (cart.length === 0) return <p className="text-center mt-20">Votre panier est vide.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-12 bg-white rounded-2xl shadow-card">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      <button
        onClick={handleCheckout}
        className="w-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
      >
        Confirmer la commande
      </button>
    </div>
  );
}