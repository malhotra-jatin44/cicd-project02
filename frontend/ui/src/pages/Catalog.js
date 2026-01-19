import { useEffect, useState } from "react";

export default function Catalog() {
  const [products, setProducts] = useState([]);
    const productsURL = window.APP_CONFIG?.PRODUCTS_URL;
const cartURL = window.APP_CONFIG?.CART_URL;

console.log("Products:", productsURL);
console.log("Cart:", cartURL);

  useEffect(() => {
    fetch(productsURL)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const addToCart = (product) => {
    fetch(cartURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "user1",
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1
      })
    })
      .then(res => res.json())
      .then(() => alert("Added to Cart ✅"));
  };

  return (
    <div>
      <h2>📦 Catalog (MySQL)</h2>

      {products.map(p => (
        <div key={p.id} style={{ border: "1px solid gray", margin: "5px", padding: "5px" }}>
          {p.name} - ₹{p.price}
          <button onClick={() => addToCart(p)} style={{ marginLeft: "10px" }}>
            Buy
          </button>
        </div>
      ))}
    </div>
  );
}
