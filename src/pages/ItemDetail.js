import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ItemDetail.css"; // 👈 Import from styles folder

const API_BASE = "http://api.home-bizs.com:3001/api";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`${API_BASE}/menu/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (!item) return <p>Loading...</p>;

  return (
    <div className="item-detail-page">
      <button onClick={() => navigate("/menu")} className="back-btn">
        ← Back to Menu
      </button>

      <div className="item-card">
        <img src={item.image_url} alt={item.name} className="item-img" />

        <div className="item-content">
          <h1 className="item-title">{item.name}</h1>
          <p className="item-description">{item.description}</p>
          <p className="item-price">${Number(item.price).toFixed(2)}</p>

          <div className="qty-row">
            <button onClick={decrement} className="qty-btn">
              −
            </button>
            <span className="qty-value">{quantity}</span>
            <button onClick={increment} className="qty-btn">
              +
            </button>
          </div>

          <button className="add-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
