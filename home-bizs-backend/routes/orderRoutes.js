// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// GET /api/orders
// Fetch all past orders for logged-in user
// router.get("/", auth, async (req, res) => {
//   const userId = req.user.id;

//   const [orders] = await db.query(
//     `SELECT * FROM orders ORDER BY created_at DESC`
//   );

//   // fetch items for each order
//   for (let order of orders) {
//     const [items] = await db.query(
//       `SELECT oi.id, oi.menu_item_id, m.name as item_name, oi.qty, oi.unit_price, oi.line_total
//        FROM order_items oi
//        JOIN menu_items m ON m.id = oi.menu_item_id
//        WHERE oi.order_id = ?`,
//       [order.order_id]
//     );
//     order.items = items;
//   }
//   console.log("Fetched orders:", orders);
//   res.json(orders);
// });

router.get("/", async (req, res) => {
  const [orders] = await db.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  console.log("Fetched orders:", orders); // 👈 log to terminal
  // fetch items for each order
  for (let order of orders) {
    const [items] = await db.query(
      `SELECT oi.id, oi.menu_item_id, m.name as item_name, oi.qty, oi.unit_price, oi.line_total
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       WHERE oi.order_id = ?`,
      [order.order_id]
    );
    order.items = items;
  }

  res.json(orders);
});
// SELECT o.id as order_id, o.restaurant_id, r.name as restaurant_name,
//             o.status, o.subtotal, o.delivery_fee, o.total, o.created_at
//      FROM orders o
//      JOIN restaurants r ON r.id = o.restaurant_id
//      ORDER BY o.created_at DESC
module.exports = router;
