export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} FCFA</p>
      <button className="btn">Ajouter au panier</button>
    </div>
  );
}
