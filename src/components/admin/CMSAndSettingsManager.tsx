import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Save,
  RotateCcw,
  Download,
  Upload,
  Globe,
  Shield,
  FileText,
  Clock,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
} from 'lucide-react';

export const CMSManager: React.FC = () => {
  const { cms, updateCMS, showToast } = useApp();

  const [heroHeadline, setHeroHeadline] = useState(cms.heroHeadline);
  const [heroTagline, setHeroTagline] = useState(cms.heroTagline);
  const [heroSubheadline, setHeroSubheadline] = useState(cms.heroSubheadline);
  const [heroImage, setHeroImage] = useState(cms.heroImage);
  const [announcementText, setAnnouncementText] = useState(cms.announcementText);
  const [showAnnouncement, setShowAnnouncement] = useState(cms.showAnnouncement);
  const [aboutStory, setAboutStory] = useState(cms.aboutStory);
  const [aboutMission, setAboutMission] = useState(cms.aboutMission);
  const [aboutQuality, setAboutQuality] = useState(cms.aboutQuality);
  const [contactPhone, setContactPhone] = useState(cms.contactPhone);
  const [contactEmail, setContactEmail] = useState(cms.contactEmail);
  const [faqs, setFaqs] = useState(cms.faqs || []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS({
      heroHeadline,
      heroTagline,
      heroSubheadline,
      heroImage,
      announcementText,
      showAnnouncement,
      aboutStory,
      aboutMission,
      aboutQuality,
      contactPhone,
      contactEmail,
      faqs,
    });
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: 'New Question?', answer: 'Answer details here...' }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-[#2C1810]">
          Website Content Management System (CMS)
        </h2>
        <p className="text-xs text-stone-500">
          Modify hero titles, marketing banners, announcements, stories, and FAQs live with zero code deployment.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-[#2C1810]">
        {/* Hero Section Copy */}
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
          <div className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE4] pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C89B6D]" />
            <span>Homepage Hero Banner</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={heroTagline}
                onChange={e => setHeroTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Main Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={e => setHeroHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-bold font-display text-base"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Subheadline Description</label>
              <textarea
                rows={2}
                value={heroSubheadline}
                onChange={e => setHeroSubheadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Hero Image URL</label>
              <input
                type="url"
                value={heroImage}
                onChange={e => setHeroImage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Announcement Strip */}
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
          <div className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE4] pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C89B6D]" />
              <span>Top Announcement Strip</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={showAnnouncement}
                onChange={e => setShowAnnouncement(e.target.checked)}
                className="rounded text-[#C89B6D]"
              />
              <span>Display Live</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Announcement Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
            />
          </div>
        </div>

        {/* About & Brand Story */}
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
          <div className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE4] pb-2">
            Our Story & Ethical Philosophy
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Brand Heritage</label>
              <textarea
                rows={3}
                value={aboutStory}
                onChange={e => setAboutStory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Mission Statement</label>
                <textarea
                  rows={2}
                  value={aboutMission}
                  onChange={e => setAboutMission(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Quality & Craft</label>
                <textarea
                  rows={2}
                  value={aboutQuality}
                  onChange={e => setAboutQuality(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
          <div className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE4] pb-2 flex items-center justify-between">
            <span>Customer FAQs</span>
            <button
              type="button"
              onClick={handleAddFaq}
              className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-stone-200 border border-[#DFD5C7] text-stone-700 font-bold rounded-lg text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={e => {
                      const updated = [...faqs];
                      updated[i].question = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Question"
                    className="flex-1 p-1.5 rounded-lg border border-[#DFD5C7] bg-white font-bold text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(i)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={e => {
                    const updated = [...faqs];
                    updated[i].answer = e.target.value;
                    setFaqs(updated);
                  }}
                  placeholder="Answer"
                  className="w-full p-2 rounded-lg border border-[#DFD5C7] bg-white text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Live Website Changes</span>
        </button>
      </form>
    </div>
  );
};

export const AuditLogsManager: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = auditLogs.filter(l => {
    if (filterAction !== 'all' && l.action !== filterAction) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            System Security & Operations Audit Logs
          </h2>
          <p className="text-xs text-stone-500">
            Immutable tracking of data modifications, status changes, inventory adjustments, and logins.
          </p>
        </div>

        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          className="py-1.5 px-3 rounded-xl border border-[#DFD5C7] bg-white text-xs font-semibold text-[#2C1810]"
        >
          <option value="all">All Actions ({auditLogs.length})</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="STATUS_CHANGE">STATUS_CHANGE</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-[#DFD5C7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider border-b border-[#DFD5C7]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-[#2C1810]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 font-mono text-stone-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <div>{log.userName}</div>
                    <div className="text-[10px] text-stone-400 font-normal">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'DELETE'
                          ? 'bg-rose-100 text-rose-800'
                          : log.action === 'STATUS_CHANGE'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-700">{log.module}</td>
                  <td className="py-3 px-4 text-stone-600 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SettingsManager: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToSampleData,
    exportDatabaseJSON,
    importDatabaseJSON,
    showToast,
  } = useApp();

  const [shopName, setShopName] = useState(settings.shopName);
  const [taxRatePercent, setTaxRatePercent] = useState(settings.taxRatePercent.toString());
  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryFee.toString());
  const [minimumOrder, setMinimumOrder] = useState(settings.minimumOrder.toString());
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(settings.freeDeliveryThreshold.toString());
  const [loyaltyEarnRate, setLoyaltyEarnRate] = useState(settings.loyaltyEarnRate.toString());
  const [openingTime, setOpeningTime] = useState(settings.openingTime);
  const [closingTime, setClosingTime] = useState(settings.closingTime);
  const [autoDeductInventory, setAutoDeductInventory] = useState(settings.autoDeductInventory);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      shopName,
      taxRatePercent: parseFloat(taxRatePercent) || 8.0,
      deliveryFee: parseFloat(deliveryFee) || 3.5,
      minimumOrder: parseFloat(minimumOrder) || 5.0,
      freeDeliveryThreshold: parseFloat(freeDeliveryThreshold) || 35.0,
      loyaltyEarnRate: parseFloat(loyaltyEarnRate) || 1,
      openingTime,
      closingTime,
      autoDeductInventory,
    });
  };

  const handleExport = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_roast_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported to JSON backup file!', 'success');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-[#2C1810]">
          System Settings & Store Preferences
        </h2>
        <p className="text-xs text-stone-500">
          Configure financial tax rates, delivery policies, automatic recipe inventory deduction, and data backup.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs text-[#2C1810]">
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
          <div className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE4] pb-2">
            Store Name & Hours
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Coffee Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] font-semibold text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Standard Opening</label>
              <input
                type="text"
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Standard Closing</label>
              <input
                type="text"
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
          <div className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE4] pb-2">
            Pricing, Tax & Fulfillment Thresholds
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRatePercent}
                onChange={e => setTaxRatePercent(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Delivery Fee ($)</label>
              <input
                type="number"
                step="0.25"
                value={deliveryFee}
                onChange={e => setDeliveryFee(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Free Delivery Min ($)</label>
              <input
                type="number"
                step="1"
                value={freeDeliveryThreshold}
                onChange={e => setFreeDeliveryThreshold(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Loyalty Points / $1</label>
              <input
                type="number"
                step="0.5"
                value={loyaltyEarnRate}
                onChange={e => setLoyaltyEarnRate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
              <input
                type="checkbox"
                checked={autoDeductInventory}
                onChange={e => setAutoDeductInventory(e.target.checked)}
                className="rounded text-[#C89B6D]"
              />
              <span>
                Enable Automatic Recipe Ingredient Deduction on Order Completion
              </span>
            </label>
            <p className="text-[11px] text-stone-400 ml-5 mt-0.5">
              When an order is marked as 'Completed', raw beans, milk, syrups, and packaging are decremented in inventory.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>

      {/* Backup & Reset Data */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFD5C7] shadow-sm space-y-4">
        <div className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE4] pb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#C89B6D]" />
          <span>Central Database Backup & Recovery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleExport}
            className="p-4 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#DFD5C7] flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5 text-[#8C5828]" />
            <div className="font-bold text-xs text-[#2C1810]">Export Database JSON</div>
            <div className="text-[10px] text-stone-400">Download full offline snapshot</div>
          </button>

          <label className="p-4 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#DFD5C7] flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer">
            <Upload className="w-5 h-5 text-[#8C5828]" />
            <div className="font-bold text-xs text-[#2C1810]">Import Database JSON</div>
            <div className="text-[10px] text-stone-400">Restore state from JSON backup</div>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Reset database to clean sample data? All test records will be refreshed.')) {
                resetToSampleData();
              }
            }}
            className="p-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <div className="font-bold text-xs text-rose-800">Reset to Sample Data</div>
            <div className="text-[10px] text-rose-500">Restore default 20+ products & orders</div>
          </button>
        </div>
      </div>
    </div>
  );
};
