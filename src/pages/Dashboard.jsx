import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Activity, ArrowUpRight, DollarSign, 
  GripVertical, Layout, Settings, RefreshCcw, Shield, Server, Zap
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
import './Dashboard.css';

const Dashboard = () => {
  const [widgets, setWidgets] = useState([
    { id: 'shield-monitor', type: 'shield', title: 'Global Shield Status' },
    { id: 'kpi-mrr', type: 'kpi', title: 'Predictive MRR', value: '$124,500', trend: '+14.2%', icon: DollarSign, color: 'positive' },
    { id: 'kpi-contacts', type: 'kpi', title: 'Active Contacts', value: '8,432', trend: '+5.1%', icon: Users, color: 'positive' },
    { id: 'kpi-conversion', type: 'kpi', title: 'Conversion Rate', value: '24.8%', trend: '-2.4%', icon: Activity, color: 'negative' },
    { id: 'chart-revenue', type: 'chart', title: 'Revenue Forecast (AI Projected)' },
    { id: 'feed-activity', type: 'feed', title: 'Live Activity Pulse' }
  ]);

  // Load order from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('dashboard-widget-order');
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        const reorderedWidgets = orderIds.map(id => widgets.find(w => w.id === id)).filter(Boolean);
        // Add any new widgets that weren't in the saved order
        const newWidgets = widgets.filter(w => !orderIds.includes(w.id));
        setWidgets([...reorderedWidgets, ...newWidgets]);
      } catch (e) {
        console.error('Failed to load widget order', e);
      }
    }
  }, []);

  // Save order to localStorage
  useEffect(() => {
    localStorage.setItem('dashboard-widget-order', JSON.stringify(widgets.map(w => w.id)));
  }, [widgets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'kpi':
        return (
          <div className="glass-panel kpi-card" style={{ height: '100%' }}>
            <div className="kpi-icon"><widget.icon size={24} /></div>
            <div className="kpi-info">
              <h3>{widget.title}</h3>
              <p className="kpi-value">{widget.value}</p>
              <span className={`kpi-trend ${widget.color}`}>
                <ArrowUpRight size={16} /> {widget.trend}
              </span>
            </div>
          </div>
        );
      case 'chart':
        return (
          <div className="glass-panel chart-area" style={{ height: '100%' }}>
            <h3>{widget.title}</h3>
            <div className="chart-placeholder">
              {[40, 55, 45, 70, 85, 60, 95].map((h, i) => (
                <div key={i} className="bar" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        );
      case 'feed':
        return (
          <div className="glass-panel activity-feed" style={{ height: '100%' }}>
            <h3>{widget.title}</h3>
            <ul className="feed-list">
              <li>
                <span className="dot" style={{ background: '#10b981' }}></span>
                <div className="feed-content">
                  <p><strong>Sarah Jenkins</strong> closed a $15,000 deal.</p>
                  <span className="time">2 mins ago</span>
                </div>
              </li>
              <li>
                <span className="dot" style={{ background: '#3b82f6' }}></span>
                <div className="feed-content">
                  <p><strong>Mark D.</strong> booked a consultation.</p>
                  <span className="time">14 mins ago</span>
                </div>
              </li>
              <li>
                <span className="dot" style={{ background: '#f59e0b' }}></span>
                <div className="feed-content">
                  <p>New inbound lead from LinkedIn.</p>
                  <span className="time">1 hour ago</span>
                </div>
              </li>
            </ul>
          </div>
        );
      case 'shield':
        return (
          <div className="glass-panel" style={{ height: '100%', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <h3 style={{ margin: 0 }}>{widget.title}</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid #10b98133' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                  <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800 }}>ENGINE ONLINE</span>
               </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
               <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '8px' }}>ACTIVE SPOOFING</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Zap size={14} color="#6366f1" />
                     <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>New York, NY</span>
                  </div>
               </div>
               <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '8px' }}>NATIVE SESSIONS</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Server size={14} color="#10b981" />
                     <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>4 Active</span>
                  </div>
               </div>
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Shield size={14} color="#6366f1" />
               ISO-Shield Protection Level: <span style={{ color: '#10b981', fontWeight: 800 }}>PROFESSIONAL</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Modular Dashboard</h1>
          <p className="page-subtitle">Drag and drop widgets to customize your workspace.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-button" onClick={() => localStorage.removeItem('dashboard-widget-order')}>
            <RefreshCcw size={16} /> Reset Layout
          </button>
          <button className="glass-button primary">Generate Report</button>
        </div>
      </header>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={widgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="dashboard-grid">
            {widgets.map((widget) => (
              <DraggableWidget 
                key={widget.id} 
                id={widget.id}
                className={widget.type === 'kpi' ? '' : widget.type}
              >
                {renderWidget(widget)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Dashboard;
