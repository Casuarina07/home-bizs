import React, { useEffect, useState } from "react";
import axios from "axios";

function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/menu")
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Menu</h2>
      {menu.map((item) => (
        <div key={item.id} style={{ marginBottom: "20px" }}>
          <h3>
            {item.name} - ${item.price}
          </h3>
          <p>{item.description}</p>
          <img
            src={item.image_url}
            alt={item.name}
            style={{ width: "100px" }}
          />
        </div>
      ))}
    </div>
  );
}

export default Menu;
