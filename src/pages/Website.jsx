import React, { useState } from 'react';
import { Layout, Plus, Monitor, Smartphone, Globe, Save, Play, Image as ImageIcon, Type, Square, MousePointer2, Filter, Globe2, FileText, Users, MessageCircle, Folder, Link, BarChart3 } from 'lucide-react';

const menuItems = [
  { id: 'funnel', name: 'Funnel', icon: Filter },
  { id: 'website', name: 'Website', icon: Globe2 },
  { id: 'wordpress', name: 'WordPress', icon: Globe },
  { id: 'membership', name: 'Membership', icon: Users },
  { id: 'surveys', name: 'Surveys', icon: FileText },
  { id: 'chat-widget', name: 'Chat Widget', icon: MessageCircle },
  { id: 'media', name: 'Media', icon: Folder },
  { id: 'url-redirect', name: 'URL Redirect', icon: Link },
];

const Website = () => {
  const [view, setView] = useState('templates'); // 'templates' or 'builder'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeMenu, setActiveMenu] = useState('website');

  const templates = [
    { id: 1, name: 'Home & Reno Pro', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400', category: 'Construction' },
    { id: 2, name: 'Modern Agency', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400', category: 'Marketing' },
    { id: 3, name: 'Luxury Real Estate', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400', category: 'Real Estate' },
    { id: 4, name: 'Service Landing', image: 'https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=400', category: 'Services' },
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setView('builder');
  };

  return (
    <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      {/* Top Bar */}
      <header className="page-header" style={{ padding: '16px 32px', borderBottom: '1px solid var(--glass-border)', marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--accent-color)', padding: '8px', borderRadius: '8px' }}>
            <Layout size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {menuItems.find(m => m.id === activeMenu)?.name || 'Website Builder'}
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {view === 'templates' ? 'Select a starting point for your customer' : `Editing: ${selectedTemplate?.name}`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {view === 'builder' && (
            <>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                <button className="icon-btn" style={{ padding: '6px 12px' }}><Monitor size={16} /></button>
                <button className="icon-btn" style={{ padding: '6px 12px' }}><Smartphone size={16} /></button>
              </div>
              <button className="glass-button" onClick={() => setView('templates')}>
                <Globe size={16} /> Preview
              </button>
              <button className="glass-button primary">
                <Save size={16} /> Publish
              </button>
            </>
          )}
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Vertical Menu Bar */}
        <aside style={{ width: '80px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                title={item.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '12px 8px',
                  borderRadius: '8px',
                  background: isActive ? 'var(--accent-color)' : 'transparent',
                  border: 'none',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{item.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {activeMenu === 'website' && (
            <>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Choose a Template</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Launch professional websites for your clients in seconds.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {templates.map(tpl => (
                  <div key={tpl.id} className="glass-panel" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => handleSelectTemplate(tpl)}>
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img src={tpl.image} alt={tpl.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', padding: '16px' }}>
                        <span style={{ fontSize: '0.75rem', background: 'var(--accent-color)', padding: '2px 8px', borderRadius: '4px' }}>{tpl.category}</span>
                      </div>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1rem' }}>{tpl.name}</h3>
                      <Plus size={18} color="var(--text-secondary)" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeMenu === 'funnel' && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Filter size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h2>Funnel Builder</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Create sales funnels to convert visitors into customers.</p>
            </div>
          )}

          {activeMenu === 'wordpress' && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Globe size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h2>WordPress Integration</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Connect and manage your WordPress sites.</p>
            </div>
          )}

          {activeMenu === 'membership' && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h2>Membership Sites</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Create exclusive member-only content and courses.</p>
            </div>
          )}

          {activeMenu === 'surveys' && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h2>Surveys</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Build surveys and collect feedback from your customers.</p>
            </div>
          )}

          {activeMenu === 'chat-widget' && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <MessageCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h2>Chat Widget</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Add live chat to your website for customer support.</p>
            </div>
          )}

          {activeMenu === 'media' && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Folder size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h2>Media Library</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your images, videos, and files.</p>
            </div>
          )}

          {activeMenu === 'url-redirect' && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Link size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h2>URL Redirects</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Manage URL redirects for your domains.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Website;
