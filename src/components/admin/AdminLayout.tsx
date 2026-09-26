import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardOverview } from './DashboardOverview';
import { OrdersManager } from './OrdersManager';
import { ProductsManager } from './ProductsManager';
import { InventoryManager } from './InventoryManager';
import { RecipesManager } from './RecipesManager';
import { CustomersManager, StaffManager } from './PeopleManager';
import { BranchesAndTablesManager } from './BranchesAndTablesManager';
import { PromotionsManager } from './PromotionsManager';
import { ReportsManager } from './ReportsManager';
import { CMSManager, AuditLogsManager, SettingsManager } from './CMSAndSettingsManager';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Package,
  BookOpen,
  Users,
  Briefcase,
  Store,
  Tag,
  BarChart3,
  Globe,
  ShieldCheck,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  ArrowLeft,
  Bell,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    currentRole,
    setPlatformView,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    orders,
    inventory,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'preparing').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minimumStock).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders Pipeline', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined },
    { id: 'products', label: 'Product Catalog', icon: Coffee },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined, badgeColor: 'bg-rose-600' },
    { id: 'recipes', label: 'Recipes & Formulas', icon: BookOpen },
    { id: 'customers', label: 'Customers & Points', icon: Users },
    { id: 'staff', label: 'Staff & Employees', icon: Briefcase },
    { id: 'branches', label: 'Branches & Tables', icon: Store },
    { id: 'promotions', label: 'Promotions & Coupons', icon: Tag },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'cms', label: 'Website CMS', icon: Globe },
    { id: 'audit', label: 'Security & Audit Logs', icon: ShieldCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col lg:flex-row text-[#2C1810]">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#2C1810] text-white p-4 flex items-center justify-between border-b border-[#3D2318] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-[#3D2318] text-[#C89B6D]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="font-display font-bold text-base text-white">
            Aura Admin Portal
          </div>
        </div>

        <button
          onClick={() => setPlatformView('website')}
          className="px-2.5 py-1 rounded-lg bg-[#3D2318] text-[#C89B6D] text-xs font-bold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Website</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#23120A] text-[#E8DFD5] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 border-r border-[#381F13] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#381F13] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C89B6D] text-[#1E1109] flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-base text-white leading-tight">
                  Aura Roast
                </div>
                <div className="text-[10px] text-[#C89B6D] font-bold uppercase tracking-wider">
                  Management Suite
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-stone-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Store selector */}
          <div className="mb-4 p-2.5 rounded-xl bg-[#1B0D07] border border-[#381F13]">
            <span className="text-[9px] uppercase font-bold text-stone-400 block mb-1">
              Active Store Floor:
            </span>
            <select
              value={selectedBranchId}
              onChange={e => setSelectedBranchId(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#E8DFD5] focus:outline-none cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id} className="bg-[#23120A] text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#C89B6D] text-[#1E1109] font-bold shadow-md'
                      : 'text-stone-300 hover:bg-[#331B10] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ${
                        item.badgeColor || 'bg-amber-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#381F13] bg-[#1B0D07] text-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span>Signed in as:</span>
            <span className="capitalize font-bold text-[#C89B6D]">
              {currentRole.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={() => setPlatformView('website')}
            className="w-full py-2 bg-[#2E1A11] hover:bg-[#3D2318] text-[#C89B6D] border border-[#4A2D1F] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Website</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto min-h-screen">
        {activeTab === 'overview' && <DashboardOverview onNavigateTab={tab => setActiveTab(tab)} />}
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'recipes' && <RecipesManager />}
        {activeTab === 'customers' && <CustomersManager />}
        {activeTab === 'staff' && <StaffManager />}
        {activeTab === 'branches' && <BranchesAndTablesManager />}
        {activeTab === 'promotions' && <PromotionsManager />}
        {activeTab === 'reports' && <ReportsManager />}
        {activeTab === 'cms' && <CMSManager />}
        {activeTab === 'audit' && <AuditLogsManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
};
