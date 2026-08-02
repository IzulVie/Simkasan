import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import RouteGuard from './components/RouteGuard';
import { SidebarLayout, WaliLayout } from './components/Layout';
import Login from './features/auth/Login';
import Unauthorized from './features/auth/Unauthorized';
import Dashboard from './features/dashboard/Dashboard';
import MasterData from './features/dashboard/MasterData';
import IuranPage from './features/iuran/IuranPage';
import RolesPage from './features/roles/RolesPage';
import AbsensiPage from './features/absensi/AbsensiPage';
import HafalanPage from './features/hafalan/HafalanPage';
import NilaiPage from './features/nilai/NilaiPage';
import KegiatanPage from './features/kegiatan/KegiatanPage';
import PengaturanPage from './features/pengaturan/PengaturanPage';
import BantuanPage from './features/bantuan/BantuanPage';

const queryClient = new QueryClient();

// Helper Dispatcher for Dynamic Layout Routing based on role
const RoleBasedLayoutDispatcher = () => {
  const { user } = useAuth();

  if (user?.roles?.includes('wali')) {
    return <WaliLayout />;
  }
  return <SidebarLayout />;
};

function AppContent() {
  return (
    <Routes>
      {/* Public login */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <RouteGuard allowedRoles={['admin', 'ustadz', 'wali']}>
            <RoleBasedLayoutDispatcher />
          </RouteGuard>
        }
      >
        {/* Redirect root / to /dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Sidebar-only pages (role validation done inside RouteGuard) */}
        <Route 
          path="master-data" 
          element={
            <RouteGuard allowedRoles={['admin']}>
              <MasterData />
            </RouteGuard>
          } 
        />
        <Route 
          path="iuran" 
          element={
            <RouteGuard allowedRoles={['admin']}>
              <IuranPage />
            </RouteGuard>
          } 
        />
        <Route 
          path="roles" 
          element={
            <RouteGuard allowedRoles={['admin']}>
              <RolesPage />
            </RouteGuard>
          } 
        />
        <Route 
          path="absensi" 
          element={
            <RouteGuard allowedRoles={['admin', 'ustadz', 'wali']}>
              <AbsensiPage />
            </RouteGuard>
          } 
        />
        <Route 
          path="hafalan" 
          element={
            <RouteGuard allowedRoles={['admin', 'ustadz', 'wali']}>
              <HafalanPage />
            </RouteGuard>
          } 
        />
        <Route 
          path="nilai" 
          element={
            <RouteGuard allowedRoles={['admin', 'ustadz', 'wali']}>
              <NilaiPage />
            </RouteGuard>
          } 
        />
        <Route 
          path="kegiatan" 
          element={
            <RouteGuard allowedRoles={['admin', 'ustadz', 'wali']}>
              <KegiatanPage />
            </RouteGuard>
          } 
        />
        <Route 
          path="pengaturan" 
          element={
            <RouteGuard allowedRoles={['admin', 'ustadz', 'wali']}>
              <PengaturanPage />
            </RouteGuard>
          } 
        />
        <Route 
          path="bantuan" 
          element={
            <RouteGuard allowedRoles={['admin', 'ustadz', 'wali']}>
              <BantuanPage />
            </RouteGuard>
          } 
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
