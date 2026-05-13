import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Brain, Send, Smile, Paperclip, Search, Settings, Cpu, Mail, Camera as Instagram, PhoneCall as Phone, Share2 as Facebook, Wifi, Plus, Zap, Users, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../context/WorkspaceContext';

const INITIAL_PINNED_APPS = [
  { id: 'whatsapp', icon: Phone, color: '#25D366', name: 'WhatsApp Web', connected: false },
  { id: 'instagram', icon: Instagram, color: '#E1306C', name: 'Instagram DMs', connected: false },
  { id: 'facebook', icon: Facebook, color: '#1877F2', name: 'Facebook Ads', connected: false },
  { id: 'mail', icon: Mail, color: '#EA4335', name: 'Microsoft 365', connected: false },
  { id: 'browser', icon: Globe, color: '#94a3b8', name: 'Web Browser', connected: true },
  { id: 'crm', icon: Users, color: '#6366f1', name: 'CRM Contacts', connected: true }
];

const OmniBrain = () => {
  const { windows, openWindow, closeWindow } = useWorkspace();
  const [selectedLead, setSelectedLead] = useState(null);
  const [thread, setThread] = useState([]);
  const [composerPlatform, setComposerPlatform] = useState('whatsapp');
  const [messageText, setMessageText] = useState('');
  const [pinnedApps] = useState(INITIAL_PINNED_APPS);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const newMessage = {
      id: Date.now(),
      type: composerPlatform,
      sender: 'agent',
      name: 'HNRENO',
      content: messageText,
      time: 'Just now'
    };
    setThread([...thread, newMessage]);
    setMessageText('');
  };

  const getPlatformIcon = (type, size = 14) => {
    switch(type) {
      case 'whatsapp': return <Phone size={size} color="#25D366" />;
      case 'email': return <Mail size={size} color="#94a3b8" />;
      case 'instagram': return <Instagram size={size} color="#E1306C" />;
      case 'facebook': return <Facebook size={size} color="#1877F2" />;
      default: return <MessageSquare size={size} color="#6366f1" />;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', background: '#050505', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      {/* LEFT SIDEBAR (APPS HUB INTEGRATION) */}
      <aside style={{ width: '80px', borderRight: '1px solid #1f1f27', background: '#0a0a0c', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', zIndex: 10 }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Brain color="white" size={20} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {pinnedApps.map(app => (
            <div 
              key={app.id} 
              onClick={() => {
                if (app.connected) {
                  openWindow(app.id);
                } else {
                  setIsConnecting(app.name);
                }
              }} 
              style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#121217', border: '1px solid #1f1f27', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }} 
              className="app-icon-hover" 
              title={app.name}
            >
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
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ height: '70px', borderBottom: '1px solid #1f1f27', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'rgba(10,10,12,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        {selectedLead ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#121217', border: '1px solid #1f1f27', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#6366f1' }}>
              {selectedLead.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{selectedLead.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div> Online</span>
                • {selectedLead.company} • Omni-Thread Active
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>OMNI.BRAIN</h2>
            <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
              SYSTEM ACTIVE: ZERO-SUBSCRIPTION ROUTER
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={() => {
              if (windows.some(w => w.id === 'ai-center')) {
                closeWindow('ai-center');
              } else {
                openWindow('ai-center');
              }
            }}
            style={{ background: windows.some(w => w.id === 'ai-center') ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: windows.some(w => w.id === 'ai-center') ? '0 0 15px rgba(99,102,241,0.3)' : 'none' }}
          >
            <Cpu size={14} /> AI
          </button>
          <button 
            onClick={() => {
              if (windows.some(w => w.id === 'connections')) {
                closeWindow('connections');
              } else {
                openWindow('connections');
              }
            }}
            style={{ background: windows.some(w => w.id === 'connections') ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: windows.some(w => w.id === 'connections') ? '0 0 15px rgba(16,185,129,0.3)' : 'none' }}
          >
            <Wifi size={14} /> CONNECT
          </button>
          <button 
            onClick={() => {
              if (windows.some(w => w.id === 'outbound')) {
                closeWindow('outbound');
              } else {
                openWindow('outbound');
              }
            }}
            style={{ background: windows.some(w => w.id === 'outbound') ? 'rgba(249,115,22,0.2)' : 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: windows.some(w => w.id === 'outbound') ? '0 0 15px rgba(249,115,22,0.3)' : 'none' }}
          >
            <Phone size={14} /> OUTBOUND
          </button>
          <Search size={18} color="#475569" style={{ cursor: 'pointer' }} />
          <Settings size={18} color="#475569" style={{ cursor: 'pointer' }} />
        </div>
      </header>

      {/* Unified Thread Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {selectedLead ? (
          <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {thread.map(msg => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'agent' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.7rem', color: '#475569', flexDirection: msg.sender === 'agent' ? 'row-reverse' : 'row' }}>
                  <span style={{ fontWeight: 800, color: '#94a3b8' }}>{msg.name}</span>
                  <span style={{ opacity: 0.5 }}>{msg.time}</span>
                  {getPlatformIcon(msg.type)}
                </div>
                <div style={{ maxWidth: '65%', padding: '14px 18px', borderRadius: '16px', fontSize: '0.9rem', lineHeight: 1.5, background: msg.sender === 'agent' ? '#6366f1' : '#1a1a24', color: msg.sender === 'agent' ? 'white' : '#e2e8f0', border: msg.sender === 'agent' ? 'none' : '1px solid #2d2d3f', borderTopRightRadius: msg.sender === 'agent' ? '4px' : '16px', borderTopLeftRadius: msg.sender === 'agent' ? '16px' : '4px' }}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
             <div className="brain-pulse" style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={64} color="#6366f1" style={{ opacity: 0.6 }} />
             </div>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>Omni Brain Active.</h3>
             <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '500px' }}>
               Ready to route conversations through the zero-subscription bridge.
             </p>
          </div>
        )}
      </div>

      {/* Composer */}
      {selectedLead && (
        <div style={{ padding: '24px 32px', background: '#0a0a0c', borderTop: '1px solid #1f1f27' }}>
          <div style={{ background: '#121217', border: '1px solid #2d2d3f', borderRadius: '16px', padding: '12px' }}>
            <textarea 
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder={`Reply via ${composerPlatform}...`} 
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontSize: '0.95rem', resize: 'none', outline: 'none', minHeight: '60px' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '12px', color: '#475569' }}>
                <Paperclip size={18} style={{ cursor: 'pointer' }} />
                <Smile size={18} style={{ cursor: 'pointer' }} />
              </div>
              <button onClick={handleSendMessage} disabled={!messageText.trim()} style={{ background: messageText.trim() ? '#6366f1' : '#2d2d3f', border: 'none', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* CONNECTION OVERLAY MODAL */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
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
        .brain-pulse {
          animation: pulse-brain 3s infinite ease-in-out;
        }
        @keyframes pulse-brain {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OmniBrain;
