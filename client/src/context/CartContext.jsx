import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const getCartKey = (user) => {
  if (!user?._id || user.role !== "user") {
    return null;
  }

  return `foodCart_${user._id}`;
};

const getSavedCart = (user) => {
  const cartKey = getCartKey(user);

  if (!cartKey) {
    return [];
  }

  const savedUserCart = localStorage.getItem(cartKey);

  if (savedUserCart) {
    return JSON.parse(savedUserCart);
  }

  // Migration fallback for old cart key from earlier version
  const oldCart = localStorage.getItem("foodCart");

  if (oldCart) {
    localStorage.setItem(cartKey, oldCart);
    localStorage.removeItem("foodCart");
    return JSON.parse(oldCart);
  }

  return [];
};

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState(() => getSavedCart(user));
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    setCartReady(false);

    if (!user || user.role !== "user") {
      setCartItems([]);
      return;
    }

    setCartItems(getSavedCart(user));
    setCartReady(true);
  }, [user?._id, user?.role]);

  useEffect(() => {
    const cartKey = getCartKey(user);

    if (!cartReady || !cartKey) {
      return;
    }

    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartReady, user?._id, user?.role]);

  const addToCart = (product) => {
    if (cartItems.length > 0) {
      const currentRestaurantId =
        cartItems[0].restaurant?._id || cartItems[0].restaurant;

      const newProductRestaurantId =
        product.restaurant?._id || product.restaurant;

      if (currentRestaurantId !== newProductRestaurantId) {
        return false;
      }
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });

    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    const cartKey = getCartKey(user);

    setCartItems([]);

    if (cartKey) {
      localStorage.removeItem(cartKey);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}