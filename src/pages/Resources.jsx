import React, { useState, useEffect } from 'react';
import { Search, Book, FileText, Code, List } from 'lucide-react';
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

const Resources = () => {
  const INITIAL_WIDGETS = [
    { id: 'start', title: 'Getting Started', icon: Book, color: '#6366f1', desc: 'Basic configuration and Launchpad guides.' },
    { id: 'api', title: 'API Reference', icon: FileText, color: '#10b981', desc: 'Detailed endpoints for the developer webhook system.' },
    { id: 'integrations', title: 'Integration Guides', icon: Code, color: '#f59e0b', desc: 'How to connect Stripe, GMB, and social channels.' }
  ];

  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  useEffect(() => {
    const savedOrder = localStorage.getItem('resources-order');
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
        localStorage.setItem('resources-order', JSON.stringify(updated.map(w => w.id)));
        return updated;
      });
    }
  };

  return (
    <div className="page-container" style={{ background: '#08080a', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontWeight: 900, color: 'white' }}>RESOURCES.ENGINE</h1>
          <p className="page-subtitle" style={{ color: '#475569' }}>Context-aware AI search serving global documentation.</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', paddingBottom: '40px' }}>
         <h2 style={{ marginBottom: '32px', fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '1px' }}>HOW CAN WE HELP?</h2>
         
         <div style={{ position: 'relative', width: '100%', maxWidth: '600px', marginBottom: '64px' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input type="text" className="glass-input" placeholder="Search documentation... (Press ⌘ K)" style={{ width: '100%', padding: '24px 24px 24px 60px', fontSize: '1.1rem', borderRadius: '20px', background: '#0a0a0c', border: '1px solid #1f1f27' }} />
            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: '#121217', border: '1px solid #1f1f27', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', color: '#475569', fontWeight: 800 }}>⌘ K</div>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' }}>
              <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
                {widgets.map((w) => (
                  <DraggableWidget key={w.id} id={w.id}>
                    <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'grab', background: '#0a0a0c', border: '1px solid #1f1f27', minHeight: '220px' }}>
                       <w.icon size={24} color={w.color} />
                       <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{w.title}</h3>
                       <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5 }}>{w.desc}</p>
                    </div>
                  </DraggableWidget>
                ))}
              </SortableContext>
           </div>
         </DndContext>
      </div>
    </div>
  );
};

export default Resources;
