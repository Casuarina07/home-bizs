const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all menu items
router.get("/", async (req, res) => {
  const [rows] = await db.query(`
        SELECT m.*, r.name AS restaurant_name
        FROM menu_items m
        JOIN restaurants r ON m.restaurant_id = r.id
        ORDER BY r.name
      `);

  res.json(rows);
});

// POST new menu item
router.post("/", async (req, res) => {
  const { restaurant_id, name, description, price, image_url } = req.body;
  await db.query(
    "INSERT INTO menu_items (restaurant_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)",
    [restaurant_id, name, description, price, image_url]
  );
  res.status(201).json({ message: "Menu item created" });
});

module.exports = router;
