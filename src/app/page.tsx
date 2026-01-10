"use client";

import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CategoryRow from "@/components/home/CategoryRow";
import PopularProducts from "@/components/home/PopularProducts";
import Deals from "@/components/home/Deals";
import Trending from "@/components/home/Trending";
import PlusRecents from "@/components/home/PlusRecents";
import SidebarCategorie from "@/components/SidebarCategorie";
import Footer from "@/components/Footer";

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