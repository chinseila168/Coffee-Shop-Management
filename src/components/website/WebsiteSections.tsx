import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Tag,
  Copy,
  Check,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  ShieldCheck,
  Send,
  Coffee,
  Sparkles,
} from 'lucide-react';

export const PromotionsSection: React.FC = () => {
  const { promotions, applyCoupon } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const activePromos = promotions.filter(p => p.isActive);

  return (
    <section id="promotions-section" className="py-20 bg-[#F4EFE6] border-y border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5DDCF] text-[#8C5828] text-xs font-bold uppercase tracking-widest mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>Seasonal Perks & Rewards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2C1810]">
            Featured Offers & Promo Codes
          </h2>
          <p className="text-sm text-[#5C4033] mt-2">
            Click any coupon below to automatically apply the discount to your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePromos.map(promo => {
            const isCopied = copiedCode === promo.couponCode;
            return (
              <div
                key={promo.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#DFD5C7] flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={promo.bannerImage}
                    alt={promo.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase bg-[#C89B6D] text-[#1E1109] px-2 py-0.5 rounded">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountAmount}% OFF`
                        : `$${promo.discountAmount} OFF`}
                    </span>
                    <h3 className="font-display font-bold text-lg leading-tight mt-1">
                      {promo.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#5C4033] leading-relaxed">
                    {promo.description}
                  </p>

                  <div className="pt-2 border-t border-[#F2ECE4] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-stone-400">Coupon Code</div>
                      <div className="font-mono text-sm font-bold text-[#2C1810] tracking-wider">
                        {promo.couponCode}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(promo.couponCode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318]'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Apply Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const AboutSection: React.FC = () => {
  const { cms } = useApp();

  return (
    <section id="about-section" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] text-[#8C5828] text-xs font-bold uppercase tracking-widest">
              <Coffee className="w-3.5 h-3.5" />
              <span>Philosophy & Craft</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2C1810] leading-tight">
              Single-Origin Transparency From Farm to Every Morning Cup
            </h2>
            <p className="text-sm text-[#5C4033] leading-relaxed">
              {cms.aboutStory}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#E8DFD5] shadow-sm">
                <div className="text-xs font-bold text-[#C89B6D] uppercase tracking-wider mb-1">
                  Our Mission
                </div>
                <p className="text-xs text-[#5C4033] leading-relaxed">
                  {cms.aboutMission}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E8DFD5] shadow-sm">
                <div className="text-xs font-bold text-[#C89B6D] uppercase tracking-wider mb-1">
                  Small-Batch Roasting
                </div>
                <p className="text-xs text-[#5C4033] leading-relaxed">
                  {cms.aboutQuality}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"
              alt="Pour over coffee brew"
              className="rounded-2xl object-cover h-64 sm:h-72 w-full shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80"
              alt="Coffee beans roasting"
              className="rounded-2xl object-cover h-64 sm:h-72 w-full shadow-md mt-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const LocationsSection: React.FC = () => {
  const { branches, selectedBranchId, setSelectedBranchId, showToast } = useApp();

  return (
    <section id="locations-section" className="py-20 bg-[#F4EFE6] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5DDCF] text-[#8C5828] text-xs font-bold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Our Roasteries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2C1810]">
            3 Convenient City Locations
          </h2>
          <p className="text-sm text-[#5C4033] mt-2">
            Each branch features indoor lounge seating, fast fiber WiFi, and artisan pour-over brew bars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {branches.map(branch => {
            const isSelected = branch.id === selectedBranchId;
            return (
              <div
                key={branch.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border ${
                  isSelected ? 'border-[#C89B6D] ring-2 ring-[#C89B6D]/30' : 'border-[#DFD5C7]'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold bg-[#2C1810]/80 px-2 py-0.5 rounded text-[#C89B6D]">
                      {branch.city}
                    </span>
                    <h3 className="font-display font-bold text-lg leading-tight mt-1">
                      {branch.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-3 text-xs text-[#5C4033]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C89B6D] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C89B6D] shrink-0" />
                    <span>
                      Open Daily: {branch.openingHours} – {branch.closingHours}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C89B6D] shrink-0" />
                    <span>{branch.phone}</span>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      Mgr: <strong className="text-stone-600">{branch.managerName}</strong>
                    </span>

                    <button
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                        showToast(`Set active branch to ${branch.name}`, 'info');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318]'
                      }`}
                    >
                      {isSelected ? 'Current Store' : 'Select Branch'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ReviewsSection: React.FC = () => {
  const { reviews, products, currentCustomer, createReview } = useApp();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approvedReviews = reviews.filter(r => r.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const prod = products.find(p => p.id === selectedProduct) || products[0];

    createReview({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerAvatar: currentCustomer.avatar,
      productId: prod.id,
      productName: prod.name,
      rating,
      comment: comment.trim(),
      status: 'approved',
    });

    setComment('');
  };

  return (
    <section id="reviews-section" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] text-[#8C5828] text-xs font-bold uppercase tracking-widest mb-3">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>Community Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2C1810]">
            Loved by Daily Coffee Lovers
          </h2>
          <p className="text-sm text-[#5C4033] mt-2">
            Read real customer ratings and write a review for your favorite roast.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {approvedReviews.slice(0, 4).map(rev => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#4A3228] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2ECE4] flex items-center gap-2.5">
                <img
                  src={
                    rev.customerAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                  }
                  alt={rev.customerName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-xs text-[#2C1810]">{rev.customerName}</div>
                  <div className="text-[10px] text-stone-400">{rev.productName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm">
          <h3 className="font-display font-bold text-lg text-[#2C1810] mb-1">
            Leave a Coffee Review
          </h3>
          <p className="text-xs text-[#5C4033] mb-4">
            Posting as <strong>{currentCustomer.name}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Product</label>
              <select
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs text-[#2C1810]"
              >
                {products.filter(p => p.isActive).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-stone-300'}`}
                    />
                  </button>
                ))}
                <span className="font-bold text-xs ml-2 text-stone-600">{rating} out of 5 stars</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Your Thoughts</label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="How was the flavor notes, aroma, milk texture, or food freshness?"
                className="w-full p-3 rounded-xl border border-[#DFD5C7] text-xs focus:outline-none focus:border-[#C89B6D]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold rounded-xl shadow-md transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useApp();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for your 15% welcome voucher code: FIRSTSIP', 'success');
    setEmail('');
  };

  return (
    <section className="py-16 bg-[#2C1810] text-white border-t border-[#3D2318]">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-[#C89B6D] mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-display font-bold">
          Join the Aura Roast Tasting Club
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
          Get weekly cupping notes, secret menu releases, and an immediate 15% discount code for your next mobile order.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold max-w-md mx-auto">
            🎉 Thank you for joining! Use code <strong>FIRSTSIP</strong> at checkout for 20% off.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-xs focus:outline-none focus:border-[#C89B6D]"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#C89B6D] hover:bg-[#B38555] text-[#1E1109] font-bold text-xs transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
