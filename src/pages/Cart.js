import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

export default function Cart() {
  const { groups, updateQty, remove, clearShop, checkoutShops } = useCart();
  const [selected, setSelected] = useState(new Set());

  // tick all shops by default
  useEffect(() => {
    const all = new Set(groups.map((g) => g.restaurant_id));
    setSelected(all);
  }, [groups]);

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

  // recalc grand total based only on ticked shops
  const filteredTotal = groups
    .filter((g) => selected.has(g.restaurant_id))
    .reduce((sum, g) => sum + g.total, 0);

  if (!groups.length) return <p className="empty-cart">Your cart is empty.</p>;

  return (
    <div className="cart-page">
      <h2 className="cart-title">Your Cart</h2>

      {groups.map((g) => (
        <div className="cart-card" key={g.restaurant_id}>
          <div className="shop-header">
            <label className="shop-select">
              <input
                type="checkbox"
                className="styled-checkbox"
                checked={selected.has(g.restaurant_id)}
                onChange={() => toggleShop(g.restaurant_id)}
              />
              <span className="shop-name">{g.restaurant_name}</span>
              <span className="shop-meta">
                (Delivery: ${g.delivery_fee.toFixed(2)})
              </span>
            </label>
            <button
              className="btn btn-ghost"
              onClick={() => clearShop(g.restaurant_id)}
            >
              Clear this shop
            </button>
          </div>

          {g.items.map((it) => (
            <div className="cart-item" key={it.cart_item_id}>
              <div className="item-name">{it.name}</div>
              <div className="item-price">${it.unit_price.toFixed(2)}</div>

              <div className="qty">
                <input
                  className="qty-input"
                  type="number"
                  min="1"
                  value={it.qty}
                  onChange={(e) =>
                    updateQty(it.cart_item_id, Number(e.target.value))
                  }
                />
              </div>

              <div className="item-line-total">${it.line_total.toFixed(2)}</div>
              <button
                className="btn btn-link"
                onClick={() => remove(it.cart_item_id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="shop-total">
            <span>Subtotal:</span> <strong>${g.subtotal.toFixed(2)}</strong>
            <span className="divider">|</span>
            <span>Total (shop):</span> <strong>${g.total.toFixed(2)}</strong>
          </div>
        </div>
      ))}

      <div className="cart-footer">
        <div className="grand-total">
          Grand Total: <strong>${filteredTotal.toFixed(2)}</strong>
        </div>
        <button className="btn btn-primary" onClick={checkout}>
          Checkout selected shop(s)
        </button>
      </div>
    </div>
  );
}
