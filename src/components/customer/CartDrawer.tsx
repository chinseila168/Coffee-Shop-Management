import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Coffee,
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartTotals,
    settings,
  } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCodeInput('');
    }
  };

  const freeDeliveryProgress = Math.min(
    100,
    (cartTotals.subtotal / settings.freeDeliveryThreshold) * 100
  );
  const remainingForFreeDelivery = Math.max(
    0,
    settings.freeDeliveryThreshold - cartTotals.subtotal
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#E8DFD5] animate-slide-left">
          {/* Header */}
          <div className="p-5 border-b border-[#E8DFD5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C89B6D]" />
              <h2 className="font-display font-bold text-lg text-[#2C1810]">
                Your Order ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-[#EFE9DF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Threshold Bar */}
          <div className="bg-[#EFE9DF] px-5 py-2.5 border-b border-[#E8DFD5] text-xs">
            <div className="flex items-center justify-between text-stone-600 font-medium mb-1">
              <span>
                {remainingForFreeDelivery === 0 ? (
                  <strong className="text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Unlocked Free Delivery!
                  </strong>
                ) : (
                  <span>
                    Add <strong>${remainingForFreeDelivery.toFixed(2)}</strong> more for free delivery
                  </span>
                )}
              </span>
              <span className="font-bold text-stone-700">
                ${cartTotals.subtotal.toFixed(2)} / ${settings.freeDeliveryThreshold.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-[#DFD5C7] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#C89B6D] h-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <Coffee className="w-12 h-12 text-stone-300 mx-auto" />
                <div className="text-base font-bold text-[#2C1810]">Your cart is empty</div>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse our handcrafted espresso, single origins, or fresh bakery items to get started.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 bg-[#2C1810] text-[#C89B6D] rounded-xl text-xs font-bold"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#E8DFD5] shadow-sm flex items-start gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-[#2C1810] leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Customization Details */}
                    <div className="text-[11px] text-stone-500 mt-0.5 space-y-0.5">
                      <div>
                        Size: {item.customizations.size}
                        {item.customizations.temperature && ` • ${item.customizations.temperature}`}
                      </div>
                      {item.customizations.milk && <div>Milk: {item.customizations.milk}</div>}
                      {item.customizations.sugar && <div>Sweetness: {item.customizations.sugar}</div>}
                      {item.customizations.extras && item.customizations.extras.length > 0 && (
                        <div className="text-stone-400">
                          +{item.customizations.extras.map(e => e.name).join(', ')}
                        </div>
                      )}
                      {item.customizations.notes && (
                        <div className="italic text-stone-400 text-[10px]">
                          Note: "{item.customizations.notes}"
                        </div>
                      )}
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2ECE4]">
                      <span className="font-bold text-xs text-[#2C1810]">
                        ${item.totalPrice.toFixed(2)}
                      </span>

                      <div className="flex items-center bg-[#FAF7F2] border border-[#DFD5C7] rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-[#EFE9DF] rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-[#EFE9DF] rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8DFD5] space-y-3">
              {/* Coupon Applicator */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon "{appliedCoupon.couponCode}" applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-stone-800 text-[11px] underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. FIRSTSIP, AURA5)"
                      value={couponCodeInput}
                      onChange={e => {
                        setCouponCodeInput(e.target.value);
                        setCouponError('');
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#DFD5C7] text-xs uppercase font-mono focus:outline-none focus:border-[#C89B6D]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] text-xs font-bold rounded-xl"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <div className="text-[11px] text-rose-600 font-medium">{couponError}</div>
                  )}
                </form>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">
                    ${cartTotals.subtotal.toFixed(2)}
                  </span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-${cartTotals.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {cartTotals.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `$${cartTotals.deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${cartTotals.tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#2C1810] pt-2 border-t border-[#F2ECE4]">
                  <span>Total</span>
                  <span className="text-base text-[#2C1810]">${cartTotals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#2C1810] hover:bg-[#3D2318] text-white rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C89B6D]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
