import React, { useState } from 'react';
import { 
  Rocket, Shield, Globe, Mail, CheckCircle, ArrowRight, Server, Zap, Lock, 
  Cloud, Terminal, Download, Copy, AlertTriangle, LogIn, Key, Search, ExternalLink,
  ChevronRight, Database, ShieldCheck, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HOSTING_PROVIDERS = [
  { id: 'google', name: 'Google Cloud', icon: Cloud, color: '#4285F4', services: ['Firebase Hosting', 'Cloud Run', 'App Engine'] },
  { id: 'aws', name: 'AWS', icon: Server, color: '#FF9900', services: ['Amplify', 'Lightsail', 'S3 Static'] },
  { id: 'azure', name: 'Azure', icon: Globe, color: '#0089D6', services: ['Static Web Apps', 'App Service'] },
  { id: 'vercel', name: 'Vercel', icon: Zap, color: '#fff', services: ['Edge Hosting', 'Serverless Functions'] },
  { id: 'hostgator', name: 'HostGator', icon: Zap, color: '#FFD100', services: ['Shared Hosting', 'VPS', 'Dedicated'] }
];

const DOMAIN_PROVIDERS = [
  { id: 'godaddy', name: 'GoDaddy', icon: Globe, color: '#00A63F' },
  { id: 'namecheap', name: 'Namecheap', icon: Shield, color: '#DE3723' },
  { id: 'google_domains', name: 'Google Domains', icon: Globe, color: '#4285F4' },
  { id: 'cloudflare', name: 'Cloudflare', icon: ShieldCheck, color: '#F38020' }
];

const WebHosting = () => {
  const [selectedProvider, setSelectedProvider] = useState(HOSTING_PROVIDERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMode, setLoginMode] = useState('hosting'); // 'hosting' or 'domain'
  const [showBrowserLogin, setShowBrowserLogin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsLoggedIn(true);
    }, 2000);
  };

  return (
    <div style={{ height: '100%', display: 'flex', background: '#0a0a0f', color: 'white', overflow: 'hidden' }}>
      
      {/* SIDEBAR - PROVIDER LIST */}
      <div style={{ width: '280px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.8rem', color: '#6366f1', letterSpacing: '0.1em', marginBottom: '24px' }}>HOSTING PROVIDERS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {HOSTING_PROVIDERS.map(p => (
              <div 
                key={p.id}
                onClick={() => { setSelectedProvider(p); setLoginMode('hosting'); setIsLoggedIn(false); }}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  cursor: 'pointer',
                  background: (selectedProvider.id === p.id && loginMode === 'hosting') ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  border: '1px solid',
                  borderColor: (selectedProvider.id === p.id && loginMode === 'hosting') ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <p.icon size={18} color={p.color} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.name}</span>
                {(selectedProvider.id === p.id && loginMode === 'hosting') && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '0.8rem', color: '#6366f1', letterSpacing: '0.1em', marginTop: '32px', marginBottom: '24px' }}>DOMAIN PROVIDERS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DOMAIN_PROVIDERS.map(p => (
              <div 
                key={p.id}
                onClick={() => { setSelectedProvider(p); setLoginMode('domain'); setIsLoggedIn(false); }}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  cursor: 'pointer',
                  background: (selectedProvider.id === p.id && loginMode === 'domain') ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  border: '1px solid',
                  borderColor: (selectedProvider.id === p.id && loginMode === 'domain') ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <p.icon size={18} color={p.color} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.name}</span>
                {(selectedProvider.id === p.id && loginMode === 'domain') && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN ACTION AREA */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: `${selectedProvider.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <selectedProvider.icon size={32} color={selectedProvider.color} />
                  </div>
                  <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Connect to {selectedProvider.name}</h1>
                  <p style={{ color: '#a0a0a8' }}>Securely access your {loginMode} settings and records.</p>
                </div>

                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <button 
                      onClick={() => setShowBrowserLogin(false)} 
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', background: !showBrowserLogin ? 'rgba(255,255,255,0.05)' : 'transparent', border: '1px solid', borderColor: !showBrowserLogin ? 'rgba(255,255,255,0.1)' : 'transparent', cursor: 'pointer', color: 'white' }}
                    >
                      CREDENTIALS
                    </button>
                    <button 
                      onClick={() => setShowBrowserLogin(true)} 
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', background: showBrowserLogin ? 'rgba(255,255,255,0.05)' : 'transparent', border: '1px solid', borderColor: showBrowserLogin ? 'rgba(255,255,255,0.1)' : 'transparent', cursor: 'pointer', color: 'white' }}
                    >
                      BROWSER LOGIN
                    </button>
                  </div>

                  {showBrowserLogin ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <div style={{ background: '#000', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
                        <Globe size={48} color="#a0a0a8" style={{ marginBottom: '16px' }} />
                        <p style={{ fontSize: '0.9rem', color: '#a0a0a8' }}>A secure browser window will open to authenticate with <b>{selectedProvider.name}</b></p>
                      </div>
                      <button onClick={handleLogin} className="glass-button primary" style={{ width: '100%', height: '54px' }}>
                        {isVerifying ? 'OPENING BROWSER...' : 'LAUNCH BROWSER LOGIN'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleLogin}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, display: 'block', marginBottom: '8px' }}>USERNAME / EMAIL</label>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="glass-input" style={{ width: '100%', paddingLeft: '40px' }} placeholder="admin@homeandreno.com" />
                          <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', opacity: 0.5 }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '32px' }}>
                        <label style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, display: 'block', marginBottom: '8px' }}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                          <input type="password" className="glass-input" style={{ width: '100%', paddingLeft: '40px' }} placeholder="••••••••••••" />
                          <Key size={16} style={{ position: 'absolute', left: '14px', top: '14px', opacity: 0.5 }} />
                        </div>
                      </div>
                      <button type="submit" className="glass-button primary" style={{ width: '100%', height: '54px' }}>
                        {isVerifying ? 'VERIFYING...' : `LOGIN TO ${selectedProvider.name.toUpperCase()}`}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <selectedProvider.icon size={24} color={selectedProvider.color} />
                      <h1 style={{ fontSize: '2rem' }}>{selectedProvider.name} Dashboard</h1>
                    </div>
                    <p style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                      <Shield size={14} /> Account Connected Successfully
                    </p>
                  </div>
                  <button onClick={() => setIsLoggedIn(false)} style={{ background: 'transparent', border: 'none', color: '#a0a0a8', fontSize: '0.8rem', cursor: 'pointer' }}>LOGOUT</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1rem' }}>
                      <Zap size={18} color="#6366f1" /> {loginMode === 'hosting' ? 'Available Services' : 'Active Domains'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(loginMode === 'hosting' ? selectedProvider.services : ['homeandreno.com', 'toronto-reno.ca']).map(s => (
                        <div key={s} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{s}</span>
                          <button className="glass-button" style={{ padding: '4px 12px', fontSize: '0.7rem' }}>SELECT</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1rem' }}>
                      <Activity size={18} color="#10b981" /> System Health
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                          <span style={{ opacity: 0.6 }}>API Connectivity</span>
                          <span style={{ color: '#10b981' }}>OPTIMAL</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '2px' }}>
                          <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                          <span style={{ opacity: 0.6 }}>DNS Sync Speed</span>
                          <span style={{ color: '#10b981' }}>FAST</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '2px' }}>
                          <div style={{ width: '85%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>{loginMode === 'hosting' ? 'Deploy Infrastructure' : 'DNS Record Manager'}</h3>
                    <button className="glass-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Download size={16} /> DOWNLOAD CONFIG
                    </button>
                  </div>
                  <div style={{ background: '#000', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <div style={{ opacity: 0.5 }}>// Generated configuration for {selectedProvider.name}</div>
                    <div>{'{'}</div>
                    <div style={{ paddingLeft: '20px' }}>"domain": "homeandreno.com",</div>
                    <div style={{ paddingLeft: '20px' }}>"ssl": "auto-generated",</div>
                    <div style={{ paddingLeft: '20px' }}>"routing": "react-spa-fallback",</div>
                    <div style={{ paddingLeft: '20px' }}>"records": [</div>
                    <div style={{ paddingLeft: '40px' }}>{'{'} "type": "A", "value": "76.76.21.21" {'}'},</div>
                    <div style={{ paddingLeft: '40px' }}>{'{'} "type": "CNAME", "value": "cname.vercel-dns.com" {'}'}</div>
                    <div style={{ paddingLeft: '20px' }}>]</div>
                    <div>{'}'}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
};

export default WebHosting;
