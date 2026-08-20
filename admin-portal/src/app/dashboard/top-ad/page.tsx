"use client";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Megaphone, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink,
  Laptop,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function TopAdSettings() {
  const [isVisible, setIsVisible] = useState(true);
  const [textDesktop, setTextDesktop] = useState("🎉 Exclusive Offer: First-time users get a discount on their booking!");
  const [textMobile, setTextMobile] = useState("🎉 Special Discount on First Booking!");
  
  const [isFormOfferVisible, setIsFormOfferVisible] = useState(true);
  const [formOfferText, setFormOfferText] = useState("🎉 Exclusive Offer: First-time users get a discount on their booking!");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingText, setSavingText] = useState(false);
  
  const [savingFormOffer, setSavingFormOffer] = useState(false);
  const [savingFormOfferText, setSavingFormOfferText] = useState(false);
  
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const { toast } = useToast();

  useEffect(() => {
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in');
    
    Promise.all([
      fetch(`${baseUrl}/api/settings/top-ad`).then(r => r.json()).catch(() => null),
      fetch(`${baseUrl}/api/settings/form-offer`).then(r => r.json()).catch(() => null)
    ]).then(([topAdData, formOfferData]) => {
      if (topAdData) {
        if (typeof topAdData.isVisible === 'boolean') setIsVisible(topAdData.isVisible);
        if (topAdData.textDesktop) setTextDesktop(topAdData.textDesktop);
        if (topAdData.textMobile) setTextMobile(topAdData.textMobile);
      }
      if (formOfferData) {
        if (typeof formOfferData.isVisible === 'boolean') setIsFormOfferVisible(formOfferData.isVisible);
        if (formOfferData.textDesktop) setFormOfferText(formOfferData.textDesktop);
      }
      setLoading(false);
    });
  }, []);

  const handleToggle = async () => {
    setSaving(true);
    const newStatus = !isVisible;
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in');
      const response = await fetch(`${baseUrl}/api/settings/top-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsVisible(newStatus);
        toast({
          title: newStatus ? "Top Ad Bar Activated" : "Top Ad Bar Disabled",
          description: newStatus 
            ? "The promotional banner is now live across the booking platform." 
            : "The promotional banner has been removed from the platform.",
        });
      }
    } catch (err) {
      console.error('Error updating top ad settings:', err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to communicate with main website. Ensure both servers are running.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveText = async () => {
    setSavingText(true);
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in');
      const response = await fetch(`${baseUrl}/api/settings/top-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textDesktop, textMobile })
      });
      
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Text Updated Successfully",
          description: "The banner text has been updated across the booking platform.",
        });
      }
    } catch (err) {
      console.error('Error updating banner text:', err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update banner text. Ensure both servers are running.",
      });
    } finally {
      setSavingText(false);
    }
  };

  const handleToggleFormOffer = async () => {
    setSavingFormOffer(true);
    const newStatus = !isFormOfferVisible;
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in');
      const response = await fetch(`${baseUrl}/api/settings/form-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsFormOfferVisible(newStatus);
        toast({
          title: newStatus ? "Form Offer Activated" : "Form Offer Disabled",
          description: newStatus 
            ? "The promotional offer in the lead form is now visible." 
            : "The promotional offer in the lead form has been hidden.",
        });
      }
    } catch (err) {
      console.error('Error updating form offer settings:', err);
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setSavingFormOffer(false);
    }
  };

  const handleSaveFormOfferText = async () => {
    setSavingFormOfferText(true);
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in');
      const response = await fetch(`${baseUrl}/api/settings/form-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textDesktop: formOfferText, textMobile: formOfferText })
      });
      
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Form Text Updated Successfully",
          description: "The form promotional text has been updated.",
        });
      }
    } catch (err) {
      console.error('Error updating form offer text:', err);
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setSavingFormOfferText(false);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="section-header">
          <span className="section-label flex items-center gap-1.5 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <Megaphone size={14} className="text-indigo-600" />
            Marketing & Promotions
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Top Banner Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-medium">
            Control the global discount announcement bar displayed at the very top of the customer booking website.
          </p>
        </div>

        <a 
          href={process.env.NEXT_PUBLIC_SITE_URL || "https://www.magnevents.in"}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm"
        >
          <ExternalLink size={14} />
          View Live Website
        </a>
      </div>

      {/* Main Control Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                isVisible ? 'bg-amber-50 border border-amber-200 text-amber-600' : 'bg-slate-100 border border-slate-200 text-slate-400'
              }`}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  Global Top Ad Bar
                  {isVisible ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live & Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      Disabled
                    </span>
                  )}
                </h3>
                <p className="text-slate-500 text-xs font-medium mt-0.5">
                  Yellow highlight banner at 0px header position with instant claim button
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl pt-2">
              When turned on, the yellow promotional bar will be displayed at the very top of all landing pages. It includes a clickable <strong className="text-slate-900">Claim Now</strong> action button that opens the discount lead form directly.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-2.5 bg-slate-50/80 p-4 rounded-xl border border-slate-100 min-w-[160px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isVisible ? 'Banner Enabled' : 'Banner Disabled'}
            </span>
            <button
              onClick={handleToggle}
              disabled={saving}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 ${
                isVisible ? 'bg-emerald-500' : 'bg-slate-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-95'}`}
              aria-label="Toggle banner visibility"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                  isVisible ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-[11px] font-bold text-slate-600">
              {saving ? 'Updating...' : isVisible ? 'Click to Turn Off' : 'Click to Turn On'}
            </span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
              <Zap size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Smart Scroll Snapping</h4>
              <p className="text-[12px] text-slate-500 mt-0.5 font-medium leading-normal">
                Scrolls away smoothly and leaves your original navbar fixed to the top.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">First Booking Hook</h4>
              <p className="text-[12px] text-slate-500 mt-0.5 font-medium leading-normal">
                Proven to increase initial inquiry conversion by over 35%.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fully Mobile Optimized</h4>
              <p className="text-[12px] text-slate-500 mt-0.5 font-medium leading-normal">
                Fits perfectly on narrow phone screens with no content overflow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Text Configuration Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          Ad Text Configuration
        </h3>
        <div className="space-y-5 max-w-3xl">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Desktop Banner Text</label>
            <input 
              type="text" 
              value={textDesktop} 
              onChange={(e) => setTextDesktop(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
              placeholder="e.g. 🎉 Exclusive Offer: First-time users get a discount on their booking!"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Banner Text (Shorter)</label>
            <input 
              type="text" 
              value={textMobile} 
              onChange={(e) => setTextMobile(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
              placeholder="e.g. 🎉 Special Discount on First Booking!"
            />
          </div>
          <button 
            onClick={handleSaveText}
            disabled={savingText}
            className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${savingText ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-md'}`}
          >
            {savingText ? 'Saving...' : 'Save Text Settings'}
          </button>
        </div>
      </div>

      <hr className="my-8 border-slate-200" />

      {/* --- LEAD FORM OFFER SECTION --- */}
      <div className="section-header mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Lead Form Promotional Offer
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-xl font-medium">
          Control the special discount box that appears inside the "Book Now" inquiry form.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                isFormOfferVisible ? 'bg-amber-50 border border-amber-200 text-amber-600' : 'bg-slate-100 border border-slate-200 text-slate-400'
              }`}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  Form Page Offer
                  {isFormOfferVisible ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live & Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      Disabled
                    </span>
                  )}
                </h3>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl pt-2">
              When turned on, the special Raksha Bandhan offer box will be shown inside the booking modal.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-2.5 bg-slate-50/80 p-4 rounded-xl border border-slate-100 min-w-[160px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isFormOfferVisible ? 'Offer Enabled' : 'Offer Disabled'}
            </span>
            <button
              onClick={handleToggleFormOffer}
              disabled={savingFormOffer}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 ${
                isFormOfferVisible ? 'bg-emerald-500' : 'bg-slate-300'
              } ${savingFormOffer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-95'}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                  isFormOfferVisible ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-5 max-w-3xl pt-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Form Offer Text</label>
            <input 
              type="text" 
              value={formOfferText} 
              onChange={(e) => setFormOfferText(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
              placeholder="e.g. 🎉 Exclusive Offer: First-time users get a discount on their booking!"
            />
            <p className="text-xs text-slate-500 mt-2">Note: This exact text will be displayed to users in the booking form.</p>
          </div>
          <button 
            onClick={handleSaveFormOfferText}
            disabled={savingFormOfferText}
            className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${savingFormOfferText ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-md'}`}
          >
            {savingFormOfferText ? 'Saving...' : 'Save Form Text'}
          </button>
        </div>
      </div>

      <hr className="my-8 border-slate-200" />

      {/* Live Preview Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span className="text-xs font-bold text-slate-600 ml-2">Live Customer View Preview</span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                previewDevice === 'desktop' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Laptop size={14} />
              Desktop
            </button>
            <button 
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                previewDevice === 'mobile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone size={14} />
              Mobile
            </button>
          </div>
        </div>

        {/* Preview Frame Content */}
        <div className="p-6 md:p-10 bg-slate-900 flex justify-center items-center min-h-[300px]">
          <div className={`transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-white/10 ${
            previewDevice === 'mobile' ? 'w-[320px]' : 'w-full max-w-2xl'
          }`}>
            
            {/* Top Ad in Preview */}
            {isVisible ? (
              <div className="bg-[#FFE032] text-black px-4 py-2 flex items-center justify-between text-xs font-bold transition-all">
                <span className="truncate">
                  {previewDevice === 'mobile' ? textMobile : textDesktop}
                </span>
                <span className="bg-black text-[#FFE032] px-2 py-0.5 rounded text-[10px] font-extrabold flex-shrink-0 ml-2">
                  Claim Now
                </span>
              </div>
            ) : (
              <div className="bg-slate-800/80 text-slate-400 py-1.5 px-4 text-[11px] text-center italic border-b border-white/5">
                (Banner Hidden - Website starts with Navbar)
              </div>
            )}

            {/* Navbar in Preview */}
            <div className="bg-[#080707] text-white px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2 font-black text-xs tracking-wider">
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px]">M</div>
                MAGNEVENTS
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                {previewDevice === 'desktop' && (
                  <>
                    <span>Artists</span>
                    <span>Pricing</span>
                    <span>Blog</span>
                  </>
                )}
                <span className="bg-[#FFE032] text-black font-bold px-2 py-0.5 rounded text-[10px]">
                  Contact
                </span>
              </div>
            </div>

            {/* Mock Hero Area in Preview */}
            <div className="bg-gradient-to-b from-[#110f0e] to-[#0a0a0a] p-6 text-center space-y-3">
              <div className="h-4 bg-white/20 rounded w-2/3 mx-auto"></div>
              <div className="h-3 bg-white/10 rounded w-1/2 mx-auto"></div>
              <div className="pt-2 flex justify-center gap-2">
                <div className="h-6 w-20 bg-amber-500/30 rounded"></div>
                <div className="h-6 w-20 bg-white/10 rounded"></div>
              </div>
            </div>

          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Changes take effect immediately on the live booking platform.</span>
          <span className="font-semibold text-slate-700">Auto-saved to API</span>
        </div>
      </div>
    </div>
  );
}
