import React, { useState, useEffect } from 'react';
import { PhoneCall, Mic, ShieldAlert, FastForward, List } from 'lucide-react';
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

const Outbound = () => {
  const INITIAL_WIDGETS = [
    { id: 'dialer', title: 'Power Dialer' },
    { id: 'transcription', title: 'Live Transcription' }
  ];

  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  useEffect(() => {
    const savedOrder = localStorage.getItem('outbound-order');
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
        localStorage.setItem('outbound-order', JSON.stringify(updated.map(w => w.id)));
        return updated;
      });
    }
  };

  const renderWidgetContent = (id) => {
    if (id === 'dialer') return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '2px solid #6366f1', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
           <PhoneCall size={48} color="#6366f1" />
        </div>
        <h2 style={{ marginBottom: '8px', color: 'white' }}>John Doe</h2>
        <p style={{ color: '#475569', marginBottom: '24px' }}>+1 (555) 019-2834</p>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
           <button className="glass-button" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: '#ef4444' }}>Hang Up</button>
           <button className="glass-button primary"><FastForward size={16} style={{ display: 'inline', marginRight: '4px' }} /> Next Lead</button>
        </div>

        <div style={{ width: '100%', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10b981', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
           <ShieldAlert color="#10b981" size={20} />
           <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>DNC SCRUBBED: SAFE TO CALL</p>
        </div>
      </div>
    );

    if (id === 'transcription') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
           <Mic color="#ef4444" className="animate-pulse" />
           <h3 style={{ color: 'white' }}>Live Whisper Stream</h3>
        </div>
        
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <p style={{ color: '#6366f1', fontSize: '0.85rem' }}><strong>Agent:</strong> "Hi John, this is Sarah from HNRENO."</p>
           <p style={{ color: '#f8fafc', fontSize: '0.85rem' }}><strong>John:</strong> "Yes, hi. Does your system support custom API endpoints?"</p>
           <p style={{ color: '#6366f1', fontSize: '0.85rem' }}><strong>Agent:</strong> "Absolutely. Full developer sandbox included."</p>
           <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderLeft: '3px solid #6366f1', borderRadius: '4px' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', marginBottom: '4px' }}>AI Action Item:</p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Email API docs to John Doe.</p>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ background: '#08080a', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontWeight: 900, color: 'white' }}>OUTBOUND.DIALER</h1>
          <p className="page-subtitle" style={{ color: '#475569' }}>Real-time whisper transcription and DNC scrubbing.</p>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((w) => (
              <DraggableWidget key={w.id} id={w.id}>
                <div className="glass-panel" style={{ padding: '32px', height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', cursor: 'grab', background: '#0a0a0c', border: '1px solid #1f1f27' }}>
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

export default Outbound;
