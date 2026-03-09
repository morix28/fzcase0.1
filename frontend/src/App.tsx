import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Market from './pages/Market';
import Roulette from './pages/Roulette';
import Friends from './pages/Friends';
import Tasks from './pages/Tasks';
import CaseDetail from './pages/CaseDetail';
import AdminLayout from './pages/admin/AdminLayout';
import AdminKeys from './pages/admin/AdminKeys';
import AdminStats from './pages/admin/AdminStats';
import AdminAudit from './pages/admin/AdminAudit';
import { useUser } from './context/UserContext';
import './styles/global.css';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useUser();
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Home />
          </motion.div>
        } />
        <Route path="/market" element={
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Market />
          </motion.div>
        } />
        <Route path="/roulette" element={
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Roulette />
          </motion.div>
        } />
        <Route path="/friends" element={
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Friends />
          </motion.div>
        } />
        <Route path="/tasks" element={
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Tasks />
          </motion.div>
        } />
        <Route path="/case/:id" element={
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <CaseDetail />
          </motion.div>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AdminLayout />
            </motion.div>
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/keys" replace />} />
          <Route path="keys" element={<AdminKeys />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="audit" element={<AdminAudit />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <div className="glow-line" />
            <div className="glow-line bottom" />
            <AnimatedRoutes />
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;