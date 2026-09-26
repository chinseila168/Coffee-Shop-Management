import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coffee, ArrowRight, Star, Sparkles, MapPin } from 'lucide-react';

interface HeroProps {
  onOrderNowClick: () => void;
  onExploreMenuClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNowClick, onExploreMenuClick }) => {
  const { cms, branches, selectedBranchId, setSelectedBranchId } = useApp();

  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#24140C] text-white">
      {/* CMS Announcement Top Strip */}
      {cms.showAnnouncement && cms.announcementText && (
        <div className="bg-[#C89B6D] text-[#1E1109] px-4 py-2 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{cms.announcementText}</span>
        </div>
      )}

      {/* Hero Visual Container */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Image with warm gradient scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={cms.heroImage}
            alt="Coffee shop ambiance"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#190C06]/95 via-[#23120A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24140C] via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C89B6D]/20 border border-[#C89B6D]/40 backdrop-blur-md text-[#E8DFD5] text-xs font-bold tracking-widest uppercase">
              <Coffee className="w-3.5 h-3.5 text-[#C89B6D]" />
              <span>{cms.heroTagline}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
              {cms.heroHeadline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-xl">
              {cms.heroSubheadline}
            </p>

            {/* Branch Quick Switcher */}
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-300 bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/10 max-w-md">
              <MapPin className="w-4 h-4 text-[#C89B6D] shrink-0" />
              <span className="text-stone-400">Ordering from:</span>
              <select
                value={selectedBranchId}
                onChange={e => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-[#E8DFD5] font-semibold focus:outline-none cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id} className="bg-[#2C1810] text-white">
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOrderNowClick}
                className="flex items-center gap-2.5 bg-[#C89B6D] hover:bg-[#B38555] text-[#1E1109] font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 group cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreMenuClick}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                <span>Explore Menu</span>
              </button>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.9/5</span>
                <span className="text-stone-400">(600+ reviews)</span>
              </div>

              <div className="hidden sm:inline text-stone-500">•</div>

              <div>
                <span className="text-white font-semibold">15 mins</span> avg pickup time
              </div>

              <div className="hidden sm:inline text-stone-500">•</div>

              <div>
                <span className="text-white font-semibold">100%</span> direct trade beans
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
