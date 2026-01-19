import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const cartURL = window.APP_CONFIG.CART_URL;
  const checkoutURL = window.APP_CONFIG.CHECKOUT_URL;
  const loadCart = () => {
    fetch(cartURL)
      .then(res => res.json())
      .then(data => setCart(data));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const checkout = () => {
    fetch(checkoutURL , {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(() => {
        alert("Order Placed ✅");
        setCart([]); // clear UI
      });
  };

  return (
    <div>
      <h2>🛍 Cart (MongoDB)</h2>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((item, i) => (
        <div key={i}>
          {item.name} - Qty: {item.qty}
        </div>
      ))}

      {cart.length > 0 && (
        <button onClick={checkout} style={{ marginTop: "10px" }}>
          Checkout
        </button>
      )}
    </div>
  );
}
