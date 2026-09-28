import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const shippingCost = totalPrice > 999 || totalPrice === 0 ? 0 : 99;
  const grandTotal = totalPrice + shippingCost;

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCheckoutSuccess(true);
      clearCart();
    }, 1200);
  };

  if (checkoutSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-[#D5CEC1] p-10 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#24221F] mb-2">Order Confirmed!</h2>
          <p className="text-sm text-[#5F5A52] mb-6">
            Thank you for your purchase. We have received your order and are preparing it for shipment.
          </p>
          <div className="p-4 bg-stone-50 rounded-xl mb-6 text-xs text-stone-600 text-left space-y-1.5">
            <p className="font-medium text-stone-800">Order ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
            <p>Estimated Delivery: 3-5 business days</p>
            <p>Payment Method: Cash on Delivery / Prepaid Demo</p>
          </div>
          <Link
            to="/products"
            onClick={() => setCheckoutSuccess(false)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#24221F] hover:bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto bg-white border border-[#D5CEC1] p-10 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#24221F] mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-[#5F5A52] mb-6">
            Looks like you haven't added any products to your bag yet. Explore our curated catalog!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#24221F] hover:bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Explore Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#24221F]">Shopping Cart</h1>
        <p className="text-xs uppercase tracking-wider text-[#5F5A52] mt-1">
          Review your items and complete your purchase ({totalItems} item{totalItems > 1 ? 's' : ''})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#D5CEC1] rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-[#D5CEC1]/60">
              {cartItems.map((item) => (
                <div key={item.productId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-stone-100 border border-[#D5CEC1]/50 flex-shrink-0"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                    }}
                  />

                  {/* Details & Controls */}
                  <div className="flex-1 w-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        {item.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                        <h3 className="font-medium text-[#24221F] text-base mt-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#5F5A52] mt-0.5">
                          Unit Price: <span className="font-semibold text-stone-900">₹{item.price}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                      {/* Quantity Controls [-] Qty [+] */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-stone-500 mr-1">Qty:</span>
                        <div className="flex items-center border border-[#D5CEC1] rounded-lg bg-stone-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`p-1.5 text-stone-600 hover:text-black transition-colors ${
                              item.quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-8 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`p-1.5 text-stone-600 hover:text-black transition-colors ${
                              item.quantity >= item.stock ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {item.stock <= 5 && (
                          <span className="text-[11px] font-medium text-amber-700 ml-2">
                            Only {item.stock} left in stock
                          </span>
                        )}
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="text-xs text-stone-500">Subtotal: </span>
                        <span className="text-base font-bold text-[#24221F]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-[#5F5A52] px-2">
            <Link to="/products" className="hover:text-black flex items-center space-x-1 font-medium">
              <span>← Continue Shopping</span>
            </Link>
            <button
              onClick={clearCart}
              className="hover:text-rose-600 transition-colors font-medium text-stone-500"
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#D5CEC1] p-6 rounded-2xl shadow-sm space-y-4 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-[#24221F] pb-3 border-b border-[#D5CEC1]">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-semibold text-stone-900">₹{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>

              {shippingCost > 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg leading-snug">
                  Add items worth ₹{(1000 - totalPrice).toLocaleString()} more for free shipping!
                </p>
              )}

              <div className="pt-3 border-t border-[#D5CEC1] flex justify-between items-baseline">
                <span className="font-bold text-base text-[#24221F]">Total Amount</span>
                <span className="font-serif text-2xl font-bold text-[#24221F]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#24221F] hover:bg-black text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
            >
              <span>{checkingOut ? 'Processing Order...' : 'Proceed to Checkout'}</span>
              <ArrowRight size={14} />
            </button>

            <div className="pt-3 flex items-center justify-center space-x-2 text-[11px] text-[#5F5A52]">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
