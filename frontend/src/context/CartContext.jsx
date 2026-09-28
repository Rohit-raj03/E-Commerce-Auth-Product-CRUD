import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isUser } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items');
      return saved ? JSON.parse(saved) : { items: [], totalItems: 0, totalPrice: 0 };
    } catch {
      return { items: [], totalItems: 0, totalPrice: 0 };
    }
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync cart from backend when user logs in
  useEffect(() => {
    if (user && isUser) {
      fetchBackendCart();
    } else if (!user) {
      // Clear or keep local
      const saved = localStorage.getItem('cart_items');
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch {
          setCart({ items: [], totalItems: 0, totalPrice: 0 });
        }
      }
    }
  }, [user, isUser]);

  // Recalculate totals helper
  const calculateTotals = (items) => {
    let totalItems = 0;
    let totalPrice = 0;
    items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += (item.price || 0) * item.quantity;
    });
    return { items, totalItems, totalPrice };
  };

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
        localStorage.setItem('cart_items', JSON.stringify(res.data.cart));
      }
    } catch (err) {
      console.error('Failed to fetch backend cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      showToast('Product is out of stock', 'error');
      return false;
    }

    const qtyToAdd = Math.max(1, Number(quantity));

    // Optimistic local update
    setCart((prev) => {
      const existingIndex = prev.items.findIndex(
        (it) => it.productId === (product._id || product.id)
      );
      let updatedItems = [...prev.items];

      if (existingIndex > -1) {
        const currentQty = updatedItems[existingIndex].quantity;
        const newQty = currentQty + qtyToAdd;
        if (newQty > product.stock) {
          showToast(`Cannot add more. Available stock limit is ${product.stock}.`, 'error');
          return prev;
        }
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: newQty,
          subtotal: (product.price || 0) * newQty,
        };
      } else {
        if (qtyToAdd > product.stock) {
          showToast(`Requested quantity exceeds stock (${product.stock}).`, 'error');
          return prev;
        }
        updatedItems.push({
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          quantity: qtyToAdd,
          subtotal: (product.price || 0) * qtyToAdd,
        });
      }

      const updated = calculateTotals(updatedItems);
      localStorage.setItem('cart_items', JSON.stringify(updated));
      showToast(`"${product.name}" added to cart!`, 'success');
      return updated;
    });

    // Sync to backend if authenticated user
    if (user && isUser) {
      try {
        const res = await api.post('/cart/add', {
          productId: product._id || product.id,
          quantity: qtyToAdd,
        });
        if (res.data.success && res.data.cart) {
          setCart(res.data.cart);
          localStorage.setItem('cart_items', JSON.stringify(res.data.cart));
        }
      } catch (err) {
        console.warn('Backend cart sync error:', err.response?.data?.message || err.message);
      }
    }

    return true;
  };

  const updateQuantity = async (productId, newQuantity) => {
    const qty = Number(newQuantity);
    if (isNaN(qty) || qty < 1) {
      return;
    }

    const currentItem = cart.items.find((it) => it.productId === productId);
    if (!currentItem) return;

    if (qty > currentItem.stock) {
      showToast(`Cannot exceed available stock of ${currentItem.stock}`, 'error');
      return;
    }

    // Local update
    setCart((prev) => {
      const updatedItems = prev.items.map((it) => {
        if (it.productId === productId) {
          return {
            ...it,
            quantity: qty,
            subtotal: it.price * qty,
          };
        }
        return it;
      });
      const updated = calculateTotals(updatedItems);
      localStorage.setItem('cart_items', JSON.stringify(updated));
      return updated;
    });

    // Backend sync
    if (user && isUser) {
      try {
        const res = await api.put(`/cart/item/${productId}`, { quantity: qty });
        if (res.data.success && res.data.cart) {
          setCart(res.data.cart);
          localStorage.setItem('cart_items', JSON.stringify(res.data.cart));
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to update quantity', 'error');
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter((it) => it.productId !== productId);
      const updated = calculateTotals(updatedItems);
      localStorage.setItem('cart_items', JSON.stringify(updated));
      showToast('Item removed from cart', 'info');
      return updated;
    });

    if (user && isUser) {
      try {
        const res = await api.delete(`/cart/item/${productId}`);
        if (res.data.success && res.data.cart) {
          setCart(res.data.cart);
          localStorage.setItem('cart_items', JSON.stringify(res.data.cart));
        }
      } catch (err) {
        console.error('Failed to remove item from backend:', err);
      }
    }
  };

  const clearCart = async () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
    localStorage.removeItem('cart_items');

    if (user && isUser) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        console.error('Failed to clear backend cart:', err);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items || [],
        totalItems: cart.totalItems || 0,
        totalPrice: cart.totalPrice || 0,
        loading,
        toastMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-300">
          <div
            className={`flex items-center space-x-3 px-5 py-3 rounded-xl shadow-2xl text-white font-medium text-sm backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-rose-600/95 border border-rose-500'
                : toastMessage.type === 'info'
                ? 'bg-slate-800/95 border border-slate-700'
                : 'bg-emerald-600/95 border border-emerald-500'
            }`}
          >
            <span>
              {toastMessage.type === 'error' ? '⚠️' : toastMessage.type === 'info' ? 'ℹ️' : '✅'}
            </span>
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
