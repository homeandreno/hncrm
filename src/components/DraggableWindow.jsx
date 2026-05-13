import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2, GripVertical, Lock, Unlock, Puzzle, ChevronLeft, ChevronRight, Settings, RefreshCcw } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

const DraggableWindow = ({ win }) => {
  const { closeWindow, focusWindow, toggleMinimize, toggleMaximize, toggleLock, activeWindowId, updateWindowSize, updateWindowPosition } = useWorkspace();
  const isActive = activeWindowId === win.id;
  const [showExtensions, setShowExtensions] = React.useState(false);
  const windowRef = React.useRef(null);

  if (win.isMinimized) return null;

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = win.size.width;
    const startHeight = win.size.height;

    const onMouseMove = (moveEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) {
        newWidth = Math.max(400, startWidth + (moveEvent.clientX - startX));
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY));
      }

      updateWindowSize(win.id, { width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <motion.div
      ref={windowRef}
      drag={!win.isLocked}
      dragMomentum={false}
      dragListener={!win.isLocked}
      onMouseDown={() => focusWindow(win.id)}
      onDrag={(e, info) => {
        // Snap to top detection
        if (info.point.y < 20 && !win.isMaximized) {
          toggleMaximize(win.id);
        }
        // Pull to restore detection
        if (win.isMaximized && info.offset.y > 50) {
          toggleMaximize(win.id);
        }
      }}
      onDragEnd={(e, info) => {
        // Update position in context when drag ends
        updateWindowPosition(win.id, { x: win.position.x + info.offset.x, y: win.position.y + info.offset.y });
      }}
      initial={win.position}
      animate={{
        width: win.isMaximized ? 'calc(100vw - 80px)' : win.size.width,
        height: win.isMaximized ? 'calc(100vh - 20px)' : win.size.height,
        x: win.isMaximized ? 80 : undefined,
        y: win.isMaximized ? 0 : undefined,
        zIndex: win.zIndex,
        boxShadow: isActive ? '0 30px 60px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.3)',
        scale: 1,
        opacity: 1
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        position: 'fixed',
        background: 'rgba(13, 13, 18, 0.85)',
        backdropFilter: 'blur(16px) saturate(180%)',
        border: isActive ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: win.isMaximized ? '0' : '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible', // Changed to visible to show handles outside if needed
      }}
    >
      {/* Window Title Bar */}
      <div 
        onDoubleClick={() => toggleMaximize(win.id)}
        style={{
          height: '48px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          cursor: win.isMaximized ? 'default' : 'grab',
          userSelect: 'none',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GripVertical size={14} color="rgba(255,255,255,0.2)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? 'white' : '#94a3b8' }}>
            {win.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={(e) => { e.stopPropagation(); toggleLock(win.id); }} className="window-control" title={win.isLocked ? "Unlock Window" : "Lock Window"}>
            {win.isLocked ? <Lock size={14} color="#f59e0b" /> : <Unlock size={14} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); toggleMinimize(win.id); }} className="window-control"><Minus size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }} className="window-control">
            {win.isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="window-control close"><X size={14} /></button>
        </div>
      </div>

      {/* Window Content & Extension Rail Container */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569' }}><RefreshCcw className="animate-spin" size={24} /></div>}>
            <win.component />
          </React.Suspense>
        </div>

        {/* Page Extension Rail */}
        <div 
          style={{ 
            width: showExtensions ? '180px' : '36px', 
            background: 'rgba(255,255,255,0.02)', 
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease'
          }}
        >
          <div 
            onClick={() => setShowExtensions(!showExtensions)}
            style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
          >
            {showExtensions ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0', alignItems: 'center' }}>
            <div title="Extensions" style={{ color: '#475569', cursor: 'pointer' }}><Puzzle size={16} /></div>
            <div title="Page Settings" style={{ color: '#475569', cursor: 'pointer' }}><Settings size={16} /></div>
          </div>

          {showExtensions && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 12px' }}>
               <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', marginBottom: '12px', letterSpacing: '1px' }}>EXTENSIONS</div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="extension-item">Identity Shield</div>
                  <div className="extension-item">Proxy Tuner</div>
                  <div className="extension-item">Session Export</div>
               </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Resize Handles */}
      {!win.isMaximized && !win.isLocked && (
        <>
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '100%', cursor: 'ew-resize', zIndex: 10 }}
          />
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '6px', cursor: 'ns-resize', zIndex: 10 }}
          />
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', cursor: 'nwse-resize', zIndex: 11 }}
          />
        </>
      )}

      <style>{`
        .extension-item {
          font-size: 0.75rem;
          color: #94a3b8;
          padding: 8px;
          border-radius: 6px;
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .extension-item:hover {
          background: rgba(99,102,241,0.1);
          color: white;
        }
        .window-control {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .window-control:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }
        .window-control.close:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </motion.div>
  );
};

export default DraggableWindow;
