import React, { useState, useEffect } from 'react';
import { PlayCircle, Trophy, Code, List } from 'lucide-react';
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

const University = () => {
  const INITIAL_WIDGETS = [
    { id: 'videos', title: 'Video Library', icon: PlayCircle, color: '#6366f1', desc: 'Watch guided tutorials on setting up your workflows and CRM.' },
    { id: 'sandbox', title: 'Sandbox Env', icon: Trophy, color: '#f59e0b', desc: 'A dummy CRM loaded with fake data so you can practice.' },
    { id: 'api', title: 'API Playpen', icon: Code, color: '#10b981', desc: 'Postman-style interface to safely trigger test webhooks.' }
  ];

  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  useEffect(() => {
    const savedOrder = localStorage.getItem('university-order');
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
        localStorage.setItem('university-order', JSON.stringify(updated.map(w => w.id)));
        return updated;
      });
    }
  };

  return (
    <div className="page-container" style={{ background: '#08080a', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontWeight: 900, color: 'white' }}>INTERACTIVE.UNIVERSITY</h1>
          <p className="page-subtitle" style={{ color: '#475569' }}>Master the software in a containerized sandbox environment.</p>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((w) => (
              <DraggableWidget key={w.id} id={w.id}>
                <div className="glass-panel" style={{ padding: '32px', height: '100%', minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'grab', background: '#0a0a0c', border: w.id === 'sandbox' ? '1px solid #6366f1' : '1px solid #1f1f27' }}>
                   <w.icon size={48} color={w.color} style={{ marginBottom: '24px' }} />
                   <h3 style={{ color: 'white', fontWeight: 800 }}>{w.title}</h3>
                   <p style={{ color: '#475569', fontSize: '0.85rem', margin: '16px 0', lineHeight: 1.6 }}>{w.desc}</p>
                   <button className={`glass-button ${w.id === 'sandbox' ? 'primary' : ''}`} style={{ marginTop: 'auto', width: '100%' }}>
                      {w.id === 'sandbox' ? 'Launch Sandbox' : 'Open Module'}
                   </button>
                </div>
              </DraggableWidget>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default University;
