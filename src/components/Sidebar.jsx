import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { AuthContext } from '../context/AuthContext';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableWidget from './DraggableWidget';

import { LogOut, RefreshCcw, Shield, Globe, Code, ExternalLink } from 'lucide-react';
import { PAGE_REGISTRY } from '../lib/windowRegistry';
import './Sidebar.css';

const INITIAL_NAV_ITEMS = Object.keys(PAGE_REGISTRY).map(id => ({
  id,
  path: `/${id}`,
  label: PAGE_REGISTRY[id].label,
  icon: PAGE_REGISTRY[id].icon
})).filter(item => {
  const hiddenIds = ['omni-brain', 'apps-hub', 'ai-center', 'browser', 'contacts', 'opportunities'];
  return !hiddenIds.includes(item.id);
});

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const { openWindow } = useWorkspace();
  const location = useLocation();
  const [navItems, setNavItems] = useState(INITIAL_NAV_ITEMS);

  // Load and save order
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-nav-order');
    if (saved) {
      try {
        const orderIds = JSON.parse(saved);
        const reordered = orderIds.map(id => INITIAL_NAV_ITEMS.find(item => item.id === id)).filter(Boolean);
        const remaining = INITIAL_NAV_ITEMS.filter(item => !orderIds.includes(item.id));
        setNavItems([...reordered, ...remaining]);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-nav-order', JSON.stringify(navItems.map(i => i.id)));
  }, [navItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setNavItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>HNRENO<span className="text-accent">.</span></h2>
        <button 
          onClick={() => { localStorage.removeItem('sidebar-nav-order'); setNavItems(INITIAL_NAV_ITEMS); }}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', opacity: 0.5 }}
          title="Reset Menu"
        >
          <RefreshCcw size={12} />
        </button>
      </div>
      <nav className="sidebar-nav">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={navItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {navItems.map((item) => (
                <DraggableWidget key={item.id} id={item.id}>
                  <li>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => {
                        const windowIds = ['omni-brain', 'apps-hub', 'ai-center', 'browser'];
                        if (windowIds.includes(item.id)) {
                          e.preventDefault();
                          const Comp = PAGE_REGISTRY[item.id].component;
                          openWindow(item.id, item.label, Comp, item.icon);
                        }
                      }}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                </DraggableWidget>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        
        <div className="sidebar-admin" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', paddingBottom: '8px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-secondary)', opacity: 0.5, marginBottom: '12px', paddingLeft: '12px', letterSpacing: '1px' }}>ADMIN CENTER</div>
          
          <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="nav-link admin-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#3b82f6', marginBottom: '8px' }}>
            <Shield size={18} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Azure Portal</span>
          </a>

          <a href="https://admin.microsoft.com" target="_blank" rel="noopener noreferrer" className="nav-link admin-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', marginBottom: '8px' }}>
            <Globe size={18} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>M365 Admin</span>
          </a>

          <a href="https://vscode.dev" target="_blank" rel="noopener noreferrer" className="nav-link admin-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6366f1', marginBottom: '16px' }}>
            <Code size={18} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>VS Code Web</span>
          </a>

          <button onClick={logout} className="nav-link" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', opacity: 0.8 }}>
             <LogOut size={18} />
             <span className="nav-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
