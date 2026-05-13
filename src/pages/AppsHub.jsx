import React, { useState } from 'react';
import { 
  Brain, PhoneCall as Phone, Camera as Instagram, Share2 as Facebook, Mail, Users, Plus, Settings, Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const INITIAL_PINNED_APPS = [
  { id: 'whatsapp', icon: Phone, color: '#25D366', name: 'WhatsApp Web', connected: false },
  { id: 'instagram', icon: Instagram, color: '#E1306C', name: 'Instagram DMs', connected: false },
  { id: 'facebook', icon: Facebook, color: '#1877F2', name: 'Facebook Ads', connected: false },
  { id: 'mail', icon: Mail, color: '#EA4335', name: 'Microsoft 365', connected: false },
  { id: 'crm', icon: Users, color: '#6366f1', name: 'CRM Contacts', connected: true }
];

const AppsHub = () => {
  const [pinnedApps] = useState(INITIAL_PINNED_APPS);
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <div style={{ height: '100%', background: '#0a0a0c', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', borderRight: '1px solid #1f1f27', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
        <Brain color="white" size={20} />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {pinnedApps.map(app => (
          <div key={app.id} onClick={() => !app.connected && setIsConnecting(app.name)} style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#121217', border: '1px solid #1f1f27', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }} className="app-icon-hover" title={app.name}>
            <app.icon size={20} color={app.connected ? app.color : '#475569'} style={{ opacity: app.connected ? 1 : 0.5 }} />
            {!app.connected && <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>}
          </div>
        ))}
        <div onClick={() => setIsConnecting('Any Application')} style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed #3d3d4f', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: '8px' }}>
          <Plus size={20} color="#475569" />
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Settings size={20} color="#475569" style={{ cursor: 'pointer' }} />
      </div>

      {/* CONNECTION OVERLAY MODAL */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: '100%', maxWidth: '400px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Zap size={24} color="#6366f1" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Connect {isConnecting}</h3>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '32px' }}>
                Activate the zero-subscription bridge for {isConnecting}.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => setIsConnecting(false)} className="glass-button primary" style={{ width: '100%', height: '44px', background: '#6366f1', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 800, cursor: 'pointer' }}>INITIALIZE</button>
                <button onClick={() => setIsConnecting(false)} style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .app-icon-hover:hover { background: #1f1f27 !important; border-color: #3d3d4f !important; }
      `}</style>
    </div>
  );
};

export default AppsHub;
