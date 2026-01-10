"use client";

import Footer from "../components/Footer";           // ← ./ au lieu de ../
import Navbar from "../components/Navbar";           // ← ./ au lieu de ../
import BestProducts from "../components/home/BestProducts";     // ← ./ au lieu de ../
import Card from "../components/Card";               // ← ./ au lieu de ../
import PlusRecents from "../components/home/PlusRecents";       // ← ./ au lieu de ../
import SidebarCategorie from "../components/SidebarCategorie.tsk";  // ← ./ au lieu de ../

// Ajoutez aussi ces imports manquants :
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import CategoryRow from "../components/home/CategoryRow";
import PopularProducts from "../components/home/PopularProducts";
import Deals from "../components/home/Deals";
import Trending from "../components/home/Trending";

export default function Home() {
  return (
    <>
      {/* Hero en pleine largeur */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Hero />
      </div>
      
      {/* Features en pleine largeur */}
      <Features />
      
      {/* Layout avec sidebar */}
      <div className="flex max-w-7xl mx-auto gap-6 px-6 pb-12">
        <SidebarCategorie />
        <div className="flex-1">
          <CategoryRow />
          <PopularProducts />
          <Deals />
          <Trending />
          <PlusRecents />
          <Footer />
        </div>
      </div>
    </>
  );
}