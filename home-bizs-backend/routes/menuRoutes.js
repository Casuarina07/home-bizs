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

// ✅ GET single menu item by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT m.*, r.name AS restaurant_name
      FROM menu_items m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE m.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching menu item:", err);
    res.status(500).json({ error: "Internal server error" });
  }
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
