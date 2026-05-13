import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Globe, List } from 'lucide-react';
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

const Payments = () => {
  const INITIAL_WIDGETS = [
    { id: 'stats', title: 'Financial Overview' },
    { id: 'invoices', title: 'Recent Smart Invoices' }
  ];

  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  useEffect(() => {
    const savedOrder = localStorage.getItem('payments-order');
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
        localStorage.setItem('payments-order', JSON.stringify(updated.map(w => w.id)));
        return updated;
      });
    }
  };

  const renderWidgetContent = (id) => {
    if (id === 'stats') return (
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', padding: '20px' }}>
         <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Outstanding</p>
            <h2 style={{ fontSize: '2.5rem', color: '#f59e0b', marginTop: '8px', fontWeight: 900 }}>$14,200</h2>
         </div>
         <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.05)' }}></div>
         <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Collected</p>
            <h2 style={{ fontSize: '2.5rem', color: '#10b981', marginTop: '8px', fontWeight: 900 }}>$48,500</h2>
         </div>
         <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.05)' }}></div>
         <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Subs</p>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginTop: '8px', fontWeight: 900 }}>142</h2>
         </div>
      </div>
    );

    if (id === 'invoices') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <table className="glass-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#475569', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
              <th style={{ padding: '16px' }}>Client</th>
              <th style={{ padding: '16px' }}>Amount</th>
              <th style={{ padding: '16px' }}>Region</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}></th>
            </tr>
          </thead>
          <tbody>
            {[
              { client: 'TechNova', amount: '$1,200', region: 'USD (US)', status: 'Paid', statusClass: 'active' },
              { client: 'DesignCo', amount: '€850', region: 'EUR (FR)', status: 'Pending', statusClass: 'lead' }
            ].map((inv, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '20px 16px', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{inv.client}</td>
                <td style={{ padding: '20px 16px', color: 'white', fontSize: '0.9rem' }}>{inv.amount}</td>
                <td style={{ padding: '20px 16px', color: '#475569', fontSize: '0.8rem' }}><Globe size={12} style={{ marginRight: '6px', display: 'inline' }} /> {inv.region}</td>
                <td style={{ padding: '20px 16px' }}><span className={`status-badge ${inv.statusClass}`} style={{ fontSize: '0.65rem' }}>{inv.status}</span></td>
                <td style={{ padding: '20px 16px' }}><button className="icon-btn"><Download size={16} color="#475569" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ background: '#08080a', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontWeight: 900, color: 'white' }}>GLOBAL.BILLING</h1>
          <p className="page-subtitle" style={{ color: '#475569' }}>IP-Geolocation pricing and automated tax compliance active.</p>
        </div>
        <button className="glass-button primary" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '10px', height: '40px', padding: '0 20px', color: 'white', fontWeight: 700 }}>
          <CreditCard size={16} style={{ display: 'inline', marginRight: '8px' }} /> Create Invoice
        </button>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((w) => (
              <DraggableWidget key={w.id} id={w.id}>
                <div className="glass-panel" style={{ padding: '0', minHeight: w.id === 'stats' ? '180px' : '400px', display: 'flex', flexDirection: 'column', cursor: 'grab', background: '#0a0a0c', border: '1px solid #1f1f27', overflow: 'hidden' }}>
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

export default Payments;
