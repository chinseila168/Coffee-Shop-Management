import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Home,
  Coffee,
  ShoppingBag,
  Sparkles,
  User,
  Search,
  Flame,
  Snowflake,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  Heart,
  QrCode,
  Tag,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface MobileAppSimulatorProps {
  onCustomizeProduct: (product: Product) => void;
  onOpenCheckout: () => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  onCustomizeProduct,
  onOpenCheckout,
}) => {
  const {
    currentCustomer,
    products,
    categories,
    cart,
    setIsCartOpen,
    orders,
    setActiveOrderTrackerId,
    loyaltyRewards,
    redeemReward,
    selectedBranchId,
    branches,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'orders' | 'loyalty' | 'profile'>('home');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  const activeBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Active pending/brewing order if any
  const ongoingOrder = orders.find(
    o => o.customerId === currentCustomer.id && o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled'
  );

  const filteredMenu = products.filter(p => {
    if (!p.isActive) return false;
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="py-6 sm:py-10 px-2 sm:px-4 bg-[#23140C] min-h-[calc(100vh-80px)] flex flex-col items-center justify-start">
      {/* Simulator Control Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2 text-xs text-stone-300">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Aura Mobile App (iOS / Android)</span>
        </div>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="px-2.5 py-1 rounded-lg bg-[#3D2318] hover:bg-[#4D2E1F] text-[#C89B6D] font-bold text-[11px] transition-colors"
        >
          {isPhoneFrame ? 'Expand Full View' : 'Device Shell View'}
        </button>
      </div>

      {/* Mobile Shell Frame */}
      <div
        className={`w-full bg-[#FAF7F2] text-[#2C1810] shadow-2xl transition-all duration-300 flex flex-col ${
          isPhoneFrame
            ? 'max-w-[420px] h-[840px] rounded-[48px] border-[10px] border-[#180D07] overflow-hidden relative ring-1 ring-white/10'
            : 'max-w-2xl min-h-[800px] rounded-3xl border border-[#DFD5C7] overflow-hidden'
        }`}
      >
        {/* Mobile Status Bar */}
        <div className="bg-[#2C1810] text-[#E8DFD5] px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold tracking-wider">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Store & Cart Floating App Top Header */}
        <div className="bg-[#2C1810] text-white px-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C89B6D] text-[#1E1109] flex items-center justify-center font-bold">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-tight">
                {activeBranch.name.split(' ')[0]} Store
              </div>
              <div className="text-[10px] text-[#C89B6D] flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <span>Pickup in ~15 mins</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            <ShoppingBag className="w-4 h-4 text-[#C89B6D]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C89B6D] text-black text-[9px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Mobile Viewport Body */}
        <div className="flex-1 overflow-y-auto pb-20">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-5">
              {/* Greeting Card */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#2C1810]">
                    Good morning, {currentCustomer.name.split(' ')[0]} ☀️
                  </h2>
                  <p className="text-xs text-stone-500">What are we brewing for you today?</p>
                </div>
                <div className="flex items-center gap-1 bg-[#EFE9DF] text-[#8C5828] px-2.5 py-1 rounded-full text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{currentCustomer.loyaltyPoints} pts</span>
                </div>
              </div>

              {/* Live Order Tracker Banner if active */}
              {ongoingOrder && (
                <div
                  onClick={() => setActiveOrderTrackerId(ongoingOrder.id)}
                  className="bg-gradient-to-r from-[#2C1810] to-[#45271A] text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:opacity-95"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#C89B6D] text-[#1E1109] flex items-center justify-center animate-spin">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">
                        Order #{ongoingOrder.orderNumber} is {ongoingOrder.orderStatus}
                      </div>
                      <div className="text-[10px] text-stone-300">
                        Tap for live coffee progress stepper
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C89B6D]" />
                </div>
              )}

              {/* Promo Banner Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-stone-900 h-36">
                <img
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
                  alt="Iced specialty promotion"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-between text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C89B6D] bg-[#2C1810]/70 px-2 py-0.5 rounded w-max">
                    Today's Perk
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-base">20% Off Welcome Sips</h3>
                    <p className="text-[11px] text-stone-300">Code: FIRSTSIP at mobile checkout</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-max px-3 py-1 bg-[#C89B6D] text-[#1E1109] rounded-lg text-xs font-bold"
                  >
                    Order Now
                  </button>
                </div>
              </div>

              {/* Quick Categories Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2 text-[#6F4E37]">
                  <span>Explore Menu</span>
                  <button onClick={() => setActiveTab('menu')} className="text-[#C89B6D]">
                    See All
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {categories.slice(0, 5).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCat(cat.id);
                        setActiveTab('menu');
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-[#DFD5C7] text-xs font-semibold whitespace-nowrap shadow-sm hover:border-[#C89B6D]"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Barista Recommendations */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2 text-[#6F4E37]">
                  <span>Barista Picks Today</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {products.slice(0, 4).map(p => (
                    <div
                      key={p.id}
                      onClick={() => onCustomizeProduct(p)}
                      className="bg-white p-2.5 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-28 rounded-xl overflow-hidden mb-2">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center">
                          <Heart className="w-3 h-3" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#2C1810] line-clamp-1">{p.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-[#8C5828]">
                            ${(p.discountPrice || p.price).toFixed(2)}
                          </span>
                          <button className="w-6 h-6 rounded-lg bg-[#2C1810] text-[#C89B6D] flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MENU */}
          {activeTab === 'menu' && (
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search latte, cold brew, bakery..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#DFD5C7] text-xs focus:outline-none focus:border-[#C89B6D]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => setSelectedCat('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                    selectedCat === 'all'
                      ? 'bg-[#2C1810] text-[#C89B6D]'
                      : 'bg-white text-stone-600 border border-[#DFD5C7]'
                  }`}
                >
                  All
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                      selectedCat === c.id
                        ? 'bg-[#2C1810] text-[#C89B6D]'
                        : 'bg-white text-stone-600 border border-[#DFD5C7]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Product List */}
              <div className="space-y-3">
                {filteredMenu.map(product => (
                  <div
                    key={product.id}
                    onClick={() => onCustomizeProduct(product)}
                    className="bg-white p-3 rounded-2xl border border-[#DFD5C7] shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-[#C89B6D] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-[#2C1810] truncate">{product.name}</h4>
                        <p className="text-[11px] text-[#5C4033] line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                          <span>{product.calories} kcal</span>
                          <span>•</span>
                          <span className="font-bold text-xs text-[#8C5828]">
                            ${(product.discountPrice || product.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 bg-[#2C1810] text-[#C89B6D] text-xs font-bold rounded-xl shrink-0">
                      Order
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="p-4 space-y-4">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">My Coffee Orders</h3>

              <div className="space-y-3">
                {orders
                  .filter(o => o.customerId === currentCustomer.id)
                  .map(ord => (
                    <div
                      key={ord.id}
                      className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#2C1810]">#{ord.orderNumber}</div>
                          <div className="text-[11px] text-stone-400">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className="bg-[#EFE9DF] text-[#8C5828] px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                          {ord.orderStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-1 text-stone-600 border-t border-[#F2ECE4] pt-2">
                        {ord.items.map(it => (
                          <div key={it.id} className="flex justify-between text-[11px]">
                            <span>
                              {it.quantity}x {it.productName}
                            </span>
                            <span>${it.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE4]">
                        <span className="font-bold text-sm text-[#2C1810]">
                          ${ord.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setActiveOrderTrackerId(ord.id)}
                          className="px-3 py-1.5 bg-[#2C1810] text-[#C89B6D] rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <span>Track Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOYALTY */}
          {activeTab === 'loyalty' && (
            <div className="p-4 space-y-4">
              <div className="bg-[#2C1810] text-white p-5 rounded-3xl shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C89B6D] tracking-widest uppercase">
                    Aura Member Card
                  </span>
                  <Sparkles className="w-5 h-5 text-[#C89B6D]" />
                </div>
                <div>
                  <div className="text-3xl font-display font-bold">
                    {currentCustomer.loyaltyPoints} Points
                  </div>
                  <div className="text-xs text-stone-300 mt-1">Tier: Gold Roaster Member</div>
                </div>

                {/* Simulated Barcode */}
                <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center">
                  <div className="h-8 w-44 bg-repeating-linear-gradient space-x-1 flex items-center justify-center">
                    <div className="font-mono text-xs font-bold text-black tracking-widest">
                      ||| |||| | ||||| || |||
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono mt-1">
                    SCAN AT REGISTER • 2026-AURA-{currentCustomer.id.slice(-4)}
                  </span>
                </div>
              </div>

              {/* Rewards List */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#6F4E37]">
                  Instant Rewards
                </h4>
                {loyaltyRewards.map(rew => (
                  <div
                    key={rew.id}
                    className="bg-white p-3 rounded-xl border border-[#DFD5C7] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#2C1810]">{rew.title}</div>
                      <div className="text-[10px] text-stone-400">{rew.pointsCost} pts required</div>
                    </div>
                    <button
                      onClick={() => redeemReward(currentCustomer.id, rew.id)}
                      disabled={currentCustomer.loyaltyPoints < rew.pointsCost}
                      className="px-3 py-1 bg-[#2C1810] text-[#C89B6D] rounded-lg text-xs font-bold disabled:opacity-40"
                    >
                      Redeem
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#2C1810] text-[#C89B6D] flex items-center justify-center font-bold text-base">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#2C1810]">
                    {currentCustomer.name}
                  </h4>
                  <p className="text-stone-400 text-[11px]">{currentCustomer.email}</p>
                  <p className="text-stone-500 text-[11px]">{currentCustomer.phone}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#DFD5C7] divide-y divide-[#F2ECE4]">
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium text-stone-700">Primary Delivery Address</span>
                  <span className="text-[11px] text-stone-500 truncate max-w-[140px]">
                    {currentCustomer.addresses[0]}
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium text-stone-700">Saved Payment Methods</span>
                  <span className="text-[11px] text-stone-500">Visa •••• 4242</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium text-stone-700">Push Notifications</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Enabled</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Persistent Bottom Bar for Cart Subtotal if cart has items */}
        {cart.length > 0 && (
          <div className="absolute bottom-16 left-4 right-4 bg-[#2C1810] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between z-20">
            <div className="flex items-center gap-2 text-xs">
              <ShoppingBag className="w-4 h-4 text-[#C89B6D]" />
              <span>{totalCartCount} items in cart</span>
            </div>
            <button
              onClick={() => {
                onOpenCheckout();
              }}
              className="px-3 py-1 bg-[#C89B6D] text-[#1E1109] rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[#E8DFD5] py-2 px-4 flex items-center justify-around z-30">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'home' ? 'text-[#C89B6D]' : 'text-stone-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'menu' ? 'text-[#C89B6D]' : 'text-stone-400'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'orders' ? 'text-[#C89B6D]' : 'text-stone-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'loyalty' ? 'text-[#C89B6D]' : 'text-stone-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Loyalty</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
              activeTab === 'profile' ? 'text-[#C89B6D]' : 'text-stone-400'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
