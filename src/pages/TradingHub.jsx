import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Zap, Target, BookOpen, 
  ExternalLink, ArrowUpRight, Shield, Activity,
  LineChart, MousePointer2, AlertCircle
} from 'lucide-react';

const STRATEGIES = [
  {
    id: 'silver-bullet',
    name: 'ICT Silver Bullet',
    time: '10:00 AM - 11:00 AM EST',
    description: 'High-probability scalp focusing on Fair Value Gaps after morning liquidity sweeps.',
    icon: Zap,
    color: '#6366f1',
    winRate: '75%'
  },
  {
    id: 'orb-breakout',
    name: 'Opening Range Breakout',
    time: '9:30 AM - 9:35 AM EST',
    description: 'Momentum strategy trading the break of the first 5-minute candle range.',
    icon: Target,
    color: '#f59e0b',
    winRate: '60%'
  },
  {
    id: 'renko-ichimoku',
    name: 'Renko Ichimoku Pro',
    time: 'Any Trend Session',
    description: 'Trend-following system using Uni Renko bars and Ichimoku Cloud for noise reduction.',
    icon: TrendingUp,
    color: '#10b981',
    winRate: '70%'
  }
];

const TradingHub = () => {
  const [activeStrategy, setActiveStrategy] = useState(STRATEGIES[0]);

  return (
    <div className="page-container" style={{ padding: '32px', background: '#050505', height: '100vh', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Trading <span style={{ color: 'var(--accent-color)' }}>Hub</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Global Markets Command Center & NinjaTrader Integration</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => window.open('https://tradetheticker.com', '_blank')}
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16,185,129,0.2)'
            }}
          >
            <ExternalLink size={18} /> OPEN NINJATRADER WEB
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        
        {/* MAIN CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* STRATEGY SELECTOR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {STRATEGIES.map(strat => (
              <motion.div 
                key={strat.id}
                whileHover={{ y: -5 }}
                onClick={() => setActiveStrategy(strat)}
                style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeStrategy.id === strat.id ? strat.color : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '24px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeStrategy.id === strat.id ? `0 12px 32px ${strat.color}15` : 'none'
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '14px', 
                  background: `${strat.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <strat.icon size={24} color={strat.color} />
                </div>
                <h3 style={{ color: 'white', marginBottom: '8px' }}>{strat.name}</h3>
                <div style={{ fontSize: '0.75rem', color: strat.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                  {strat.time}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ACTIVE STRATEGY DETAILS */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: activeStrategy.color, opacity: 0.05, filter: 'blur(100px)' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '12px' }}>{activeStrategy.name} Strategy</h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>{activeStrategy.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: activeStrategy.color }}>{activeStrategy.winRate}</div>
                <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>HISTORICAL WIN RATE</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div style={{ background: '#0a0a0c', border: '1px solid #1a1a24', borderRadius: '20px', padding: '24px' }}>
                <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Shield size={16} color="#6366f1" /> Risk Management
                </h4>
                <ul style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Max Daily Loss: $250 (Prop Firm Safe)</li>
                  <li>Position Size: 1-2 Contracts (NQ/ES)</li>
                  <li>Automated Stop Loss: 15 Ticks</li>
                </ul>
              </div>
              <div style={{ background: '#0a0a0c', border: '1px solid #1a1a24', borderRadius: '20px', padding: '24px' }}>
                <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Activity size={16} color="#10b981" /> Execution Status
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontWeight: 600 }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                  NINJASCRIPT BRIDGE READY
                </div>
                <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '12px' }}>Local script detected: RenkoIchimokuPro.cs</p>
              </div>
            </div>
          </div>

        </div>

        {/* SIDEBAR - MARKET PULSE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <LineChart size={18} color="var(--accent-color)" /> Market Pulse
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '16px', background: '#0a0a0c', border: '1px solid #1a1a24', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>NASDAQ 100</div>
                  <div style={{ color: 'white', fontWeight: 800 }}>NQ Futures</div>
                </div>
                <div style={{ color: '#10b981', fontWeight: 700 }}>+1.2%</div>
              </div>
              <div style={{ padding: '16px', background: '#0a0a0c', border: '1px solid #1a1a24', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>S&P 500</div>
                  <div style={{ color: 'white', fontWeight: 800 }}>ES Futures</div>
                </div>
                <div style={{ color: '#10b981', fontWeight: 700 }}>+0.5%</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BookOpen size={18} color="#6366f1" /> Strategy Docs
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2d2d3f', borderRadius: '12px', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer' }}>
                View Backtest Data (ES)
              </button>
              <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2d2d3f', borderRadius: '12px', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer' }}>
                Risk Calculator Manual
              </button>
            </div>
          </div>

          {/* QUICK ALERT */}
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '24px', padding: '24px' }}>
             <div style={{ display: 'flex', gap: '12px' }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div>
                   <h4 style={{ color: '#f59e0b', margin: 0, marginBottom: '8px', fontSize: '0.9rem' }}>Prop Firm Alert</h4>
                   <p style={{ margin: 0, color: '#f59e0b', fontSize: '0.75rem', opacity: 0.8, lineHeight: '1.4' }}>
                     NY Open in 45 mins. Ensure all 50 city browsers are synced if running Multi-Account arbitrage.
                   </p>
                </div>
             </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TradingHub;
