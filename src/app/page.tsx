import Hero from "@/components/home/Hero";
import CategoryRow from "@/components/home/CategoryRow";
import Deals from "@/components/home/Deals";
import PopularProducts from "@/components/home/PopularProducts";
import Trending from "@/components/home/Trending";
import PlusRecents from "@/components/home/PlusRecents";
import SidebarCategorie from "@/components/SidebarCategorie";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero pleine largeur */}
        <div className="mb-8">
          <Hero />
        </div>

        {/* Layout avec Sidebar */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <SidebarCategorie />

          {/* Contenu principal */}
          <div className="flex-1 space-y-12">
            <CategoryRow />
            <Deals />
            <PopularProducts />
            <Trending />
            <PlusRecents />
          </div>
        </div>
      </div>
    </main>
  );
}