import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Differentiate by id and selectedDate for bookings
      const cartItemId = product.selectedDate ? `${product.id}-${product.selectedDate}` : product.id;
      
      const existingItem = prevCart.find((item) => 
        (item.cartItemId || item.id) === cartItemId
      );
      
      if (existingItem) {
        return prevCart.map((item) =>
          (item.cartItemId || item.id) === cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, cartItemId, quantity: 1 }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => (item.cartItemId || item.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total price based on price strings (handling "Rs. 399" or "399")
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseInt(item.price.toString().replace(/[^0-9]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};