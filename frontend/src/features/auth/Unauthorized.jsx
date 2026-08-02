import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F7F5F0] px-4 text-center">
      <div className="p-4 bg-[#8B3A3A]/10 text-[#8B3A3A] rounded-full mb-4">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h1 className="font-heading text-2xl font-extrabold text-[#1C2620]">Akses Ditolak</h1>
      <p className="text-sm text-[#5B6350] mt-2 max-w-md">
        Anda tidak memiliki izin (role/permission) untuk mengakses halaman ini. Hubungi administrator jika Anda merasa ini adalah kesalahan.
      </p>
      <Button
        onClick={() => navigate('/dashboard')}
        className="mt-6 bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0]"
      >
        Kembali ke Dashboard
      </Button>
    </div>
  );
};

export default Unauthorized;
