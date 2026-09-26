import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Coffee,
  AlertTriangle,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const { orders, products, inventory, customers, categories, branches, settings } = useApp();

  // Dynamic calculations from database
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'preparing').length;
    const lowStockItems = inventory.filter(i => i.currentStock <= i.minimumStock).length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
    const activeProductsCount = products.filter(p => p.isActive).length;

    // Sales by category
    const catSales: { [catId: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.categoryName || 'Other';
        catSales[cat] = (catSales[cat] || 0) + item.totalPrice;
      });
    });

    // Top selling products
    const prodCounts: { [prodId: string]: { name: string; count: number; revenue: number } } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!prodCounts[item.productId]) {
          prodCounts[item.productId] = { name: item.productName, count: 0, revenue: 0 };
        }
        prodCounts[item.productId].count += item.quantity;
        prodCounts[item.productId].revenue += item.totalPrice;
      });
    });

    const topProducts = Object.values(prodCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      todaySales,
      todayOrdersCount: todayOrders.length,
      totalCustomers: customers.length,
      activeProductsCount,
      lowStockItems,
      pendingOrders,
      totalRevenue,
      catSales,
      topProducts,
    };
  }, [orders, products, inventory, customers]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#432519] to-[#603522] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C89B6D]/20 text-[#E8DFD5] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C89B6D]" />
            <span>Central Roastery Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Real-Time Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Monitoring multi-branch orders, automated recipe consumption, ingredients stock levels, and store analytics.
          </p>
        </div>
        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none hidden md:block">
          <Coffee className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-[#2C1810]">
            ${stats.todaySales.toFixed(2)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">Live Data</span>
            <span>from today's receipts</span>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-[#2C1810]">
            {stats.todayOrdersCount} Orders
          </div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span className="text-amber-600 font-bold">{stats.pendingOrders} in prep</span>
            <span>• Baristas active</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-rose-600 transition-colors">
              Low Stock Alert
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-rose-600">
            {stats.lowStockItems} Items
          </div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>Below safety threshold</span>
            <ChevronRight className="w-3 h-3 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Total Registered Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[#C89B6D] transition-colors">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF2E8] text-[#8C5828] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-[#2C1810]">
            {stats.totalCustomers} Accounts
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Active loyalty club members</div>
        </div>
      </div>

      {/* Visual Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-[#2C1810]">
                Best-Selling Drinks & Pastries
              </h3>
              <p className="text-xs text-stone-500">Ranked by actual cumulative sales volume</p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#8C5828] font-bold hover:underline flex items-center gap-1"
            >
              <span>Manage Products</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.topProducts.map((p, idx) => {
              const maxCount = stats.topProducts[0]?.count || 1;
              const percent = Math.round((p.count / maxCount) * 100);

              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#2C1810]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FAF2E8] text-[#8C5828] text-[10px] flex items-center justify-center font-bold">
                        #{idx + 1}
                      </span>
                      <span>{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-stone-500">{p.count} sold</span>
                      <span className="font-bold text-[#8C5828]">${p.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-[#F4EFE6] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#C89B6D] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales by Category Doughnut Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
          <div className="border-b border-[#F2ECE4] pb-3">
            <h3 className="font-display font-bold text-base text-[#2C1810]">Sales by Category</h3>
            <p className="text-xs text-stone-500">Revenue split across coffee & food</p>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.catSales).map(([catName, amount]) => {
              const share = Math.round((amount / (stats.totalRevenue || 1)) * 100);
              return (
                <div key={catName} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8C5828]" />
                    <span className="font-medium text-stone-700">{catName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C1810]">${amount.toFixed(2)}</span>
                    <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                      {share}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DFD5C7] flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs">
          <div className="font-bold text-[#2C1810]">Quick Management Operations</div>
          <div className="text-stone-500">Access primary staff workflows in 1-click:</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-2 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Orders Kanban</span>
          </button>

          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-[#2C1810] border border-[#DFD5C7] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#C89B6D]" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-[#2C1810] border border-[#DFD5C7] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Stock In / Out Adjustment</span>
          </button>

          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-[#2C1810] border border-[#DFD5C7] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
