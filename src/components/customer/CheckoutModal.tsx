import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderType, PaymentMethod } from '../../types';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  Smartphone,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartTotals,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    tables,
    currentCustomer,
    placeOrder,
    settings,
  } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [selectedTable, setSelectedTable] = useState<string>('T-01');
  const [pickupTime, setPickupTime] = useState<string>('15 minutes');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    currentCustomer.addresses[0] || '425 Grand Avenue, Apt 4B, Metropolis'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentBranchTables = tables.filter(t => t.branchId === selectedBranchId && t.status !== 'occupied');
  const activeBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const pointsEarned = Math.round(cartTotals.total * settings.loyaltyEarnRate);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      placeOrder({
        branchId: selectedBranchId,
        orderType,
        tableNumber: orderType === 'dine_in' ? selectedTable : undefined,
        pickupTime: orderType === 'takeaway' ? pickupTime : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
        notes: orderNotes.trim() || undefined,
      });

      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8DFD5] animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C89B6D]">
              Complete Your Coffee Order
            </span>
            <h3 className="text-xl font-display font-bold text-[#2C1810]">Checkout & Payment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-[#EFE9DF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-[#2C1810]">
          {/* Branch selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
              1. Roastery Branch
            </label>
            <select
              value={selectedBranchId}
              onChange={e => setSelectedBranchId(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#DFD5C7] bg-white text-xs font-medium text-[#2C1810]"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.address}
                </option>
              ))}
            </select>
          </div>

          {/* Order Type Toggle */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
              2. Order Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  orderType === 'dine_in'
                    ? 'bg-[#2C1810] text-[#C89B6D] border-[#2C1810] shadow-sm'
                    : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-[#C89B6D]'
                }`}
              >
                <span>🍽️ Dine-In</span>
                <span className="text-[10px] opacity-80">Cafe Table</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-[#2C1810] text-[#C89B6D] border-[#2C1810] shadow-sm'
                    : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-[#C89B6D]'
                }`}
              >
                <span>🛍️ Takeaway</span>
                <span className="text-[10px] opacity-80">Pickup Counter</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-[#2C1810] text-[#C89B6D] border-[#2C1810] shadow-sm'
                    : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-[#C89B6D]'
                }`}
              >
                <span>🛵 Delivery</span>
                <span className="text-[10px] opacity-80">Direct to Door</span>
              </button>
            </div>
          </div>

          {/* Conditional Order Type Details */}
          {orderType === 'dine_in' && (
            <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Select Your Table ({activeBranch.name})
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {(currentBranchTables.length > 0 ? currentBranchTables : tables.slice(0, 6)).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTable(t.tableNumber)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedTable === t.tableNumber
                        ? 'bg-[#C89B6D] text-[#1E1109] border-[#C89B6D]'
                        : 'bg-[#FAF7F2] text-stone-700 border-[#DFD5C7] hover:border-stone-400'
                    }`}
                  >
                    {t.tableNumber}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-stone-500">
                A barista will bring your freshly brewed order directly to Table {selectedTable}.
              </div>
            </div>
          )}

          {orderType === 'takeaway' && (
            <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] space-y-2">
              <label className="text-xs font-bold text-stone-700 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C89B6D]" />
                <span>Estimated Pickup Time</span>
              </label>
              <select
                value={pickupTime}
                onChange={e => setPickupTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs text-[#2C1810]"
              >
                <option value="10 minutes">Ready in 10 minutes</option>
                <option value="15 minutes">Ready in 15 minutes</option>
                <option value="25 minutes">Ready in 25 minutes</option>
                <option value="45 minutes">Ready in 45 minutes</option>
              </select>
            </div>
          )}

          {orderType === 'delivery' && (
            <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] space-y-3">
              <label className="text-xs font-bold text-stone-700 block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C89B6D]" />
                <span>Delivery Address</span>
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Street address, apartment or office suite number"
                className="w-full p-3 rounded-xl border border-[#DFD5C7] text-xs focus:outline-none focus:border-[#C89B6D]"
                required
              />
              <div className="text-[11px] text-stone-500">
                Eco-friendly bicycle courier delivery within 30-40 minutes.
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
              3. Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'qr_payment', label: 'QR Pay', icon: QrCode },
                { id: 'mobile_banking', label: 'Mobile Bank', icon: Smartphone },
                { id: 'cash', label: 'Cash', icon: Banknote },
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#2C1810] text-[#C89B6D] border-[#2C1810] shadow-sm font-bold'
                        : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-[#C89B6D]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-1">
              Order Notes / Allergies
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              placeholder="e.g. Ring doorbell, napkins please, extra hot"
              className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white text-xs"
            />
          </div>

          {/* Order Summary Recap */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] space-y-2 text-xs">
            <div className="font-bold text-stone-800 border-b border-[#F2ECE4] pb-2 flex items-center justify-between">
              <span>Order Summary ({cart.length} items)</span>
              <span className="text-[#8C5828] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Earn +{pointsEarned} loyalty points</span>
              </span>
            </div>

            <div className="space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>${cartTotals.subtotal.toFixed(2)}</span>
              </div>
              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Applied Discount</span>
                  <span>-${cartTotals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${cartTotals.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${cartTotals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#2C1810] pt-2 border-t border-[#F2ECE4]">
                <span>Total Amount Due</span>
                <span>${cartTotals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#2C1810] hover:bg-[#3D2318] text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5 text-[#C89B6D]" />
              <span>
                {isProcessing ? 'Processing Transaction...' : `Confirm & Place Order • $${cartTotals.total.toFixed(2)}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
