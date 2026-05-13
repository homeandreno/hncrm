import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../context/WorkspaceContext';

const WorkspaceDock = () => {
  const { windows, toggleMinimize, focusWindow, activeWindowId } = useWorkspace();

  if (windows.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        background: 'rgba(13, 13, 18, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        pointerEvents: 'auto'
      }}
    >
      <AnimatePresence>
        {windows.map((window) => {
          const Icon = window.icon;
          const isActive = activeWindowId === window.id && !window.isMinimized;
          
          return (
            <motion.div
              key={window.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ y: -5, scale: 1.1 }}
              onClick={() => {
                if (window.isMinimized) toggleMinimize(window.id);
                focusWindow(window.id);
              }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s, border 0.2s'
              }}
              title={window.title}
            >
              <Icon size={20} color={isActive ? '#6366f1' : '#94a3b8'} />
              
              {/* Status Dot */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: window.isMinimized ? '#f59e0b' : '#10b981',
                  opacity: 0.8
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceDock;
