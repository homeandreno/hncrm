import React, { useState, useEffect, useCallback } from 'react';
import { 
  Megaphone, Share2, Mail, Zap, Search, Plus, MoreHorizontal, Filter, MessageSquare, 
  FileText, BarChart2, PlusCircle, Bell, Settings, Camera, LayoutGrid, Globe, 
  ShoppingCart, ShoppingBag, ExternalLink, ChevronDown, GripVertical, X, Trash2, 
  Move, Users, Video, Key, Shield, Globe2, Monitor, RefreshCcw, LogOut, Eye, EyeOff,
  Maximize2, RotateCcw, WifiOff, Wifi, ExternalLink as Launch
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

const BRIDGE_URL = 'http://localhost:3001';

const INITIAL_PLATFORMS = [
  { id: 'Facebook', icon: Share2, label: 'Facebook', url: 'https://www.facebook.com' },
  { id: 'Marketplace', icon: ShoppingBag, label: 'Marketplace', url: 'https://www.facebook.com/marketplace' },
  { id: 'Instagram', icon: Camera, label: 'Instagram', url: 'https://www.instagram.com' },
  { id: 'TikTok', icon: Video, label: 'TikTok', url: 'https://www.tiktok.com' },
  { id: 'Google', icon: Globe, label: 'Google', url: 'https://myaccount.google.com' },
  { id: 'Bing', icon: Search, label: 'Bing', url: 'https://www.bing.com' },
  { id: 'Amazon', icon: ShoppingCart, label: 'Amazon', url: 'https://sellercentral.amazon.com' },
  { id: 'eBay', icon: ShoppingBag, label: 'eBay', url: 'https://www.ebay.com' },
  { id: 'Walmart', icon: ShoppingCart, label: 'Walmart', url: 'https://www.walmart.com' },
  { id: 'BestBuy', icon: ShoppingBag, label: 'Best Buy', url: 'https://www.bestbuy.com' },
  { id: 'Twitter', icon: Share2, label: 'X (Twitter)', url: 'https://x.com' },
  { id: 'LinkedIn', icon: Users, label: 'LinkedIn', url: 'https://www.linkedin.com' },
  { id: 'YouTube', icon: Video, label: 'YouTube', url: 'https://studio.youtube.com' }
];

const EXTRA_PLATFORMS = [
  { id: 'Pinterest', icon: Share2, label: 'Pinterest', url: 'https://www.pinterest.com' },
  { id: 'Snapchat', icon: Bell, label: 'Snapchat', url: 'https://www.snapchat.com' },
  { id: 'WhatsApp', icon: MessageSquare, label: 'WhatsApp', url: 'https://web.whatsapp.com' },
  { id: 'Reddit', icon: MessageSquare, label: 'Reddit', url: 'https://www.reddit.com' },
  { id: 'Telegram', icon: MessageSquare, label: 'Telegram', url: 'https://web.telegram.org' },
  { id: 'Etsy', icon: ShoppingBag, label: 'Etsy', url: 'https://www.etsy.com' },
  { id: 'Houzz', icon: Globe, label: 'Houzz', url: 'https://www.houzz.com' },
  { id: 'Nextdoor', icon: Globe, label: 'Nextdoor', url: 'https://nextdoor.com' },
  { id: 'Yelp', icon: Globe, label: 'Yelp', url: 'https://www.yelp.com' },
  { id: 'AdManager', icon: BarChart2, label: 'Ads Manager', url: 'https://adsmanager.facebook.com' },
  { id: 'Messenger', icon: MessageSquare, label: 'Messenger', url: 'https://www.messenger.com' },
  { id: 'Alibaba', icon: ShoppingCart, label: 'Alibaba', url: 'https://www.alibaba.com' },
  { id: 'Craigslist', icon: FileText, label: 'Craigslist', url: 'https://www.craigslist.org' },
  { id: 'Kijiji', icon: Globe, label: 'Kijiji', url: 'https://www.kijiji.ca' },
  { id: 'Wayfair', icon: ShoppingBag, label: 'Wayfair', url: 'https://www.wayfair.com' },
];

const Marketing = () => {
  const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);
  const [activePlatform, setActivePlatform] = useState('Facebook');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [bridgeOnline, setBridgeOnline] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState(null);
  const [profileMap, setProfileMap] = useState({});

  // Load persistence
  useEffect(() => {
    const savedPlatforms = localStorage.getItem('marketing-platforms-order');
    if (savedPlatforms) {
      try {
        const orderIds = JSON.parse(savedPlatforms);
        const allAvailable = [...INITIAL_PLATFORMS, ...EXTRA_PLATFORMS];
        const reordered = orderIds.map(id => allAvailable.find(p => p.id === id)).filter(Boolean);
        if (reordered.length > 0) setPlatforms(reordered);
      } catch (e) {}
    }

    const savedProfiles = localStorage.getItem('marketing-profile-map');
    if (savedProfiles) {
      try {
        setProfileMap(JSON.parse(savedProfiles));
      } catch (e) {}
    } else {
      const initialMap = {};
      INITIAL_PLATFORMS.forEach(p => {
        initialMap[p.id] = Array.from({ length: 50 }).map((_, i) => ({
          id: `${p.id}-${i}`,
          name: `${p.label} Acct #${i + 1}`,
          username: `${p.id.toLowerCase()}_user_${1000 + i}`,
          password: `pass_${Math.random().toString(36).substring(7)}`,
          proxy: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          status: i < 5 ? 'Active' : 'Ready'
        }));
      });
      setProfileMap(initialMap);
    }
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('marketing-platforms-order', JSON.stringify(platforms.map(p => p.id)));
  }, [platforms]);

  useEffect(() => {
    if (Object.keys(profileMap).length > 0) {
      localStorage.setItem('marketing-profile-map', JSON.stringify(profileMap));
    }
  }, [profileMap]);

  const currentProfiles = profileMap[activePlatform] || [];

  const handleReorderProfiles = (newOrder) => {
    setProfileMap(prev => ({
      ...prev,
      [activePlatform]: newOrder
    }));
  };

  const checkBridge = useCallback(async () => {
    try {
      const res = await fetch(`${BRIDGE_URL}/status`, { signal: AbortSignal.timeout(1500) });
      setBridgeOnline(res.ok);
    } catch {
      setBridgeOnline(false);
    }
  }, []);

  useEffect(() => {
    checkBridge();
    const interval = setInterval(checkBridge, 5000);
    return () => clearInterval(interval);
  }, [checkBridge]);

  const handleLaunch = async (profile) => {
    if (!profile) return;
    const platform = platforms.find(p => p.id === activePlatform);
    const targetUrl = platform?.url || 'https://www.google.com';

    setIsLaunching(true);
    setLaunchError(null);

    if (bridgeOnline) {
      try {
        const res = await fetch(`${BRIDGE_URL}/launch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: targetUrl,
            proxy: profile.proxy,
            profileId: profile.id,
            username: profile.username,
            password: profile.password
          })
        });
        const data = await res.json();
        if (data.success) {
          setActiveSession({ profile, platform, url: targetUrl, launchedAt: new Date() });
        } else {
          setLaunchError(data.error || 'Launch failed');
        }
      } catch (err) {
        setLaunchError('Bridge request failed: ' + err.message);
      }
    } else {
      window.open(targetUrl, '_blank');
      setActiveSession({ profile, platform, url: targetUrl, launchedAt: new Date() });
    }
    setIsLaunching(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#08080a', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      
      <header style={{ height: '44px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: '#0a0a0c' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', background: '#6366f1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Shield size={14} color="white" />
            </div>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.8rem', letterSpacing: '1px' }}>CORE.MARKETING</div>
         </div>

         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
               <div className="save-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
               CLOUD SYNCED
            </div>
            <button 
               onClick={() => { localStorage.clear(); window.location.reload(); }}
               style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}
            >
               <RefreshCcw size={14} />
            </button>
            <Settings size={16} color="#475569" style={{ cursor: 'pointer' }} />
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1e1e24', border: '1px solid #2d2d3f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>BK</div>
         </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        <aside style={{ width: '74px', borderRight: '1px solid rgba(255,255,255,0.05)', background: '#0a0a0c', display: 'flex', flexDirection: 'column', position: 'relative' }}>
           <div style={{ flex: 1, overflowY: 'auto' }}>
             <Reorder.Group axis="y" values={platforms} onReorder={setPlatforms} style={{ listStyle: 'none', padding: 0 }}>
                {platforms.map((p) => (
                  <Reorder.Item key={p.id} value={p}>
                    <div 
                      onClick={() => { setActivePlatform(p.id); setSelectedProfile(null); }}
                      style={{ 
                        padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab', 
                        opacity: activePlatform === p.id ? 1 : 0.2, transition: 'all 0.2s',
                        background: activePlatform === p.id ? 'rgba(99,102,241,0.08)' : 'transparent'
                      }}
                    >
                       <p.icon size={18} color={activePlatform === p.id ? '#6366f1' : '#fff'} />
                       <span style={{ fontSize: '0.48rem', color: '#475569', marginTop: '5px', textTransform: 'uppercase', fontWeight: 800 }}>{p.id.substring(0,4)}</span>
                    </div>
                  </Reorder.Item>
                ))}
             </Reorder.Group>
           </div>

           <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
             <div
               onClick={() => setShowMoreDropdown(v => !v)}
               style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s' }}
             >
               <MoreHorizontal size={18} color="#6366f1" />
               <span style={{ fontSize: '0.48rem', color: '#6366f1', marginTop: '5px', fontWeight: 800 }}>MORE</span>
             </div>

             <AnimatePresence>
               {showMoreDropdown && (
                 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                   style={{
                     position: 'absolute', bottom: '60px', left: '78px', width: '220px', background: '#161620',
                     border: '1px solid #2d2d3f', borderRadius: '14px', padding: '10px 0', zIndex: 200,
                     boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                   }}
                 >
                   <div style={{ padding: '8px 16px 12px', fontSize: '0.6rem', color: '#444', fontWeight: 900, letterSpacing: '1px' }}>ADD TO YOUR LIST</div>
                   {EXTRA_PLATFORMS.filter(ep => !platforms.find(p => p.id === ep.id)).map(ep => (
                     <div key={ep.id} onClick={() => { setPlatforms(prev => [...prev, ep]); setShowMoreDropdown(false); setActivePlatform(ep.id); setSelectedProfile(null); }}
                       style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s' }}
                       onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                     >
                       <ep.icon size={16} color="#6366f1" />
                       <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{ep.label}</span>
                       <Plus size={12} color="#333" style={{ marginLeft: 'auto' }} />
                     </div>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </aside>

        <aside style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#0d0d12' }}>
           <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{activePlatform} Pool</div>
              <Plus size={14} color="#475569" />
           </div>
           
           <div style={{ flex: 1, overflowY: 'auto' }}>
              <Reorder.Group axis="y" values={currentProfiles} onReorder={handleReorderProfiles} style={{ listStyle: 'none', padding: 0 }}>
                {currentProfiles.map((prof) => (
                  <Reorder.Item key={prof.id} value={prof}>
                    <div 
                      onClick={() => setSelectedProfile(prof)}
                      style={{ 
                        padding: '12px 20px', cursor: 'grab', transition: 'all 0.2s',
                        background: selectedProfile?.id === prof.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        borderLeft: selectedProfile?.id === prof.id ? '2px solid #6366f1' : '2px solid transparent'
                      }}
                    >
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                             <Users size={16} />
                          </div>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '0.8rem', color: selectedProfile?.id === prof.id ? 'white' : '#94a3b8', fontWeight: 600 }}>{prof.name}</div>
                             <div style={{ fontSize: '0.65rem', color: '#475569' }}>{prof.status} • {prof.proxy.split('.')[3]}</div>
                          </div>
                       </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
           </div>
        </aside>

        <main style={{ flex: 1, background: '#08080a', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
           <div style={{ height: '36px', background: '#0d0d12', borderBottom: '1px solid #1f1f27', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 {bridgeOnline
                   ? <><Wifi size={13} color="#10b981" /><span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Native Bridge: Online</span></>
                   : <><WifiOff size={13} color="#f59e0b" /><span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>Bridge Offline</span></>
                 }
              </div>
           </div>

           <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
             {selectedProfile ? (
               activeSession?.profile?.id === selectedProfile.id ? (
                 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '860px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.05))', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '20px' }}>
                       <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Monitor size={28} color="#10b981" />
                       </div>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 900, marginBottom: '4px' }}>Session Active</div>
                          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>{activeSession.platform?.label} Â· {activeSession.profile.name}</div>
                       </div>
                       <button onClick={() => setActiveSession(null)} style={{ height: '42px', padding: '0 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>End Session</button>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                       <div style={{ background: 'linear-gradient(160deg, #161622 0%, #0e0e14 100%)', border: '1px solid #2d2d3f', borderRadius: '24px', padding: '36px', textAlign: 'center' }}>
                          <img src={`https://www.google.com/s2/favicons?domain=${platforms.find(p => p.id === activePlatform)?.url}&sz=128`} style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '20px' }} />
                          <div style={{ fontSize: '1.6rem', color: 'white', fontWeight: 900, marginBottom: '6px' }}>{selectedProfile.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#475569' }}>{platforms.find(p => p.id === activePlatform)?.url}</div>
                       </div>
                       <button onClick={() => handleLaunch(selectedProfile)} disabled={isLaunching} style={{ width: '100%', height: '60px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '16px', color: 'white', fontSize: '1.05rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 12px 40px rgba(99,102,241,0.35)' }}>
                         {isLaunching ? 'Linking Identity...' : 'Launch in Real Browser'}
                       </button>
                    </div>
                    <div style={{ background: '#121217', border: '1px solid #2d2d3f', borderRadius: '18px', padding: '22px' }}>
                       <div style={{ fontSize: '0.72rem', color: 'white', fontWeight: 900, marginBottom: '18px' }}>IDENTITY DETAILS</div>
                       <div style={{ color: '#475569', fontSize: '0.8rem' }}>Proxy: {selectedProfile.proxy}</div>
                       <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: '8px' }}>User: {selectedProfile.username}</div>
                    </div>
                 </motion.div>
               )
             ) : (
               <div style={{ textAlign: 'center' }}>
                  <Monitor size={100} strokeWidth={0.5} color="#1f1f27" />
                  <h3 style={{ color: '#2d2d3f', marginTop: '20px' }}>Select a Profile to Launch</h3>
               </div>
             )}
           </div>
        </main>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e1e24; border-radius: 3px; }
        .save-pulse { animation: pulse-save 3s infinite ease-in-out; }
        @keyframes pulse-save { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default Marketing;
