import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Coffee,
  AlertTriangle,
} from 'lucide-react';

export const ReportsManager: React.FC = () => {
  const { orders, products, inventory, customers, branches, settings, showToast } = useApp();

  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'year' | 'all'>('30days');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  // Filter orders by date range and branch
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(ord => {
      if (branchFilter !== 'all' && ord.branchId !== branchFilter) return false;

      const ordDate = new Date(ord.createdAt);
      if (dateRange === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        return ord.createdAt.startsWith(todayStr);
      }
      if (dateRange === '7days') {
        const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return ordDate >= past;
      }
      if (dateRange === '30days') {
        const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return ordDate >= past;
      }
      if (dateRange === 'year') {
        const past = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return ordDate >= past;
      }
      return true;
    });
  }, [orders, dateRange, branchFilter]);

  const reportMetrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0),
      0
    );
    const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

    // By product
    const productStats: { [id: string]: { name: string; quantity: number; revenue: number } } = {};
    filteredOrders.forEach(o => {
      o.items.forEach(it => {
        if (!productStats[it.productId]) {
          productStats[it.productId] = { name: it.productName, quantity: 0, revenue: 0 };
        }
        productStats[it.productId].quantity += it.quantity;
        productStats[it.productId].revenue += it.totalPrice;
      });
    });

    const topSelling = Object.values(productStats).sort((a, b) => b.quantity - a.quantity);
    const leastSelling = [...topSelling].reverse();

    // By branch
    const branchPerformance: { [id: string]: { name: string; orders: number; revenue: number } } = {};
    branches.forEach(b => {
      branchPerformance[b.id] = { name: b.name, orders: 0, revenue: 0 };
    });
    filteredOrders.forEach(o => {
      if (branchPerformance[o.branchId]) {
        branchPerformance[o.branchId].orders += 1;
        branchPerformance[o.branchId].revenue += o.paymentStatus === 'paid' ? o.total : 0;
      }
    });

    return {
      totalRevenue,
      avgOrderValue,
      totalOrders: filteredOrders.length,
      topSelling,
      leastSelling,
      branchPerformance: Object.values(branchPerformance),
    };
  }, [filteredOrders, branches]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Branch', 'Type', 'Status', 'Payment', 'Total ($)'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      `"${o.branchName}"`,
      o.orderType,
      o.orderStatus,
      o.paymentMethod,
      o.total.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_roast_sales_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV sales report successfully!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Financial & Sales Analytics Reports
          </h2>
          <p className="text-xs text-stone-500">
            Export comprehensive sales, branch performance, and item popularity metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white hover:bg-stone-50 text-[#2C1810] border border-[#DFD5C7] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-500" />
          <span className="font-bold text-stone-700">Time Window:</span>
          {(['today', '7days', '30days', 'year', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                dateRange === range
                  ? 'bg-[#2C1810] text-[#C89B6D]'
                  : 'bg-[#FAF7F2] text-stone-600 hover:bg-stone-200'
              }`}
            >
              {range === '7days' ? 'Past 7 Days' : range === '30days' ? 'Past Month' : range}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">Filter Branch:</span>
          <select
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
          >
            <option value="all">All Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs font-bold uppercase">
            <span>Period Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-display font-bold text-[#2C1810]">
            ${reportMetrics.totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Across all completed transactions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs font-bold uppercase">
            <span>Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-display font-bold text-[#2C1810]">
            {reportMetrics.totalOrders} Receipts
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Average ticket: ${reportMetrics.avgOrderValue.toFixed(2)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs font-bold uppercase">
            <span>Inventory Alert</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-display font-bold text-rose-600">
            {inventory.filter(i => i.currentStock <= i.minimumStock).length} Low Stock
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Require re-order from suppliers</div>
        </div>
      </div>

      {/* Performance by Branch */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#2C1810]">
          Branch Sales & Fulfillment Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportMetrics.branchPerformance.map(bp => (
            <div key={bp.name} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-2 text-xs">
              <div className="font-bold text-sm text-[#2C1810]">{bp.name}</div>
              <div className="flex justify-between text-stone-600">
                <span>Orders Fulfilled:</span>
                <span className="font-bold text-stone-800">{bp.orders}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Period Revenue:</span>
                <span className="font-bold text-base text-[#8C5828]">${bp.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Popularity Breakdown Table */}
      <div className="bg-white rounded-2xl border border-[#DFD5C7] shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-[#2C1810]">
          Best-Selling Menu Items (Top Volume)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider border-b border-[#DFD5C7]">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Total Units Sold</th>
                <th className="py-3 px-4">Cumulative Revenue</th>
                <th className="py-3 px-4">Avg Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-[#2C1810]">
              {reportMetrics.topSelling.slice(0, 8).map(it => {
                const share = Math.round((it.revenue / (reportMetrics.totalRevenue || 1)) * 100);
                return (
                  <tr key={it.name} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold">{it.name}</td>
                    <td className="py-3 px-4 font-semibold text-stone-700">{it.quantity} cups/items</td>
                    <td className="py-3 px-4 font-bold text-sm text-[#8C5828]">${it.revenue.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#FAF2E8] text-[#8C5828] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {share}% of revenue
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
