import React, { useState, useEffect } from 'react';
import { 
  Bot, Link as LinkIcon, Image, Code, Play, RefreshCcw, FolderOpen, 
  HardDrive, ExternalLink, Eye, Download, Maximize2, X, Sparkles, Layout, Globe
} from 'lucide-react';

const USA_EQUIPMENT_PAGES = [
  { label: 'Home Page', file: 'usaequipmentdirect.com_clone.html', desc: 'Main Landing Page & Brand Catalog' },
  { label: 'Shop Directory', file: 'usaequipmentdirect.com_shop.html', desc: 'Complete product catalog interface' },
  { label: 'Restaurant Equipment', file: 'usaequipmentdirect.com_restaurant_equipment.html', desc: 'Heavy-duty commercial cooking lines' },
  { label: 'Commercial Refrigeration', file: 'usaequipmentdirect.com_commercial_refrigeration.html', desc: 'Reach-ins, walk-ins, and prep tables' },
  { label: 'Janitorial Supplies', file: 'usaequipmentdirect.com_janitorial_supplies.html', desc: 'Commercial sanitation and cleanup' },
  { label: 'Smallwares', file: 'usaequipmentdirect.com_smallwares.html', desc: 'Kitchen tools, pans, and chef essentials' },
  { label: 'Tabletop', file: 'usaequipmentdirect.com_tabletop.html', desc: 'Plateware, glassware, and serving pieces' },
  { label: 'Furniture', file: 'usaequipmentdirect.com_furniture.html', desc: 'Dining tables, seating, and bar stools' },
  { label: 'Brands Showcase', file: 'usaequipmentdirect.com_brands.html', desc: 'Complete manufacturer brand lines' },
];

const generateEquipmentAssets = () => {
  const list = [];
  for (let i = 0; i < 90; i++) {
    let ext = 'jpg';
    if ((i >= 6 && i <= 9) || (i >= 16 && i <= 19) || (i >= 26 && i <= 29) || i === 36 || i === 86) {
      ext = 'webp';
    } else if ((i >= 37 && i <= 39) || (i >= 87 && i <= 89)) {
      ext = 'png';
    }
    list.push({ name: `asset_${i}.${ext}`, type: ext });
  }
  return list;
};

const EQUIPMENT_ASSETS = generateEquipmentAssets();


const GENERAL_ASSETS = [
  { name: 'asset_0.png', type: 'png' },
  { name: 'asset_1.png', type: 'png' },
  { name: 'asset_2.png', type: 'png' },
  { name: 'asset_3.jpg', type: 'jpg' },
  { name: 'asset_4.jpg', type: 'jpg' },
  { name: 'asset_5.png', type: 'png' },
  { name: 'asset_6.png', type: 'png' },
  { name: 'asset_7.jpg', type: 'jpg' },
  { name: 'asset_8.jpg', type: 'jpg' },
  { name: 'asset_9.jpg', type: 'jpg' },
  { name: 'asset_10.jpg', type: 'jpg' },
  { name: 'asset_11.jpg', type: 'jpg' },
  { name: 'asset_12.jpg', type: 'jpg' },
  { name: 'asset_13.jpg', type: 'jpg' },
  { name: 'asset_14.jpg', type: 'jpg' },
  { name: 'asset_15.jpg', type: 'jpg' },
  { name: 'asset_16.jpg', type: 'jpg' },
  { name: 'asset_17.jpg', type: 'jpg' },
  { name: 'asset_18.jpg', type: 'jpg' },
  { name: 'asset_19.jpg', type: 'jpg' },
];

const ScraperAgent = () => {
  const [url, setUrl] = useState('');
  const [upscale, setUpscale] = useState(false);
  const [optimizeStorage, setOptimizeStorage] = useState(true);
  const [status, setStatus] = useState({ queueLength: 0, isScraping: false });
  const [loading, setLoading] = useState(false);
  
  // Custom states for preview and lightbox
  const [previewUrl, setPreviewUrl] = useState(null); // iframe preview URL
  const [previewTitle, setPreviewTitle] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null); // full size image preview
  const [activeTab, setActiveTab] = useState('equipment');

  const checkStatus = async () => {
    try {
      const res = await fetch('http://localhost:3001/scrape/status');
      if(res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch(e) {
      // Quiet fail to prevent console spam if native bridge is offline
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, upscale, optimizeStorage })
      });
      if(res.ok) {
        alert('Scraping job queued successfully! The Scraper Agent will handle it in the background.');
        setUrl('');
        checkStatus();
      }
    } catch (error) {
      alert('Failed to connect to Scraper Agent (Native Bridge might be down).');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: '"Inter", sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title Header */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={32} color="#10b981" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>AI Scraper Agent</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Autonomous Background Asset Harvesting • SuperResolution • Smart Vaulting</p>
          </div>
        </div>
        
        {/* Quick status status indicator */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.isScraping ? '#10b981' : '#64748b', boxShadow: status.isScraping ? '0 0 8px #10b981' : 'none' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: status.isScraping ? 'white' : '#64748b' }}>
              {status.isScraping ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Queue & Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
        
        {/* Form Container */}
        <form onSubmit={handleScrape} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="var(--accent-color)" /> Queue New Harvesting Target
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>TARGET DOMAIN / URL</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <LinkIcon size={18} color="#475569" />
              <input 
                type="url" 
                placeholder="https://competitorwebsite.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.85rem' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                id="upscale" 
                checked={upscale} 
                onChange={(e) => setUpscale(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
              />
              <label htmlFor="upscale" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#94a3b8' }}>
                <Image size={16} color="var(--accent-color)" />
                <span>Upscale High-Res Assets (AI SuperResolution via FFmpeg)</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                id="optimize" 
                checked={optimizeStorage} 
                onChange={(e) => setOptimizeStorage(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
              />
              <label htmlFor="optimize" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#94a3b8' }}>
                <HardDrive size={16} color="var(--accent-color)" />
                <span>Optimize Storage (Smart Lossless Compression & WebP Conversion)</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !url}
            style={{ 
              marginTop: '8px',
              background: 'var(--accent-color)', 
              color: 'black', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '12px', 
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: (loading || !url) ? 'not-allowed' : 'pointer',
              opacity: (loading || !url) ? 0.5 : 1,
              boxShadow: '0 4px 20px var(--accent-glow)',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? <RefreshCcw className="animate-spin" size={18} /> : <Play size={18} fill="black" />}
            ENGAGE HARVESTING SEQUENCE
          </button>
        </form>

        {/* Status Dashboard Panel */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen size={18} color="#10b981" /> Local Vault Architecture
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
            Every target processed is dynamically structured into `/public/vault/` and categorized under dedicated sectors: <strong>Equipment</strong>, <strong>Contractors</strong>, and <strong>General</strong>. 
          </p>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Active Jobs Pending:</span>
              <span style={{ color: 'white', fontWeight: 700 }}>{status.queueLength} queue</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Vault Location:</span>
              <code style={{ color: 'var(--accent-color)', background: 'rgba(99,102,241,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>/public/vault/*</code>
            </div>
          </div>
        </div>
      </div>

      {/* Stunning Scraped Vault Explorer */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FolderOpen size={22} color="var(--accent-color)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Scraped Assets & Clones Vault</h3>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setActiveTab('equipment')}
              style={{
                background: activeTab === 'equipment' ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                color: activeTab === 'equipment' ? 'white' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              usaequipmentdirect.com
            </button>
            <button 
              onClick={() => setActiveTab('general')}
              style={{
                background: activeTab === 'general' ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                color: activeTab === 'general' ? 'white' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              kommerlingusa.com
            </button>
          </div>
        </div>

        {activeTab === 'equipment' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Cloned Sub-pages Interactive Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layout size={18} color="var(--accent-color)" />
                <h4 style={{ margin: 0, color: 'white', fontSize: '1rem', fontWeight: 800 }}>Harvested Sub-pages & Competitor Catalogs ({USA_EQUIPMENT_PAGES.length})</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {USA_EQUIPMENT_PAGES.map((page, idx) => (
                  <div 
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '16px',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.background = 'rgba(99,102,241,0.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'; }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white' }}>{page.label}</span>
                        <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>CLONED</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>{page.desc}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button 
                        type="button"
                        onClick={() => { setPreviewUrl(`/vault/Equipment/${page.file}`); setPreviewTitle(page.label); }}
                        style={{ ...secondaryButtonStyle, flex: 1, justifyContent: 'center', padding: '6px 12px', fontSize: '0.72rem' }}
                      >
                        <Eye size={12} />
                        <span>Preview</span>
                      </button>
                      <a 
                        href={`/vault/Equipment/${page.file}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ ...secondaryButtonStyle, flex: 1, justifyContent: 'center', padding: '6px 12px', fontSize: '0.72rem', textDecoration: 'none' }}
                      >
                        <ExternalLink size={12} />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Grid Display */}
            <div>
              <h5 style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>HARVESTED IMAGES Vault ({EQUIPMENT_ASSETS.length})</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
                {EQUIPMENT_ASSETS.map((asset, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setLightboxImg(`/vault/Equipment/media/${asset.name}`)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      aspectRatio: '1',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <img 
                      src={`/vault/Equipment/media/${asset.name}`} 
                      alt={`asset_${idx}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', bottom: 0, insetX: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace' }}>#{idx}</span>
                      <span style={{ fontSize: '0.58rem', background: 'rgba(99,102,241,0.2)', color: 'var(--accent-color)', padding: '2px 4px', borderRadius: '4px', fontWeight: 800 }}>{asset.type.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Folder Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div>
                <h4 style={{ margin: 0, color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>Kömmerling USA Clone</h4>
                <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '0.78rem' }}>Sector: General / Supplies • Cloned Index & High-Resolution Optimized Marketing Assets</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => { setPreviewUrl('/vault/General/kommerlingusa.com_clone.html'); setPreviewTitle('Kömmerling USA'); }}
                  style={secondaryButtonStyle}
                >
                  <Eye size={14} />
                  <span>Preview Page Clone</span>
                </button>
                <a 
                  href="/vault/General/kommerlingusa.com_clone.html" 
                  target="_blank" 
                  rel="noreferrer"
                  style={secondaryButtonStyle}
                >
                  <ExternalLink size={14} />
                  <span>Open in New Tab</span>
                </a>
              </div>
            </div>

            {/* Asset Grid Display */}
            <div>
              <h5 style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>HARVESTED IMAGES Vault ({GENERAL_ASSETS.length})</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
                {GENERAL_ASSETS.map((asset, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setLightboxImg(`/vault/General/media/${asset.name}`)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      aspectRatio: '1',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <img 
                      src={`/vault/General/media/${asset.name}`} 
                      alt={`asset_${idx}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', bottom: 0, insetX: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace' }}>#{idx}</span>
                      <span style={{ fontSize: '0.58rem', background: 'rgba(99,102,241,0.2)', color: 'var(--accent-color)', padding: '2px 4px', borderRadius: '4px', fontWeight: 800 }}>{asset.type.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Iframe Preview Modal */}
      {previewUrl && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: '90vw', height: '90vh' }}>
            <div style={modalHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={18} color="var(--accent-color)" />
                <h4 style={{ margin: 0, color: 'white', fontWeight: 800 }}>Preview Clone: {previewTitle}</h4>
              </div>
              <button onClick={() => setPreviewUrl(null)} style={closeButtonStyle}>
                <X size={16} />
              </button>
            </div>
            <iframe 
              src={previewUrl} 
              title={previewTitle} 
              style={{ width: '100%', height: 'calc(100% - 60px)', border: 'none', background: 'white', borderRadius: '0 0 16px 16px' }} 
            />
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div style={modalOverlayStyle} onClick={() => setLightboxImg(null)}>
          <div style={{ position: 'relative', maxWidth: '85vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxImg(null)} style={{ ...closeButtonStyle, position: 'absolute', top: '-40px', right: '0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <X size={18} />
            </button>
            <img 
              src={lightboxImg} 
              alt="Full Size View" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }} 
            />
            <a 
              href={lightboxImg} 
              download 
              style={{
                marginTop: '16px',
                background: 'var(--accent-color)',
                color: 'black',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <Download size={14} />
              <span>Download High-Res Asset</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
};

// Reuseable element style mappings
const secondaryButtonStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s',
  textDecoration: 'none'
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999999,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalContentStyle = {
  background: 'rgba(10, 10, 15, 0.9)',
  backdropFilter: 'blur(30px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  background: 'rgba(0,0,0,0.2)'
};

const closeButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  borderRadius: '50%',
  transition: 'all 0.2s'
};

export default ScraperAgent;
