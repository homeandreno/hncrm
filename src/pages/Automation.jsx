import React, { useState, useEffect } from 'react';
import { 
  Zap, Settings, Mail, Calendar, Briefcase, Fingerprint, Play, Pause, 
  ChevronRight, Brain, Sliders, ShieldCheck, Activity, Terminal, X,
  Cpu, MessageSquare, Target, UserCheck, RefreshCcw, Smartphone
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const AGENT_FLEET = [
  { 
    id: 'conv_agent', 
    name: 'GHOST-WRITER', 
    role: 'Conversations', 
    icon: MessageSquare, 
    status: 'Running',
    desc: 'Autonomous chat & email response engine with intent detection.',
    missions: 124,
    color: '#6366f1',
    settings: [
      { label: 'Tone', value: 'Professional' },
      { label: 'Response Delay', value: '3-5 min' },
      { label: 'Human Handoff', value: 'Enabled' }
    ]
  },
  { 
    id: 'ad_agent', 
    name: 'AD-SCIENTIST', 
    role: 'Marketing', 
    icon: Zap, 
    status: 'Running',
    desc: 'Optimizes ad spend & pauses low-performing creatives.',
    missions: 312,
    color: '#f43f5e',
    settings: [
      { label: 'Min ROI', value: '2.5x' },
      { label: 'Daily Cap', value: '$500' },
      { label: 'Auto-Pause', value: 'Enabled' }
    ]
  },
  { 
    id: 'cal_agent', 
    name: 'CONCIERGE', 
    role: 'Calendar', 
    icon: Calendar, 
    status: 'Standby',
    desc: 'Schedules appointments by analyzing natural language intent.',
    missions: 42,
    color: '#10b981',
    settings: [
      { label: 'Buffer Time', value: '15 min' },
      { label: 'Min Notice', value: '24 hours' },
      { label: 'Sync Status', value: 'G-Cal Live' }
    ]
  },
  { 
    id: 'opp_agent', 
    name: 'THE CLOSER', 
    role: 'Opportunities', 
    icon: Target, 
    status: 'Running',
    desc: 'Moves leads through pipeline based on buying signals.',
    missions: 89,
    color: '#f59e0b',
    settings: [
      { label: 'Score Threshold', value: '80+' },
      { label: 'Auto-Move', value: 'Enabled' },
      { label: 'Stale Alert', value: '3 Days' }
    ]
  },
  { 
    id: 'pay_agent', 
    name: 'TREASURY', 
    role: 'Payments', 
    icon: Briefcase, 
    status: 'Running',
    desc: 'Manages invoices and automates failed payment recovery.',
    missions: 18,
    color: '#8b5cf6',
    settings: [
      { label: 'Grace Period', value: '3 Days' },
      { label: 'Dunning Level', value: 'Aggressive' },
      { label: 'Tax Sync', value: 'Auto' }
    ]
  },
  { 
    id: 'sup_agent', 
    name: 'GUARDIAN', 
    role: 'Support', 
    icon: ShieldCheck, 
    status: 'Running',
    desc: 'Resolves customer tickets using University knowledge base.',
    missions: 245,
    color: '#06b6d4',
    settings: [
      { label: 'Confidence min', value: '90%' },
      { label: 'Escalation', value: 'Immediate' },
      { label: 'Language', value: 'Auto-detect' }
    ]
  },
  { 
    id: 'out_agent', 
    name: 'DIALER', 
    role: 'Outbound', 
    icon: Smartphone, 
    status: 'Standby',
    desc: 'Automates cold outreach volume and lead verification.',
    missions: 812,
    color: '#f97316',
    settings: [
      { label: 'Dial Speed', value: '1x' },
      { label: 'VM Drop', value: 'Enabled' },
      { label: 'Lead Sifting', value: 'Active' }
    ]
  },
  { 
    id: 'uni_agent', 
    name: 'MENTOR', 
    role: 'University', 
    icon: Brain, 
    status: 'Running',
    desc: 'Summarizes training content and answers process questions.',
    missions: 67,
    color: '#a855f7',
    settings: [
      { label: 'Detail Level', value: 'High' },
      { label: 'Quiz Gen', value: 'Enabled' },
      { label: 'Memory', value: 'Global' }
    ]
  },
  { 
    id: 'id_agent', 
    name: 'RESIDENTIAL-50', 
    role: 'Identity', 
    icon: Fingerprint, 
    status: 'Running',
    desc: 'Automates human behavior to warm up anti-detect profiles.',
    missions: 1542,
    color: '#ec4899',
    settings: [
      { label: 'Task Frequency', value: 'High' },
      { label: 'Search Patterns', value: 'Localized' },
      { label: 'ISO-Shield', value: 'Max' }
    ]
  }
];


const Automation = () => {
  const [agents, setAgents] = useState(AGENT_FLEET);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  const toggleStatus = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Running' ? 'Standby' : 'Running' } : a));
  };

  return (
    <div className="page-container" style={{ background: '#050505', minHeight: '100vh', padding: '40px' }}>
      
      {/* HEADER */}
      <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
         <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
               <Brain size={24} color="#6366f1" />
               <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#6366f1', letterSpacing: '2px' }}>AUTONOMOUS CORE</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>Agent Command Center</h1>
            <p style={{ color: '#475569', fontSize: '1rem', marginTop: '10px' }}>Manage and adjust your fleet of specialty AI workers.</p>
         </div>
         <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid #10b98144', padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }}></div>
               <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>ENGINE STATUS: OPTIMAL</span>
            </div>
         </div>
      </header>

      {/* AGENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
         {agents.map(agent => (
           <motion.div 
             key={agent.id}
             whileHover={{ y: -5 }}
             style={{ 
               background: '#0a0a0c', 
               border: '1px solid #1f1f27', 
               borderRadius: '24px', 
               padding: '32px',
               position: 'relative',
               overflow: 'hidden'
             }}
           >
              {/* STATUS BAR */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: agent.color, opacity: agent.status === 'Running' ? 1 : 0.2 }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                 <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${agent.color}11`, border: `1px solid ${agent.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <agent.icon size={28} color={agent.color} />
                 </div>
                 <div onClick={() => toggleStatus(agent.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: agent.status === 'Running' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: agent.status === 'Running' ? '1px solid #10b98133' : '1px solid #ffffff11' }}>
                    {agent.status === 'Running' ? <Pause size={12} color="#10b981" /> : <Play size={12} color="#94a3b8" />}
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: agent.status === 'Running' ? '#10b981' : '#94a3b8' }}>{agent.status.toUpperCase()}</span>
                 </div>
              </div>

              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'white', fontWeight: 900 }}>{agent.name}</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>{agent.role.toUpperCase()} AGENT</p>
              <p style={{ margin: '0 0 32px 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>{agent.desc}</p>

              <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
                 <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{agent.missions}</div>
                    <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 900, letterSpacing: '1px' }}>MISSIONS COMPLETED</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6366f1' }}>99.8%</div>
                    <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 900, letterSpacing: '1px' }}>ACCURACY RATE</div>
                 </div>
              </div>

              <button 
                onClick={() => { setSelectedAgent(agent); setShowConfig(true); }}
                style={{ width: '100%', height: '48px', background: '#121217', border: '1px solid #1f1f27', borderRadius: '12px', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                 <Sliders size={16} color={agent.color} /> Adjust Neural Settings
              </button>
           </motion.div>
         ))}
      </div>

      {/* CONFIGURATION DRAWER */}
      <AnimatePresence>
        {showConfig && selectedAgent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', justifyContent: 'flex-end' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
               onClick={() => setShowConfig(false)}
             />
             <motion.div 
               initial={{ x: 600 }} animate={{ x: 0 }} exit={{ x: 600 }}
               style={{ position: 'relative', width: '500px', height: '100%', background: '#0a0a0c', borderLeft: '1px solid #1f1f27', padding: '48px', display: 'flex', flexDirection: 'column' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${selectedAgent.color}11`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <selectedAgent.icon size={24} color={selectedAgent.color} />
                      </div>
                      <div>
                         <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>{selectedAgent.name}</h2>
                         <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem' }}>Neural Configuration</p>
                      </div>
                   </div>
                   <X size={24} color="#475569" style={{ cursor: 'pointer' }} onClick={() => setShowConfig(false)} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   {selectedAgent.settings.map((setting, i) => (
                     <div key={i}>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#475569', fontWeight: 900, marginBottom: '12px', letterSpacing: '1px' }}>{setting.label.toUpperCase()}</label>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#121217', borderRadius: '12px', border: '1px solid #1f1f27' }}>
                           <span style={{ color: 'white', fontWeight: 600 }}>{setting.value}</span>
                           <ChevronRight size={16} color="#475569" />
                        </div>
                     </div>
                   ))}

                   <div style={{ marginTop: 'auto', background: 'rgba(99,102,241,0.05)', border: '1px solid #6366f133', borderRadius: '16px', padding: '24px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                         <Cpu size={16} color="#6366f1" />
                         <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>NEURAL LOGS</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#475569', fontFamily: 'monospace', lineHeight: 1.6 }}>
                         [LOG] Intent detected: "Wants pricing" <br/>
                         [LOG] Action: Forwarded to THE CLOSER <br/>
                         [LOG] Profile: Identity-04 (New York) <br/>
                         [LOG] Status: Logic synchronized
                      </div>
                   </div>

                   <button onClick={() => setShowConfig(false)} style={{ width: '100%', height: '56px', background: selectedAgent.color, border: 'none', borderRadius: '16px', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', marginTop: '24px', boxShadow: `0 10px 30px ${selectedAgent.color}33` }}>
                      Save Adjustments
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e1e24; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Automation;
