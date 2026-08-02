import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  User, 
  Shield, 
  Mail, 
  Bell, 
  Smartphone, 
  Moon, 
  Sun,
  Laptop,
  Lock,
  Save,
  CheckCircle2
} from 'lucide-react';

const PengaturanPage = () => {
  const { user } = useAuth();
  
  // Settings forms local states (Mocks)
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('simkasan-theme') || 'system';
  });
  const [language, setLanguage] = useState('id');
  const [notifWeb, setNotifWeb] = useState(true);
  const [notifWA, setNotifWA] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const changeTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('simkasan-theme', newTheme);
    
    // Apply immediate dark class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Dispatch global event to sync header toggle knob immediately
    window.dispatchEvent(new Event('theme-change'));
  };

  React.useEffect(() => {
    const handleThemeChange = () => {
      setThemeState(localStorage.getItem('simkasan-theme') || 'system');
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header Block */}
      <div className="pb-2">
        <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Pengaturan</h1>
        <p className="text-xs text-[#5B6350] mt-0.5">Kelola informasi profil, kata sandi, dan setelan preferensi aplikasi Anda.</p>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Pengaturan Anda berhasil diperbarui dan disimpan secara lokal.</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-[#5B7553] flex items-center justify-center text-white font-extrabold text-3xl shadow-sm border border-[#E3DEC6] mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-heading text-lg font-black text-[#1C2620]">{user?.name}</h3>
              <p className="text-xs text-[#5B6350] mt-0.5">{user?.email}</p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {user?.roles?.map((role) => (
                  <Badge key={role} className="bg-[#5B7553]/15 text-[#5B7553] border-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg">
                    <Shield className="h-3 w-3 mr-1" /> {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-[#E3DEC6] pt-6 text-left space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] block">Status Akun</span>
                <span className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span> Aktif
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] block">Waktu Sesi Anda</span>
                <span className="text-xs text-[#1C2620] font-medium block mt-1">Hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Preferences Section */}
            <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6 space-y-6">
              <h3 className="font-heading text-[#1C2620] text-base font-black border-b border-[#E3DEC6] pb-3">Preferensi Sistem</h3>
              
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1">
                  <Sun className="h-3.5 w-3.5 text-[#5B6350]/80" /> Tema Antarmuka
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => changeTheme('light')}
                    className={`flex items-center justify-center gap-2 h-11 px-4 text-xs font-bold rounded-2xl border transition-all ${
                      theme === 'light'
                        ? 'border-[#5B7553] bg-[#5B7553]/10 text-[#5B7553]'
                        : 'border-[#E3DEC6] bg-white text-[#5B6350] hover:bg-[#F7F5F0]/60'
                    }`}
                  >
                    <Sun className="h-4 w-4" /> Mode Terang
                  </button>
                  <button
                    type="button"
                    onClick={() => changeTheme('dark')}
                    className={`flex items-center justify-center gap-2 h-11 px-4 text-xs font-bold rounded-2xl border transition-all ${
                      theme === 'dark'
                        ? 'border-[#5B7553] bg-[#5B7553]/10 text-[#5B7553]'
                        : 'border-[#E3DEC6] bg-white text-[#5B6350] hover:bg-[#F7F5F0]/60'
                    }`}
                  >
                    <Moon className="h-4 w-4" /> Mode Gelap
                  </button>
                  <button
                    type="button"
                    onClick={() => changeTheme('system')}
                    className={`flex items-center justify-center gap-2 h-11 px-4 text-xs font-bold rounded-2xl border transition-all ${
                      theme === 'system'
                        ? 'border-[#5B7553] bg-[#5B7553]/10 text-[#5B7553]'
                        : 'border-[#E3DEC6] bg-white text-[#5B6350] hover:bg-[#F7F5F0]/60'
                    }`}
                  >
                    <Laptop className="h-4 w-4" /> Otomatis (Default Sistem)
                  </button>
                </div>
              </div>
            </Card>

            {/* Notification Section */}
            <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6 space-y-4">
              <h3 className="font-heading text-[#1C2620] text-base font-black border-b border-[#E3DEC6] pb-3">Setelan Notifikasi</h3>
              
              <div className="space-y-4 pt-1">
                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/20 hover:bg-[#F7F5F0]/30 transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#5B7553]/15 flex items-center justify-center text-[#5B7553] mt-0.5">
                      <Bell className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1C2620] block">Notifikasi Web Browser</span>
                      <span className="text-[10px] text-[#5B6350] mt-0.5 block">Tampilkan pemberitahuan absensi atau kegiatan baru di sudut layar browser.</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifWeb}
                    onChange={(e) => setNotifWeb(e.target.checked)}
                    className="rounded border-[#E3DEC6] text-[#5B7553] focus:ring-[#5B7553] cursor-pointer h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/20 hover:bg-[#F7F5F0]/30 transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#C9A876]/15 flex items-center justify-center text-[#8A6A3A] mt-0.5">
                      <Smartphone className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1C2620] block">Laporan Harian WhatsApp (Mockup)</span>
                      <span className="text-[10px] text-[#5B6350] mt-0.5 block">Kirim rekap absensi dan setoran tahfidz otomatis ke nomor WhatsApp wali.</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifWA}
                    onChange={(e) => setNotifWA(e.target.checked)}
                    className="rounded border-[#E3DEC6] text-[#5B7553] focus:ring-[#5B7553] cursor-pointer h-4 w-4"
                  />
                </label>
              </div>
            </Card>

            {/* Change Password Placeholder Card */}
            <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6 space-y-4">
              <h3 className="font-heading text-[#1C2620] text-base font-black border-b border-[#E3DEC6] pb-3">Ubah Kata Sandi</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="old-pass" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Lock className="h-3 w-3 text-[#5B6350]/60" /> Kata Sandi Lama</Label>
                  <Input
                    id="old-pass"
                    type="password"
                    placeholder="Masukkan sandi lama"
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-pass" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Lock className="h-3 w-3 text-[#5B6350]/60" /> Kata Sandi Baru</Label>
                  <Input
                    id="new-pass"
                    type="password"
                    placeholder="Masukkan sandi baru"
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold h-11 px-6 flex items-center gap-1.5 shadow-sm"
              >
                <Save className="h-4 w-4" /> Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PengaturanPage;
