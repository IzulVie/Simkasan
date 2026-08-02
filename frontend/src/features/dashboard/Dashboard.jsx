import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UstadzDashboard from './UstadzDashboard';
import WaliDashboard from './WaliDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.roles?.includes('admin')) {
    return <AdminDashboard />;
  }

  if (user?.roles?.includes('ustadz')) {
    return <UstadzDashboard />;
  }

  if (user?.roles?.includes('wali')) {
    return <WaliDashboard />;
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-[#E3DEC6] text-center">
      <h2 className="text-xl font-bold text-[#8B3A3A]">Peran Tidak Dikenali</h2>
      <p className="text-sm text-[#5B6350] mt-2">
        Akun Anda belum dikonfigurasi dengan peran (role) akses yang sah di SIMKASAN.
      </p>
    </div>
  );
};

export default Dashboard;
