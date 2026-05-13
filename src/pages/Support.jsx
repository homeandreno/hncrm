import React, { useState, useEffect } from 'react';
import { LifeBuoy, Bot, User, CheckCircle, List } from 'lucide-react';
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

const Support = () => {
  const INITIAL_WIDGETS = [
    { id: 'metrics', title: 'Ticket Deflection' },
    { id: 'monitor', title: 'Live Resolution Monitor' }
  ];

  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  useEffect(() => {
    const savedOrder = localStorage.getItem('support-order');
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
        localStorage.setItem('support-order', JSON.stringify(updated.map(w => w.id)));
        return updated;
      });
    }
  };

  const renderWidgetContent = (id) => {
    if (id === 'metrics') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
         <h2 style={{ fontSize: '4rem', color: '#10b981', margin: '20px 0', fontWeight: 900 }}>84%</h2>
         <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>Of all incoming queries were resolved by the AI agent without human intervention today.</p>
         
         <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <h4 style={{ color: 'white', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Queue Status</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: '#475569' }}>AI Handling</span> <span style={{ color: '#10b981', fontWeight: 700 }}>14 Active</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: '#475569' }}>Human Queue</span> <span style={{ color: '#f59e0b', fontWeight: 700 }}>3 Waiting</span></li>
            </ul>
         </div>
      </div>
    );

    if (id === 'monitor') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: '16px' }}>
         {[
           { q: "How do I reset my API key?", time: "Just now", res: "AI provided link to security settings.", color: "#10b981", status: "RESOLVED" },
           { q: "Billing shows double charge", time: "5 mins ago", res: "Confidence score 42%. Triggered handoff.", color: "#f59e0b", status: "HUMAN QUEUE" }
         ].map((item, idx) => (
           <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', borderLeft: `4px solid ${item.color}`, border: '1px solid #1f1f27' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong style={{ color: 'white', fontSize: '0.9rem' }}>"{item.q}"</strong>
                <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 800 }}>{item.time}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                 <Bot size={16} color="#6366f1" style={{ marginTop: '2px' }} />
                 <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>{item.res} <span style={{ color: item.color, fontWeight: 800, fontSize: '0.65rem', marginLeft: '8px' }}>[{item.status}]</span></p>
              </div>
           </div>
         ))}
      </div>
    );
  };

  return (
    <div className="page-container" style={{ background: '#08080a', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontWeight: 900, color: 'white' }}>HELPDESK.MONITOR</h1>
          <p className="page-subtitle" style={{ color: '#475569' }}>RAG AI Agent deflection active. Human handoff at 70% threshold.</p>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px' }}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((w) => (
              <DraggableWidget key={w.id} id={w.id}>
                <div className="glass-panel" style={{ padding: '32px', height: '100%', minHeight: '450px', display: 'flex', flexDirection: 'column', cursor: 'grab', background: '#0a0a0c', border: '1px solid #1f1f27' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                     <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>{w.title}</h3>
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

export default Support;
