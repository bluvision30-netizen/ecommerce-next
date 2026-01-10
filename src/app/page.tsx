import Hero from "@/components/home/Hero";
import CategoryRow from "@/components/home/CategoryRow";
import Deals from "@/components/home/Deals";
import PopularProducts from "@/components/home/PopularProducts";
import Trending from "@/components/home/Trending";
import PlusRecents from "@/components/home/PlusRecents";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <CategoryRow />
        <Deals />
        <PopularProducts />
        <Trending />
        <PlusRecents />
      </div>
    </main>
  );
}