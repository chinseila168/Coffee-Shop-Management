import React, { useState } from 'react';
import { useApp, PlatformView } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Coffee,
  ShoppingBag,
  Bell,
  Smartphone,
  Globe,
  ShieldCheck,
  User,
  Sparkles,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Store,
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications?: () => void;
  onOpenCustomerProfile?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenCustomerProfile,
  onNavigateSection,
}) => {
  const {
    currentRole,
    setCurrentRole,
    platformView,
    setPlatformView,
    cart,
    cartTotals,
    setIsCartOpen,
    currentCustomer,
    notifications,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  const handleNavClick = (sectionId: string) => {
    if (platformView !== 'website') {
      setPlatformView('website');
    }
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roles: { role: UserRole; label: string; badge: string }[] = [
    { role: 'super_admin', label: 'Super Admin', badge: 'Full Access' },
    { role: 'admin', label: 'Admin / Manager', badge: 'Ops & Inventory' },
    { role: 'staff', label: 'Staff / Barista', badge: 'Orders & Recipes' },
    { role: 'customer', label: 'Customer', badge: 'Shopping & Loyalty' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      {/* Top Banner / Simulator & Role Bar */}
      <div className="bg-[#2C1810] text-[#E8DFD5] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#3D2318]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-[#C89B6D]">
            <Store className="w-3.5 h-3.5" />
            <span>Store:</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="flex items-center gap-1.5 hover:text-white bg-[#3D2318] px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors"
            >
              <span>{selectedBranch?.name}</span>
              <ChevronDown className="w-3 h-3 text-[#C89B6D]" />
            </button>
            {branchDropdownOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-[#23130C] border border-[#4A2D1F] rounded-lg shadow-2xl py-1 z-50 text-left">
                {branches.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBranchId(b.id);
                      setBranchDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left hover:bg-[#3D2318] transition-colors flex items-center justify-between ${
                      b.id === selectedBranchId ? 'text-[#C89B6D] font-bold' : 'text-stone-300'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] text-stone-400">{b.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="hidden sm:inline text-stone-400">
            Hours: {settings.openingTime} - {settings.closingTime}
          </span>
        </div>

        {/* View Mode Switcher & Quick Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#1B0F0A] p-0.5 rounded-lg border border-[#3D2318]">
            <button
              onClick={() => setPlatformView('website')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                platformView === 'website'
                  ? 'bg-[#C89B6D] text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Customer Responsive Website"
            >
              <Globe className="w-3 h-3" />
              <span className="hidden md:inline">Website</span>
            </button>
            <button
              onClick={() => setPlatformView('mobile_app')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                platformView === 'mobile_app'
                  ? 'bg-[#C89B6D] text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Customer Mobile App Experience"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden md:inline">Mobile App</span>
            </button>
            <button
              onClick={() => setPlatformView('admin_dashboard')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                platformView === 'admin_dashboard'
                  ? 'bg-[#C89B6D] text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Staff & Management Portal"
            >
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden md:inline">Admin Portal</span>
            </button>
          </div>

          {/* Role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#3D2318] hover:bg-[#4D2E1F] text-[#E8DFD5] px-2.5 py-1 rounded text-[11px] font-medium transition-all border border-[#523322]"
            >
              <span className="text-[#C89B6D]">Role:</span>
              <span className="font-semibold text-white capitalize">{currentRole.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-[#23130C] border border-[#4A2D1F] rounded-lg shadow-2xl py-1 z-50 text-left">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-stone-400 border-b border-[#3D2318]">
                  Switch User Role
                </div>
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentRole(r.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-[#3D2318] flex items-center justify-between text-xs transition-colors ${
                      currentRole === r.role ? 'text-[#C89B6D] font-bold bg-[#2A160F]' : 'text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-stone-400">{r.badge}</div>
                    </div>
                    {currentRole === r.role && <span className="w-1.5 h-1.5 rounded-full bg-[#C89B6D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => {
            setPlatformView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C1810] to-[#543021] flex items-center justify-center text-[#C89B6D] shadow-md group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-xl sm:text-2xl text-[#2C1810] tracking-tight leading-none">
              Aura Roast
            </div>
            <div className="text-[10px] font-semibold text-[#8C6239] tracking-widest uppercase">
              Coffee & Roastery
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A3228]">
          <button
            onClick={() => handleNavClick('hero-section')}
            className="hover:text-[#A26D3B] transition-colors py-1 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu-section')}
            className="hover:text-[#A26D3B] transition-colors py-1 cursor-pointer"
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('promotions-section')}
            className="hover:text-[#A26D3B] transition-colors py-1 cursor-pointer flex items-center gap-1"
          >
            <span>Offers</span>
            <span className="bg-[#C89B6D]/20 text-[#8C5828] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
          <button
            onClick={() => handleNavClick('about-section')}
            className="hover:text-[#A26D3B] transition-colors py-1 cursor-pointer"
          >
            Our Story
          </button>
          <button
            onClick={() => handleNavClick('locations-section')}
            className="hover:text-[#A26D3B] transition-colors py-1 cursor-pointer"
          >
            Locations
          </button>
          <button
            onClick={() => handleNavClick('reviews-section')}
            className="hover:text-[#A26D3B] transition-colors py-1 cursor-pointer"
          >
            Reviews
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#4A3228] hover:bg-[#EFE9DF] transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Customer Profile Trigger */}
          <button
            onClick={onOpenCustomerProfile}
            className="hidden sm:flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#EFE9DF] hover:bg-[#E5DDCF] border border-[#DFD5C7] text-xs font-medium text-[#2C1810] transition-colors"
            title="Customer Account & Loyalty"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2C1810] text-[#C89B6D] flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-xs leading-none truncate max-w-[90px]">
                {currentCustomer.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-[#A26D3B] flex items-center gap-0.5 mt-0.5 font-bold">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{currentCustomer.loyaltyPoints} pts</span>
              </div>
            </div>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#C89B6D]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C89B6D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
            {totalCartCount > 0 && (
              <span className="text-xs bg-[#4A2D1F] px-1.5 py-0.5 rounded text-[#F5EBE1] font-medium">
                ${cartTotals.total.toFixed(2)}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#2C1810] hover:bg-[#EFE9DF]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8DFD5] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E8DFD5]">
            <button
              onClick={() => handleNavClick('hero-section')}
              className="px-3 py-2 text-left text-sm font-medium rounded-lg hover:bg-[#EFE9DF]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('menu-section')}
              className="px-3 py-2 text-left text-sm font-medium rounded-lg hover:bg-[#EFE9DF]"
            >
              Menu
            </button>
            <button
              onClick={() => handleNavClick('promotions-section')}
              className="px-3 py-2 text-left text-sm font-medium rounded-lg hover:bg-[#EFE9DF]"
            >
              Offers & Promos
            </button>
            <button
              onClick={() => handleNavClick('locations-section')}
              className="px-3 py-2 text-left text-sm font-medium rounded-lg hover:bg-[#EFE9DF]"
            >
              Locations
            </button>
            <button
              onClick={() => handleNavClick('about-section')}
              className="px-3 py-2 text-left text-sm font-medium rounded-lg hover:bg-[#EFE9DF]"
            >
              Our Story
            </button>
            <button
              onClick={() => handleNavClick('reviews-section')}
              className="px-3 py-2 text-left text-sm font-medium rounded-lg hover:bg-[#EFE9DF]"
            >
              Customer Reviews
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCustomerProfile) onOpenCustomerProfile();
              }}
              className="flex items-center gap-2 text-xs font-semibold text-[#2C1810] bg-[#EFE9DF] px-3 py-2 rounded-xl"
            >
              <User className="w-4 h-4 text-[#C89B6D]" />
              <span>
                {currentCustomer.name} ({currentCustomer.loyaltyPoints} pts)
              </span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setPlatformView('admin_dashboard');
              }}
              className="text-xs font-semibold text-[#8C5828] bg-[#C89B6D]/20 px-3 py-2 rounded-xl flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
