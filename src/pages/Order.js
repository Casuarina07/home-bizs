import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!orders.length) return <p>You have no past orders.</p>;

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order.order_id}>
          <div className="order-header">
            <strong>{order.restaurant_name}</strong>
            <span className={`status ${order.status}`}>{order.status}</span>
          </div>

          <div className="order-meta">
            <span>
              Placed on: {new Date(order.created_at).toLocaleString()}
            </span>
            <span>Total: ${Number(order.total).toFixed(2)}</span>
          </div>

          <div className="order-items">
            {order.items.map((it) => (
              <div className="order-item" key={it.id}>
                {it.item_name} — ${it.unit_price.toFixed(2)} × {it.qty} = $
                {it.line_total.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
