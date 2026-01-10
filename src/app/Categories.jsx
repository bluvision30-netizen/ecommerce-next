import { Link } from "react-router-dom";

export default function Categories() {
  const categories = [
    { name: "Téléphones", slug: "phones" },
    { name: "Accessoires", slug: "accessories" },
    { name: "Laptops", slug: "laptops" },
    { name: "Télévisions", slug: "tv" }
  ];

  return (
    <div className="container">
      <h1>Catégories</h1>

      <div className="grid">
        {categories.map(c => (
          <Link key={c.slug} to={`/products/${c.slug}`} className="card">
            <h3>{c.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
