import React, { useEffect, useState } from "react";
import axios from "axios";

function Menu() {
  const [groupedMenu, setGroupedMenu] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/menu")
      .then((res) => {
        console.log("Results returned:", JSON.stringify(res.data, null, 2)); // Pretty JSON
        const grouped = {};
        res.data.forEach((item) => {
          if (!grouped[item.restaurant_name]) {
            grouped[item.restaurant_name] = [];
          }
          grouped[item.restaurant_name].push(item);
        });
        setGroupedMenu(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Menu</h2>
      {Object.entries(groupedMenu).map(([restaurant, items]) => (
        <div key={restaurant} style={{ marginBottom: "3rem" }}>
          <h3
            style={{ borderBottom: "2px solid #ccc", paddingBottom: "0.5rem" }}
          >
            {restaurant}
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  width: "200px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  padding: "1rem",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <h4>
                  {item.name} - ${Number(item.price).toFixed(2)}
                </h4>

                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                  {item.description}
                </p>
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
