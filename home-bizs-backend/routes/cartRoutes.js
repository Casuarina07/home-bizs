const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

/** GET /api/cart
 * Returns cart grouped by restaurant:
 * { groups: [{ restaurant_id, restaurant_name, delivery_fee, items: [...], subtotal, total }], grand_total }
 */
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;

  const [rows] = await db.query(
    `SELECT ci.id as cart_item_id, ci.menu_item_id, ci.qty, ci.unit_price, ci.line_total,
            r.id as restaurant_id, r.name as restaurant_name, COALESCE(r.delivery_fee,0) as delivery_fee,
            mi.name as item_name
     FROM cart_items ci
     JOIN menu_items mi ON mi.id = ci.menu_item_id
     JOIN restaurants r ON r.id = ci.restaurant_id
     WHERE ci.user_id=?`,
    [userId]
  );

  // group by restaurant
  const groupsMap = new Map();
  rows.forEach((r) => {
    if (!groupsMap.has(r.restaurant_id)) {
      groupsMap.set(r.restaurant_id, {
        restaurant_id: r.restaurant_id,
        restaurant_name: r.restaurant_name,
        delivery_fee: Number(r.delivery_fee || 0),
        items: [],
        subtotal: 0,
        total: 0,
      });
    }
    const g = groupsMap.get(r.restaurant_id);
    g.items.push({
      cart_item_id: r.cart_item_id,
      menu_item_id: r.menu_item_id,
      name: r.item_name,
      qty: r.qty,
      unit_price: Number(r.unit_price),
      line_total: Number(r.line_total),
    });
    g.subtotal += Number(r.line_total);
  });

  const groups = Array.from(groupsMap.values()).map((g) => ({
    ...g,
    subtotal: Number(g.subtotal.toFixed(2)),
    total: Number((g.subtotal + g.delivery_fee).toFixed(2)),
  }));

  const grand_total = Number(
    groups.reduce((s, g) => s + g.total, 0).toFixed(2)
  );
  res.json({ groups, grand_total });
});

/** POST /api/cart/add { menu_item_id, qty }
 * Upsert into cart_items for this user (multi-restaurant allowed).
 */
router.post("/add", auth, async (req, res) => {
  const userId = req.user.id;
  const { menu_item_id, qty = 1 } = req.body;
  if (!menu_item_id)
    return res.status(400).json({ message: "menu_item_id required" });

  const [[mi]] = await db.query(
    "SELECT id, price, restaurant_id FROM menu_items WHERE id=?",
    [menu_item_id]
  );
  if (!mi) return res.status(404).json({ message: "Menu item not found" });

  // Upsert by (user_id, menu_item_id)
  const [[existing]] = await db.query(
    "SELECT * FROM cart_items WHERE user_id=? AND menu_item_id=?",
    [userId, mi.id]
  );

  if (existing) {
    const newQty = existing.qty + qty;
    const lineTotal = (newQty * mi.price).toFixed(2);
    await db.query(
      "UPDATE cart_items SET qty=?, unit_price=?, line_total=? WHERE id=?",
      [newQty, mi.price, lineTotal, existing.id]
    );
  } else {
    await db.query(
      "INSERT INTO cart_items (user_id, restaurant_id, menu_item_id, qty, unit_price, line_total) VALUES (?,?,?,?,?,?)",
      [
        userId,
        mi.restaurant_id,
        mi.id,
        qty,
        mi.price,
        (qty * mi.price).toFixed(2),
      ]
    );
  }
  res.json({ ok: true });
});

/** PATCH /api/cart/item/:id { qty } */
router.patch("/item/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;
  if (!qty || qty < 1)
    return res.status(400).json({ message: "Qty must be >= 1" });

  const [[ci]] = await db.query("SELECT * FROM cart_items WHERE id=?", [id]);
  if (!ci) return res.status(404).json({ message: "Cart item not found" });

  const lineTotal = (qty * ci.unit_price).toFixed(2);
  await db.query("UPDATE cart_items SET qty=?, line_total=? WHERE id=?", [
    qty,
    lineTotal,
    id,
  ]);
  res.json({ ok: true });
});

/** DELETE /api/cart/item/:id */
router.delete("/item/:id", auth, async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM cart_items WHERE id=?", [id]);
  res.json({ ok: true });
});

/** POST /api/cart/clear (all shops) */
router.post("/clear", auth, async (req, res) => {
  const userId = req.user.id;
  await db.query("DELETE FROM cart_items WHERE user_id=?", [userId]);
  res.json({ ok: true });
});

/** POST /api/cart/clear-shop { restaurant_id } (clear just one shop) */
router.post("/clear-shop", auth, async (req, res) => {
  const userId = req.user.id;
  const { restaurant_id } = req.body;
  await db.query("DELETE FROM cart_items WHERE user_id=? AND restaurant_id=?", [
    userId,
    restaurant_id,
  ]);
  res.json({ ok: true });
});

/** POST /api/cart/checkout
 * Body can be:
 *   { restaurant_ids: [1,2] }  -> checkout multiple shops at once
 * or { restaurant_id: 1 }      -> checkout a single shop
 * Creates 1 order per restaurant and moves items.
 */
router.post("/checkout", auth, async (req, res) => {
  const userId = req.user.id;
  let { restaurant_ids, restaurant_id } = req.body;
  if (restaurant_id && !restaurant_ids) restaurant_ids = [restaurant_id];
  if (!Array.isArray(restaurant_ids) || restaurant_ids.length === 0)
    return res.status(400).json({ message: "restaurant_ids required" });

  // Get delivery fee per restaurant
  const [restRows] = await db.query(
    "SELECT id, COALESCE(delivery_fee,0) as delivery_fee FROM restaurants WHERE id IN (?)",
    [restaurant_ids]
  );
  const feeMap = new Map(restRows.map((r) => [r.id, Number(r.delivery_fee)]));

  // 1. Get cart items for these restaurants
  const [items] = await db.query(
    `SELECT * FROM cart_items WHERE user_id=? AND restaurant_id IN (?) ORDER BY restaurant_id`,
    [userId, restaurant_ids]
  );
  if (!items.length)
    return res.status(400).json({ message: "No items for selected shop(s)" });

  // 2. Group by restaurant
  const byShop = new Map();
  items.forEach((ci) => {
    if (!byShop.has(ci.restaurant_id)) byShop.set(ci.restaurant_id, []);
    byShop.get(ci.restaurant_id).push(ci);
  });

  const createdOrders = [];

  // 3. For each restaurant, create an order + order_items
  for (const [rid, list] of byShop.entries()) {
    const subtotal = list.reduce((s, r) => s + Number(r.line_total), 0);
    const delivery = feeMap.get(rid) || 0;
    const total = Number((subtotal + delivery).toFixed(2));

    const [orderRes] = await db.query(
      "INSERT INTO orders (user_id, restaurant_id, status, subtotal, total, created_at, updated_at) VALUES (?,?, 'placed', ?, ?, NOW(), NOW())",
      [userId, rid, subtotal, total]
    );
    const orderId = orderRes.insertId;

    const values = list.map((r) => [
      orderId,
      r.menu_item_id,
      r.qty,
      r.unit_price,
      r.line_total,
    ]);
    await db.query(
      "INSERT INTO order_items (order_id, menu_item_id, qty, unit_price, line_total) VALUES ?",
      [values]
    );

    createdOrders.push({
      order_id: orderId,
      restaurant_id: rid,
      subtotal,
      delivery,
      total,
    });
  }

  // 4. Remove checked-out items from cart
  await db.query(
    "DELETE FROM cart_items WHERE user_id=? AND restaurant_id IN (?)",
    [userId, restaurant_ids]
  );

  res.json({ orders: createdOrders });
});

module.exports = router;
