import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { groups, grandTotal, updateQty, remove, clearShop, checkoutShops } =
    useCart();
  const [selected, setSelected] = useState(new Set());

  const toggleShop = (rid) => {
    const s = new Set(selected);
    s.has(rid) ? s.delete(rid) : s.add(rid);
    setSelected(s);
  };

  const checkout = async () => {
    if (selected.size === 0) return alert("Select at least one shop.");
    const restaurant_ids = Array.from(selected);
    const orders = await checkoutShops(restaurant_ids);
    console.log("Created orders:", orders);
  };

  if (!groups.length) return <p>Your cart is empty.</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      {groups.map((g) => (
        <div
          key={g.restaurant_id}
          style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}
        >
          <div>
            <input
              type="checkbox"
              checked={selected.has(g.restaurant_id)}
              onChange={() => toggleShop(g.restaurant_id)}
            />
            <strong>{g.restaurant_name}</strong> (Delivery: $
            {g.delivery_fee.toFixed(2)})
          </div>

          {g.items.map((it) => (
            <div key={it.cart_item_id}>
              {it.name} — ${it.unit_price} ×
              <input
                type="number"
                min="1"
                value={it.qty}
                onChange={(e) =>
                  updateQty(it.cart_item_id, Number(e.target.value))
                }
                style={{ width: 50 }}
              />
              = ${it.line_total}
              <button onClick={() => remove(it.cart_item_id)}>Remove</button>
            </div>
          ))}

          <div>
            Subtotal: ${g.subtotal} | Total (shop): ${g.total}
          </div>
          <button onClick={() => clearShop(g.restaurant_id)}>
            Clear this shop
          </button>
        </div>
      ))}

      <hr />
      <div>Grand Total: ${grandTotal}</div>
      <button onClick={checkout}>Checkout selected shop(s)</button>
    </div>
  );
}
