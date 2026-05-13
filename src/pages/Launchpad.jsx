import React, { useState, useEffect } from 'react';
import { 
  Rocket, CheckCircle2, ArrowRight, Smartphone, MessageSquare, Zap, 
  Globe, Mail, Phone, CreditCard, Users, Shield, Wifi, Database,
  BarChart2, Share2, AtSign, Radio,
  Building2, Star, MapPin, Bell, Lock, Key, RefreshCcw, ExternalLink,
  Cpu, Brain, ChevronRight, Circle
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableWidget from '../components/DraggableWidget';
import { motion } from 'framer-motion';

const WIDGET_GROUPS = [
  {
    id: 'core',
    label: 'Core Setup',
    description: 'Essential integrations to get your CRM operational.',
    widgets: [
      { id: 'app', title: 'Mobile App', icon: Smartphone, color: '#6366f1', desc: 'Install the native iOS/Android app for on-the-go lead management.', status: 'pending', tag: 'FREE' },
      { id: 'google', title: 'Google My Business', icon: Star, color: '#f59e0b', desc: 'Connect your GMB accounts to sync reviews and local search data.', status: 'completed', tag: 'CONNECTED' },
      { id: 'chat', title: 'Web Chat', icon: MessageSquare, color: '#10b981', desc: 'Install the live chat widget on your website to capture instant leads.', status: 'pending', tag: 'FREE' },
      { id: 'domain', title: 'Custom Domain', icon: Globe, color: '#6366f1', desc: 'Connect your business domain to brand all outbound communications.', status: 'pending', tag: 'REQUIRED' },
    ]
  },
  {
    id: 'social',
    label: 'Social & Messaging',
    description: 'Connect your social channels to the zero-subscription bridge.',
    widgets: [
      { id: 'whatsapp', title: 'WhatsApp Business', icon: Phone, color: '#25D366', desc: 'Route WhatsApp DMs through the native bridge for automated replies.', status: 'pending', tag: 'BRIDGE' },
      { id: 'instagram', title: 'Instagram DMs', icon: Instagram, color: '#E1306C', desc: 'Sync Instagram direct messages to your unified conversation thread.', status: 'pending', tag: 'BRIDGE' },
      { id: 'facebook', title: 'Facebook Pages', icon: Facebook, color: '#1877F2', desc: 'Manage Facebook messages and ad leads directly in your inbox.', status: 'pending', tag: 'BRIDGE' },
      { id: 'twitter', title: 'X / Twitter', icon: Twitter, color: '#1DA1F2', desc: 'Monitor mentions and DMs and route them into your CRM pipeline.', status: 'pending', tag: 'OPTIONAL' },
    ]
  },
  {
    id: 'email',
    label: 'Email & Outbound',
    description: 'Configure email routing and outbound automation.',
    widgets: [
      { id: 'microsoft', title: 'Microsoft 365', icon: Mail, color: '#0078D4', desc: 'Connect Outlook aliases for high-volume outbound with anti-spam trust.', status: 'completed', tag: 'CONNECTED' },
      { id: 'smtp', title: 'SMTP / Relay', icon: Share2, color: '#6366f1', desc: 'Configure custom SMTP relay for deliverability optimization.', status: 'pending', tag: 'ADVANCED' },
      { id: 'sequences', title: 'Email Sequences', icon: RefreshCcw, color: '#10b981', desc: 'Set up automated multi-step nurture sequences for leads.', status: 'pending', tag: 'AI-POWERED' },
    ]
  },
  {
    id: 'billing',
    label: 'Billing & Payments',
    description: 'Set up payment processing and invoice automation.',
    widgets: [
      { id: 'stripe', title: 'Stripe', icon: CreditCard, color: '#635BFF', desc: 'Accept online payments and automate recurring billing for your clients.', status: 'pending', tag: 'REQUIRED' },
      { id: 'invoicing', title: 'Invoice Engine', icon: Database, color: '#f59e0b', desc: 'Auto-generate branded invoices with IP-geolocation tax compliance.', status: 'pending', tag: 'BUILT-IN' },
    ]
  },
  {
    id: 'ai',
    label: 'AI & Automation',
    description: 'Activate the intelligence layer for your operations.',
    widgets: [
      { id: 'omni-ai', title: 'Omni Brain AI', icon: Brain, color: '#6366f1', desc: 'Activate the local AI engine for zero-cost conversation automation.', status: 'completed', tag: 'ACTIVE' },
      { id: 'enrichment', title: 'Lead Enrichment', icon: Zap, color: '#10b981', desc: 'Auto-enrich contacts using the Local Stealth Browser scraper.', status: 'pending', tag: 'FREE' },
      { id: 'yext', title: 'Yext / Listings', icon: MapPin, color: '#f59e0b', desc: 'Sync your business listings across 100+ directories automatically.', status: 'pending', tag: 'OPTIONAL' },
      { id: 'analytics', title: 'Analytics & Reports', icon: BarChart2, color: '#6366f1', desc: 'Connect your tracking pixels and generate automated performance reports.', status: 'pending', tag: 'BUILT-IN' },
    ]
  },
];

const ALL_WIDGETS = WIDGET_GROUPS.flatMap(g => g.widgets);

const StatusBadge = ({ tag, status }) => {
  const colors = {
    CONNECTED: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
    ACTIVE: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
    FREE: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', border: 'rgba(99,102,241,0.2)' },
    BRIDGE: { bg: 'rgba(99,102,241,0.1)', color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
    REQUIRED: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
    ADVANCED: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    'AI-POWERED': { bg: 'rgba(99,102,241,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
    'BUILT-IN': { bg: 'rgba(16,185,129,0.05)', color: '#475569', border: 'rgba(71,85,105,0.2)' },
    OPTIONAL: { bg: 'rgba(71,85,105,0.1)', color: '#475569', border: 'rgba(71,85,105,0.2)' },
  };
  const style = colors[tag] || colors.OPTIONAL;
  return (
    <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', padding: '2px 7px', borderRadius: '99px', background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
      {tag}
    </span>
  );
};

const Launchpad = () => {
  const [widgetStates, setWidgetStates] = useState(() => {
    const saved = localStorage.getItem('launchpad-widget-states');
    if (saved) try { return JSON.parse(saved); } catch(e) {}
    return Object.fromEntries(ALL_WIDGETS.map(w => [w.id, w.status]));
  });

  const completed = Object.values(widgetStates).filter(s => s === 'completed').length;
  const total = ALL_WIDGETS.length;
  const progress = Math.round((completed / total) * 100);

  const toggleStatus = (id) => {
    setWidgetStates(prev => {
      const next = { ...prev, [id]: prev[id] === 'completed' ? 'pending' : 'completed' };
      localStorage.setItem('launchpad-widget-states', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#08080a', padding: '40px', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2rem', margin: 0, marginBottom: '8px' }}>
            <Rocket size={28} color="#6366f1" /> MISSION.CONTROL
          </h1>
          <p style={{ color: '#475569', margin: 0 }}>Complete these core integrations to unlock the full power of your CRM.</p>
        </div>

        {/* Progress Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
          <div style={{ position: 'relative', width: '72px', height: '72px' }}>
            <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="36" cy="36" r="30" fill="none" stroke="#1f1f27" strokeWidth="6" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="#6366f1" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, color: 'white' }}>
              {progress}%
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>{completed}/{total} COMPLETE</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: '#1f1f27', borderRadius: '99px', marginBottom: '48px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #4f46e5, #6366f1, #818cf8)', borderRadius: '99px' }} 
        />
      </div>

      {/* Groups */}
      {WIDGET_GROUPS.map((group, gi) => (
        <motion.div 
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.07, duration: 0.4 }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1rem', margin: 0 }}>{group.label}</h2>
            <div style={{ flex: 1, height: '1px', background: '#1f1f27' }} />
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>
              {group.widgets.filter(w => widgetStates[w.id] === 'completed').length}/{group.widgets.length} done
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '20px', marginTop: 0 }}>{group.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {group.widgets.map((w) => {
              const isDone = widgetStates[w.id] === 'completed';
              return (
                <motion.div
                  key={w.id}
                  whileHover={{ y: -2, boxShadow: `0 12px 40px rgba(0,0,0,0.4)` }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: '#0a0a0c',
                    border: isDone ? '1px solid rgba(16,185,129,0.25)' : '1px solid #1f1f27',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glow accent */}
                  {isDone && (
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 16px 0 80px', background: 'rgba(16,185,129,0.04)', pointerEvents: 'none' }} />
                  )}

                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${w.color}15`, border: `1px solid ${w.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <w.icon size={22} color={w.color} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge tag={w.tag} />
                      {isDone 
                        ? <CheckCircle2 size={18} color="#10b981" /> 
                        : <Circle size={18} color="#2d2d3f" />
                      }
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', margin: '0 0 6px' }}>{w.title}</h3>
                    <p style={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => toggleStatus(w.id)}
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: isDone ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(99,102,241,0.3)',
                      background: isDone ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.12)',
                      color: isDone ? '#10b981' : '#818cf8',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      letterSpacing: '0.04em',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isDone ? <><CheckCircle2 size={14} /> Connected</> : <><ArrowRight size={14} /> Connect Now</>}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Footer CTA */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '48px', background: 'radial-gradient(circle at center, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '24px', border: '1px solid rgba(99,102,241,0.2)', marginTop: '24px' }}
        >
          <Rocket size={48} color="#6366f1" style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px' }}>All Systems Go.</h3>
          <p style={{ color: '#475569', marginBottom: '24px' }}>Every integration is live. Your CRM is operating at full capacity.</p>
          <button style={{ background: '#6366f1', border: 'none', padding: '12px 32px', borderRadius: '12px', color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
            Launch Dashboard →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Launchpad;
