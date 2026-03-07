import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Market from './pages/Market';
import Roulette from './pages/Roulette';
import Friends from './pages/Friends';
import Tasks from './pages/Tasks';
import CaseDetail from './pages/CaseDetail';
// Админские страницы
import AdminLayout from './pages/admin/AdminLayout';
import AdminKeys from './pages/admin/AdminKeys';
import AdminStats from './pages/admin/AdminStats';
import AdminAudit from './pages/admin/AdminAudit';
import './styles/global.css';

// Компонент для защиты админ-роутов
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useUser();
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/market" element={<Market />} />
      <Route path="/roulette" element={<Roulette />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/case/:id" element={<CaseDetail />} />
      
      {/* Админка */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<Navigate to="/admin/keys" replace />} />
        <Route path="keys" element={<AdminKeys />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="audit" element={<AdminAudit />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <div className="glow-line" />
            <div className="glow-line bottom" />
            <AppRoutes />
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;