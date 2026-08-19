"use client";
import { useState, useEffect } from 'react';

export default function TopAdSettings() {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // The admin portal runs on port 9002 in dev, and booking platform on 3000
    // We use the full URL if we're in dev mode
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
    fetch(`${baseUrl}/api/settings/top-ad`)
      .then(r => r.json())
      .then(d => {
        if (d && typeof d.isVisible === 'boolean') {
          setIsVisible(d.isVisible);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching top ad settings:', err);
        setLoading(false);
      });
  }, []);

  const handleToggle = async () => {
    setSaving(true);
    const newStatus = !isVisible;
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
      const response = await fetch(`${baseUrl}/api/settings/top-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsVisible(newStatus);
      }
    } catch (err) {
      console.error('Error updating top ad settings:', err);
      alert('Failed to update Top Ad status. Ensure the main server is running.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Settings...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Top Ad Configuration</h1>
        <p className="text-white/50 text-sm mt-1">Manage the promotional offer bar displayed at the very top of the main website.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Top Ad Bar Visibility
              {isVisible ? (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              ) : (
                <span className="text-[10px] font-bold bg-white/10 text-white/40 px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>
              )}
            </h3>
            <p className="text-white/60 text-sm mt-2 max-w-xl leading-relaxed">
              When enabled, a yellow promotional bar will appear globally across the main platform. This bar pushes down the main navigation and includes a "Claim Now" button that opens a special 10% Off booking form.
            </p>
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <button
              onClick={handleToggle}
              disabled={saving}
              className={`relative w-20 h-10 rounded-full transition-colors duration-300 ${isVisible ? 'bg-emerald-500' : 'bg-white/10'} ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
              aria-label="Toggle Ad Bar"
            >
              <div className={`absolute top-1 bottom-1 w-8 rounded-full bg-white transition-all duration-300 shadow-lg ${isVisible ? 'left-11' : 'left-1'}`} />
            </button>
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
              {isVisible ? 'Turn Off' : 'Turn On'}
            </span>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Live Preview Setup</h4>
          <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            {isVisible ? (
              <div className="w-full bg-[#FFE032] py-2 px-4 flex items-center justify-center gap-4 text-black font-semibold text-sm">
                <span>🎉 Exclusive Offer: Get 10% OFF on your first artist booking!</span>
                <span className="bg-black text-[#FFE032] px-3 py-1 rounded-lg text-xs font-bold">Claim Now</span>
              </div>
            ) : (
              <div className="w-full h-10 flex items-center justify-center text-white/20 text-sm italic">
                (Ad bar is currently disabled and will not render)
              </div>
            )}
            <div className="w-full h-12 bg-[#080707] flex items-center px-4 border-b border-white/5">
              <div className="w-24 h-4 bg-white/10 rounded-md"></div>
              <div className="ml-auto flex gap-4">
                <div className="w-12 h-2 bg-white/5 rounded-full"></div>
                <div className="w-12 h-2 bg-white/5 rounded-full"></div>
                <div className="w-12 h-2 bg-white/5 rounded-full"></div>
              </div>
            </div>
            <div className="w-full h-24 bg-gradient-to-b from-[#080707] to-[#0f0f0f] p-4">
              <div className="w-48 h-6 bg-white/5 rounded-lg mb-2"></div>
              <div className="w-64 h-4 bg-white/5 rounded-lg"></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
