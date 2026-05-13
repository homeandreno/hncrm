import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Clock, Loader2, Share2, Video, Camera, ShoppingBag, Globe, Zap, ExternalLink, Calendar, MessageSquare, Lightbulb, Filter, Search, LayoutGrid, List, Columns } from 'lucide-react';
import { launchNativeBrowser, getBridgeStatus } from '../lib/proxyService';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORM_ICONS = {
  Facebook: Share2,
  Instagram: Camera,
  LinkedIn: Globe,
  YouTube: Video,
  Marketplace: ShoppingBag,
  Twitter: Share2
};

const SortablePostCard = ({ post, onLaunch }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post.id });
  const Icon = PLATFORM_ICONS[post.platform] || MessageSquare;

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
      className="content-card glass-panel"
    >
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
            <Icon size={12} color="#6366f1" />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#6366f1' }}>{post.platform.toUpperCase()}</span>
         </div>
         <button className="icon-btn" onPointerDown={(e) => e.stopPropagation()}><MoreVertical size={14} color="#475569" /></button>
      </div>
      
      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'white' }}>{post.title}</h4>
      <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>{post.content.substring(0, 80)}...</p>
      
      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.65rem' }}>
            <Clock size={10} /> {post.time}
         </div>
         <button 
           onClick={() => onLaunch(post)}
           onPointerDown={(e) => e.stopPropagation()}
           style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '4px 10px', borderRadius: '6px', color: '#6366f1', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
         >
            <Zap size={10} /> LAUNCH
         </button>
      </div>
    </div>
  );
};

const ContentBoard = () => {
  const [viewMode, setViewMode] = useState('split'); // 'kanban', 'list', 'split'
  const [posts, setPosts] = useState([
    { id: 'p1', title: 'Summer Campaign Intro', platform: 'Facebook', content: 'Get ready for the biggest reno sale of the year. Link in bio!', col: 'idea', time: '10:30 AM', status: 'In Review' },
    { id: 'p2', title: 'LinkedIn B2B Hook', platform: 'LinkedIn', content: 'Why most agencies fail at residential scaling...', col: 'draft', time: '1:00 PM', status: 'Writing' },
    { id: 'p3', title: 'Instagram Reel: Behind Scenes', platform: 'Instagram', content: 'Walking through our latest project in London.', col: 'scheduled', time: '4:45 PM', status: 'Ready' },
    { id: 'p4', title: 'Marketplace Listing: Toolset', platform: 'Marketplace', content: 'Professional grade reno tools for sale.', col: 'posted', time: '9:00 AM', status: 'Live' },
  ]);
  const [activeId, setActiveId] = useState(null);
  const [bridgeStatus, setBridgeStatus] = useState('offline');

  const columns = [
    { id: 'idea', title: 'Idea Vault', color: '#f59e0b', icon: Lightbulb },
    { id: 'draft', title: 'Drafting', color: '#3b82f6', icon: MessageSquare },
    { id: 'scheduled', title: 'Scheduled', color: '#8b5cf6', icon: Calendar },
    { id: 'posted', title: 'Live/Posted', color: '#10b981', icon: Zap }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const checkBridge = async () => {
      const status = await getBridgeStatus();
      setBridgeStatus(status.status === 'online' ? 'online' : 'offline');
    };
    checkBridge();
    const interval = setInterval(checkBridge, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const isActivePost = posts.some(p => p.id === activeId);
    const isOverColumn = columns.some(c => c.id === overId);
    const isOverPost = posts.some(p => p.id === overId);

    if (isActivePost) {
      if (isOverColumn) {
        setPosts(prev => prev.map(p => p.id === activeId ? { ...p, col: overId } : p));
      } else if (isOverPost) {
        const overPost = posts.find(p => p.id === overId);
        setPosts(prev => prev.map(p => p.id === activeId ? { ...p, col: overPost.col } : p));
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeIndex = posts.findIndex(p => p.id === active.id);
    const overIndex = posts.findIndex(p => p.id === over.id);

    if (activeIndex !== overIndex && overIndex !== -1) {
      setPosts(prev => arrayMove(prev, activeIndex, overIndex));
    }
  };

  const handleLaunch = async (post) => {
    const urls = {
      Facebook: 'https://www.facebook.com',
      Instagram: 'https://www.instagram.com',
      LinkedIn: 'https://www.linkedin.com',
      Marketplace: 'https://www.facebook.com/marketplace',
      YouTube: 'https://www.youtube.com'
    };
    
    await launchNativeBrowser(
      `post-${post.id}`, 
      urls[post.platform] || 'https://www.google.com', 
      null, 
      { city: 'London', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
      true
    );
  };

  const activePost = activeId ? posts.find(p => p.id === activeId) : null;

  return (
    <div className="page-container" style={{ background: '#050505', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header className="page-header" style={{ marginBottom: '24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div>
              <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>CONTENT.HUB</h1>
              <p className="page-subtitle" style={{ color: '#475569' }}>The "MS Lists" meets "Kanban" hybrid engine.</p>
           </div>
           
           <div style={{ display: 'flex', background: '#0a0a0c', padding: '4px', borderRadius: '10px', border: '1px solid #1f1f27' }}>
              <button onClick={() => setViewMode('kanban')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: viewMode === 'kanban' ? '#6366f1' : 'transparent', color: viewMode === 'kanban' ? 'white' : '#475569', cursor: 'pointer' }}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode('split')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: viewMode === 'split' ? '#6366f1' : 'transparent', color: viewMode === 'split' ? 'white' : '#475569', cursor: 'pointer' }}><Columns size={16} /></button>
              <button onClick={() => setViewMode('list')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: viewMode === 'list' ? '#6366f1' : 'transparent', color: viewMode === 'list' ? 'white' : '#475569', cursor: 'pointer' }}><List size={16} /></button>
           </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
           <div className="glass-panel" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', border: bridgeStatus === 'online' ? '1px solid #10b98133' : '1px solid #ef444433' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bridgeStatus === 'online' ? '#10b981' : '#ef4444' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 900, color: bridgeStatus === 'online' ? '#10b981' : '#ef4444' }}>BRIDGE {bridgeStatus.toUpperCase()}</span>
           </div>
           <button className="glass-button primary"><Plus size={16} /> NEW POST</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', gap: '20px', minHeight: 0, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {(viewMode === 'kanban' || viewMode === 'split') && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ flex: viewMode === 'split' ? 0.6 : 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            >
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCorners} 
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'split' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '20px', flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                   {columns.filter(c => viewMode === 'split' ? (c.id === 'idea' || c.id === 'scheduled') : true).map(col => {
                     const colPosts = posts.filter(p => p.col === col.id);
                     return (
                       <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <col.icon size={14} color={col.color} />
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'white' }}>{col.title.toUpperCase()}</h3>
                             </div>
                          </div>
                          
                          <div id={col.id} className="glass-panel" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '16px', overflowY: 'auto' }}>
                             <SortableContext items={colPosts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                {colPosts.map(post => (
                                  <SortablePostCard key={post.id} post={post} onLaunch={handleLaunch} />
                                ))}
                             </SortableContext>
                          </div>
                       </div>
                     );
                   })}
                </div>
                <DragOverlay>
                   {activePost ? (
                     <div className="content-card glass-panel" style={{ cursor: 'grabbing', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', opacity: 0.9 }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#6366f1', marginBottom: '8px' }}>{activePost.platform.toUpperCase()}</div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{activePost.title}</h4>
                     </div>
                   ) : null}
                </DragOverlay>
              </DndContext>
            </motion.div>
          )}

          {(viewMode === 'list' || viewMode === 'split') && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ flex: viewMode === 'split' ? 0.4 : 1, background: '#0a0a0c', border: '1px solid #1f1f27', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f1f27', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px' }}>MS LIST VIEW (MASTER DATA)</div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn"><Filter size={14} /></button>
                    <button className="icon-btn"><Search size={14} /></button>
                 </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#0a0a0c', zIndex: 10 }}>
                       <tr style={{ textAlign: 'left', color: '#475569', borderBottom: '1px solid #1f1f27' }}>
                          <th style={{ padding: '12px 20px' }}>TITLE</th>
                          <th style={{ padding: '12px 20px' }}>PLATFORM</th>
                          <th style={{ padding: '12px 20px' }}>STATUS</th>
                          <th style={{ padding: '12px 20px' }}>SCHEDULE</th>
                       </tr>
                    </thead>
                    <tbody>
                       {posts.map(post => (
                         <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row-hover">
                            <td style={{ padding: '12px 20px', fontWeight: 600 }}>{post.title}</td>
                            <td style={{ padding: '12px 20px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {React.createElement(PLATFORM_ICONS[post.platform] || MessageSquare, { size: 12, color: '#6366f1' })}
                                  {post.platform}
                               </div>
                            </td>
                            <td style={{ padding: '12px 20px' }}>
                               <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.05)', color: '#6366f1', fontSize: '0.65rem', fontWeight: 700 }}>
                                  {post.status || 'Draft'}
                               </span>
                            </td>
                            <td style={{ padding: '12px 20px', color: '#475569' }}>{post.time}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .content-card { padding: 16px; background: #0a0a0c; border: 1px solid #1f1f27; borderRadius: 14px; margin-bottom: 12px; cursor: grab; transition: all 0.2s; }
        .content-card:hover { border-color: #6366f155; transform: translateY(-1px); background: #0e0e12; }
        .icon-btn { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 6px; color: #475569; transition: all 0.2s; }
        .icon-btn:hover { background: rgba(255,255,255,0.05); color: white; }
        .table-row-hover:hover { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1f1f27; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ContentBoard;
