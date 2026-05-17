import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Trash2, Edit3, RotateCcw, Layout, Sidebar as SidebarIcon, 
  Palette, EyeOff, Check, X, RefreshCw, Layers, Sparkles
} from 'lucide-react';
import { PAGE_REGISTRY } from '../lib/windowRegistry';

// Helper to generate a unique selector for any DOM element
const getUniqueSelector = (el) => {
  if (!(el instanceof Element)) return '';
  const path = [];
  let currentEl = el;
  
  while (currentEl && currentEl.nodeType === Node.ELEMENT_NODE) {
    let selector = currentEl.nodeName.toLowerCase();
    if (currentEl.id) {
      selector += '#' + currentEl.id;
      path.unshift(selector);
      break;
    } else {
      let sibling = currentEl;
      let nth = 1;
      while (sibling = sibling.previousElementSibling) {
        if (sibling.nodeName.toLowerCase() === currentEl.nodeName.toLowerCase()) {
          nth++;
        }
      }
      selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    currentEl = currentEl.parentNode;
  }
  return path.join(' > ');
};

const THEME_PRESETS = [
  { name: 'Indigo (Default)', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' },
  { name: 'Emerald', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Cyan', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  { name: 'Crimson', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  { name: 'Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
];

export const StealthCustomizer = () => {
  const [contextMenu, setContextMenu] = useState(null); // { x, y, targetSelector, textContent }
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState('elements');
  const [hiddenSelectors, setHiddenSelectors] = useState([]);
  const [sidebarActiveIds, setSidebarActiveIds] = useState([]);
  const [activeTheme, setActiveTheme] = useState(THEME_PRESETS[0].name);
  const [isLiveEditTextMode, setIsLiveEditTextMode] = useState(false);
  const [editedTexts, setEditedTexts] = useState({});

  const clickSequenceRef = useRef({ lastLeftClickTime: 0 });

  // 1. Load initial states on mount
  useEffect(() => {
    // Load hidden selectors
    const savedHidden = localStorage.getItem('stealth-hidden-selectors');
    if (savedHidden) {
      try {
        const parsed = JSON.parse(savedHidden);
        setHiddenSelectors(parsed);
        applyHiddenStyles(parsed);
      } catch (e) {}
    }

    // Load active sidebar ids
    const savedSidebar = localStorage.getItem('sidebar-active-ids');
    if (savedSidebar) {
      try {
        const parsed = JSON.parse(savedSidebar);
        if (parsed && Array.isArray(parsed)) {
          let updated = false;
          if (!parsed.includes('scraper')) {
            parsed.push('scraper');
            updated = true;
          }
          if (!parsed.includes('lead-validator')) {
            parsed.push('lead-validator');
            updated = true;
          }
          if (updated) {
            localStorage.setItem('sidebar-active-ids', JSON.stringify(parsed));
          }
          setSidebarActiveIds(parsed);
        } else {
          setSidebarActiveIds(parsed);
        }
      } catch (e) {}
    } else {
      // Default set: everything except standard hidden ones
      const initialIds = Object.keys(PAGE_REGISTRY).filter(id => 
        !['omni-brain', 'apps-hub', 'ai-center', 'browser', 'contacts', 'opportunities'].includes(id)
      );
      setSidebarActiveIds(initialIds);
    }

    // Load theme
    const savedTheme = localStorage.getItem('stealth-active-theme');
    if (savedTheme) {
      setActiveTheme(savedTheme);
      applyTheme(savedTheme);
    }

    // Load edited texts
    const savedTexts = localStorage.getItem('stealth-edited-texts');
    if (savedTexts) {
      try {
        const parsed = JSON.parse(savedTexts);
        setEditedTexts(parsed);
        applyTextEdits(parsed);
      } catch (e) {}
    }

    // Bind click trackers for Left-then-Right click option
    const handleMouseDown = (e) => {
      if (e.button === 0) { // Left click
        clickSequenceRef.current.lastLeftClickTime = Date.now();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Sync edited texts dynamically
  useEffect(() => {
    if (isLiveEditTextMode) {
      const handleInput = (e) => {
        const selector = getUniqueSelector(e.target);
        if (selector) {
          const newTexts = { ...editedTexts, [selector]: e.target.innerText };
          setEditedTexts(newTexts);
          localStorage.setItem('stealth-edited-texts', JSON.stringify(newTexts));
        }
      };

      document.body.addEventListener('input', handleInput);
      return () => document.body.removeEventListener('input', handleInput);
    }
  }, [isLiveEditTextMode, editedTexts]);

  // Apply hidden selectors via stylesheet
  const applyHiddenStyles = (selectors) => {
    let styleTag = document.getElementById('stealth-customizer-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'stealth-customizer-styles';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = selectors.length > 0 
      ? selectors.map(sel => `${sel} { display: none !important; }`).join('\n')
      : '';
  };

  // Apply text edits
  const applyTextEdits = (texts) => {
    Object.entries(texts).forEach(([selector, text]) => {
      try {
        const el = document.querySelector(selector);
        if (el) el.innerText = text;
      } catch (e) {}
    });
  };

  // Apply theme preset
  const applyTheme = (themeName) => {
    const theme = THEME_PRESETS.find(t => t.name === themeName) || THEME_PRESETS[0];
    document.documentElement.style.setProperty('--accent-color', theme.color);
    document.documentElement.style.setProperty('--accent-glow', theme.glow);
  };

  // Global Context Menu listener
  useEffect(() => {
    const handleGlobalContextMenu = (e) => {
      // Check if triggering either standard right click OR left-then-right sequence within 800ms
      const isLeftThenRight = (Date.now() - clickSequenceRef.current.lastLeftClickTime) < 800;
      
      e.preventDefault();
      const targetSelector = getUniqueSelector(e.target);
      const textContent = e.target.innerText || e.target.textContent || '';
      
      setContextMenu({
        x: e.pageX,
        y: e.pageY,
        targetSelector,
        textContent: textContent.substring(0, 30) + (textContent.length > 30 ? '...' : '')
      });
    };

    window.addEventListener('contextmenu', handleGlobalContextMenu);
    return () => window.removeEventListener('contextmenu', handleGlobalContextMenu);
  }, []);

  // Hide context menu on global click
  useEffect(() => {
    const handleCloseMenu = () => {
      setContextMenu(null);
    };
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

  // Action: Add hidden selector
  const hideElement = (selector) => {
    if (!selector) return;
    const nextHidden = [...new Set([...hiddenSelectors, selector])];
    setHiddenSelectors(nextHidden);
    localStorage.setItem('stealth-hidden-selectors', JSON.stringify(nextHidden));
    applyHiddenStyles(nextHidden);
    setContextMenu(null);
  };

  // Action: Restore single hidden selector
  const restoreElement = (selector) => {
    const nextHidden = hiddenSelectors.filter(sel => sel !== selector);
    setHiddenSelectors(nextHidden);
    localStorage.setItem('stealth-hidden-selectors', JSON.stringify(nextHidden));
    applyHiddenStyles(nextHidden);
  };

  // Action: Restore all elements
  const restoreAllElements = () => {
    setHiddenSelectors([]);
    localStorage.setItem('stealth-hidden-selectors', JSON.stringify([]));
    applyHiddenStyles([]);
  };

  // Action: Toggle Sidebar item visibility
  const toggleSidebarItem = (id) => {
    let nextIds;
    if (sidebarActiveIds.includes(id)) {
      nextIds = sidebarActiveIds.filter(i => i !== id);
    } else {
      nextIds = [...sidebarActiveIds, id];
    }
    setSidebarActiveIds(nextIds);
    localStorage.setItem('sidebar-active-ids', JSON.stringify(nextIds));
    window.dispatchEvent(new Event('sidebar-updated'));
  };

  // Action: Change Active Theme
  const changeTheme = (themeName) => {
    setActiveTheme(themeName);
    localStorage.setItem('stealth-active-theme', themeName);
    applyTheme(themeName);
  };

  // Action: Toggle Text Editing Mode
  const toggleLiveEditText = () => {
    const nextMode = !isLiveEditTextMode;
    setIsLiveEditTextMode(nextMode);
    
    // Enable/disable contentEditable globally for text holders
    const textSelectors = 'p, span, h1, h2, h3, h4, h5, h6, a, button, li';
    document.querySelectorAll(textSelectors).forEach(el => {
      if (nextMode) {
        el.setAttribute('contenteditable', 'true');
        el.style.outline = '1px dashed rgba(99, 102, 241, 0.4)';
      } else {
        el.removeAttribute('contenteditable');
        el.style.outline = '';
      }
    });
  };

  return (
    <>
      {/* 1. Sleek Right-Click Context Menu */}
      {contextMenu && (
        <div 
          style={{
            position: 'absolute',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            zIndex: 999999,
            width: '240px',
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            padding: '6px',
            fontFamily: '"Inter", sans-serif',
            animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Section Header */}
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', padding: '6px 10px', letterSpacing: '0.05em' }}>
            STEALTH CUSTOMIZER
          </div>

          {/* Option: Customize Dashboard */}
          <button 
            onClick={() => { setShowDashboard(true); setContextMenu(null); }}
            style={menuButtonStyle}
          >
            <Settings size={14} color="var(--accent-color)" />
            <span>Open Customizer Panel</span>
          </button>

          {/* Option: Hide Element Under Cursor */}
          <button 
            onClick={() => hideElement(contextMenu.targetSelector)}
            style={menuButtonStyle}
          >
            <EyeOff size={14} color="#ef4444" />
            <span style={{ color: '#ef4444' }}>Zap Element Under Cursor</span>
          </button>

          {/* Option: Edit Text Under Cursor */}
          <button 
            onClick={() => { toggleLiveEditText(); setContextMenu(null); }}
            style={menuButtonStyle}
          >
            <Edit3 size={14} color="#f59e0b" />
            <span>{isLiveEditTextMode ? 'Disable Text Edit Mode' : 'Edit Text Mode'}</span>
          </button>

          {hiddenSelectors.length > 0 && (
            <>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
              <button 
                onClick={() => { restoreAllElements(); setContextMenu(null); }}
                style={menuButtonStyle}
              >
                <RotateCcw size={14} color="#10b981" />
                <span style={{ color: '#10b981' }}>Restore all elements</span>
              </button>
            </>
          )}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
          
          <div style={{ fontSize: '0.58rem', color: '#475569', padding: '4px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Target: <code>{contextMenu.targetSelector.split(' > ').pop()}</code>
          </div>
        </div>
      )}

      {/* 2. Sleek Customizer Control Dashboard */}
      {showDashboard && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999999,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Inter", sans-serif'
          }}
        >
          <div 
            style={{
              width: '600px',
              height: '500px',
              background: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sparkles size={20} color="var(--accent-color)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0 }}>Stealth Customizer</h2>
              </div>
              <button 
                onClick={() => setShowDashboard(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(239, 68, 68, 0.15)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255, 255, 255, 0.03)'}
              >
                <X size={14} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Tab Navigation */}
              <div 
                style={{
                  width: '160px',
                  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <button 
                  onClick={() => setActiveTab('elements')}
                  style={tabButtonStyle(activeTab === 'elements')}
                >
                  <EyeOff size={14} />
                  <span>Hidden Items</span>
                </button>
                <button 
                  onClick={() => setActiveTab('sidebar')}
                  style={tabButtonStyle(activeTab === 'sidebar')}
                >
                  <SidebarIcon size={14} />
                  <span>Pages Sidebar</span>
                </button>
                <button 
                  onClick={() => setActiveTab('theme')}
                  style={tabButtonStyle(activeTab === 'theme')}
                >
                  <Palette size={14} />
                  <span>Accent Theme</span>
                </button>
                <button 
                  onClick={() => setActiveTab('editmode')}
                  style={tabButtonStyle(activeTab === 'editmode')}
                >
                  <Edit3 size={14} />
                  <span>Text Editor</span>
                </button>
              </div>

              {/* Tab Views */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                
                {/* 1. Tab Elements */}
                {activeTab === 'elements' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      You can hide any HTML element on the page by right-clicking on it and choosing <strong>"Zap Element Under Cursor"</strong>. Manage the active hidden elements below.
                    </div>
                    {hiddenSelectors.length === 0 ? (
                      <div style={{ padding: '32px 0', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
                        No hidden elements. Right click anything to hide it!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>HIDDEN PATHS ({hiddenSelectors.length})</span>
                          <button 
                            onClick={restoreAllElements}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <RotateCcw size={12} />
                            <span>Restore All</span>
                          </button>
                        </div>
                        {hiddenSelectors.map((sel, idx) => (
                          <div 
                            key={idx} 
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              background: 'rgba(255,255,255,0.01)',
                              border: '1px solid rgba(255,255,255,0.03)',
                              borderRadius: '10px',
                              fontSize: '0.72rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }} title={sel}>
                              {sel.split(' > ').pop()}
                            </span>
                            <button 
                              onClick={() => restoreElement(sel)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                              title="Restore element"
                            >
                              <RotateCcw size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Tab Sidebar Manager */}
                {activeTab === 'sidebar' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      Enable or disable navigation items from displaying in the primary sidebar navigation list.
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                      {Object.entries(PAGE_REGISTRY).map(([id, page]) => {
                        const PageIcon = page.icon;
                        const isVisible = sidebarActiveIds.includes(id);
                        return (
                          <div 
                            key={id}
                            onClick={() => toggleSidebarItem(id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              background: isVisible ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.01)',
                              border: isVisible ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255,255,255,0.03)',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <PageIcon size={14} color={isVisible ? 'var(--accent-color)' : '#475569'} />
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isVisible ? 'white' : '#64748b' }}>
                                {page.label}
                              </span>
                            </div>
                            <div 
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                border: isVisible ? '1px solid var(--accent-color)' : '1px solid #475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isVisible ? 'var(--accent-color)' : 'transparent',
                                transition: 'all 0.2s'
                              }}
                            >
                              {isVisible && <Check size={10} color="black" strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Tab Theme Presets */}
                {activeTab === 'theme' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      Select a premium glow tone layout accent configuration to skin the CRM. Updates on-the-fly!
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                      {THEME_PRESETS.map((preset) => {
                        const isSelected = activeTheme === preset.name;
                        return (
                          <div 
                            key={preset.name}
                            onClick={() => changeTheme(preset.name)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 18px',
                              background: isSelected ? 'rgba(255,255,255,0.02)' : 'transparent',
                              border: isSelected ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: preset.color, boxShadow: `0 0 10px ${preset.color}` }} />
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? 'white' : '#64748b' }}>
                                {preset.name}
                              </span>
                            </div>
                            {isSelected && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: 800 }}>
                                <Check size={14} />
                                <span>ACTIVE</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Tab Text Editing */}
                {activeTab === 'editmode' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      Enable <strong>Live Text Edit Mode</strong>. This will make all text elements on your website instantly editable by clicking on them. Changes are saved to <code>localStorage</code> and persist!
                    </div>

                    <div 
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        marginTop: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'white', fontWeight: 700 }}>
                          Live Text Editing:
                        </div>
                        <div 
                          onClick={toggleLiveEditText}
                          style={{
                            width: '46px',
                            height: '24px',
                            borderRadius: '12px',
                            background: isLiveEditTextMode ? 'var(--accent-color)' : '#1e293b',
                            padding: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: isLiveEditTextMode ? 'flex-end' : 'flex-start',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'black' }} />
                        </div>
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
                        {isLiveEditTextMode 
                          ? '👉 Click any text on the website now to rewrite it!'
                          : 'Toggle the switch above to activate editing mode.'
                        }
                      </div>

                      {Object.keys(editedTexts).length > 0 && (
                        <button 
                          onClick={() => {
                            setEditedTexts({});
                            localStorage.removeItem('stealth-edited-texts');
                            window.location.reload();
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '12px'
                          }}
                        >
                          <RotateCcw size={12} />
                          <span>Reset Edited Texts</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Footer */}
            <div 
              style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                <Layers size={12} />
                <span>Stealth Visual customizer v1.0.0</span>
              </div>
              <button 
                onClick={() => setShowDashboard(false)}
                style={{
                  background: 'var(--accent-color)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 20px',
                  color: 'black',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px var(--accent-glow)'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

// Sub-component styles
const menuButtonStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  padding: '10px 12px',
  borderRadius: '10px',
  color: '#94a3b8',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textAlign: 'left',
  transition: 'background 0.15s, color 0.15s'
};

// Dynamic style hook for hover effects
const hoverStyleInjector = () => {
  const css = `
    button:hover {
      background: rgba(255, 255, 255, 0.03) !important;
      color: white !important;
    }
  `;
  return css;
};

const tabButtonStyle = (isActive) => ({
  width: '100%',
  background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '10px',
  color: isActive ? 'white' : '#475569',
  fontSize: '0.75rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textAlign: 'left',
  transition: 'all 0.2s'
});

export default StealthCustomizer;
