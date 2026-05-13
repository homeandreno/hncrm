import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Cloud, Shield, Cpu, RefreshCcw, ShieldCheck, Search, MapPin, Globe, Zap, ExternalLink, Loader2, Monitor, History, MoreVertical, Globe2, Clock, X, Grid, Camera, Mic, Maximize2, Minimize2, Minus, ArrowLeft, ArrowRight, Settings, Database, List, Users, ShoppingBag, Layout } from 'lucide-react';
import { lookupAddress, launchNativeBrowser, getAddressSuggestions, getBridgeStatus, closeNativeSession } from '../lib/proxyService';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableWidget from '../components/DraggableWidget';
import { motion, AnimatePresence } from 'framer-motion';

const Identity = () => {
  const [url, setUrl] = useState('https://www.bing.com');
  const [displayUrl, setDisplayUrl] = useState('https://www.bing.com');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Selection States
  const [selectedCity, setSelectedCity] = useState('New York');
  const [activeProfile, setActiveProfile] = useState(null);
  const [profilePool, setProfilePool] = useState([]);
  const [locationData, setLocationData] = useState({ country: 'United States', city: 'New York', timezone: 'America/New_York', lat: 40.7128, lon: -74.0060 });
  const [isLive, setIsLive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [windowState, setWindowState] = useState('normal'); 
  const [isSaving, setIsSaving] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('offline');
  const [nativeSessions, setNativeSessions] = useState([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [sentinelReport, setSentinelReport] = useState(null);
  const [isAutonomous, setIsAutonomous] = useState(true);
  
  // PROXY VAULT STATE
  const [showProxyVault, setShowProxyVault] = useState(false);
  const [proxyList, setProxyList] = useState([]);
  const [proxyInput, setProxyInput] = useState('');
  const [diUser, setDiUser] = useState('');
  const [diPass, setDiPass] = useState('');
  
  // M365 STATE
  const [showM365Config, setShowM365Config] = useState(false);
  const [m365Domain, setM365Domain] = useState('hnreno.com');
  const [m365Creds, setM365Creds] = useState({ tenantId: '', clientId: '', clientSecret: '' });
  const [isProvisioning, setIsProvisioning] = useState(false);
  
  const dropdownRef = useRef(null);

  // Load Persistence
  useEffect(() => {
    const savedProxy = localStorage.getItem('pro-proxy-vault');
    if (savedProxy) {
      try {
        const parsed = JSON.parse(savedProxy);
        if (Array.isArray(parsed)) {
          setProxyList(parsed);
          setProxyInput(parsed.join('\n'));
        } else {
          setProxyList([savedProxy]);
          setProxyInput(savedProxy);
        }
      } catch(e) {
        setProxyList([savedProxy]);
        setProxyInput(savedProxy);
      }
    }
    
    generatePool('New York', 'United States');
    
    const checkBridge = async () => {
      const status = await getBridgeStatus();
      setBridgeStatus(status.status === 'online' ? 'online' : 'offline');
      if (status.sessions) setNativeSessions(status.sessions.map(s => s.profileId));
      
      try {
        const res = await fetch('http://127.0.0.1:3001/sentinel/report');
        const data = await res.json();
        setSentinelReport(data);
      } catch (e) {}
    };
    checkBridge();
    const interval = setInterval(checkBridge, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isLive) {
        try {
          const time = new Date().toLocaleTimeString('en-US', {
            timeZone: locationData.timezone || 'UTC',
            hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
          });
          setLocalTime(time);
        } catch (e) { setLocalTime(new Date().toLocaleTimeString()); }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive, locationData.timezone]);

  useEffect(() => {
    if (profilePool.length > 0) {
      setIsSaving(true);
      const timer = setTimeout(() => setIsSaving(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [profilePool]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (selectedCity.length > 2 && !isSearching) {
        const results = await getAddressSuggestions(selectedCity);
        setSuggestions(results);
        setShowSuggestions(true);
      } else { setShowSuggestions(false); }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [selectedCity]);

  const generatePool = (city, country) => {
    const savedOrder = localStorage.getItem(`profile-order-${city}`);
    const savedProxy = localStorage.getItem('pro-proxy-vault');
    let currentProxies = [];
    if (savedProxy) {
      try {
        const parsed = JSON.parse(savedProxy);
        currentProxies = Array.isArray(parsed) ? parsed : [savedProxy];
      } catch(e) {
        currentProxies = [savedProxy];
      }
    }

    let newPool = Array.from({ length: 50 }).map((_, i) => ({
      id: `${city}-${i}`,
      address: `${100 + i} ${['Main', 'Park', 'Ocean', 'West', 'Madison'][i % 5]} St, ${city}`,
      city: city,
      country: country,
      proxy: currentProxies.length > 0 ? currentProxies[i % currentProxies.length] : `76.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: 'Ready'
    }));

    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        const reordered = orderIds.map(id => newPool.find(p => p.id === id)).filter(Boolean);
        const remaining = newPool.filter(p => !orderIds.includes(p.id));
        newPool = [...reordered, ...remaining];
      } catch (e) {}
    }

    setProfilePool(newPool);
    if (newPool.length > 0) handleSelectProfile(newPool[0]);
  };

  const handleSelectSuggestion = (sug) => {
    // UNRESTRICTED: Extract full address details including house/street
    const displayName = sug.display_name;
    const addrObj = sug.address || {};
    const city = addrObj.city || addrObj.town || addrObj.village || addrObj.suburb || 'Unknown';
    const country = addrObj.country || 'Unknown';
    
    setSelectedCity(displayName); // Auto-populate the full address in the bar
    setShowSuggestions(false);
    setIsSearching(true);
    
    // Improved Timezone detection (Dynamic Fallback)
    const lat = sug.lat ? parseFloat(sug.lat) : 40.7128;
    const lon = sug.lon ? parseFloat(sug.lon) : -74.0060;
    
    // We use a simplified timezone map for now, but the lat/lon is exact
    const tZone = sug.timezone || 'America/New_York'; 
    
    setLocationData({ country, city, timezone: tZone, lat, lon });
    generatePool(city, country);
    setIsSearching(false);
    // Note: Assuming addLog function exists in scope or context
    if (typeof addLog === 'function') addLog(`GPS-Shield Synchronized: ${displayName}`, 'success');
  };

  const handleSelectProfile = async (profile) => {
    setActiveProfile(profile);
    setIsLive(true);
    // Google blocks iframes (X-Frame-Options), so we use Bing for the dashboard preview.
    // The "Launch Native" button still uses the original target.
    setUrl(`https://www.bing.com/search?q=weather+in+${encodeURIComponent(profile.city)}`);
  };

  const handleLaunchNative = async (targetUrl = url, warmup = false) => {
    if (!activeProfile) return;
    setIsLaunching(true);
    // Use the assigned profile proxy
    const proxyToUse = activeProfile.proxy;
    const result = await launchNativeBrowser(activeProfile.id, targetUrl, proxyToUse, locationData, warmup);
    if (result.success) {
      setNativeSessions(prev => [...prev, activeProfile.id]);
    } else {
      alert(result.error || 'Failed to launch native browser');
    }
    setIsLaunching(false);
  };


  const autoGenerateDI = () => {
    if (!diUser || !diPass) {
      alert("Please enter both your DataImpulse username and password.");
      return;
    }
    const proxies = [];
    for (let i = 0; i < 50; i++) {
      proxies.push(`http://${diUser}__country-us:${diPass}@gw.dataimpulse.com:${10000 + i}`);
    }
    setProxyList(proxies);
    localStorage.setItem('pro-proxy-vault', JSON.stringify(proxies));
    setShowProxyVault(false);
    generatePool(locationData.city, locationData.country);
  };

  const saveProxy = () => {
    const lines = proxyInput.split('\n').map(l => l.trim()).filter(Boolean);
    const parsedProxies = lines.map(line => {
      if (line.startsWith('http')) return line;
      const parts = line.split(':');
      if (parts.length === 4) {
         const [ip, port, user, pass] = parts;
         return `http://${user}:${pass}@${ip}:${port}`;
      }
      return line;
    });
    
    setProxyList(parsedProxies);
    localStorage.setItem('pro-proxy-vault', JSON.stringify(parsedProxies));
    setShowProxyVault(false);
    generatePool(locationData.city, locationData.country);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setProfilePool((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const updated = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(`profile-order-${locationData.city}`, JSON.stringify(updated.map(p => p.id)));
        return updated;
      });
    }
  };

  const QUICK_LINKS = [
    { label: 'Bing', icon: Search, url: 'https://www.bing.com' },
    { label: 'Outlook', icon: ExternalLink, url: 'https://outlook.office.com' },
    { label: 'Microsoft 365', icon: Grid, url: 'https://www.office.com/?auth=2' },
    { label: 'Facebook', icon: Users, url: 'https://www.facebook.com' },
  ];

  return (
    <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, background: '#050505' }}>
      
      {/* TOP HEADER */}
      {windowState !== 'maximized' && (
        <div style={{ padding: '12px 32px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', zIndex: 100 }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
             <div style={{ flex: 1, position: 'relative' }} ref={dropdownRef}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-color)' }}><Search size={16} /></div>
                <input className="glass-input" style={{ width: '100%', paddingLeft: '40px', height: '38px', borderRadius: '8px' }} placeholder="Search City, Town or Country..." value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} />
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#1a1a24', border: '1px solid #3d3d4f', borderRadius: '8px', zIndex: 1000 }}>
                     {suggestions.map((sug, i) => (
                       <div key={i} onClick={() => handleSelectSuggestion(sug)} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #2d2d3f', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }} className="suggestion-item">
                          <MapPin size={12} color="var(--accent-color)" />{sug.display_name}
                       </div>
                     ))}
                  </div>
                )}
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div onClick={() => setShowProxyVault(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', height: '38px', background: proxyList.length > 0 ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: proxyList.length > 0 ? '1px solid #10b98144' : '1px solid var(--glass-border)' }}>
                   <Database size={14} color={proxyList.length > 0 ? '#10b981' : '#475569'} />
                   <span style={{ fontSize: '0.75rem', color: proxyList.length > 0 ? '#10b981' : '#475569', fontWeight: 600 }}>{proxyList.length > 0 ? `${proxyList.length} PROXIES LOADED` : 'PROXY VAULT'}</span>
                </div>
                
                <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }}></div>
                
                <div onClick={() => setShowM365Config(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', height: '38px', background: m365Creds.tenantId ? 'rgba(0,120,215,0.05)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: m365Creds.tenantId ? '1px solid #0078d744' : '1px solid var(--glass-border)' }}>
                   <Monitor size={14} color={m365Creds.tenantId ? '#0078d7' : '#475569'} />
                   <span style={{ fontSize: '0.75rem', color: m365Creds.tenantId ? '#0078d7' : '#475569', fontWeight: 600 }}>{m365Creds.tenantId ? 'M365 CONNECTED' : 'CONNECT M365'}</span>
                </div>

                <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }}></div>

                <button className={`glass-button primary`} style={{ height: '38px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }} disabled={bridgeStatus !== 'online' || isLaunching} onClick={() => handleLaunchNative()}>
                   {isLaunching ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                   <span style={{ marginLeft: '8px' }}>Launch Native</span>
                </button>
                <button 
                  className={`glass-button`} 
                  style={{ height: '38px', borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.05)' }} 
                  disabled={bridgeStatus !== 'online' || isLaunching}
                  onClick={() => handleLaunchNative(url, true)}
                >
                   {isLaunching ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                   <span style={{ marginLeft: '8px' }}>Warm Up Identity</span>
                </button>
                <button className="glass-button" style={{ height: '38px' }} onClick={() => setWindowState('maximized')}>Expand</button>
             </div>
          </div>
        </div>
      )}

      {/* SHIELD SENTINEL STATUS BAR */}
      <div style={{ height: '32px', background: 'rgba(99,102,241,0.05)', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className={sentinelReport?.status === 'active' ? 'pulse-green' : ''} style={{ width: '8px', height: '8px', borderRadius: '50%', background: sentinelReport?.status === 'active' ? '#10b981' : '#475569' }}></div>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: sentinelReport?.status === 'active' ? '#10b981' : '#475569', letterSpacing: '1px' }}>SHIELD SENTINEL {sentinelReport?.status.toUpperCase() || 'OFFLINE'}</span>
          </div>
          <div style={{ height: '12px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>UPTIME: {sentinelReport?.metrics.bridgeUptime || 0}s</div>
          <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>GPS ACCURACY: {sentinelReport?.metrics.gpsAccuracy || 'N/A'}</div>
          <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>HEALTH SCORE: {sentinelReport?.healthScore || 0}%</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: isAutonomous ? '#10b981' : '#475569' }}>{isAutonomous ? 'AUTONOMOUS MODE ACTIVE' : 'MANUAL OVERRIDE'}</span>
          <div onClick={() => setIsAutonomous(!isAutonomous)} style={{ width: '32px', height: '16px', background: isAutonomous ? '#10b981' : '#2d2d3f', borderRadius: '8px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isAutonomous ? '18px' : '2px', transition: 'all 0.2s' }}></div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* SIDEBAR */}
        {windowState !== 'maximized' && (
          <aside style={{ width: '380px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
             <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><List size={14} color="var(--accent-color)" /><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{locationData.city.toUpperCase()} POOL</span></div>
                <button onClick={() => { localStorage.removeItem(`profile-order-${locationData.city}`); generatePool(locationData.city, locationData.country); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><RefreshCcw size={10} /></button>
             </div>
             
             <div style={{ flex: 1, overflowY: 'auto' }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                   <SortableContext items={profilePool.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      {profilePool.map((item) => (
                        <DraggableWidget key={item.id} id={item.id}>
                          <div onClick={() => handleSelectProfile(item)} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.02)', cursor: 'pointer', background: activeProfile?.id === item.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent', borderLeft: activeProfile?.id === item.id ? '3px solid #6366f1' : '3px solid transparent' }}>
                             <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500, marginBottom: '6px' }}>{item.address}</div>
                             <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                 <div style={{ 
                                   fontSize: '0.7rem', 
                                   color: item.proxy.startsWith('76.') ? '#ef4444' : 'var(--text-secondary)', 
                                   display: 'flex', 
                                   alignItems: 'center', 
                                   gap: '4px',
                                   fontWeight: item.proxy.startsWith('76.') ? 700 : 400 
                                 }}>
                                   {item.proxy.startsWith('76.') ? <Shield size={10} /> : <Globe size={10} />} 
                                   {item.proxy.startsWith('76.') ? 'UNPROTECTED IP' : item.proxy}
                                 </div>
                                 <div style={{ flex: 1 }}></div>
                                 {sentinelReport && (
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                     <div style={{ 
                                       width: '6px', 
                                       height: '6px', 
                                       borderRadius: '50%', 
                                       background: (sentinelReport.profileTrustScores[item.id] || 90) > 90 ? '#10b981' : (sentinelReport.profileTrustScores[item.id] || 90) > 70 ? '#f59e0b' : '#ef4444',
                                       boxShadow: `0 0 8px ${(sentinelReport.profileTrustScores[item.id] || 90) > 90 ? '#10b981' : (sentinelReport.profileTrustScores[item.id] || 90) > 70 ? '#f59e0b' : '#ef4444'}`
                                     }}></div>
                                     <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 800 }}>TRUST: {sentinelReport.profileTrustScores[item.id] || 90}%</span>
                                   </div>
                                 )}
                                {nativeSessions.includes(item.id) && <div style={{ fontSize: '0.65rem', color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>NATIVE LIVE</div>}
                             </div>
                          </div>
                        </DraggableWidget>
                      ))}
                   </SortableContext>
                </DndContext>
             </div>
          </aside>
        )}

        {/* BROWSER STAGE */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
           
           {/* QUICK LAUNCH BAR */}
           {!activeProfile ? null : (
                <div style={{ height: '54px', background: '#0a0a0c', borderBottom: '1px solid #1a1a24', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: '#444', fontWeight: 900, marginRight: '10px' }}>QUICK LAUNCH:</div>
                {QUICK_LINKS.map(link => (
                  <button key={link.label} onClick={() => handleLaunchNative(link.url)} style={{ background: '#121217', border: '1px solid #2d2d3f', borderRadius: '8px', padding: '6px 12px', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <link.icon size={13} color="#6366f1" /> {link.label}
                  </button>
                ))}
                <div style={{ flex: 1 }}></div>
                <button 
                  onClick={async () => {
                    if (!m365Creds.tenantId) { setShowM365Config(true); return; }
                    setIsProvisioning(true);
                    const { provisionM365Identity } = await import('../lib/microsoftService');
                    const res = await provisionM365Identity(locationData.city, m365Domain, m365Creds);
                    if (res.success) alert(`Identity Created: ${res.email}\nStatus: ${res.status}`);
                    else alert(res.error || 'Failed to provision identity');
                    setIsProvisioning(false);
                  }}
                  disabled={isProvisioning}
                  style={{ background: 'linear-gradient(135deg, #0078d7, #005a9e)', border: 'none', borderRadius: '8px', padding: '6px 16px', color: 'white', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,120,215,0.3)' }}
                >
                  {isProvisioning ? <Loader2 size={13} className="animate-spin" /> : <Users size={13} />} 
                  PROVISION CITY IDENTITY
                </button>
              </div>
           )}

           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: windowState === 'maximized' ? 'fixed' : 'relative', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: '#fff' }}>
              <div style={{ background: '#f2f2f2', borderBottom: '1px solid #ccc', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '15px', height: '40px' }}>
                 <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', cursor: 'pointer' }} onClick={() => setWindowState('normal')}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', cursor: 'pointer' }} onClick={() => setWindowState(windowState === 'maximized' ? 'normal' : 'maximized')}></div>
                 </div>
                 <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: '16px', padding: '2px 14px', fontSize: '0.75rem', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Monitor size={12} color="#4285F4" /><span>{url}</span></div>
                     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: activeProfile?.proxy.startsWith('76.') ? '#ef4444' : '#10b981', 
                          fontWeight: 700 
                        }}>
                          {activeProfile?.proxy.startsWith('76.') ? '⚠️ UNPROTECTED' : activeProfile?.proxy}
                        </div>
                        {activeProfile?.proxy.startsWith('76.') ? <Shield size={12} color="#ef4444" /> : <ShieldCheck size={12} color="#10b981" />}
                     </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontSize: '0.8rem', fontWeight: 600 }}><Clock size={12} />{localTime}</div>
              </div>
              <div style={{ flex: 1, background: '#fff' }}>
                <iframe 
                  src={url.startsWith('http') ? `http://127.0.0.1:3001/proxy-view?url=${encodeURIComponent(url)}` : url} 
                  style={{ width: '100%', height: '100%', border: 'none' }} 
                />
              </div>
           </div>
        </main>
      </div>

      {/* PROXY VAULT MODAL */}
      <AnimatePresence>
        {showProxyVault && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ width: '400px', background: '#121217', border: '1px solid #2d2d3f', borderRadius: '24px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database size={20} color="#6366f1" /></div>
                      <div><h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Proxy Vault</h3><p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>Professional residential settings</p></div>
                   </div>
                   <X size={20} color="#475569" style={{ cursor: 'pointer' }} onClick={() => setShowProxyVault(false)} />
                </div>
                <div style={{ marginBottom: '20px', background: 'rgba(16,185,129,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid #10b98133' }}>
                   <label style={{ display: 'block', fontSize: '0.65rem', color: '#10b981', fontWeight: 900, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={12} fill="#10b981" /> AUTO-GENERATE DATAIMPULSE USA PROXIES</label>
                   <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                      <input className="glass-input" style={{ flex: 1, padding: '10px 12px', fontSize: '0.8rem', borderRadius: '8px' }} placeholder="DataImpulse Username" value={diUser} onChange={e => setDiUser(e.target.value)} />
                      <input className="glass-input" type="password" style={{ flex: 1, padding: '10px 12px', fontSize: '0.8rem', borderRadius: '8px' }} placeholder="Password" value={diPass} onChange={e => setDiPass(e.target.value)} />
                   </div>
                   <button onClick={autoGenerateDI} style={{ width: '100%', height: '38px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '8px', color: '#10b981', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                     <Cloud size={14} /> Generate & Load 50 Mobile IPs
                   </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '10px', opacity: 0.5 }}>
                   <div style={{ flex: 1, height: '1px', background: '#475569' }}></div>
                   <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '1px' }}>OR PASTE MANUALLY</div>
                   <div style={{ flex: 1, height: '1px', background: '#475569' }}></div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                   <label style={{ display: 'block', fontSize: '0.65rem', color: '#444', fontWeight: 900, marginBottom: '8px' }}>BULK RESIDENTIAL PROXIES (1 Per Line)</label>
                   <textarea className="glass-input" style={{ width: '100%', height: '80px', padding: '12px', fontSize: '0.85rem', resize: 'vertical' }} placeholder={`http://user:pass@ip:port`} value={proxyInput} onChange={e => setProxyInput(e.target.value)} />
                </div>
                <button onClick={saveProxy} style={{ width: '100%', height: '44px', background: '#2d2d3f', border: '1px solid #3d3d4f', borderRadius: '12px', color: '#cbd5e1', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Save Manual Configuration</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* M365 CONFIG MODAL */}
      <AnimatePresence>
        {showM365Config && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ width: '450px', background: '#121217', border: '1px solid #2d2d3f', borderRadius: '24px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,120,215,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Monitor size={20} color="#0078d7" /></div>
                      <div><h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Microsoft 365 Bridge</h3><p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>Azure Entra ID Integration</p></div>
                   </div>
                   <X size={20} color="#475569" style={{ cursor: 'pointer' }} onClick={() => setShowM365Config(false)} />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                   <label style={{ display: 'block', fontSize: '0.65rem', color: '#444', fontWeight: 900, marginBottom: '8px' }}>TARGET DOMAIN</label>
                   <input className="glass-input" style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }} placeholder="e.g. hnreno.com" value={m365Domain} onChange={e => setM365Domain(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: '#444', fontWeight: 900, marginBottom: '8px' }}>TENANT ID</label>
                      <input className="glass-input" style={{ width: '100%', padding: '12px', fontSize: '0.8rem' }} value={m365Creds.tenantId} onChange={e => setM365Creds({...m365Creds, tenantId: e.target.value})} />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: '#444', fontWeight: 900, marginBottom: '8px' }}>CLIENT ID (APP ID)</label>
                      <input className="glass-input" style={{ width: '100%', padding: '12px', fontSize: '0.8rem' }} value={m365Creds.clientId} onChange={e => setM365Creds({...m365Creds, clientId: e.target.value})} />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: '#444', fontWeight: 900, marginBottom: '8px' }}>CLIENT SECRET</label>
                      <input className="glass-input" type="password" style={{ width: '100%', padding: '12px', fontSize: '0.8rem' }} value={m365Creds.clientSecret} onChange={e => setM365Creds({...m365Creds, clientSecret: e.target.value})} />
                   </div>
                </div>

                <button onClick={() => setShowM365Config(false)} style={{ width: '100%', height: '44px', background: '#0078d7', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Save & Connect Subscription</button>
                <p style={{ marginTop: '15px', fontSize: '0.65rem', color: '#475569', textAlign: 'center' }}>Requires 'User.ReadWrite.All' and 'Domain.Read.All' Graph permissions.</p>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .suggestion-item:hover { background: #2d2d3f !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
        .pulse-green {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
};

export default Identity;
