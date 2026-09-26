import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Coffee,
  Bike,
  PackageCheck,
  Ban,
  Eye,
  ChevronDown,
  ArrowRight,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, branches, selectedBranchId } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      if (statusFilter !== 'all' && ord.orderStatus !== statusFilter) return false;
      if (branchFilter !== 'all' && ord.branchId !== branchFilter) return false;
      if (typeFilter !== 'all' && ord.orderType !== typeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = ord.orderNumber.toLowerCase().includes(q);
        const matchName = ord.customerName.toLowerCase().includes(q);
        const matchPhone = ord.customerPhone.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchPhone) return false;
      }

      return true;
    });
  }, [orders, statusFilter, branchFilter, typeFilter, searchQuery]);

  const allStatuses: { id: OrderStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Confirmed</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Preparing</span>;
      case 'ready':
      case 'out_for_delivery':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Ready / En Route</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Order Management & Live Pipeline
          </h2>
          <p className="text-xs text-stone-500">
            Accept orders, assign to baristas, track delivery dispatch, and auto-deduct recipe stock.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order # (AR-2026-...), customer name, or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DFD5C7] focus:outline-none focus:border-[#C89B6D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={branchFilter}
              onChange={e => setBranchFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-[#DFD5C7] text-xs text-[#2C1810] focus:outline-none"
            >
              <option value="all">All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-[#DFD5C7] text-xs text-[#2C1810] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="dine_in">Dine-In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {allStatuses.map(st => {
            const count = st.id === 'all' ? orders.length : orders.filter(o => o.orderStatus === st.id).length;
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2C1810] text-[#C89B6D] shadow-sm'
                    : 'bg-[#FAF7F2] text-stone-600 hover:bg-stone-200 border border-[#DFD5C7]'
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#DFD5C7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider border-b border-[#DFD5C7]">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type / Location</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-[#2C1810]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#8C5828]">
                      {order.orderNumber}
                      <div className="text-[10px] text-stone-400 font-normal">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold">{order.customerName}</div>
                      <div className="text-[10px] text-stone-400">{order.customerPhone}</div>
                    </td>

                    <td className="py-3 px-4 capitalize">
                      <span className="font-semibold">{order.orderType.replace('_', ' ')}</span>
                      {order.tableNumber && (
                        <div className="text-[10px] text-stone-500 font-bold">
                          Table: {order.tableNumber}
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="text-[10px] text-stone-500 truncate max-w-[150px]">
                          {order.deliveryAddress}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-700">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate max-w-[180px]">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-sm text-[#2C1810]">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(order.orderStatus)}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {/* Quick Status Advance */}
                        {order.orderStatus === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            Accept
                          </button>
                        )}
                        {order.orderStatus === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            Brew
                          </button>
                        )}
                        {order.orderStatus === 'preparing' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                order.id,
                                order.orderType === 'delivery' ? 'out_for_delivery' : 'ready'
                              )
                            }
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            {order.orderType === 'delivery' ? 'Dispatch' : 'Ready'}
                          </button>
                        )}
                        {(order.orderStatus === 'ready' || order.orderStatus === 'out_for_delivery') && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                            title="Auto-deducts recipe ingredients from inventory"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}

                        {/* Inspect detail */}
                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#DFD5C7] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C5828]">Order Detail</span>
                <h3 className="font-display font-bold text-lg text-[#2C1810]">
                  #{inspectingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-[#DFD5C7]">
                <div>
                  <span className="text-stone-400 text-[10px] block">Customer:</span>
                  <div className="font-bold">{inspectingOrder.customerName}</div>
                  <div className="text-stone-500">{inspectingOrder.customerPhone}</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Fulfillment:</span>
                  <div className="font-bold capitalize">{inspectingOrder.orderType}</div>
                  {inspectingOrder.tableNumber && <div>Table: {inspectingOrder.tableNumber}</div>}
                  {inspectingOrder.pickupTime && <div>Pickup: {inspectingOrder.pickupTime}</div>}
                </div>
              </div>

              {inspectingOrder.deliveryAddress && (
                <div className="bg-white p-3 rounded-xl border border-[#DFD5C7] flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C89B6D] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 text-[10px] block">Address:</span>
                    <span>{inspectingOrder.deliveryAddress}</span>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="bg-white p-3 rounded-xl border border-[#DFD5C7] space-y-2">
                <span className="text-stone-400 text-[10px] block font-bold uppercase">Items</span>
                {inspectingOrder.items.map(it => (
                  <div key={it.id} className="flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold">
                        {it.quantity}x {it.productName}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {it.customizations.size} {it.customizations.milk ? `• ${it.customizations.milk}` : ''}
                      </div>
                    </div>
                    <span className="font-bold">${it.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Status Selector in Modal */}
              <div className="pt-2 flex items-center justify-between">
                <label className="font-bold text-stone-700">Change Status:</label>
                <select
                  value={inspectingOrder.orderStatus}
                  onChange={e => {
                    updateOrderStatus(inspectingOrder.id, e.target.value as OrderStatus);
                    setInspectingOrder({ ...inspectingOrder, orderStatus: e.target.value as OrderStatus });
                  }}
                  className="p-2 rounded-xl border border-[#DFD5C7] bg-white font-semibold text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="completed">Completed (Deducts Inventory)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
