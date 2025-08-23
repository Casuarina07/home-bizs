// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const refresh = async () => {
    const { data } = await api.get("/api/cart");
    setGroups(data.groups || []);
    setGrandTotal(data.grand_total || 0);
  };

  const add = async (menu_item_id, qty = 1) => {
    await api.post("/api/cart/add", { menu_item_id, qty });
    await refresh();
  };
  const updateQty = async (id, qty) => {
    await api.patch(`/api/cart/item/${id}`, { qty });
    await refresh();
  };
  const remove = async (id) => {
    await api.delete(`/api/cart/item/${id}`);
    await refresh();
  };
  const clearShop = async (restaurant_id) => {
    await api.post("/api/cart/clear-shop", { restaurant_id });
    await refresh();
  };
  const checkoutShops = async (restaurant_ids) => {
    const { data } = await api.post("/api/cart/checkout", { restaurant_ids });
    await refresh();
    return data.orders;
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <CartCtx.Provider
      value={{
        groups,
        grandTotal,
        add,
        updateQty,
        remove,
        clearShop,
        checkoutShops,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}
