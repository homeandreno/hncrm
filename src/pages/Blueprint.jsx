import React, { useState, useEffect } from 'react';
import { Lightbulb, Rocket, Target, DollarSign, ArrowRight, Loader2, Link, Shield, Layers, TrendingUp, Sparkles, X, Globe, Video, Share2 } from 'lucide-react';
import { analyzeIdea } from '../lib/proxyService';
import { motion, AnimatePresence } from 'framer-motion';

const Blueprint = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('strategy');

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await analyzeIdea(url);
    
    if (result.success) {
      // Simulate AI transformation logic based on the scraped content
      const data = result.data;
      setTimeout(() => {
        setAnalysisResult({
          original: data,
          strategy: {
            concept: data.title,
            marketGap: `The current ${data.domain} landscape lacks automated, high-velocity integration for niche markers.`,
            audience: "Independent agencies and solopreneurs looking for enterprise-grade automation.",
            monetization: "Subscription-based SaaS with high-margin consulting upsells."
          },
          branding: {
            name: `${data.title.split(' ')[0]}Flow`,
            colors: ["#6366f1", "#4f46e5", "#0f172a"],
            tagline: "The Future of Automated Intelligence."
          },
          roadmap: [
            { step: 1, title: "Identity Setup", desc: "Configure residential proxies and anti-detect profiles for the brand." },
            { step: 2, title: "Market Validation", desc: "Deploy automated scraping to identify top 100 high-value leads." },
            { step: 3, title: "MVP Launch", desc: "Build a landing page and connect the CRM outbound engine." }
          ]
        });
        setIsAnalyzing(false);
      }, 2000);
    } else {
      alert("Analysis failed. Ensure the bridge is online.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page-container" style={{ background: '#050505', color: 'white', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f59e0b' }}>
              <Lightbulb color="#f59e0b" size={24} />
           </div>
           <div>
              <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>BLUEPRINT.ARCHITECT</h1>
              <p className="page-subtitle" style={{ color: '#475569' }}>AI-driven business logic from any web inspiration.</p>
           </div>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* INPUT STAGE */}
        <div className="glass-panel" style={{ padding: '40px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>What's the inspiration?</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }}><Link size={18} /></div>
            <input 
              className="glass-input" 
              style={{ width: '100%', paddingLeft: '48px', height: '56px', fontSize: '1rem', borderRadius: '14px' }} 
              placeholder="Paste YouTube link, Article URL, or X post..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url}
              style={{ padding: '0 24px', height: '56px', background: '#6366f1', border: 'none', borderRadius: '14px', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              ANALYZE IDEA
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', opacity: 0.4 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}><Video size={14} /> YouTube</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}><Share2 size={14} /> X/Twitter</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}><Globe size={14} /> Web Articles</div>
          </div>
        </div>

        {/* ANALYSIS RESULTS */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '60px' }}
            >
               <Loader2 className="animate-spin" size={48} color="#6366f1" style={{ margin: '0 auto 24px' }} />
               <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Vision Engine Active</h3>
               <p style={{ color: '#475569' }}>Scraping content, identifying patterns, and architecting the roadmap...</p>
            </motion.div>
          )}

          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {/* HEADER SNAPSHOT */}
              <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent)', border: '1px solid #6366f133', borderRadius: '24px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#6366f1', marginBottom: '8px', letterSpacing: '0.1em' }}>INSPIRATION CAPTURED</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>{analysisResult.original.title}</h2>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>{analysisResult.original.description}</p>
              </div>

              {/* TABS */}
              <div style={{ display: 'flex', gap: '8px', background: '#0a0a0c', padding: '6px', borderRadius: '12px', border: '1px solid #1f1f27' }}>
                 {['strategy', 'branding', 'roadmap'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', background: activeTab === tab ? '#6366f1' : 'transparent', color: activeTab === tab ? 'white' : '#475569', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                   >
                     {tab.toUpperCase()}
                   </button>
                 ))}
              </div>

              {/* TAB CONTENT */}
              <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px' }}>
                 {activeTab === 'strategy' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                         <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 900, color: '#475569', marginBottom: '12px' }}><Target size={12} /> MARKET GAP</label>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{analysisResult.strategy.marketGap}</div>
                         </div>
                         <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 900, color: '#475569', marginBottom: '12px' }}><Layers size={12} /> TARGET AUDIENCE</label>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{analysisResult.strategy.audience}</div>
                         </div>
                      </div>
                      <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', border: '1px solid #10b98133', borderRadius: '16px' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 900, color: '#10b981', marginBottom: '12px' }}><DollarSign size={12} /> MONETIZATION MODEL</label>
                         <div style={{ fontSize: '1rem', fontWeight: 700 }}>{analysisResult.strategy.monetization}</div>
                      </div>
                   </motion.div>
                 )}

                 {activeTab === 'branding' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '20px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 900, marginBottom: '12px' }}>SUGGESTED IDENTITY</div>
                      <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', background: `linear-gradient(to right, ${analysisResult.branding.colors[0]}, ${analysisResult.branding.colors[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {analysisResult.branding.name}
                      </h2>
                      <p style={{ fontSize: '1rem', color: '#475569', fontStyle: 'italic', marginTop: '8px' }}>"{analysisResult.branding.tagline}"</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
                         {analysisResult.branding.colors.map(c => (
                           <div key={c} style={{ width: '40px', height: '40px', borderRadius: '10px', background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                         ))}
                      </div>
                   </motion.div>
                 )}

                 {activeTab === 'roadmap' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {analysisResult.roadmap.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1f1f27', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, color: '#6366f1' }}>{s.step}</div>
                           <div>
                              <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>{s.title}</h4>
                              <p style={{ fontSize: '0.8rem', color: '#475569' }}>{s.desc}</p>
                           </div>
                        </div>
                      ))}
                      <button style={{ width: '100%', height: '54px', marginTop: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}>
                         PUSH TO EXECUTION ENGINE <Rocket size={18} />
                      </button>
                   </motion.div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .glass-input:focus { border-color: #6366f1 !important; outline: none; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
      `}</style>
    </div>
  );
};

export default Blueprint;
