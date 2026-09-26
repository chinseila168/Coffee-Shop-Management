import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Sparkles,
  ShoppingBag,
  MapPin,
  Heart,
  Gift,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({ isOpen, onClose }) => {
  const {
    currentCustomer,
    updateCustomer,
    loyaltyRewards,
    redeemReward,
    orders,
    setActiveOrderTrackerId,
    products,
    setCustomizingProduct,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'loyalty' | 'orders' | 'favorites'>('profile');
  const [nameInput, setNameInput] = useState(currentCustomer.name);
  const [phoneInput, setPhoneInput] = useState(currentCustomer.phone);
  const [emailInput, setEmailInput] = useState(currentCustomer.email);
  const [newAddress, setNewAddress] = useState('');

  if (!isOpen) return null;

  const customerOrders = orders.filter(o => o.customerId === currentCustomer.id);
  const favoriteProducts = products.filter(p => currentCustomer.favoriteProductIds?.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer(currentCustomer.id, {
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const updated = [...(currentCustomer.addresses || []), newAddress.trim()];
    updateCustomer(currentCustomer.id, { addresses: updated });
    setNewAddress('');
  };

  const handleRemoveAddress = (addr: string) => {
    const updated = currentCustomer.addresses.filter(a => a !== addr);
    updateCustomer(currentCustomer.id, { addresses: updated });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8DFD5] animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2C1810] text-[#C89B6D] flex items-center justify-center font-bold text-base shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {currentCustomer.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{currentCustomer.email}</span>
                <span>•</span>
                <span className="text-[#8C5828] font-bold flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {currentCustomer.loyaltyPoints} Loyalty Points
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-[#EFE9DF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DFD5] bg-[#FAF7F2] px-6 gap-6 text-xs font-bold text-[#6F4E37]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile' ? 'border-[#2C1810] text-[#2C1810]' : 'border-transparent text-stone-500'
            }`}
          >
            Profile & Addresses
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'loyalty' ? 'border-[#2C1810] text-[#2C1810]' : 'border-transparent text-stone-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Rewards ({loyaltyRewards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders' ? 'border-[#2C1810] text-[#2C1810]' : 'border-transparent text-stone-500'
            }`}
          >
            Order History ({customerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'favorites' ? 'border-[#2C1810] text-[#2C1810]' : 'border-transparent text-stone-500'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Favorites ({favoriteProducts.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-[#2C1810]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Details Form */}
              <form onSubmit={handleSaveProfile} className="bg-white p-5 rounded-2xl border border-[#DFD5C7] space-y-4">
                <div className="font-bold text-xs text-stone-800 border-b border-[#F2ECE4] pb-2">
                  Personal Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] text-xs font-bold rounded-xl"
                >
                  Save Profile Changes
                </button>
              </form>

              {/* Saved Addresses */}
              <div className="bg-white p-5 rounded-2xl border border-[#DFD5C7] space-y-3">
                <div className="font-bold text-xs text-stone-800 border-b border-[#F2ECE4] pb-2 flex items-center justify-between">
                  <span>Saved Delivery Addresses</span>
                  <span className="text-stone-400 font-normal text-[11px]">
                    {currentCustomer.addresses?.length || 0} saved
                  </span>
                </div>

                <div className="space-y-2">
                  {currentCustomer.addresses?.map(addr => (
                    <div
                      key={addr}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C89B6D] shrink-0" />
                        <span className="font-medium text-stone-700">{addr}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAddress(addr)}
                        className="text-stone-400 hover:text-rose-500 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new address */}
                <form onSubmit={handleAddAddress} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add new delivery address..."
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#2C1810] text-[#C89B6D] rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className="space-y-4">
              {/* Points Card */}
              <div className="bg-gradient-to-br from-[#2C1810] to-[#543021] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C89B6D]">
                      Aura Club VIP Member
                    </span>
                    <div className="text-3xl font-display font-bold mt-1">
                      {currentCustomer.loyaltyPoints} Points
                    </div>
                    <div className="text-xs text-stone-300 mt-1">
                      Earn 1 point per $1 spent. Redeem for free espresso & artisanal treats!
                    </div>
                  </div>
                  <Sparkles className="w-12 h-12 text-[#C89B6D] opacity-80" />
                </div>
              </div>

              {/* Redeemable Rewards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6F4E37]">
                  Available Point Rewards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {loyaltyRewards.map(rew => {
                    const canAfford = currentCustomer.loyaltyPoints >= rew.pointsCost;
                    return (
                      <div
                        key={rew.id}
                        className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-[#2C1810]">{rew.title}</span>
                            <span className="text-xs font-bold text-[#8C5828] bg-[#EFE9DF] px-2 py-0.5 rounded-full">
                              {rew.pointsCost} pts
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C4033] mt-1 leading-relaxed">
                            {rew.description}
                          </p>
                        </div>

                        <button
                          onClick={() => redeemReward(currentCustomer.id, rew.id)}
                          disabled={!canAfford}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            canAfford
                              ? 'bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] shadow-sm cursor-pointer'
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Redeem Reward' : `Need ${rew.pointsCost - currentCustomer.loyaltyPoints} more pts`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#DFD5C7]">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <div className="text-xs font-bold text-stone-600">No orders placed yet</div>
                </div>
              ) : (
                customerOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2C1810]">#{ord.orderNumber}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#8C5828]">
                          {ord.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items • ${ord.total.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        setActiveOrderTrackerId(ord.id);
                      }}
                      className="flex items-center gap-1 bg-[#2C1810] text-[#C89B6D] px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-[#3D2318]"
                    >
                      <span>Track Order</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#DFD5C7]">
                  <Heart className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <div className="text-xs font-bold text-stone-600">No favorite coffees saved</div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Click the heart icon on any product in the menu to bookmark it!
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteProducts.map(p => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded-2xl border border-[#DFD5C7] shadow-sm flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#2C1810] truncate">{p.name}</div>
                          <div className="text-[11px] text-[#8C5828] font-semibold">
                            ${(p.discountPrice || p.price).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          setCustomizingProduct(p);
                        }}
                        className="px-3 py-1.5 bg-[#2C1810] text-[#C89B6D] rounded-xl text-xs font-bold hover:bg-[#3D2318] shrink-0"
                      >
                        Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotificationsDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationAsRead, clearNotifications } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#E8DFD5] animate-slide-left">
          {/* Header */}
          <div className="p-4 border-b border-[#E8DFD5] bg-white flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#2C1810]">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearNotifications}
                className="text-[11px] text-stone-500 hover:text-stone-800 font-semibold"
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-500 hover:bg-[#EFE9DF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-20 text-xs text-stone-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    notif.isRead
                      ? 'bg-white border-[#E8DFD5] text-stone-600'
                      : 'bg-[#FAF2E8] border-[#C89B6D]/50 font-medium text-[#2C1810] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs">{notif.title}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
