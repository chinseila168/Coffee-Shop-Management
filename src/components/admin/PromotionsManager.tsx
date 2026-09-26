import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Promotion } from '../../types';
import { Plus, Tag, Trash2, Edit2, X, CheckCircle2, Copy } from 'lucide-react';

export const PromotionsManager: React.FC = () => {
  const { promotions, createPromotion, updatePromotion, deletePromotion, showToast } = useApp();

  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [discountType, setDiscountType] = useState<Promotion['discountType']>('percentage');
  const [discountAmount, setDiscountAmount] = useState('20');
  const [minimumPurchase, setMinimumPurchase] = useState('10');
  const [couponCode, setCouponCode] = useState('SPECIAL20');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState('500');
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setBannerImage('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80');
    setDiscountType('percentage');
    setDiscountAmount('20');
    setMinimumPurchase('15');
    setCouponCode('ROAST20');
    setStartDate('2026-01-01');
    setEndDate('2026-12-31');
    setUsageLimit('500');
    setIsActive(true);
    setIsCreating(true);
    setEditingPromo(null);
  };

  const openEditModal = (p: Promotion) => {
    setEditingPromo(p);
    setName(p.name);
    setDescription(p.description);
    setBannerImage(p.bannerImage);
    setDiscountType(p.discountType);
    setDiscountAmount(p.discountAmount.toString());
    setMinimumPurchase(p.minimumPurchase.toString());
    setCouponCode(p.couponCode);
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setUsageLimit(p.usageLimit.toString());
    setIsActive(p.isActive);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      discountType,
      discountAmount: parseFloat(discountAmount) || 10,
      minimumPurchase: parseFloat(minimumPurchase) || 0,
      couponCode: couponCode.trim().toUpperCase(),
      startDate,
      endDate,
      usageLimit: parseInt(usageLimit) || 500,
      isActive,
    };

    if (editingPromo) {
      updatePromotion(editingPromo.id, payload);
      setEditingPromo(null);
    } else {
      createPromotion(payload);
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Promotions & Coupon Campaign Engine
          </h2>
          <p className="text-xs text-stone-500">
            Create discount vouchers, buy-X-get-Y deals, and promotional seasonal marketing banners.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotion</span>
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(promo => (
          <div
            key={promo.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#DFD5C7] shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-40 overflow-hidden">
              <img src={promo.bannerImage} alt={promo.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 rounded-xl p-1">
                <button
                  onClick={() => openEditModal(promo)}
                  className="p-1 text-white hover:text-[#C89B6D]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deletePromotion(promo.id)}
                  className="p-1 text-white hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold bg-[#C89B6D] text-black px-2 py-0.5 rounded">
                  {promo.discountType === 'percentage'
                    ? `${promo.discountAmount}% OFF`
                    : `$${promo.discountAmount} OFF`}
                </span>
                <h3 className="font-display font-bold text-base mt-1">{promo.name}</h3>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs text-[#5C4033]">
              <p className="line-clamp-2 leading-relaxed">{promo.description}</p>

              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Code</span>
                  <span className="font-mono font-bold text-sm text-[#2C1810]">
                    {promo.couponCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Min Spend</span>
                  <span className="font-semibold text-stone-700">${promo.minimumPurchase}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span>
                  Redeemed: <strong>{promo.usageCount}</strong> / {promo.usageLimit}
                </span>
                <button
                  onClick={() => updatePromotion(promo.id, { isActive: !promo.isActive })}
                  className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                    promo.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {promo.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promotion Modal */}
      {(isCreating || editingPromo) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {editingPromo ? 'Edit Promotion' : 'New Promo Campaign'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPromo(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs text-[#2C1810]">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Afternoon Nitro Special"
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. NITRO30"
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountAmount}
                    onChange={e => setDiscountAmount(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min Order Subtotal ($)</label>
                  <input
                    type="number"
                    value={minimumPurchase}
                    onChange={e => setMinimumPurchase(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Max Uses Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={e => setBannerImage(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPromo(null);
                  }}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
