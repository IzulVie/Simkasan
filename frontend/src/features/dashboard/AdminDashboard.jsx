import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSantri } from '../santri/useSantri';
import { useHafalan } from '../hafalan/useHafalan';
import { useKegiatan } from '../kegiatan/useKegiatan';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  Play, 
  Pause, 
  Square,
  Search,
  Bell,
  Mail,
  Plus,
  Compass,
  PlusCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Real data hooks
  const { santris } = useSantri();
  const { records: hafalanRecords } = useHafalan();
  const { activities } = useKegiatan();

  // Calculate stats dynamically
  const totalSantri = santris?.length || 142;
  const totalKelas = 12; // Static/dynamic placeholder
  const setoranHariIni = hafalanRecords?.length || 38;
  const agendaCount = activities?.length || 3;

  // Live Time Tracker State (mimicking the bottom right card)
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

  // Mock list of Ustadz (Team Collaboration equivalent)
  const ustadzList = [
    { name: 'Ustadz Ahmad Fulan', role: 'Halaqah Utsman (Juz 30)', status: 'Aktif', color: 'bg-emerald-500/10 text-emerald-800' },
    { name: 'Ustadz Ali Mustofa', role: 'Halaqah Ali (Juz 29)', status: 'Aktif', color: 'bg-emerald-500/10 text-emerald-800' },
    { name: 'Ustadz Umar Faruq', role: 'Halaqah Umar (Juz 1-5)', status: 'Selesai Sesi', color: 'bg-[#C9A876]/20 text-[#8A6A3A]' },
    { name: 'Ustadz Usman Khatib', role: 'Halaqah Abu Bakar (Juz 6-10)', status: 'Aktif', color: 'bg-emerald-500/10 text-emerald-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navbar Header inside content area */}
      <div className="pb-4">
        <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Dashboard</h1>
        <p className="text-xs text-[#5B6350] mt-0.5">Plan, prioritize, and accomplish your tasks with ease.</p>
      </div>

      {/* Metrics Row (4 premium cards mimicking the image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Highlighted Green Card */}
        <div className="bg-[#5B7553] text-[#F7F5F0] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EDEAE2]/80">Total Santri Binaan</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight">{totalSantri}</h3>
          <p className="text-[10px] mt-4 text-[#EDEAE2]/90 flex items-center gap-1">
            <span className="bg-white/20 px-1.5 py-0.5 rounded font-black">↑ 5%</span> dari bulan lalu
          </p>
        </div>

        {/* Card 2: White Card */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F7F5F0] flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-[#5B7553]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B6350]">Halaqah & Kelas</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight text-[#1C2620]">{totalKelas}</h3>
          <p className="text-[10px] mt-4 text-[#5B6350] flex items-center gap-1">
            <span className="bg-[#5B7553]/10 text-[#5B7553] px-1.5 py-0.5 rounded font-black">↑ 10%</span> pembentukan kelas baru
          </p>
        </div>

        {/* Card 3: White Card */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F7F5F0] flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-[#5B7553]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B6350]">Setoran Hari Ini</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight text-[#1C2620]">{setoranHariIni}</h3>
          <p className="text-[10px] mt-4 text-[#5B6350] flex items-center gap-1">
            <span className="bg-[#5B7553]/10 text-[#5B7553] px-1.5 py-0.5 rounded font-black">↑ 12 Sesi</span> dibanding kemarin
          </p>
        </div>

        {/* Card 4: White Card */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-sm">
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F7F5F0] flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-[#5B7553]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B6350]">Kegiatan Terjadwal</span>
          <h3 className="text-4xl font-heading font-black mt-2 tracking-tight text-[#1C2620]">{agendaCount}</h3>
          <p className="text-[10px] mt-4 text-[#5B6350] flex items-center gap-1">
            <span className="bg-[#C9A876]/20 text-[#8A6A3A] px-1.5 py-0.5 rounded font-black">On Schedule</span> agenda terdekat
          </p>
        </div>
      </div>

      {/* Middle Layout (Analytics Chart, Upcoming Agenda, Setoran List) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Memorization Analytics (Project Analytics equivalent) */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1C2620] mb-1">Statistik Setoran Tahfidz</h4>
            <p className="text-[10px] text-[#5B6350] mb-6">Grafik tren akumulasi setoran ayat sepekan terakhir.</p>
            
            {/* Custom SVG Bar Chart with stripes style matching the image */}
            <div className="flex items-end justify-between h-36 px-2 mt-4">
              {[
                { label: 'S', value: '40%', active: false },
                { label: 'M', value: '75%', active: true },
                { label: 'T', value: '55%', active: false },
                { label: 'W', value: '90%', active: true },
                { label: 'T', value: '35%', active: false },
                { label: 'F', value: '45%', active: false },
                { label: 'S', value: '60%', active: false },
              ].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 w-7 relative pt-4">
                  <div className="w-full relative bg-[#F7F5F0] rounded-full h-28 flex flex-col justify-end">
                    {/* Track background with overflow-hidden for fill bar clipping */}
                    <div className="absolute inset-0 rounded-full overflow-hidden flex flex-col justify-end animate-in fade-in zoom-in duration-300">
                      {day.active ? (
                        <div 
                          style={{ height: day.value }} 
                          className="w-full bg-[#5B7553] rounded-full transition-all duration-500"
                        />
                      ) : (
                        // Diagonal stripes equivalent using SVG background pattern
                        <div 
                          style={{ height: day.value }} 
                          className="w-full bg-gradient-to-t from-[#EDEAE2] to-[#E3DEC6] rounded-full transition-all duration-500 opacity-60"
                        />
                      )}
                    </div>

                    {/* Floating label outside overflow-hidden */}
                    {day.active && (
                      <span 
                        style={{ bottom: `calc(${day.value} + 4px)` }}
                        className="absolute left-1/2 transform -translate-x-1/2 bg-[#5B7553] text-[#F7F5F0] text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 select-none animate-in slide-in-from-bottom-2 duration-300"
                      >
                        {day.value}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-[#5B6350]">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reminders / Agenda Card */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1C2620] mb-1">Agenda & Informasi</h4>
            <p className="text-[10px] text-[#5B6350] mb-6">Jadwal kegiatan terdekat yang harus dipantau.</p>
            
            <div className="bg-[#F7F5F0]/50 border border-[#E3DEC6] p-5 rounded-2xl space-y-2 mt-4">
              <h5 className="font-heading text-sm font-bold text-[#1C2620] leading-snug">Kajian Kitab Bulughul Maram Ba'da Ashar</h5>
              <div className="flex items-center gap-1.5 text-xs text-[#5B6350]">
                <Clock className="h-3.5 w-3.5 text-[#C9A876]" />
                <span>16:00 - 17:30 WIB</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold py-5 mt-6 flex items-center justify-center gap-1.5">
            <Play className="h-3 w-3 fill-current" /> Mulai Pertemuan / Sesi
          </Button>
        </div>

        {/* Setoran Terbaru (Project list equivalent) */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-sm text-[#1C2620]">Setoran Masuk</h4>
              <button className="text-[10px] font-extrabold text-[#5B7553] border border-[#5B7553]/20 px-2 py-0.5 rounded-lg hover:bg-[#F7F5F0]">
                + Baru
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'QS. An-Naba: 1-20', label: 'Muhammad Ali', color: 'bg-emerald-500' },
                { title: 'QS. An-Nazi\'at: 1-46', label: 'Aisyah Az-Zahra', color: 'bg-[#C9A876]' },
                { title: 'QS. Al-Mulk: 1-30', label: 'Zainuddin Malik', color: 'bg-[#5B7553]' },
                { title: 'QS. Al-Baqarah: 1-20', color: 'bg-[#8B3A3A]', label: 'Budi Pratama' },
              ].map((proj, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#F7F5F0] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${proj.color}`} />
                    <div>
                      <p className="text-xs font-bold text-[#1C2620]">{proj.title}</p>
                      <p className="text-[10px] text-[#5B6350]">{proj.label}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#5B6350] opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layout (Ustadz List, Circular Target, Sesi Halaqah Live Timer) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ustadz Pembimbing List (Team Collaboration equivalent) */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-sm text-[#1C2620]">Pengajar Halaqah</h4>
              <button className="text-[10px] font-extrabold text-[#5B7553] border border-[#5B7553]/20 px-2 py-0.5 rounded-lg hover:bg-[#F7F5F0]">
                + Tambah
              </button>
            </div>

            <div className="space-y-3">
              {ustadzList.map((ust, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#F7F5F0] border border-[#E3DEC6] flex items-center justify-center text-[#5B7553] font-bold text-xs">
                      {ust.name.charAt(8)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C2620]">{ust.name}</p>
                      <p className="text-[9px] text-[#5B6350]">{ust.role}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${ust.color}`}>
                    {ust.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Circular Target Progress (Project Progress equivalent) */}
        <div className="bg-white border border-[#E3DEC6] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1C2620] mb-1">Target Hafalan Pesantren</h4>
            <p className="text-[10px] text-[#5B6350] mb-4">Rasio ketuntasan target hafalan dari seluruh santri.</p>
            
            {/* Circular Ring SVG Layout */}
            <div className="relative flex items-center justify-center h-32 mt-4">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-[#EDEAE2]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-[#5B7553]"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="283"
                  strokeDashoffset="75" // ~74% progress fill
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-heading font-black text-[#1C2620]">74%</span>
                <span className="text-[9px] text-[#5B6350] uppercase font-bold">Target Juz</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-[9px] font-bold uppercase tracking-wider mt-4">
            <span className="flex items-center gap-1 text-[#5B7553]"><span className="h-2 w-2 rounded-full bg-[#5B7553]" /> Khatam</span>
            <span className="flex items-center gap-1 text-[#C9A876]"><span className="h-2 w-2 rounded-full bg-[#C9A876]" /> Berjalan</span>
            <span className="flex items-center gap-1 text-[#8B3A3A]"><span className="h-2 w-2 rounded-full bg-[#8B3A3A]" /> Tertinggal</span>
          </div>
        </div>

        {/* Live Timer Card (Dark Green card layout mimicking the image) */}
        <div className="bg-[#1C2620] text-[#EDEAE2] p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Abstract background graphics */}
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
    </div>
  );
};

export default AdminDashboard;
