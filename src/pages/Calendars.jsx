import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, List } from 'lucide-react';
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

const Calendars = () => {
  const INITIAL_WIDGETS = [
    { id: 'schedule', title: 'Today\'s Schedule' },
    { id: 'upcoming', title: 'Upcoming Bookings' }
  ];

  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  useEffect(() => {
    const savedOrder = localStorage.getItem('calendars-order');
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
        localStorage.setItem('calendars-order', JSON.stringify(updated.map(w => w.id)));
        return updated;
      });
    }
  };

  const renderWidgetContent = (id) => {
    if (id === 'schedule') return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
         <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
            <div style={{ width: '4px', background: '#6366f1', borderRadius: '2px' }}></div>
            <div style={{ padding: '8px 0' }}>
               <p style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>10:00 AM - 11:00 AM</p>
               <h4 style={{ color: 'white', marginTop: '4px' }}>Onboarding Call: John Doe</h4>
               <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '4px' }}>Reviewing CRM deployment and API setup.</p>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '16px', flex: 1, marginTop: '20px', opacity: 0.5 }}>
            <div style={{ width: '4px', background: '#475569', borderRadius: '2px' }}></div>
            <div style={{ padding: '8px 0' }}>
               <p style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>02:00 PM - 03:00 PM</p>
               <h4 style={{ color: 'white', marginTop: '4px' }}>Strategic Review</h4>
               <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '4px' }}>Quarterly growth hub analysis.</p>
            </div>
         </div>
      </div>
    );

    if (id === 'upcoming') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
         {[
           { name: 'Sarah Wilson', type: 'Consultation', time: 'Tomorrow' },
           { name: 'Michael Ross', type: 'Follow-up', time: 'Friday' }
         ].map((item, idx) => (
           <div key={idx} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #1f1f27', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>{item.name}</p>
                 <p style={{ color: '#475569', fontSize: '0.75rem' }}>{item.type}</p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 800 }}>{item.time}</span>
           </div>
         ))}
      </div>
    );
  };

  return (
    <div className="page-container" style={{ background: '#08080a', overflowY: 'auto' }}>
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="page-title" style={{ fontWeight: 900, color: 'white' }}>CALENDAR.HUB</h1>
          <p className="page-subtitle" style={{ color: '#475569' }}>Consolidated schedule for all linked identities and client leads.</p>
        </div>
        <button className="glass-button primary" style={{ background: '#6366f1', border: 'none', borderRadius: '10px', height: '40px', padding: '0 20px', color: 'white', fontWeight: 700 }}>
          <Plus size={16} style={{ display: 'inline', marginRight: '8px' }} /> New Event
        </button>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((w) => (
              <DraggableWidget key={w.id} id={w.id}>
                <div className="glass-panel" style={{ padding: '32px', height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', cursor: 'grab', background: '#0a0a0c', border: '1px solid #1f1f27' }}>
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

export default Calendars;
