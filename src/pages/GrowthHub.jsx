import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, Briefcase, Share2, Server, List } from 'lucide-react';
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

const GrowthHub = () => {
  const INITIAL_WIDGETS = [
    { id: 'upgrades', title: 'Usage & Upgrades', icon: ArrowUpCircle, color: '#f59e0b' },
    { id: 'marketplace', title: 'App & Service Marketplace', icon: Briefcase, color: '#10b981' },
    { id: 'affiliate', title: 'Affiliate Portal', icon: Share2, color: '#3b82f6' }
  ];

  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  useEffect(() => {
    const savedOrder = localStorage.getItem('growth-hub-order');
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        const reordered = orderIds.map(id => INITIAL_WIDGETS.find(w => w.id === id)).filter(Boolean);
        setWidgets(reordered);
      } catch (e) {}
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const updated = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('growth-hub-order', JSON.stringify(updated.map(w => w.id)));
        return updated;
      });
    }
  };

  const renderWidgetContent = (id) => {
    if (id === 'upgrades') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>Monitor hardware usage and purchase add-ons.</p>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}><span>Database Storage</span><span>8.5 GB / 10 GB</span></div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '85%', height: '100%', background: '#f59e0b' }}></div></div>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}><span>API Requests (Monthly)</span><span>45k / 50k</span></div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '90%', height: '100%', background: '#ef4444' }}></div></div>
        </div>
        <button className="glass-button primary" style={{ marginTop: 'auto' }}>Manage Plan</button>
      </div>
    );

    if (id === 'marketplace') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>One-click APIs and done-for-you professional services.</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <li style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><strong style={{ fontSize: '0.9rem' }}>Logo Design Package</strong><span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Done-for-you creative</span></div>
            <span style={{ fontWeight: 'bold' }}>$299</span>
          </li>
          <li style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><strong style={{ fontSize: '0.9rem' }}>Advanced SEO Setup</strong><span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>One-time configuration</span></div>
            <span style={{ fontWeight: 'bold' }}>$499</span>
          </li>
        </ul>
        <button className="glass-button" style={{ marginTop: 'auto' }}>Browse Catalog</button>
      </div>
    );

    if (id === 'affiliate') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>Deep-link tracking and automated Stripe Connect payouts.</p>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: '4px' }}>Your Pending Commissions</p>
          <h2 style={{ fontSize: '2rem', color: '#fff' }}>$1,450.00</h2>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Your Referral Link</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" className="glass-input" value="https://hnreno.com/ref/benko42" readOnly style={{ flex: 1, fontSize: '0.8rem' }} />
            <button className="glass-button">Copy</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ overflowY: 'auto', background: '#08080a' }}>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontWeight: 900, color: 'white' }}>GROWTH.HUB</h1>
          <p className="page-subtitle" style={{ color: '#475569' }}>Unified dashboard for Upgrades, Services, and Referrals.</p>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((w) => (
              <DraggableWidget key={w.id} id={w.id}>
                <div className="glass-panel" style={{ padding: '24px', height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', cursor: 'grab' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <w.icon size={24} color={w.color} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>{w.title}</h3>
                  </div>
                  {renderWidgetContent(w.id)}
                </div>
              </DraggableWidget>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default GrowthHub;
