import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const ordersURL = window.APP_CONFIG.ORDERS_URL;

  const getOrders = () => {
    fetch(ordersURL)
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div>
      <h2>📑 My Orders (PostgreSQL)</h2>

      <button onClick={getOrders}>Refresh Orders</button>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map(o => (
        <div key={o.id} style={{ border: "1px solid black", margin: "5px", padding: "5px" }}>
          Order #{o.id} — {o.item} x {o.qty}
        </div>
      ))}
    </div>
  );
}
