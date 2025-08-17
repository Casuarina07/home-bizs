// src/pages/RestaurantMenu.js
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Menu.css"; // reuse the same card/grid styles

export default function RestaurantMenu() {
  const { id } = useParams(); // restaurant_id from URL
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://api.home-bizs.com:3001/api/menu")
      .then((res) => {
        const filtered = res.data.filter(
          (i) => String(i.restaurant_id) === String(id)
        );
        setItems(filtered);
        setName(filtered[0]?.restaurant_name || "Restaurant");
      })
      .catch(() => setError("Failed to load restaurant menu."))
      .finally(() => setLoading(false));
  }, [id]);

  const inc = (pid) => setQty((q) => ({ ...q, [pid]: (q[pid] || 1) + 1 }));
  const dec = (pid) =>
    setQty((q) => ({ ...q, [pid]: Math.max(1, (q[pid] || 1) - 1) }));

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="menu-page">
      <div className="shop-header">
        <h2 className="menu-title" style={{ marginBottom: 0 }}>
          {name}
        </h2>
        <div className="back-link">
          <Link to="/menu" className="back-to-menu">
            <span className="arrow">←</span> Back to All Restaurants
          </Link>
        </div>
      </div>

      <div className="menu-grid">
        {items.map((item) => (
          <article key={item.id} className="menu-card">
            <Link to={`/menu/${item.id}`} className="menu-img-wrap">
              <img src={item.image_url} alt={item.name} className="menu-img" />
            </Link>

            <div className="menu-card-body">
              <Link to={`/menu/${item.id}`} className="menu-link">
                <h4 className="menu-item-name">{item.name}</h4>
              </Link>

              <p className="menu-price">${Number(item.price).toFixed(2)}</p>

              <div className="qty-row">
                <button onClick={() => dec(item.id)} className="qty-btn">
                  −
                </button>
                <span className="qty-value">{qty[item.id] || 1}</span>
                <button onClick={() => inc(item.id)} className="qty-btn">
                  +
                </button>
              </div>

              <button className="add-basket-btn">Add to Cart</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
