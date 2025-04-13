const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all orders
router.get("/", async (req, res) => {
  const [orders] = await db.query(`
    SELECT o.id, u.name AS customer_name, r.name AS restaurant_name, o.total, o.created_at
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN restaurants r ON o.restaurant_id = r.id
  `);
  res.json(orders);
});

module.exports = router;
