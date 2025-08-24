// src/pages/Menu.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Menu.css";
import api from "../api";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

let userId = null;
const token = localStorage.getItem("token");
if (token) {
  try {
    const d = jwtDecode(token);
    userId = d.id;
  } catch (e) {
    console.error("Token decode failed:", e);
  }
}

console.log("User ID on Menu:", userId);

function Menu() {
  const { add } = useCart();
  const [groups, setGroups] = useState([]); // [{ id, name, items }]
  const [qty, setQty] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/menu")
      .then((res) => {
        // Group by restaurant_id
        const byId = new Map();
        for (const item of res.data) {
          const id = item.restaurant_id;
          const name = item.restaurant_name || "Unknown";
          if (!byId.has(id)) byId.set(id, { id, name, items: [] });
          byId.get(id).items.push(item);
        }
        // Optional: sort items inside each group
        const arr = Array.from(byId.values()).map((g) => ({
          ...g,
          items: g.items.sort((a, b) =>
            String(a.name).localeCompare(String(b.name))
          ),
        }));
        setGroups(arr);
      })
      .catch(() => setError("Failed to load menu."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (menuItemId) => {
    try {
      console.log("Function triggered");
      const q = qty[menuItemId] || 1;
      await add(menuItemId, q);
      console.log("✅ add() finished successfully");
      toast.success("Added to cart");
    } catch (e) {
      console.error(e);
      toast.error("Could not add to cart. Please login?");
    }
  };

  const inc = (id) => setQty((q) => ({ ...q, [id]: (q[id] || 1) + 1 }));
  const dec = (id) =>
    setQty((q) => ({ ...q, [id]: Math.max(1, (q[id] || 1) - 1) }));

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="menu-page">
      <h2 className="menu-title">Menu</h2>

      {groups.map((group) => {
        const visible = group.items.slice(0, 8);
        const hasMore = group.items.length > 8;

        return (
          <section key={group.id} className="menu-shop">
            <h3 className="shop-name">{group.name}</h3>

            <div className="menu-grid">
              {visible.map((item) => (
                <article key={item.id} className="menu-card">
                  <Link to={`/menu/${item.id}`} className="menu-img-wrap">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="menu-img"
                    />
                  </Link>

                  <div className="menu-card-body">
                    <Link to={`/menu/${item.id}`} className="menu-link">
                      <h4 className="menu-item-name">{item.name}</h4>
                    </Link>
                    <p className="menu-price">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    <div className="qty-row">
                      <button onClick={() => dec(item.id)} className="qty-btn">
                        −
                      </button>
                      <span className="qty-value">{qty[item.id] || 1}</span>
                      <button onClick={() => inc(item.id)} className="qty-btn">
                        +
                      </button>
                    </div>
                    {/* <button className="add-basket-btn">Add to Cart</button>+{" "} */}
                    <button
                      className="add-basket-btn"
                      onClick={() => handleAdd(item.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {hasMore && (
              <button
                className="view-more-wide"
                onClick={() => navigate(`/restaurant/${group.id}`)}
              >
                View more from {group.name}
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default Menu;
