const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Use JSON parser
app.use(express.json());

// ✅ Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://home-bizs.com",
      "https://www.home-bizs.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // 👉 set to true only if you’re using cookies
  })
);

// Routes
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");


app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

// Error handler (recommended)
app.use((err, req, res, next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
