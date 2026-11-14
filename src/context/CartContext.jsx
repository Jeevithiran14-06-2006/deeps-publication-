import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('vowles_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('vowles_cart', JSON.stringify(cart));
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      // Check if already in cart
      const exists = prev.find((p) => p.id === item.id && p.type === item.type);
      if (exists) {
        setIsCartOpen(true);
        return prev;
      }
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, type) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount: cart.length
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}