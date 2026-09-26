import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  X,
  CheckCircle2,
  Clock,
  Coffee,
  Bike,
  PackageCheck,
  Ban,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const OrderTrackerModal: React.FC = () => {
  const {
    activeOrderTrackerId,
    setActiveOrderTrackerId,
    orders,
    updateOrderStatus,
    currentRole,
  } = useApp();

  if (!activeOrderTrackerId) return null;

  const order = orders.find(o => o.id === activeOrderTrackerId);
  if (!order) return null;

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'pending', label: 'Received', icon: Clock },
    { status: 'confirmed', label: 'Accepted', icon: CheckCircle2 },
    { status: 'preparing', label: 'Brewing', icon: Coffee },
    {
      status: order.orderType === 'delivery' ? 'out_for_delivery' : 'ready',
      label: order.orderType === 'delivery' ? 'On Way' : 'Ready',
      icon: order.orderType === 'delivery' ? Bike : PackageCheck,
    },
    { status: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
      case 'out_for_delivery':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'pending') return 'confirmed';
    if (current === 'confirmed') return 'preparing';
    if (current === 'preparing') return order.orderType === 'delivery' ? 'out_for_delivery' : 'ready';
    if (current === 'ready' || current === 'out_for_delivery') return 'completed';
    return null;
  };

  const nextStatus = getNextStatus(order.orderStatus);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8DFD5] animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-[#C89B6D] flex items-center justify-center font-bold text-sm">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-[#2C1810]">
                  Order #{order.orderNumber}
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {order.branchName} • Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveOrderTrackerId(null)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-[#EFE9DF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-[#2C1810]">
          {/* Status Stepper */}
          {order.orderStatus === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
              <Ban className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <div className="font-bold text-sm">Order Cancelled</div>
                <div className="text-xs text-rose-700">This order was cancelled and refunded.</div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-[#DFD5C7] space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                <span>Status Tracker</span>
                <span className="text-[#8C5828] font-bold uppercase">
                  Current: {order.orderStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Step icons */}
              <div className="relative flex items-center justify-between">
                {/* Connecting bar */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#E8DFD5] -z-0">
                  <div
                    className="h-full bg-[#C89B6D] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {steps.map((st, i) => {
                  const Icon = st.icon;
                  const isDone = i <= currentStepIdx;
                  const isCurrent = i === currentStepIdx;

                  return (
                    <div key={st.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#2C1810] text-[#C89B6D] shadow-md ring-4 ring-[#FAF7F2]'
                            : 'bg-white text-stone-400 border border-[#DFD5C7]'
                        } ${isCurrent ? 'ring-2 ring-[#C89B6D] scale-110' : ''}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] mt-2 font-semibold ${
                          isDone ? 'text-[#2C1810]' : 'text-stone-400'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Simulation Button for Testing */}
          {nextStatus && (
            <div className="p-3.5 rounded-2xl bg-[#EFE9DF] border border-[#DFD5C7] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C5828]" />
                <span className="text-stone-700">
                  <strong>Simulate Barista:</strong> Advance order to "{nextStatus.replace('_', ' ')}"
                </span>
              </div>
              <button
                onClick={() => updateOrderStatus(order.id, nextStatus)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                <span>Advance Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Delivery / Table / Pickup Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] space-y-1">
              <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                Fulfillment Details
              </span>
              <div className="font-bold text-[#2C1810] capitalize text-sm">
                {order.orderType.replace('_', ' ')}
              </div>
              {order.tableNumber && (
                <div className="text-stone-600 font-medium">Table: {order.tableNumber}</div>
              )}
              {order.pickupTime && (
                <div className="text-stone-600 font-medium">Pickup window: {order.pickupTime}</div>
              )}
              {order.deliveryAddress && (
                <div className="text-stone-600 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C89B6D] shrink-0 mt-0.5" />
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] space-y-1">
              <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                Customer & Payment
              </span>
              <div className="font-bold text-[#2C1810]">{order.customerName}</div>
              <div className="text-stone-500">{order.customerPhone}</div>
              <div className="text-stone-600 font-medium capitalize">
                Paid via {order.paymentMethod.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] space-y-3">
            <div className="font-bold text-xs text-stone-800 border-b border-[#F2ECE4] pb-2">
              Order Items ({order.items.length})
            </div>

            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold text-[#2C1810]">
                        {item.quantity}x {item.productName}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {item.customizations.size}
                        {item.customizations.temperature && ` • ${item.customizations.temperature}`}
                        {item.customizations.milk && ` • ${item.customizations.milk}`}
                      </div>
                    </div>
                  </div>

                  <span className="font-bold text-[#2C1810]">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="pt-3 border-t border-[#F2ECE4] space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#2C1810] pt-2 border-t border-[#F2ECE4]">
                <span>Total Paid</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
