import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  LogOut, 
  GraduationCap, 
  CheckSquare, 
  FileText,
  Menu,
  X,
  Search,
  Mail,
  Bell,
  Settings,
  HelpCircle,
  Award
} from 'lucide-react';
import { Button } from './ui/button';

export const SidebarLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('simkasan-theme') || 'system';
    if (saved === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return saved;
  });

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem('simkasan-theme') || 'system';
    let nextTheme = 'light';
    if (currentTheme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      nextTheme = isSystemDark ? 'light' : 'dark';
    } else {
      nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    }
    setTheme(nextTheme);
    localStorage.setItem('simkasan-theme', nextTheme);
    window.dispatchEvent(new Event('theme-change'));
  };

  React.useEffect(() => {
    const applyTheme = () => {
      const saved = localStorage.getItem('simkasan-theme') || 'system';
      let resolved = saved;
      if (saved === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setTheme(resolved);
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    window.addEventListener('theme-change', applyTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const saved = localStorage.getItem('simkasan-theme') || 'system';
      if (saved === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      window.removeEventListener('theme-change', applyTheme);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.roles?.includes('admin');
  const isUstadz = user?.roles?.includes('ustadz');

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      show: true
    },
    {
      title: 'Master Data',
      path: '/master-data',
      icon: Users,
      show: isAdmin
    },
    {
      title: 'Absensi',
      path: '/absensi',
      icon: CheckSquare,
      show: isUstadz || isAdmin
    },
    {
      title: 'Hafalan & Tahfidz',
      path: '/hafalan',
      icon: BookOpen,
      show: isUstadz || isAdmin
    },
    {
      title: 'Nilai Akademik',
      path: '/nilai',
      icon: GraduationCap,
      show: isUstadz || isAdmin
    },
    {
      title: 'Kegiatan & Jadwal',
      path: '/kegiatan',
      icon: Calendar,
      show: isUstadz || isAdmin
    }
  ];

  const activeItem = menuItems.find(item => location.pathname.startsWith(item.path)) || menuItems[0];

  return (
    <div className="flex min-h-screen bg-[#F7F5F0] dark:bg-[#121815] transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-[#1C2621] border-r border-[#E3DEC6] dark:border-[#2D3A33] justify-between transition-colors duration-300">
        <div className="flex flex-col flex-1">
          {/* Logo Area */}
          <div className="flex h-16 items-center px-6 border-b border-[#E3DEC6] dark:border-[#2D3A33] gap-2">
            <div className="h-6 w-6 rounded-full border-4 border-[#5B7553] flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-[#5B7553]" />
            </div>
            <span className="font-heading text-base font-black tracking-tight text-[#1C2620] dark:text-[#EDEAE2]">SIMKASAN</span>
          </div>
          
          {/* Navigation Menu */}
          <div className="px-4 py-6 space-y-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-[#5B6350]/60 dark:text-[#A0A898]/60 px-4 mb-2">Menu</p>
              <nav className="space-y-1">
                {menuItems.filter(item => item.show).map((item) => {
                  const isActive = location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/dashboard');
                  return (
                    <Link
                      key={item.title}
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-2.5 text-xs font-bold rounded-xl transition-all relative ${
                        isActive 
                          ? 'bg-[#5B7553]/10 text-[#1C2620] dark:text-[#EDEAE2]' 
                          : 'text-[#5B6350] dark:text-[#A0A898] hover:bg-[#F7F5F0]/65 dark:hover:bg-[#2D3A33]/50 hover:text-[#1C2620] dark:hover:text-[#EDEAE2]'
                      }`}
                    >
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#5B7553] rounded-r" />}
                      <div className="flex items-center">
                        <item.icon className={`mr-3 h-4.5 w-4.5 ${isActive ? 'text-[#5B7553]' : 'text-[#5B6350]/70'}`} />
                        {item.title}
                      </div>
                      {item.title === 'Hafalan & Tahfidz' && (
                        <span className="bg-[#5B7553] text-[#F7F5F0] text-[8px] font-bold px-1.5 py-0.5 rounded-full">12+</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-[#5B6350]/60 dark:text-[#A0A898]/60 px-4 mb-2">General</p>
              <nav className="space-y-1">
                <Link
                  to="/pengaturan"
                  className="flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-[#5B6350] dark:text-[#A0A898] hover:bg-[#F7F5F0]/65 dark:hover:bg-[#2D3A33]/50 hover:text-[#1C2620] dark:hover:text-[#EDEAE2] transition-colors"
                >
                  <Settings className="mr-3 h-4.5 w-4.5 text-[#5B6350]/70" />
                  Pengaturan
                </Link>
                <Link
                  to="/bantuan"
                  className="flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-[#5B6350] dark:text-[#A0A898] hover:bg-[#F7F5F0]/65 dark:hover:bg-[#2D3A33]/50 hover:text-[#1C2620] dark:hover:text-[#EDEAE2] transition-colors"
                >
                  <HelpCircle className="mr-3 h-4.5 w-4.5 text-[#5B6350]/70" />
                  Bantuan
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-[#8B3A3A] hover:bg-[#8B3A3A]/5 dark:hover:bg-[#8B3A3A]/10 transition-colors text-left"
                >
                  <LogOut className="mr-3 h-4.5 w-4.5 text-[#8B3A3A]" />
                  Keluar Akun
                </button>
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation bar */}
      <div className="flex flex-col flex-1">
        <header className="flex h-16 items-center justify-between px-4 bg-white dark:bg-[#1C2621] border-b border-[#E3DEC6] dark:border-[#2D3A33] text-[#1C2620] dark:text-[#EDEAE2] md:hidden">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full border-4 border-[#5B7553] flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#5B7553]" />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-[#1C2620] dark:text-[#EDEAE2]">SIMKASAN</span>
          </div>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A33]/50 text-[#1C2620] dark:text-[#EDEAE2]"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)}></div>
            <div className="relative flex w-64 max-w-xs flex-col bg-white dark:bg-[#1C2621] border-r border-[#E3DEC6] dark:border-[#2D3A33] pt-5 pb-4">
              <div className="flex items-center px-6 pb-4 border-b border-[#E3DEC6] dark:border-[#2D3A33] gap-2">
                <div className="h-6 w-6 rounded-full border-4 border-[#5B7553] flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-[#5B7553]" />
                </div>
                <span className="font-heading text-base font-black tracking-tight text-[#1C2620] dark:text-[#EDEAE2]">SIMKASAN</span>
              </div>
              <div className="mt-5 flex-1 space-y-6 px-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#5B6350]/60 dark:text-[#A0A898]/60 px-4 mb-2">Menu</p>
                  <nav className="space-y-1">
                    {menuItems.filter(item => item.show).map((item) => {
                      const isActive = location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/dashboard');
                      return (
                        <Link
                          key={item.title}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                            isActive 
                              ? 'bg-[#5B7553]/10 text-[#1C2620] dark:text-[#EDEAE2]' 
                              : 'text-[#5B6350] dark:text-[#A0A898] hover:bg-[#F7F5F0]/65 dark:hover:bg-[#2D3A33]/50 hover:text-[#1C2620] dark:hover:text-[#EDEAE2]'
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className={`mr-3 h-4.5 w-4.5 ${isActive ? 'text-[#5B7553]' : 'text-[#5B6350]/70'}`} />
                            {item.title}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                 <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#5B6350]/60 dark:text-[#A0A898]/60 px-4 mb-2">General</p>
                  <nav className="space-y-1">
                    <Link
                      to="/pengaturan"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-[#5B6350] dark:text-[#A0A898] hover:bg-[#F7F5F0]/65 dark:hover:bg-[#2D3A33]/50 hover:text-[#1C2620] dark:hover:text-[#EDEAE2] transition-colors"
                    >
                      <Settings className="mr-3 h-4.5 w-4.5 text-[#5B6350]/70" />
                      Pengaturan
                    </Link>
                    <Link
                      to="/bantuan"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-[#5B6350] dark:text-[#A0A898] hover:bg-[#F7F5F0]/65 dark:hover:bg-[#2D3A33]/50 hover:text-[#1C2620] dark:hover:text-[#EDEAE2] transition-colors"
                    >
                      <HelpCircle className="mr-3 h-4.5 w-4.5 text-[#5B6350]/70" />
                      Bantuan
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="w-full flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-[#8B3A3A] hover:bg-[#8B3A3A]/5 dark:hover:bg-[#8B3A3A]/10 transition-colors text-left"
                    >
                      <LogOut className="mr-3 h-4.5 w-4.5 text-[#8B3A3A]" />
                      Keluar Akun
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Donezo Style Top Bar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] p-4 rounded-3xl gap-4 shadow-sm transition-colors duration-300">
              {/* Theme Toggle Button on the Left */}
              <div className="flex items-center self-start md:self-auto pl-1">
                <button
                  onClick={toggleTheme}
                  className="relative flex items-center w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-500 overflow-hidden shadow-inner border border-[#E3DEC6] focus:outline-none focus-visible:outline-none select-none"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0F172A' : '#FDE047',
                  }}
                  title="Toggle Tema Antarmuka"
                >
                  {/* Sky Details: Stars for Dark Mode */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="absolute top-1.5 right-6 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
                    <span className="absolute top-3 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-80 animate-pulse" />
                    <span className="absolute top-2 right-4 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
                    <svg className="absolute right-2 top-2 h-4 w-4 text-[#EDEAE2] fill-current" viewBox="0 0 24 24">
                      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  </div>

                  {/* Sky Details: Sun for Light Mode */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${theme !== 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                    <svg 
                      className="absolute left-2 top-2 h-4 w-4 text-[#E2A737] fill-current" 
                      style={{ animation: 'spin 12s linear infinite' }}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Mountain outlines at the bottom */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-3 flex items-end pointer-events-none transition-colors duration-500"
                    style={{ color: theme === 'dark' ? '#1E293B' : '#E2A737' }}
                  >
                    <svg className="w-full h-full fill-current" viewBox="0 0 64 12" preserveAspectRatio="none">
                      {/* Back peak */}
                      <path d="M10 12 L28 3 L48 12" opacity="0.6" />
                      {/* Front peaks */}
                      <path d="M-5 12 L15 5 L35 12" />
                      <path d="M25 12 L45 2 L68 12" />
                    </svg>
                  </div>

                  {/* Circle Toggle Knob */}
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-500 ease-in-out z-10 flex items-center justify-center ${
                      theme === 'dark' ? 'translate-x-0' : 'translate-x-8'
                    }`}
                  >
                    {/* Inner glowing circle */}
                    <div className="w-4 h-4 rounded-full bg-[#F1F5F9]/30" />
                  </div>
                </button>
              </div>

              {/* User and Notification Area */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <button className="h-9 w-9 rounded-full bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] flex items-center justify-center text-[#1C2620] dark:text-[#EDEAE2] hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A33]/50 transition-colors shadow-sm">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="h-9 w-9 rounded-full bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] flex items-center justify-center text-[#1C2620] dark:text-[#EDEAE2] hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A33]/50 transition-colors shadow-sm">
                    <Bell className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#5B7553] flex items-center justify-center text-white font-bold text-sm shadow-sm border border-[#E3DEC6] dark:border-[#2D3A33]">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-[#1C2620] dark:text-[#EDEAE2] leading-none">{user?.name}</p>
                    <p className="text-[9px] text-[#5B6350] dark:text-[#A0A898] mt-1 leading-none">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Children routes rendered here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const WaliLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('simkasan-theme') || 'system';
    if (saved === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return saved;
  });

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem('simkasan-theme') || 'system';
    let nextTheme = 'light';
    if (currentTheme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      nextTheme = isSystemDark ? 'light' : 'dark';
    } else {
      nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    }
    setTheme(nextTheme);
    localStorage.setItem('simkasan-theme', nextTheme);
    window.dispatchEvent(new Event('theme-change'));
  };

  React.useEffect(() => {
    const applyTheme = () => {
      const saved = localStorage.getItem('simkasan-theme') || 'system';
      let resolved = saved;
      if (saved === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setTheme(resolved);
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    window.addEventListener('theme-change', applyTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const saved = localStorage.getItem('simkasan-theme') || 'system';
      if (saved === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      window.removeEventListener('theme-change', applyTheme);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#121815] flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <header className="bg-[#1C2620] text-[#EDEAE2] shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Info */}
          <div className="flex items-center gap-3 shrink-0">
            <GraduationCap className="h-7 w-7 text-[#C9A876]" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-heading font-extrabold text-base md:text-lg tracking-wider text-[#F7F5F0]">SIMKASAN</span>
              <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#2D3A31] text-[#C9A876]">
                Portal Wali
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 lg:gap-6 text-[10px] font-black uppercase tracking-wider text-[#EDEAE2]/75">
            <Link to="/dashboard" className="hover:text-[#C9A876] transition-colors py-1">Beranda</Link>
            <Link to="/absensi" className="hover:text-[#C9A876] transition-colors py-1">Kehadiran</Link>
            <Link to="/hafalan" className="hover:text-[#C9A876] transition-colors py-1">Hafalan</Link>
            <Link to="/nilai" className="hover:text-[#C9A876] transition-colors py-1">Rapor Nilai</Link>
            <Link to="/kegiatan" className="hover:text-[#C9A876] transition-colors py-1">Agenda</Link>
            <Link to="/pengaturan" className="hover:text-[#C9A876] transition-colors py-1">Pengaturan</Link>
            <Link to="/bantuan" className="hover:text-[#C9A876] transition-colors py-1">Bantuan</Link>
          </nav>

          {/* Theme, Profile & Logout */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center w-14 h-7 rounded-full p-0.5 cursor-pointer transition-all duration-500 overflow-hidden shadow-inner border border-[#2D3A31] focus:outline-none focus-visible:outline-none select-none shrink-0"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FDE047',
              }}
              title="Toggle Tema Antarmuka"
            >
              {/* Sky Details: Stars for Dark Mode */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                <span className="absolute top-1 right-5 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
                <span className="absolute top-2 right-6 w-0.5 h-0.5 bg-white rounded-full opacity-80 animate-pulse" />
                <svg className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-[#EDEAE2] fill-current" viewBox="0 0 24 24">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              </div>

              {/* Sky Details: Sun for Light Mode */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${theme !== 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                <svg 
                  className="absolute left-1.5 top-1.5 h-3.5 w-3.5 text-[#E2A737] fill-current" 
                  style={{ animation: 'spin 12s linear infinite' }}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Mountain outlines at the bottom */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-2 flex items-end pointer-events-none transition-colors duration-500"
                style={{ color: theme === 'dark' ? '#1E293B' : '#E2A737' }}
              >
                <svg className="w-full h-full fill-current" viewBox="0 0 64 12" preserveAspectRatio="none">
                  <path d="M10 12 L28 3 L48 12" opacity="0.6" />
                  <path d="M-5 12 L15 5 L35 12" />
                  <path d="M25 12 L45 2 L68 12" />
                </svg>
              </div>

              {/* Circle Toggle Knob */}
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow transform transition-transform duration-500 ease-in-out z-10 flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-0' : 'translate-x-7'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#F1F5F9]/30" />
              </div>
            </button>

            {/* Profile Avatar and Name */}
            <div className="flex items-center gap-2.5">
              <div className="h-8.5 w-8.5 rounded-full bg-[#5B7553] flex items-center justify-center text-[#F7F5F0] font-black text-xs shadow-sm border border-[#2D3A31]">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-black text-[#F7F5F0] leading-none">{user?.name}</p>
                <p className="text-[9px] text-[#EDEAE2]/60 mt-1 leading-none">Wali Santri</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="border border-[#EDEAE2]/15 text-[#EDEAE2] hover:bg-[#2D3A31] hover:text-[#F7F5F0] bg-[#2D3A31]/30 h-8.5 px-3.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar for parents */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1C2620] border-t border-[#2D3A31]/50 h-16 px-4 z-40 flex items-center justify-around select-none shadow-lg">
        {/* Beranda */}
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            location.pathname === '/dashboard' ? 'text-[#C9A876]' : 'text-[#EDEAE2]/55'
          }`}
        >
          {location.pathname === '/dashboard' && <span className="absolute top-0 w-8 h-0.5 bg-[#C9A876] rounded-full animate-pulse" />}
          <LayoutDashboard className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Beranda</span>
        </Link>

        {/* Kehadiran */}
        <Link 
          to="/absensi" 
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            location.pathname === '/absensi' ? 'text-[#C9A876]' : 'text-[#EDEAE2]/55'
          }`}
        >
          {location.pathname === '/absensi' && <span className="absolute top-0 w-8 h-0.5 bg-[#C9A876] rounded-full animate-pulse" />}
          <CheckSquare className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Kehadiran</span>
        </Link>

        {/* Hafalan (Raised Middle Button) */}
        <div className="flex-1 flex justify-center h-full relative">
          <Link 
            to="/hafalan" 
            className={`absolute -top-4.5 h-13 w-13 rounded-full border-4 border-[#F7F5F0] dark:border-[#121815] shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-200 z-10 ${
              location.pathname === '/hafalan' ? 'bg-[#C9A876]' : 'bg-[#5B7553]'
            }`}
          >
            <BookOpen className="h-5.5 w-5.5 text-white" />
          </Link>
          <span className={`text-[9px] font-black uppercase tracking-wider mt-10 ${
            location.pathname === '/hafalan' ? 'text-[#C9A876]' : 'text-[#EDEAE2]/55'
          }`}>
            Hafalan
          </span>
        </div>

        {/* Rapor Nilai */}
        <Link 
          to="/nilai" 
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            location.pathname === '/nilai' ? 'text-[#C9A876]' : 'text-[#EDEAE2]/55'
          }`}
        >
          {location.pathname === '/nilai' && <span className="absolute top-0 w-8 h-0.5 bg-[#C9A876] rounded-full animate-pulse" />}
          <Award className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Rapor</span>
        </Link>

        {/* Lainnya */}
        <button 
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            showMoreMenu ? 'text-[#C9A876]' : 'text-[#EDEAE2]/55'
          }`}
        >
          <Menu className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Lainnya</span>
        </button>
      </div>

      {/* More Menu Drawer/Modal */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowMoreMenu(false)}></div>
          
          {/* Sheet */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C2621] rounded-t-[32px] p-6 shadow-2xl border-t border-[#E3DEC6] dark:border-[#2D3A33] animate-in slide-in-from-bottom duration-300 select-none">
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-[#E3DEC6] dark:bg-[#2D3A33] rounded-full mx-auto mb-6"></div>
            
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] mb-4">Layanan Lainnya</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Link 
                to="/kegiatan" 
                onClick={() => setShowMoreMenu(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A33]/50 text-[#1C2620] dark:text-[#EDEAE2]"
              >
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold">Agenda</span>
              </Link>

              <Link 
                to="/pengaturan" 
                onClick={() => setShowMoreMenu(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A33]/50 text-[#1C2620] dark:text-[#EDEAE2]"
              >
                <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-500/10 text-slate-600 flex items-center justify-center">
                  <Settings className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold">Setelan</span>
              </Link>

              <Link 
                to="/bantuan" 
                onClick={() => setShowMoreMenu(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A33]/50 text-[#1C2620] dark:text-[#EDEAE2]"
              >
                <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold">Bantuan</span>
              </Link>
            </div>
            
            <button
              onClick={() => {
                setShowMoreMenu(false);
                handleLogout();
              }}
              className="w-full py-3.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 border border-rose-100 dark:border-transparent cursor-pointer hover:bg-rose-100/50"
            >
              <LogOut className="h-4 w-4" />
              Keluar Akun
            </button>
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1C2620]/10 border-t border-[#E3DEC6] dark:border-[#2D3A33] py-6 text-center text-xs text-[#5B6350] dark:text-[#A0A898] pb-28 lg:pb-6">
        <p>&copy; {new Date().getFullYear()} SIMKASAN - Sistem Informasi Kegiatan Santri. All rights reserved.</p>
      </footer>
    </div>
  );
};
