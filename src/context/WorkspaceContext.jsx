import React, { createContext, useState, useContext, useEffect } from 'react';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children, registry }) => {
  const [windows, setWindows] = useState(() => {
    const saved = localStorage.getItem('workspace-windows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(win => ({
          ...win,
          component: registry[win.id]?.component || (() => null),
          icon: registry[win.id]?.icon || (() => null)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [activeWindowId, setActiveWindowId] = useState(null);

  // Persistence
  useEffect(() => {
    const toSave = windows.map(({ component, icon, ...rest }) => rest);
    localStorage.setItem('workspace-windows', JSON.stringify(toSave));
  }, [windows]);

  const openWindow = (id, title, component, icon) => {
    // If window already exists, just focus it
    if (windows.find(w => w.id === id)) {
      focusWindow(id);
      return;
    }

    // Resolve from registry if not provided
    const registryItem = registry[id] || {};
    const finalTitle = title || registryItem.label || id;
    const finalComponent = component || registryItem.component || (() => null);
    const finalIcon = icon || registryItem.icon || (() => null);

    const getInitialSize = (id) => {
      if (id === 'omni-brain') return { width: 1000, height: 750 };
      if (id === 'apps-hub') return { width: 120, height: 600 };
      if (id === 'ai-center') return { width: 360, height: 600 };
      return { width: 800, height: 600 };
    };

    const newWindow = {
      id,
      title: finalTitle,
      component: finalComponent,
      icon: finalIcon,
      isMinimized: false,
      isMaximized: false,
      isLocked: false,
      zIndex: windows.length + 10,
      position: { x: 100 + (windows.length * 40), y: 100 + (windows.length * 40) },
      size: getInitialSize(id)
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(id);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id) => {
    setWindows(windows.map(w => ({
      ...w,
      zIndex: w.id === id ? Math.max(...windows.map(win => win.zIndex)) + 1 : w.zIndex,
      isMinimized: w.id === id ? false : w.isMinimized
    })));
    setActiveWindowId(id);
  };

  const toggleMinimize = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const toggleMaximize = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const toggleLock = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isLocked: !w.isLocked } : w
    ));
  };

  const updateWindowSize = (id, size) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  };

  const updateWindowPosition = (id, position) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  };

  // Esc to Exit Logic
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeWindowId) {
        // Find the active window and check if it's not locked (or just close it)
        const activeWin = windows.find(w => w.id === activeWindowId);
        if (activeWin && !activeWin.isLocked) {
          closeWindow(activeWindowId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, windows]);

  return (
    <WorkspaceContext.Provider value={{ 
      windows, 
      activeWindowId, 
      openWindow, 
      closeWindow, 
      focusWindow, 
      toggleMinimize, 
      toggleMaximize,
      toggleLock,
      updateWindowSize,
      updateWindowPosition
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
