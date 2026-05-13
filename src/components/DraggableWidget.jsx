import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const DraggableWidget = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative'
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`${className} draggable-widget-container`}
    >
      <div 
        className="drag-handle"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          opacity: 0.4,
          color: 'var(--text-secondary)',
          zIndex: 10
        }}
      >
        <GripVertical size={16} />
      </div>
      {children}

      
      <style>{`
        .draggable-widget-container:hover .drag-handle {
          opacity: 0.6 !important;
        }
        .drag-handle:active {
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  );
};

export default DraggableWidget;
