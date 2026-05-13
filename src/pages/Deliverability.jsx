import React, { useState } from 'react';
import { ShieldCheck, Zap, Mail, AlertTriangle, CheckCircle, Info, Copy, BarChart3, Clock, Globe } from 'lucide-react';

const Deliverability = () => {
  const [domain, setDomain] = useState('yourdomain.com');
  const [activeTab, setActiveTab] = useState('dns');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const DNS_RECORDS = [
    { type: 'SPF', host: '@', value: `v=spf1 include:_spf.google.com ~all`, desc: 'Authorizes your server IP to send mail.' },
    { type: 'DKIM', host: 'google._domainkey', value: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgK...', desc: 'Digital signature that proves you sent the email.' },
    { type: 'DMARC', host: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:admin@' + domain, desc: 'Tells filters what to do if SPF/DKIM fails.' }
  ];

  return (
    <div className="page-container" style={{ background: '#050505', color: 'white', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #10b981' }}>
              <ShieldCheck color="#10b981" size={24} />
           </div>
           <div>
              <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>DELIVERABILITY.CENTER</h1>
              <p className="page-subtitle" style={{ color: '#475569' }}>Technical domain hardening for 99.9% inbox rates.</p>
           </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        
        {/* LEFT: TECHNICAL SETUP */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                 <label style={{ display: 'block', fontSize: '0.65rem', color: '#475569', fontWeight: 900, marginBottom: '8px' }}>TARGET DOMAIN</label>
                 <input className="glass-input" style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }} value={domain} onChange={e => setDomain(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
                 <button onClick={() => setActiveTab('dns')} style={{ flex: 1, height: '40px', background: activeTab === 'dns' ? '#10b981' : '#1a1a24', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>DNS RECORDS</button>
                 <button onClick={() => setActiveTab('warmup')} style={{ flex: 1, height: '40px', background: activeTab === 'warmup' ? '#6366f1' : '#1a1a24', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>WARM-UP SCHEDULE</button>
              </div>

              {activeTab === 'dns' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {DNS_RECORDS.map(record => (
                     <div key={record.type} style={{ padding: '20px', background: '#050505', borderRadius: '14px', border: '1px solid #1f1f27' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                           <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{record.type}</span>
                           <span style={{ fontSize: '0.7rem', color: '#475569' }}>Host: {record.host}</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                           <code style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', background: '#0a0a0c', padding: '12px', borderRadius: '8px', overflowX: 'auto', border: '1px solid #1a1a24', marginBottom: '10px' }}>{record.value}</code>
                           <button onClick={() => copyToClipboard(record.value)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer' }}><Copy size={14} /></button>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#475569', margin: 0 }}>{record.desc}</p>
                     </div>
                   ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   {[
                     { day: '1-3', count: '5 emails', task: 'Direct replies only' },
                     { day: '4-7', count: '15 emails', task: 'Neutral content' },
                     { day: '8-14', count: '30 emails', task: 'Include links' },
                     { day: '15-30', count: '50+ emails', task: 'Full automation' }
                   ].map((item, i) => (
                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', border: '1px solid #6366f122' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>D{item.day}</div>
                        <div style={{ flex: 1 }}>
                           <h4 style={{ margin: 0, fontSize: '0.85rem' }}>{item.count} / day</h4>
                           <p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>{item.task}</p>
                        </div>
                        <CheckCircle size={16} color="#475569" />
                     </div>
                   ))}
                </div>
              )}
           </div>
        </section>

        {/* RIGHT: HEALTH MONITOR */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '24px' }}>
              <h3 style={{ marginBottom: '24px', fontSize: '0.9rem', fontWeight: 800 }}>Domain Health Score</h3>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                 <div style={{ position: 'relative', display: 'inline-block' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                       <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a24" strokeWidth="12" />
                       <circle cx="60" cy="60" r="54" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="339" strokeDashoffset="85" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>75%</div>
                 </div>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', listStyle: 'none', padding: 0 }}>
                 <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: '#475569' }}>SSL Certificate</span> <span style={{ color: '#10b981' }}>Valid</span></li>
                 <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: '#475569' }}>MX Routing</span> <span style={{ color: '#10b981' }}>Optimized</span></li>
                 <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: '#475569' }}>Spamhaus Check</span> <span style={{ color: '#10b981' }}>Clean</span></li>
                 <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: '#475569' }}>PTR / Reverse DNS</span> <span style={{ color: '#ef4444' }}>Missing</span></li>
              </ul>
           </div>

           <div className="glass-panel" style={{ padding: '32px', background: '#0a0a0c', border: '1px solid #f59e0b33', borderRadius: '24px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                 <AlertTriangle size={16} color="#f59e0b" />
                 <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b' }}>CRITICAL RECOMMENDATION</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                 Avoid using "Tracking Pixels" for the first 14 days of your new domain. Google uses them as a signature to identify and block new bulk senders.
              </p>
           </div>
        </section>

      </div>
    </div>
  );
};

export default Deliverability;
