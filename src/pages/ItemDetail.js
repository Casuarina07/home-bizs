import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/menu/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    console.log("Added to cart:", { ...item, quantity });
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (!item) return <p>Loading...</p>;

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/menu")}
        style={{
          alignSelf: "flex-start",
          marginBottom: "1rem",
          background: "none",
          border: "none",
          color: "#007bff",
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        ← Back to Menu
      </button>

      {/* Image */}
      <img
        src={item.image_url}
        alt={item.name}
        style={{
          width: "100%",
          borderRadius: "12px",
          objectFit: "cover",
          maxHeight: "300px",
        }}
      />

      {/* Details */}
      <h2 style={{ marginTop: "1.5rem" }}>{item.name}</h2>
      <p style={{ color: "#555", textAlign: "center", margin: "0.5rem 0" }}>
        {item.description}
      </p>
      <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        ${Number(item.price).toFixed(2)}
      </p>

      {/* Quantity with + / - buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "1rem",
          gap: "0.5rem",
        }}
      >
        <label htmlFor="quantity">Quantity:</label>
        <button
          onClick={decrement}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          readOnly
          style={{
            width: "50px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "5px",
            height: "30px",
          }}
        />
        <button
          onClick={increment}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        style={{
          marginTop: "1.5rem",
          backgroundColor: "#000",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ItemDetail;
