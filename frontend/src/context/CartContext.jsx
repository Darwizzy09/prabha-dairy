import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Load from local storage so cart doesn't disappear when you refresh!
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('prabha_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to local storage every time the cart changes
  useEffect(() => {
    localStorage.setItem('prabha_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // 👉 NEW: We now check for cartItemId (e.g. "12345-250g") instead of just the product _id
      // We keep a fallback to _id just in case there are old items stuck in local storage
      const uniqueIdentifier = product.cartItemId || product._id;
      const itemExists = prevItems.find((item) => (item.cartItemId || item._id) === uniqueIdentifier);
      
      if (itemExists) {
        // If THIS EXACT SIZE exists, increase the quantity
        return prevItems.map((item) =>
          (item.cartItemId || item._id) === uniqueIdentifier 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      }
      // If it's a new size (or new product), add it!
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // 👉 NEW: Updated to use the uniqueIdentifier (cartItemId)
  const decreaseQuantity = (uniqueIdentifier) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.cartItemId || item._id) === uniqueIdentifier
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      )
    );
  };

  // 👉 NEW: Updated to use the uniqueIdentifier (cartItemId)
  const removeFromCart = (uniqueIdentifier) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => (item.cartItemId || item._id) !== uniqueIdentifier)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items (sum of quantities) for the Navbar badge
  const totalItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      decreaseQuantity, 
      removeFromCart, 
      clearCart, 
      totalItemsCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);