import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import DraggableWindow from './components/DraggableWindow';
import WorkspaceDock from './components/WorkspaceDock';
import { PAGE_REGISTRY } from './lib/windowRegistry';
import Login from './pages/Login';
import { RefreshCcw } from 'lucide-react';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ height: '100%', width: '100%' }}
    >
      <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050505', color: '#475569' }}><RefreshCcw className="animate-spin" size={32} /></div>}>
        {children}
      </React.Suspense>
    </motion.div>
  );
};

const MainLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {Object.entries(PAGE_REGISTRY).map(([id, item]) => {
              const Component = item.component;
              return (
                <Route 
                  key={id} 
                  path={`/${id}`} 
                  element={<ProtectedRoute><AnimatedPage><Component /></AnimatedPage></ProtectedRoute>} 
                />
              );
            })}
            <Route path="/factory" element={<ProtectedRoute><AnimatedPage><PAGE_REGISTRY.factory.component /></AnimatedPage></ProtectedRoute>} />
            <Route path="*" element={
              <AnimatedPage>
                <div className="glass-panel" style={{padding: '32px', marginTop: '32px'}}>
                  <h2 style={{marginBottom: '16px'}}>404 Not Found</h2>
                  <p style={{color: 'var(--text-secondary)'}}>The requested module could not be found.</p>
                </div>
              </AnimatedPage>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      <WindowLayer />
      <WorkspaceDock />
    </div>
  );
};

const WindowLayer = () => {
  const { windows } = useWorkspace();
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <div style={{ pointerEvents: 'auto' }}>
        {windows.map(window => (
          <DraggableWindow key={window.id} win={window} />
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider registry={PAGE_REGISTRY}>
        <Router>
          <MainLayout />
        </Router>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;
