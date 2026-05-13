import React, { useState } from 'react';
import { 
  Wifi, Mail, Phone, Share2, Zap, Globe, Shield, RefreshCw, 
  CheckCircle2, AlertCircle, Settings, Plus, ExternalLink, 
  MessageSquare, Smartphone, Database, Lock, Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IntegrationCard = ({ icon: Icon, title, description, status, type, onConnect }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel" 
    style={{ 
      padding: '24px', 
      background: '#121217', 
      border: '1px solid #1f1f27', 
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ 
        width: '44px', 
        height: '44px', 
        borderRadius: '12px', 
        background: status === 'connected' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Icon size={22} color={status === 'connected' ? '#10b981' : '#475569'} />
      </div>
      <div style={{ 
        padding: '4px 10px', 
        borderRadius: '20px', 
        background: status === 'connected' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
        fontSize: '0.65rem',
        fontWeight: 800,
        color: status === 'connected' ? '#10b981' : '#475569',
        letterSpacing: '0.5px'
      }}>
        {status.toUpperCase()}
      </div>
    </div>

    <div>
      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{title}</h4>
      <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>{description}</p>
    </div>

    <button 
      onClick={onConnect}
      style={{ 
        marginTop: 'auto',
        width: '100%', 
        padding: '10px', 
        background: status === 'connected' ? 'transparent' : 'rgba(99,102,241,0.1)', 
        border: status === 'connected' ? '1px solid #1f1f27' : '1px solid #6366f144', 
        borderRadius: '10px',
        color: status === 'connected' ? '#475569' : '#6366f1',
        fontSize: '0.75rem',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s'
      }}
    >
      {status === 'connected' ? <Settings size={14} /> : <Zap size={14} />}
      {status === 'connected' ? 'MANAGE SETTINGS' : `CONNECT ${type}`}
    </button>

    {status === 'connected' && (
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '40px', 
        height: '40px', 
        background: 'linear-gradient(135deg, transparent 50%, rgba(16,185,129,0.1) 50%)' 
      }}></div>
    )}
  </motion.div>
);

const Connections = () => {
  const [activeTab, setActiveTab] = useState('all');

  const INTEGRATIONS = [
    { id: 'm365', cat: 'email', icon: Command, title: 'Microsoft 365', desc: 'Connect Outlook, Azure AD and 50 Shared Mailboxes.', status: 'pending', type: 'AZURE' },
    { id: 'local_db', cat: 'auto', icon: Database, title: 'Local SQL Engine', desc: 'Sovereign SQLite database running on port 3001.', status: 'connected', type: 'SQLITE' },
    { id: 'native', cat: 'auto', icon: Shield, title: 'Native Bridge', desc: 'Anti-detect browser agent & GPS-Shield.', status: 'connected', type: 'BRIDGE' },
    { id: 'twilio', cat: 'comm', icon: Smartphone, title: 'Twilio SMS', desc: 'Global SMS and VoIP number provisioning.', status: 'connected', type: 'SID' },
    { id: 'whatsapp', cat: 'comm', icon: MessageSquare, title: 'WhatsApp Business', desc: 'Official Meta API for automated messaging.', status: 'disconnected', type: 'API' },
    { id: 'zapier', cat: 'auto', icon: Zap, title: 'Zapier / Make', desc: 'Inbound webhooks and outbound triggers.', status: 'connected', type: 'WEBHOOK' },
  ];

  const filteredIntegrations = activeTab === 'all' 
    ? INTEGRATIONS 
    : INTEGRATIONS.filter(i => i.cat === activeTab);

  return (
    <div style={{ height: '100%', background: '#050505', padding: '40px', display: 'flex', flexDirection: 'column', overflowY: 'auto', color: 'white' }}>
      
      {/* HEADER SECTION */}
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }}></div>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', letterSpacing: '2px' }}>SYSTEM CORE ONLINE</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Connections Hub</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '8px' }}>Centralized API and software integration cockpit.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-button" style={{ height: '42px', padding: '0 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid #1f1f27' }}>
            <RefreshCw size={14} style={{ marginRight: '8px' }} /> Resync All
          </button>
          <button className="glass-button primary" style={{ height: '42px', padding: '0 20px', borderRadius: '12px', background: '#6366f1', color: 'white', fontWeight: 800 }}>
            <Plus size={14} style={{ marginRight: '8px' }} /> Custom Webhook
          </button>
        </div>
      </header>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #1f1f27', marginBottom: '40px' }}>
        {['all', 'email', 'comm', 'social', 'auto'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '16px 0', 
              background: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === tab ? 'white' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID SECTION */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px',
        paddingBottom: '40px'
      }}>
        <AnimatePresence mode="popLayout">
          {filteredIntegrations.map((item) => (
            <IntegrationCard 
              key={item.id}
              {...item}
              onConnect={() => alert(`Initializing connection for ${item.title}...`)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* SECURITY FOOTER */}
      <div style={{ 
        marginTop: 'auto', 
        padding: '24px', 
        background: 'rgba(99,102,241,0.03)', 
        borderRadius: '20px', 
        border: '1px solid rgba(99,102,241,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={18} color="#6366f1" />
        </div>
        <div style={{ flex: 1 }}>
          <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>End-to-End Encryption Active</h5>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>All API tokens and credentials are stored in the local encrypted vault and never sent to our servers.</p>
        </div>
        <button style={{ background: 'transparent', border: '1px solid #6366f1', borderRadius: '8px', padding: '8px 16px', color: '#6366f1', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
          View Security Audit
        </button>
      </div>

      <style>{`
        .glass-panel {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-panel:hover {
          border-color: #6366f144 !important;
          background: #16161d !important;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Connections;
