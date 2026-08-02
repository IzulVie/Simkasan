import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSantri } from '../santri/useSantri';
import { useHafalan } from '../hafalan/useHafalan';
import { useAbsensi } from '../absensi/useAbsensi';
import { 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  UserCheck, 
  Plus, 
  Clock, 
  Play, 
  Pause, 
  Square,
  ArrowUpRight,
  Bookmark
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const UstadzDashboard = () => {
  const { user } = useAuth();
  
  // Fetch real data
  const { santris } = useSantri();
  const { records: hafalanRecords } = useHafalan();
  
  // Calculate dynamic stats
  const totalBimbingan = santris?.length || 15;
  const setoranHariIni = hafalanRecords?.filter(r => r.ustadz_id === user?.id)?.length || 8;

  // Live Timer State
  const [time, setTime] = useState(5048); // 01:24:08 in seconds
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  const assignedClasses = [
    { name: 'Kelas 7A (Halaqah Utsman)', time: '08:00 - 10:00 WIB', count: '15 Santri', room: 'Masjid Lantai 1' },
    { name: 'Kelas 7B (Halaqah Ali)', time: '13:00 - 15:00 WIB', count: '12 Santri', room: 'Gazebo Barat' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4">
        <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Dashboard</h1>
        <p className="text-xs text-[#5B6350] mt-0.5">Plan, prioritize, and accomplish your tasks with ease.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Highlighted Green Card */}
        <div className="bg-[#5B7553] text-[#F7F5F0] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EDEAE2]/80">Santri Bimbingan</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight">{totalBimbingan}</h3>
          <p className="text-[10px] mt-4 text-[#EDEAE2]/90 flex items-center gap-1">
            <span className="bg-white/20 px-1.5 py-0.5 rounded font-black">Aktif</span> semester ganjil
          </p>
        </div>

        {/* Card 2: White Card */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F7F5F0] flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-[#5B7553]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B6350]">Halaqah Diampu</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight text-[#1C2620]">2</h3>
          <p className="text-[10px] mt-4 text-[#5B6350] flex items-center gap-1">
            <span className="bg-[#5B7553]/10 text-[#5B7553] px-1.5 py-0.5 rounded font-black">Harian</span> terjadwal
          </p>
        </div>

        {/* Card 3: White Card */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F7F5F0] flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-[#5B7553]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B6350]">Setoran Bimbingan</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight text-[#1C2620]">{setoranHariIni}</h3>
          <p className="text-[10px] mt-4 text-[#5B6350] flex items-center gap-1">
            <span className="bg-[#5B7553]/10 text-[#5B7553] px-1.5 py-0.5 rounded font-black">Hari Ini</span> disimak
          </p>
        </div>

        {/* Card 4: White Card */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F7F5F0] flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-[#5B7553]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B6350]">Rasio Kehadiran</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight text-[#1C2620]">96.8%</h3>
          <p className="text-[10px] mt-4 text-[#5B6350] flex items-center gap-1">
            <span className="bg-emerald-500/10 text-emerald-800 px-1.5 py-0.5 rounded font-black">Sangat Baik</span> kehadiran santri
          </p>
        </div>
      </div>

      {/* Middle Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action Panels (3 items) */}
        <div className="lg:col-span-2 bg-white border border-[#E3DEC6] p-6 rounded-3xl shadow-sm">
          <h4 className="font-heading font-bold text-sm text-[#1C2620] mb-4">Pintasan Aktivitas Pengajar</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#E3DEC6] p-5 rounded-2xl flex flex-col justify-between hover:bg-[#F7F5F0]/30 transition-all">
              <div>
                <BookOpen className="h-6 w-6 text-[#5B7553] mb-3" />
                <h5 className="font-bold text-xs text-[#1C2620]">Simak Hafalan</h5>
                <p className="text-[10px] text-[#5B6350] mt-1">Input setoran hafalan juz/surah baru santri.</p>
              </div>
              <Button className="mt-4 bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] text-[10px] py-1.5 h-8">Setoran Baru</Button>
            </div>

            <div className="border border-[#E3DEC6] p-5 rounded-2xl flex flex-col justify-between hover:bg-[#F7F5F0]/30 transition-all">
              <div>
                <CheckSquare className="h-6 w-6 text-[#C9A876] mb-3" />
                <h5 className="font-bold text-xs text-[#1C2620]">Catat Absen</h5>
                <p className="text-[10px] text-[#5B6350] mt-1">Isi daftar absensi santri bimbingan.</p>
              </div>
              <Button className="mt-4 bg-[#1C2620] hover:bg-[#151D18] text-[#EDEAE2] text-[10px] py-1.5 h-8">Isi Kehadiran</Button>
            </div>

            <div className="border border-[#E3DEC6] p-5 rounded-2xl flex flex-col justify-between hover:bg-[#F7F5F0]/30 transition-all">
              <div>
                <Calendar className="h-6 w-6 text-[#8B3A3A] mb-3" />
                <h5 className="font-bold text-xs text-[#1C2620]">Agenda Kajian</h5>
                <p className="text-[10px] text-[#5B6350] mt-1">Kalender kegiatan kajian kepesantrenan.</p>
              </div>
              <Button variant="outline" className="mt-4 border-[#E3DEC6] text-xs text-[10px] py-1.5 h-8">Lihat Jadwal</Button>
            </div>
          </div>
        </div>

        {/* Live Timer Card (Dark Green card layout mimicking the image) */}
        <div className="bg-[#1C2620] text-[#EDEAE2] p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#5B7553]/20 via-transparent to-transparent pointer-events-none" />
          
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#EDEAE2]/50">Durasi Sesi Halaqah</span>
            <div className="mt-4">
              <h2 className="text-4xl font-heading font-black tracking-widest text-[#F7F5F0]">
                {formatTime(time)}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 relative z-10">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F5F0] flex items-center justify-center transition-colors"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </button>
            
            <button 
              onClick={() => { setTime(0); setIsRunning(false); }}
              className="h-10 w-10 rounded-full bg-[#8B3A3A]/25 hover:bg-[#8B3A3A]/45 text-[#EDEAE2] flex items-center justify-center transition-colors"
            >
              <Square className="h-4 w-4 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Assigned Halaqah Grid */}
      <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl shadow-sm">
        <h4 className="font-heading font-bold text-sm text-[#1C2620] mb-4">Daftar Halaqah Bimbingan Anda</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedClasses.map((hal, idx) => (
            <div key={idx} className="border border-[#E3DEC6] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h5 className="font-heading text-sm font-bold text-[#1C2620]">{hal.name}</h5>
                <p className="text-xs text-[#5B6350] mt-0.5">{hal.count} • {hal.room}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-[#5B7553]/10 text-[#5B7553] px-2 py-0.5 rounded-full font-bold">
                  {hal.time}
                </span>
                <Button variant="link" className="text-[#5B7553] hover:text-[#4E6446] p-0 h-auto font-bold text-xs">
                  Buka Halaqah
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UstadzDashboard;
