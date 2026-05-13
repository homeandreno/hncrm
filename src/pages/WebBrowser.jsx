import React, { useState } from 'react';
import { 
  Globe, ArrowLeft, ArrowRight, RotateCw, Shield, Lock, Search, MoreVertical, 
  ExternalLink, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const WebBrowser = () => {
  const [url, setUrl] = useState('/website');
  const [inputUrl, setInputUrl] = useState('/website');
  const [history, setHistory] = useState(['/website']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNavigate = (e) => {
    if (e.key === 'Enter') {
      let target = inputUrl;
      if (!target.startsWith('http')) {
        target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
      }
      setUrl(target);
      setInputUrl(target);
      setHistory(prev => [...prev.slice(0, historyIndex + 1), target]);
      setHistoryIndex(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setUrl(prevUrl);
      setInputUrl(prevUrl);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setUrl(nextUrl);
      setInputUrl(nextUrl);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a0c', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      {/* Browser Toolbar */}
      <div style={{ height: '54px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid #1f1f27', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={goBack} disabled={historyIndex === 0} style={{ background: 'transparent', border: 'none', color: historyIndex === 0 ? '#2d2d3f' : '#94a3b8', cursor: historyIndex === 0 ? 'default' : 'pointer' }}><ChevronLeft size={18} /></button>
          <button onClick={goForward} disabled={historyIndex === history.length - 1} style={{ background: 'transparent', border: 'none', color: historyIndex === history.length - 1 ? '#2d2d3f' : '#94a3b8', cursor: historyIndex === history.length - 1 ? 'default' : 'pointer' }}><ChevronRight size={18} /></button>
          <button onClick={() => setUrl(url)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><RotateCw size={16} /></button>
        </div>

        <div style={{ flex: 1, height: '36px', background: 'rgba(0,0,0,0.3)', border: '1px solid #2d2d3f', borderRadius: '18px', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '10px' }}>
          <Lock size={12} color="#10b981" />
          <input 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleNavigate}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.8rem', outline: 'none' }}
          />
          <Shield size={12} color="#6366f1" />
        </div>

        <div style={{ display: 'flex', gap: '12px', color: '#475569' }}>
           <Search size={18} style={{ cursor: 'pointer' }} />
           <MoreVertical size={18} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Quick Access Bar */}
      <div style={{ height: '32px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid #1f1f27', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '20px' }}>
        {[
          { name: 'Marketing Hub', url: '/marketing' },
          { name: 'Website Builder', url: '/website' },
          { name: 'CRM Dashboard', url: '/dashboard' },
          { name: 'Stealth Preview', url: 'https://example.com' }
        ].map(site => (
          <button 
            key={site.name} 
            onClick={() => { setUrl(site.url); setInputUrl(site.url); }}
            style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Globe size={10} /> {site.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Browser Stage */}
      <div style={{ flex: 1, background: '#fff', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b', textAlign: 'center', padding: '40px', zIndex: 0 }}>
          <div>
            <Shield size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <h3>Secure Stealth Browser</h3>
            <p style={{ maxWidth: '400px', fontSize: '0.85rem' }}>External sites may block in-app framing for security. Use the Quick Access bar for internal CRM tools or the Native Bridge for external browsing.</p>
          </div>
        </div>
        <iframe 
          src={url.startsWith('http') ? `http://localhost:3001/proxy-view?url=${encodeURIComponent(url)}` : url} 
          style={{ width: '100%', height: '100%', border: 'none', position: 'relative', zIndex: 1, background: url.startsWith('/') ? 'transparent' : 'white' }} 
          title="Web Browser Session"
        />
        {/* Anti-Detect Overlay Info (Subtle) */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(10,10,12,0.8)', padding: '8px 12px', borderRadius: '8px', border: '1px solid #10b98144', color: '#10b981', fontSize: '0.65rem', fontWeight: 900, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 2 }}>
           <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
           STEALTH SESSION ACTIVE
        </div>
      </div>
    </div>
  );
};

export default WebBrowser;
