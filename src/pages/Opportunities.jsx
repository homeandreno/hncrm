import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Clock, Loader2 } from 'lucide-react';
import { getDeals, updateDealColumn } from '../lib/dataService';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Opportunities.css';

const SortableDealCard = ({ deal }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`deal-card glass-panel ${deal.days > 7 ? 'stagnant' : ''}`}
    >
      <div className="deal-header">
        <h4>{deal.title}</h4>
        <button className="icon-btn" onPointerDown={(e) => e.stopPropagation()}><MoreVertical size={16} /></button>
      </div>
      <p className="deal-company">{deal.company}</p>
      <div className="deal-footer">
        <span className="deal-value">${deal.value.toLocaleString()}</span>
        {deal.days > 0 && (
          <span className={`deal-time ${deal.days > 7 ? 'warning' : ''}`}>
            <Clock size={12} /> {deal.days}d
          </span>
        )}
      </div>
      {deal.days > 7 && (
        <div className="stagnant-alert">
          Automated Re-engagement Triggered
        </div>
      )}
    </div>
  );
};

const Opportunities = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const columns = [
    { id: 'lead', title: 'New Leads', color: '#3b82f6' },
    { id: 'contacted', title: 'Contacted', color: '#f59e0b' },
    { id: 'proposal', title: 'Proposal Sent', color: '#8b5cf6' },
    { id: 'won', title: 'Closed Won', color: '#10b981' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    const data = await getDeals();
    setDeals(data);
    setLoading(false);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;

    const isActiveDeal = deals.some(d => d.id === activeId);
    const isOverColumn = columns.some(c => c.id === overId);
    const isOverDeal = deals.some(d => d.id === overId);

    if (isActiveDeal) {
      if (isOverColumn) {
        setDeals(prevDeals => prevDeals.map(d => d.id === activeId ? { ...d, col: overId, days: 0 } : d));
      } else if (isOverDeal) {
        const overDeal = deals.find(d => d.id === overId);
        setDeals(prevDeals => prevDeals.map(d => d.id === activeId ? { ...d, col: overDeal.col, days: 0 } : d));
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const targetCol = columns.some(c => c.id === over.id) 
      ? over.id 
      : deals.find(d => d.id === over.id)?.col;

    if (targetCol) {
      await updateDealColumn(active.id, targetCol);
    }
  };

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null;

  return (
    <div className="page-container opportunities-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Opportunities Pipeline</h1>
          <p className="page-subtitle">Premium physics-based drag and drop activated.</p>
        </div>
        <button className="glass-button primary">
          <Plus size={16} style={{ display: 'inline', marginRight: '8px' }} />
          New Deal
        </button>
      </header>

      {loading ? (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flex: 1 }}>
            <Loader2 className="animate-spin" color="var(--accent-color)" size={48} />
         </div>
      ) : (
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-board">
            {columns.map(col => {
              const columnDeals = deals.filter(d => d.col === col.id);
              return (
                <div key={col.id} className="kanban-column">
                  <div className="column-header">
                    <div className="col-title-wrap">
                      <span className="col-dot" style={{backgroundColor: col.color}}></span>
                      <h3>{col.title}</h3>
                    </div>
                    <span className="deal-count">{columnDeals.length}</span>
                  </div>
                  
                  <div className="column-content glass-panel" id={col.id}>
                    <SortableContext items={columnDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                      {columnDeals.map(deal => (
                        <SortableDealCard key={deal.id} deal={deal} />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
          
          <DragOverlay>
            {activeDeal ? (
              <div className={`deal-card glass-panel ${activeDeal.days > 7 ? 'stagnant' : ''}`} style={{ cursor: 'grabbing', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)' }}>
                <div className="deal-header">
                  <h4>{activeDeal.title}</h4>
                  <button className="icon-btn"><MoreVertical size={16} /></button>
                </div>
                <p className="deal-company">{activeDeal.company}</p>
                <div className="deal-footer">
                  <span className="deal-value">${activeDeal.value.toLocaleString()}</span>
                  {activeDeal.days > 0 && (
                    <span className={`deal-time ${activeDeal.days > 7 ? 'warning' : ''}`}>
                      <Clock size={12} /> {activeDeal.days}d
                    </span>
                  )}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default Opportunities;
