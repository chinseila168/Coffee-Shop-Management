import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coffee, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { cms, settings, branches, setPlatformView } = useApp();

  return (
    <footer className="bg-[#1F120B] text-[#E8DFD5] pt-16 pb-12 border-t border-[#382015]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#382015]">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D2318] flex items-center justify-center text-[#C89B6D]">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-xl text-white tracking-tight">
                  {settings.shopName}
                </div>
                <div className="text-[10px] font-semibold text-[#C89B6D] tracking-widest uppercase">
                  Single Origin Roasters
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {cms.aboutStory.slice(0, 160)}...
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={cms.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#2E1A11] flex items-center justify-center text-stone-300 hover:text-[#C89B6D] hover:bg-[#3D2318] transition-colors text-xs font-bold"
              >
                IG
              </a>
              <a
                href={cms.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#2E1A11] flex items-center justify-center text-stone-300 hover:text-[#C89B6D] hover:bg-[#3D2318] transition-colors text-xs font-bold"
              >
                FB
              </a>
              <a
                href={cms.socialTwitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#2E1A11] flex items-center justify-center text-stone-300 hover:text-[#C89B6D] hover:bg-[#3D2318] transition-colors text-xs font-bold"
              >
                X
              </a>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#C89B6D] uppercase">
              Our Roasteries
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              {branches.map(branch => (
                <div key={branch.id} className="group">
                  <div className="font-medium text-white group-hover:text-[#C89B6D] transition-colors">
                    {branch.name}
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#C89B6D] shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    Daily: {branch.openingHours} – {branch.closingHours}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#C89B6D] uppercase">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C89B6D]" />
                <span>{cms.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C89B6D]" />
                <span>{cms.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C89B6D]" />
                <span>Standard Support: 7am - 8pm</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setPlatformView('admin_dashboard')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#C89B6D] hover:text-white bg-[#2E1A11] px-3 py-1.5 rounded-lg border border-[#4A2D1F] transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin & Staff Portal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coffee Ethics & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#C89B6D] uppercase">
              The Aura Commitment
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {cms.aboutQuality}
            </p>
            <div className="p-3 rounded-xl bg-[#28160E] border border-[#3D2318] text-[11px] text-stone-300 flex items-start gap-2">
              <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                100% compostable takeaway packaging and certified organic dairy & plant milks.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} {settings.shopName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Allergen Guide</span>
            <span className="hover:text-stone-300 cursor-pointer">Direct Trade Partners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
