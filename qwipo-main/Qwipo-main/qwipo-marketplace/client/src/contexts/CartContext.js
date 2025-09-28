import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'qwipo_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function saveCart(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addItem = (product, qty = 1) => {
    if (!product?._id) return;
    setCart(prev => {
      const items = [...prev.items];
      const idx = items.findIndex(i => i.product._id === product._id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], qty: items[idx].qty + qty };
      } else {
        items.push({ product, qty });
      }
      return { ...prev, items };
    });
  };

  const removeItem = (productId) => {
    setCart(prev => ({ ...prev, items: prev.items.filter(i => i.product._id !== productId) }));
  };

  const clear = () => setCart({ items: [] });

  const totals = useMemo(() => {
    const totalCount = cart.items.reduce((s, i) => s + i.qty, 0);
    const totalAmount = cart.items.reduce((s, i) => s + (i.product?.pricing?.sellingPrice || 0) * i.qty, 0);
    return { totalCount, totalAmount };
  }, [cart.items]);

  const value = useMemo(() => ({
    items: cart.items,
    addItem,
    removeItem,
    clear,
    ...totals,
  }), [cart.items, totals]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
