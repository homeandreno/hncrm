import React, { useState, useEffect } from 'react';
import { Factory, Zap, Shield, Loader2, Play, CheckCircle, AlertCircle, Phone, Mail, User, Clock, Terminal, ArrowRight, ExternalLink, Cloud } from 'lucide-react';
import { launchNativeBrowser, getBridgeStatus, lookupAddress } from '../lib/proxyService';
import { provisionM365Identity, checkDomainStatus } from '../lib/microsoftService';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Key } from 'lucide-react';

const CITY_COORDS = {
  'New York': { lat: 40.7128, lon: -74.0060, timezone: 'America/New_York' },
  'London': { lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  'Los Angeles': { lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles' },
  'Paris': { lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' }
};

const AccountFactory = () => {
  const [selectedCity, setSelectedCity] = useState('New York');
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [bridgeStatus, setBridgeStatus] = useState('offline');
  const [step, setStep] = useState(0);
  
  // PROXY VAULT STATE
  const [showProxyVault, setShowProxyVault] = useState(false);
  const [customProxy, setCustomProxy] = useState('');

  // MICROSOFT CLOUD STATE
  const [m365Creds, setM365Creds] = useState({
    tenantId: '',
    clientId: '',
    clientSecret: ''
  });
  const [m365Status, setM365Status] = useState('DISCONNECTED');
  const [isProvisioning, setIsProvisioning] = useState(false);

  useEffect(() => {
    const savedProxy = localStorage.getItem('pro-proxy-vault');
    if (savedProxy) setCustomProxy(savedProxy);

    const savedCreds = localStorage.getItem('m365-creds');
    if (savedCreds) {
      setM365Creds(JSON.parse(savedCreds));
      setM365Status('ARMED');
    }
  }, []);

  const handleM365Provision = async () => {
    if (!m365Creds.clientSecret) {
      addLog('Microsoft Credentials required. Setup Azure App first.', 'error');
      return;
    }
    setIsProvisioning(true);
    addLog(`[M365] Initializing Provisioning for ${selectedCity} identity...`);
    
    const result = await provisionM365Identity(selectedCity, 'homeandreno.com', m365Creds);
    
    if (result.success) {
      addLog(`[M365] ✓ Identity Verified: ${result.email}`, 'success');
      setM365Status('SYNCED');
    } else {
      addLog(`[M365] Failed: ${result.error}`, 'error');
    }
    setIsProvisioning(false);
  };

  useEffect(() => {
    // Generate/Load profiles for the selected city
    const stored = localStorage.getItem(`profile-order-${selectedCity}`);
    const baseNames = ['John', 'Robert', 'Michael', 'David', 'Richard', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const cityProfiles = Array.from({ length: 50 }, (_, i) => ({
      id: `${selectedCity.toLowerCase()}-${i}`,
      name: `${baseNames[i % 10]} ${lastNames[i % 10]}`,
      address: `${100 + i} Main St, ${selectedCity}`,
      dob: `${10 + (i % 18)}/0${(i % 12) + 1}/19${80 + (i % 15)}`
    }));
    setProfiles(cityProfiles);
    setSelectedProfile(cityProfiles[0]);
  }, [selectedCity]);


  const addLog = (message, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), message, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    const checkBridge = async () => {
      const status = await getBridgeStatus();
      setBridgeStatus(status.status === 'online' ? 'online' : 'offline');
    };
    checkBridge();
    const interval = setInterval(checkBridge, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartGeneration = async () => {
    if (bridgeStatus !== 'online') {
      addLog('Bridge is offline. Start the native bridge first.', 'error');
      return;
    }

    if (!selectedProfile) return;

    setIsRunning(true);
    setStep(1);
    setLogs([]);
    addLog(`Initializing Account Production for ${selectedProfile.name}...`);
    
    const [firstName, lastName] = selectedProfile.name.split(' ');
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 9999)}@gmail.com`;

    addLog(`Identity Sync: ${selectedProfile.name} (${selectedProfile.address})`);
    addLog(`Targeting Username: ${username}`);


    // 2. Launch Protected Browser
    setStep(2);
    addLog('Launching Shielded Browser Environment...');
    
    const loc = CITY_COORDS[selectedCity] || CITY_COORDS['New York'];
    
    const result = await launchNativeBrowser(
      `factory-${Date.now()}`, 
      'https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp&biz=true', 
      customProxy || null, 
      { city: selectedCity, ...loc },
      true // Warmup enabled
    );


    if (result.success) {
      addLog('Browser Ready. Beginning Auto-Injection...', 'success');
      setStep(3);
      addLog('Navigating to Google Signup...');
      addLog('Injecting Identity Payloads...');
      addLog('WAITING FOR SMS VERIFICATION...', 'warning');
    } else {
      addLog(`Failed: ${result.error}`, 'error');
      setIsRunning(false);
      setStep(0);
    }
  };

  return (
    <div className="page-container" style={{ background: '#050505', color: 'white', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #6366f1' }}>
              <Factory color="#6366f1" size={24} />
           </div>
           <div>
              <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>ACCOUNT.FACTORY</h1>
              <p className="page-subtitle" style={{ color: '#475569' }}>High-velocity verified identity production line.</p>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <div 
             onClick={() => setShowProxyVault(true)} 
             style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: customProxy ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', border: customProxy ? '1px solid #10b98144' : '1px solid #1f1f27' }}
           >
              <Database size={14} color={customProxy ? '#10b981' : '#475569'} />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: customProxy ? '#10b981' : '#475569' }}>{customProxy ? 'RESIDENTIAL ARMED' : 'PROXY VAULT'}</span>
           </div>
           <div className={`glass-panel`} style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', border: bridgeStatus === 'online' ? '1px solid #10b98133' : '1px solid #ef444433' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bridgeStatus === 'online' ? '#10b981' : '#ef4444' }}></div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: bridgeStatus === 'online' ? '#10b981' : '#ef4444' }}>BRIDGE: {bridgeStatus.toUpperCase()}</span>
           </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        
        {/* PRODUCTION CONTROLS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px' }}>
              <h3 style={{ marginBottom: '24px', fontSize: '1rem', fontWeight: 800, color: 'white' }}>Production Configuration</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#475569', fontWeight: 900, marginBottom: '8px' }}>TARGET REGION</label>
                    <select className="glass-input" style={{ width: '100%' }} value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                       <option>New York</option>
                       <option>London</option>
                       <option>Los Angeles</option>
                       <option>Paris</option>
                    </select>
                 </div>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#475569', fontWeight: 900, marginBottom: '8px' }}>ACTIVE IDENTITY</label>
                    <select 
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      value={selectedProfile?.id} 
                      onChange={e => setSelectedProfile(profiles.find(p => p.id === e.target.value))}
                    >
                       {profiles.map(p => (
                         <option key={p.id} value={p.id}>{p.name} ({p.address})</option>
                       ))}
                    </select>
                 </div>
              </div>

              <button 
                onClick={handleStartGeneration}
                disabled={isRunning || bridgeStatus !== 'online'}
                style={{ width: '100%', height: '54px', background: '#6366f1', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', opacity: isRunning ? 0.5 : 1 }}
              >
                {isRunning ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                {isRunning ? 'PRODUCTION IN PROGRESS' : 'START AUTO-GENERATION'}
              </button>
           </div>

           <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>Live Production Log</h3>
                 <Terminal size={16} color="#475569" />
              </div>
              <div style={{ background: '#050505', borderRadius: '12px', padding: '20px', height: '300px', overflowY: 'auto', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' }}>
                 {logs.length === 0 && <div style={{ color: '#1f1f27', textAlign: 'center', marginTop: '100px' }}>No production activity...</div>}
                 {logs.map(log => (
                   <div key={log.id} style={{ marginBottom: '8px', color: log.type === 'error' ? '#ef4444' : log.type === 'warning' ? '#f59e0b' : log.type === 'success' ? '#10b981' : '#475569' }}>
                      <span style={{ color: '#1f1f27', marginRight: '10px' }}>[{log.time}]</span>
                      {log.message}
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* STATUS & GUIDE */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: m365Status === 'SYNCED' ? '1px solid #10b98133' : '1px solid #6366f122', borderRadius: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>M365 Cloud Control</h3>
                  <Cloud size={16} color={m365Status === 'SYNCED' ? '#10b981' : '#6366f1'} />
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className={`status-badge ${m365Status === 'SYNCED' ? 'active' : ''}`} style={{ background: m365Status === 'SYNCED' ? 'rgba(16,185,129,0.05)' : 'rgba(99,102,241,0.05)', padding: '12px', borderRadius: '12px', border: m365Status === 'SYNCED' ? '1px solid #10b98144' : '1px solid #6366f144' }}>
                     <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 900, marginBottom: '4px' }}>IDENTITY STATUS</div>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: m365Status === 'SYNCED' ? '#10b981' : '#6366f1' }}>{m365Status}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                     <input 
                       className="glass-input" 
                       placeholder="Tenant ID" 
                       value={m365Creds.tenantId} 
                       onChange={e => setM365Creds({...m365Creds, tenantId: e.target.value})}
                       style={{ fontSize: '0.7rem', padding: '10px' }}
                     />
                     <input 
                       className="glass-input" 
                       placeholder="Client ID" 
                       value={m365Creds.clientId} 
                       onChange={e => setM365Creds({...m365Creds, clientId: e.target.value})}
                       style={{ fontSize: '0.7rem', padding: '10px' }}
                     />
                  </div>
                  <input 
                    type="password"
                    className="glass-input" 
                    placeholder="Client Secret" 
                    value={m365Creds.clientSecret} 
                    onChange={e => setM365Creds({...m365Creds, clientSecret: e.target.value})}
                    style={{ fontSize: '0.7rem', padding: '10px' }}
                  />

                  <button 
                    onClick={handleM365Provision}
                    disabled={isProvisioning || !m365Creds.clientSecret}
                    style={{ width: '100%', height: '42px', background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f144', borderRadius: '10px', color: '#6366f1', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {isProvisioning ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                    PROVISION M365 IDENTITY
                  </button>
                  <button 
                    onClick={() => { localStorage.setItem('m365-creds', JSON.stringify(m365Creds)); setM365Status('ARMED'); }}
                    style={{ width: '100%', height: '42px', background: 'transparent', border: '1px solid #1f1f27', borderRadius: '10px', color: '#475569', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    SAVE CREDENTIALS
                  </button>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>Step-by-Step Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {[
                   { label: 'Identity Generation', icon: User, s: 1 },
                   { label: 'Shielded Environment', icon: Shield, s: 2 },
                   { label: 'Auto-Injection', icon: Zap, s: 3 },
                   { label: 'SMS Verification', icon: Phone, s: 4 }
                 ].map((s, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', opacity: step >= s.s ? 1 : 0.2 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: step === s.s ? '#6366f1' : '#1a1a24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <s.icon size={16} color={step === s.s ? 'white' : '#475569'} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: step === s.s ? 'white' : '#475569' }}>{s.label}</span>
                      {step > s.s && <CheckCircle size={16} color="#10b981" style={{ marginLeft: 'auto' }} />}
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                 <AlertCircle size={16} color="#f59e0b" />
                 <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b' }}>SMS VERIFICATION REQUIRED</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                 Google will ask for a phone number. Use your **SMS-Activate** or **5SIM** number to receive the code. Once the email is verified, the browser will save your session automatically.
              </p>
           </div>
        </section>
      </div>

      {/* PROXY VAULT MODAL */}
      <AnimatePresence>
        {showProxyVault && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ width: '400px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database size={20} color="#6366f1" /></div>
                      <div><h3 style={{ margin: 0, color: 'white', fontSize: '1rem', fontWeight: 800 }}>Account Proxy</h3><p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>Residential settings for {selectedCity}</p></div>
                   </div>
                   <X size={20} color="#475569" style={{ cursor: 'pointer' }} onClick={() => setShowProxyVault(false)} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                   <label style={{ display: 'block', fontSize: '0.65rem', color: '#475569', fontWeight: 900, marginBottom: '8px' }}>RESIDENTIAL PROXY URL</label>
                   <input 
                     className="glass-input" 
                     style={{ width: '100%', padding: '14px', fontSize: '0.85rem' }} 
                     placeholder="user:pass@ip:port" 
                     value={customProxy} 
                     onChange={e => setCustomProxy(e.target.value)} 
                   />
                   <p style={{ fontSize: '0.6rem', color: '#475569', marginTop: '12px', lineHeight: 1.5 }}>
                     Recommended format: **username:password@proxy.provider.com:port**. <br/>
                     This ensures Google sees a consistent residential identity.
                   </p>
                </div>
                <button 
                  onClick={() => { localStorage.setItem('pro-proxy-vault', customProxy); setShowProxyVault(false); }} 
                  style={{ width: '100%', height: '48px', background: '#6366f1', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  SAVE & ARM CONFIGURATION
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1f1f27; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AccountFactory;
