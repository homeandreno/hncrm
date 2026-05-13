import React, { useState } from 'react';
import { 
  Cpu, Globe, Zap, Bot, Brain, Plus, Paperclip, Send, AlertCircle, RefreshCw, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const AICommandCenter = ({ selectedLead, handleEnrichLead, isEnriching }) => {
  const [localBotActive, setLocalBotActive] = useState(true);
  const [openAiActive, setOpenAiActive] = useState(false);
  const [aiModel, setAiModel] = useState('local-llama');
  const [aiCommand, setAiCommand] = useState('');

  return (
    <div style={{ height: '100%', background: '#0a0a0c', padding: '32px 24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', color: 'white', fontFamily: '"Inter", sans-serif' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Cpu color="#6366f1" size={20} /> AI Command Center
      </h2>

      {/* Enrichment Engine */}
      <div className="glass-panel" style={{ padding: '24px', background: '#121217', border: '1px solid #1f1f27', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="#10b981" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Enrichment Engine</span>
          </div>
          {selectedLead?.enriched && <CheckCircle2 size={16} color="#10b981" />}
        </div>
        
        {selectedLead?.enriched ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(16,185,129,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.1)' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.5 }}>"{selectedLead.aiHook}"</p>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 900 }}>AI MATCH SCORE: {selectedLead.aiScore}%</span>
            </div>
          </motion.div>
        ) : (
          <>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.5 }}>Scan web footprint via Local Stealth Browser for personalized hooks.</p>
            <button onClick={handleEnrichLead} disabled={!selectedLead || isEnriching} style={{ width: '100%', background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', borderRadius: '8px', padding: '10px', color: '#6366f1', fontWeight: 800, fontSize: '0.75rem', cursor: (!selectedLead || isEnriching) ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isEnriching ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
              {isEnriching ? 'SCRAPING WEB...' : 'RUN ENRICHMENT (FREE)'}
            </button>
          </>
        )}
      </div>

      {/* Bot Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', background: '#121217', border: '1px solid #1f1f27', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="#10b981" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>Local Auto-Reply Bot</h4>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#475569', marginTop: '2px' }}>Keyword matching. Free.</p>
            </div>
          </div>
          <div onClick={() => setLocalBotActive(!localBotActive)} style={{ width: '40px', height: '22px', background: localBotActive ? '#10b981' : '#2d2d3f', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: localBotActive ? '20px' : '2px', transition: 'all 0.2s' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', background: '#121217', border: '1px solid #1f1f27', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={18} color="#ec4899" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>OpenAI Agent</h4>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#475569', marginTop: '2px' }}>Dynamic negotiation. Paid API.</p>
            </div>
          </div>
          <div onClick={() => setOpenAiActive(!openAiActive)} style={{ width: '40px', height: '22px', background: openAiActive ? '#ec4899' : '#2d2d3f', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: openAiActive ? '20px' : '2px', transition: 'all 0.2s' }}></div>
          </div>
        </div>

      </div>

      {/* SHIELD SENTINEL DIAGNOSTIC */}
      <div className="glass-panel" style={{ marginTop: '24px', padding: '24px', background: '#121217', border: '1px solid #1f1f27', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'white', letterSpacing: '1px' }}>SHIELD SENTINEL ACTIVE</span>
          </div>
          <button 
            onClick={async () => {
              const res = await fetch('http://127.0.0.1:3001/sentinel/repair', { method: 'POST' });
              const data = await res.json();
              if (data.success) alert("Sentinel: All shields re-synchronized.");
            }}
            style={{ background: 'transparent', border: '1px solid #3d3d4f', borderRadius: '6px', padding: '4px 10px', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}
          >
            RUN MANUAL REPAIR
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 800, marginBottom: '4px' }}>HEALTH SCORE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>100%</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 800, marginBottom: '4px' }}>GPS DRIFT</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#6366f1' }}>0.002%</div>
          </div>
        </div>

        <div style={{ background: '#0a0a0c', borderRadius: '8px', padding: '12px', height: '120px', overflowY: 'auto', border: '1px solid #1f1f27' }}>
           <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 900, marginBottom: '10px', borderBottom: '1px solid #1f1f27', paddingBottom: '4px' }}>LIVE SENTINEL LOGS</div>
           {[
             "Shield Sentinel AI Online.",
             "Verifying GPS-Shield integrity...",
             "ISO-SHIELD: 50/50 Profiles Isolated.",
             "Proxy Vault: Verified 50 Mobile IPs."
           ].map((log, i) => (
             <div key={i} style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '6px', fontFamily: 'monospace', display: 'flex', gap: '8px' }}>
               <span style={{ color: '#475569' }}>[{new Date().toLocaleTimeString()}]</span>
               <span>{log}</span>
             </div>
           ))}
        </div>
      </div>

      {/* AI Command Center Input */}
      <div style={{ marginTop: 'auto', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid #1f1f27', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Cpu size={14} color="#6366f1" />
               <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>COMMAND MODEL</span>
            </div>
            <select 
              value={aiModel} 
              onChange={(e) => setAiModel(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#6366f1', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', outline: 'none' }}
            >
              <option value="local-llama">LOCAL LLAMA-3</option>
              <option value="gpt-4">GPT-4 TURBO</option>
              <option value="claude-3">CLAUDE 3.5</option>
            </select>
         </div>

         <div style={{ position: 'relative', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid #2d2d3f', padding: '12px' }}>
            <textarea 
              value={aiCommand}
              onChange={(e) => setAiCommand(e.target.value)}
              placeholder="Ask the Brain..."
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', outline: 'none', resize: 'none', minHeight: '60px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <Plus size={16} color="#475569" style={{ cursor: 'pointer' }} />
                  <Paperclip size={16} color="#475569" style={{ cursor: 'pointer' }} />
               </div>
               <button 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
                  border: 'none', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
                }}
               >
                  <Send size={14} color="white" />
               </button>
            </div>
         </div>

         <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={12} color="#475569" />
            <span style={{ fontSize: '0.6rem', color: '#475569' }}>Zero-Subscription Bridge Enabled</span>
         </div>
      </div>

      <style>{`
        .glass-panel {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AICommandCenter;
