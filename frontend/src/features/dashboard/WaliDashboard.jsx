import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useKegiatan } from '../kegiatan/useKegiatan';
import { Badge } from '../../components/ui/badge';
import { 
  BookOpen, 
  CheckSquare, 
  Award, 
  ArrowRight, 
  User, 
  Loader2, 
  Calendar, 
  Settings, 
  GraduationCap 
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const WaliDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dynamic children list from authenticated user profile
  const children = user?.santris || [];
  const [selectedChild, setSelectedChild] = useState(null);

  // Set default selected child
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
  }, [children, selectedChild]);

  const { activities, isLoading: loadingActivities } = useKegiatan();

  const parentName = user?.name || 'Wali Santri';

  if (children.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] rounded-3xl p-8 text-center text-[#5B6350] dark:text-[#A0A898] font-bold shadow-sm">
        Belum ada anak asuh/santri yang dipetakan ke akun wali ini. Silakan hubungi admin.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <div className="pb-2">
        <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] dark:text-[#EDEAE2] tracking-tight">Beranda</h1>
        <p className="text-xs text-[#5B6350] dark:text-[#A0A898] mt-0.5">Selamat datang kembali. Berikut info pengumuman kegiatan dan ringkasan akademik putra-putri Anda.</p>
      </div>

      {/* Headline Berita / Kegiatan */}
      <div className="space-y-3">
        <h3 className="font-heading text-xs font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C9A876] inline-block animate-pulse"></span>
          Headline Kegiatan & Pengumuman
        </h3>
        {loadingActivities ? (
          <div className="bg-white dark:bg-[#1C2621] p-8 rounded-3xl border border-[#E3DEC6] dark:border-[#2D3A33] flex justify-center text-[#5B7553]">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : activities.length === 0 ? (
          // Mock beautiful headlines if empty
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#5B7553] to-[#4A6342] text-white p-6 rounded-3xl shadow-sm border border-[#E3DEC6]/10 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <GraduationCap className="h-40 w-40" />
              </div>
              <div>
                <Badge className="bg-[#C9A876] text-[#1C2620] hover:bg-[#C9A876] font-black text-[9px] uppercase px-2 py-0.5 rounded-md">Info Kegiatan</Badge>
                <h4 className="text-base font-extrabold mt-2 leading-snug">Pembukaan Semester Baru dan Halaqah Qur'an</h4>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">Seluruh santri diharapkan berkumpul di masjid jami' untuk pembagian kelompok halaqah baru.</p>
              </div>
              <span className="text-[10px] text-white/60 font-bold mt-4">Pesantren SIMKASAN • 01 Agustus 2026</span>
            </div>

            <div className="bg-gradient-to-br from-[#1C2620] to-[#2B3B31] text-[#EDEAE2] p-6 rounded-3xl shadow-sm border border-[#2D3A31] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <BookOpen className="h-40 w-40" />
              </div>
              <div>
                <Badge className="bg-[#5B7553] text-white hover:bg-[#5B7553] font-black text-[9px] uppercase px-2 py-0.5 rounded-md">Ujian Tahfidz</Badge>
                <h4 className="text-base font-extrabold mt-2 leading-snug">Jadwal Tasmi' Akbar 30 Juz Santri Akhir</h4>
                <p className="text-xs text-[#EDEAE2]/85 mt-1 line-clamp-2">Saksikan setoran hafalan sekali duduk oleh para santri pilihan yang telah merampungkan 30 Juz.</p>
              </div>
              <span className="text-[10px] text-[#EDEAE2]/60 font-bold mt-4">Bidang Akademik • 05 Agustus 2026</span>
            </div>
          </div>
        ) : (
          // Real activities from database
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.slice(0, 2).map((act, index) => (
              <div 
                key={act.id} 
                className={`p-6 rounded-3xl shadow-sm border relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                  index === 0 
                    ? 'bg-gradient-to-br from-[#5B7553] to-[#4A6342] text-white border-transparent' 
                    : 'bg-gradient-to-br from-[#1C2620] to-[#2B3B31] text-[#EDEAE2] border-[#2D3A31]'
                }`}
              >
                <div>
                  <Badge className={`font-black text-[9px] uppercase px-2 py-0.5 rounded-md ${
                    index === 0 
                      ? 'bg-[#C9A876] text-[#1C2620] hover:bg-[#C9A876]' 
                      : 'bg-[#5B7553] text-white hover:bg-[#5B7553]'
                  }`}>
                    Agenda
                  </Badge>
                  <h4 className="text-base font-extrabold mt-2 leading-snug">{act.nama_kegiatan}</h4>
                  <p className={`text-xs mt-1 line-clamp-2 ${index === 0 ? 'text-white/80' : 'text-[#EDEAE2]/85'}`}>{act.deskripsi}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-[10px] font-bold ${index === 0 ? 'text-white/60' : 'text-[#EDEAE2]/60'}`}>
                    {act.tanggal} • {act.waktu_mulai}-{act.waktu_selesai}
                  </span>
                  {act.lokasi && (
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${index === 0 ? 'bg-white/10 text-white' : 'bg-white/5 text-[#EDEAE2]'}`}>
                      📍 {act.lokasi}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Switcher if parent has > 1 child */}
      {children.length > 1 && (
        <div className="bg-white dark:bg-[#1C2621] p-4 rounded-3xl border border-[#E3DEC6] dark:border-[#2D3A33] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 text-xs text-[#5B6350] dark:text-[#A0A898] font-black uppercase tracking-wider">
            <User className="h-4 w-4 text-[#5B7553]" />
            <span>Pilih Data Anak:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedChild?.id === child.id
                    ? 'bg-[#5B7553] text-[#F7F5F0] border-[#5B7553] shadow-sm'
                    : 'bg-white dark:bg-[#1C2621] text-[#1C2620] dark:text-[#EDEAE2] border-[#E3DEC6] dark:border-[#2D3A33] hover:bg-[#F7F5F0]/60 dark:hover:bg-[#2D3A33]/50'
                }`}
              >
                {child.nama}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Child Information Profile Card */}
      {selectedChild && (
        <div className="bg-white dark:bg-[#1C2621] p-6 rounded-3xl border border-[#E3DEC6] dark:border-[#2D3A33] shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E3DEC6]/60 dark:border-[#2D3A33]/60">
            <User className="h-4.5 w-4.5 text-[#5B7553]" />
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-[#1C2620] dark:text-[#EDEAE2]">Detail Profil Akademik Santri</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] block">Nama Santri</span>
              <span className="text-sm font-bold text-[#1C2620] dark:text-[#EDEAE2] block">{selectedChild.nama}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] block">Nomor Induk Santri (NIS)</span>
              <span className="text-sm font-bold text-[#1C2620] dark:text-[#EDEAE2] block">{selectedChild.nis}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] block">Wali / Orang Tua</span>
              <span className="text-sm font-bold text-[#1C2620] dark:text-[#EDEAE2] block">{parentName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] block">Kelas / Halaqah</span>
              <span className="text-sm font-bold text-[#1C2620] dark:text-[#EDEAE2] block">
                {selectedChild.kelas ? selectedChild.kelas : 'Belum Ditentukan'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Fitur Cepat (Quick Access Menu) */}
      <div className="space-y-3">
        <h3 className="font-heading text-xs font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">
          Menu Layanan Portal Wali
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Presensi Kehadiran', desc: 'Rekap kehadiran & sakit/izin', path: '/absensi', icon: CheckSquare, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
            { title: 'Setoran Hafalan', desc: 'Riwayat setoran & target Juz', path: '/hafalan', icon: BookOpen, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
            { title: 'Laporan Rapor', desc: 'Nilai ujian & evaluasi mapel', path: '/nilai', icon: Award, color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' },
            { title: 'Agenda Kegiatan', desc: 'Kalender & lokasi kegiatan', path: '/kegiatan', icon: Calendar, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' },
            { title: 'Pengaturan Akun', desc: 'Ubah sandi & whatsapp wali', path: '/pengaturan', icon: Settings, color: 'text-slate-600 bg-slate-50 dark:bg-slate-500/10' }
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] p-5 rounded-3xl shadow-sm text-left hover:shadow-md hover:border-[#5B7553] dark:hover:border-[#5B7553] transition-all hover:scale-[1.03] duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
            >
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <span className="text-xs font-black text-[#1C2620] dark:text-[#EDEAE2] block leading-snug group-hover:text-[#5B7553] transition-colors">{item.title}</span>
                <span className="text-[10px] text-[#5B6350] dark:text-[#A0A898] mt-1 block leading-relaxed line-clamp-2">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaliDashboard;
