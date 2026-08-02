import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useKelas } from '../kelas/useKelas';
import { useAbsensi } from './useAbsensi';
import { useSantri } from '../santri/useSantri';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  ClipboardCheck, 
  Calendar, 
  Clock, 
  Users, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Loader2,
  ListFilter,
  Check,
  UserCheck
} from 'lucide-react';

const AbsensiPage = () => {
  const { user } = useAuth();
  const isWali = user?.roles?.includes('wali');
  const isStaff = user?.roles?.includes('admin') || user?.roles?.includes('ustadz');

  // Active Tab for Admin/Ustadz
  const [activeTab, setActiveTab] = useState('input'); // input, rekap

  // Staff Filters
  const { classes, isLoading: loadingKelas } = useKelas();
  const { santris } = useSantri();

  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSesi, setSelectedSesi] = useState('pagi'); // pagi, siang, sore, malam

  // Filter query states
  const [filterKelas, setFilterKelas] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch hook for Recap & History
  const filters = {
    ...(filterKelas && { kelas_id: filterKelas }),
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate }),
  };
  const { records, recap, isLoadingRecap, saveAttendance, isSaving } = useAbsensi(filters);

  // Active student list for attendance record sheet
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);

  // Auto select first class when classes are loaded
  useEffect(() => {
    if (classes.length > 0 && !selectedKelas) {
      setSelectedKelas(classes[0].id.toString());
      setFilterKelas(classes[0].id.toString());
    }
  }, [classes]);

  // Load students for marking
  const handleLoadStudents = () => {
    if (!selectedKelas) return;

    // Filter students belonging to selected class
    const classStudents = santris.filter(s => s.kelas_id === parseInt(selectedKelas));
    
    // Initialize sheet with default status 'hadir'
    const initialSheet = classStudents.map(student => ({
      santri_id: student.id,
      nama: student.nama,
      nis: student.nis,
      status: 'hadir', // default status
      keterangan: ''
    }));

    setAttendanceSheet(initialSheet);
    setAttendanceLoaded(true);
  };

  // Change individual student attendance status
  const handleStatusChange = (santriId, status) => {
    setAttendanceSheet(prev => 
      prev.map(item => item.santri_id === santriId ? { ...item, status } : item)
    );
  };

  // Change individual student remarks
  const handleKeteranganChange = (santriId, keterangan) => {
    setAttendanceSheet(prev => 
      prev.map(item => item.santri_id === santriId ? { ...item, keterangan } : item)
    );
  };

  // Quick action: Mark all as present
  const handleMarkAllHadir = () => {
    setAttendanceSheet(prev => prev.map(item => ({ ...item, status: 'hadir' })));
  };

  // Save attendance sheet
  const handleSaveAttendance = async () => {
    try {
      const payload = {
        tanggal: selectedTanggal,
        sesi: selectedSesi,
        items: attendanceSheet.map(item => ({
          santri_id: item.santri_id,
          status: item.status,
          keterangan: item.keterangan
        }))
      };
      await saveAttendance(payload);
      alert('Absensi berhasil disimpan.');
      setAttendanceLoaded(false);
      setAttendanceSheet([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan absensi.');
    }
  };

  // Render Wali/Parent view
  if (isWali) {
    return (
      <div className="space-y-6 flex flex-col">
        {/* Header Title */}
        <div className="pb-2">
          <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Rekap Kehadiran Ananda</h1>
          <p className="text-xs text-[#5B6350] mt-0.5">Pantau persentase dan rincian catatan absensi harian santri.</p>
        </div>

        {isLoadingRecap ? (
          <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
        ) : recap.length === 0 ? (
          <Card className="border-[#E3DEC6] bg-white rounded-3xl p-6 shadow-sm text-center">
            <p className="text-sm text-[#5B6350]">Belum ada riwayat absensi untuk ananda.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {recap.map((student) => (
              <Card key={student.santri_id} className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
                <div className="bg-[#F7F5F0] border-b border-[#E3DEC6] p-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-heading text-[#1C2620] text-lg font-black leading-tight">{student.nama}</h3>
                    <p className="text-xs text-[#5B6350] mt-1 font-bold">NIS: {student.nis}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#5B7553] tracking-tight">{student.persentase_kehadiran}%</span>
                    <p className="text-[9px] text-[#5B6350] font-black uppercase tracking-wider mt-0.5">Rasio Kehadiran</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Status counts bar */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[
                      { label: 'Hadir', count: student.rekap.hadir, color: 'bg-emerald-500/10 text-emerald-800' },
                      { label: 'Sakit', count: student.rekap.sakit, color: 'bg-amber-500/10 text-amber-800' },
                      { label: 'Izin', count: student.rekap.izin, color: 'bg-sky-500/10 text-sky-800' },
                      { label: 'Alpha', count: student.rekap.alpha, color: 'bg-[#8B3A3A]/10 text-[#8B3A3A]' },
                      { label: 'Lambat', count: student.rekap.terlambat, color: 'bg-[#C9A876]/10 text-[#8A6A3A]' }
                    ].map((st) => (
                      <div key={st.label} className={`p-2.5 rounded-xl ${st.color} flex flex-col justify-center items-center shadow-xs`}>
                        <div className="text-base font-black leading-none">{st.count}</div>
                        <div className="text-[8px] font-black uppercase tracking-wider mt-1.5 opacity-80 leading-none">{st.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Logs of the student */}
                  <div className="border border-[#E3DEC6] rounded-2xl overflow-hidden shadow-xs">
                    <Table>
                      <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                        <TableRow>
                          <TableHead className="py-2.5 pl-4 text-[9px] uppercase font-black text-[#5B6350] tracking-wider">Tanggal</TableHead>
                          <TableHead className="py-2.5 text-[9px] uppercase font-black text-[#5B6350] tracking-wider">Sesi</TableHead>
                          <TableHead className="py-2.5 text-[9px] uppercase font-black text-[#5B6350] tracking-wider">Status</TableHead>
                          <TableHead className="py-2.5 pr-4 text-[9px] uppercase font-black text-[#5B6350] tracking-wider">Keterangan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records
                          .filter(r => r.santri_id === student.santri_id)
                          .slice(0, 5)
                          .map((log) => (
                            <TableRow key={log.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                              <TableCell className="py-2.5 pl-4 text-xs font-bold text-[#1C2620]">{log.tanggal}</TableCell>
                              <TableCell className="py-2.5 text-xs text-[#5B6350] capitalize">{log.sesi}</TableCell>
                              <TableCell className="py-2.5">
                                <Badge variant="outline" className={`border-0 px-2 py-0.5 font-bold text-[9px] capitalize ${
                                  log.status === 'hadir' ? 'bg-emerald-500/10 text-emerald-800' :
                                  log.status === 'alpha' ? 'bg-[#8B3A3A]/10 text-[#8B3A3A]' :
                                  log.status === 'sakit' ? 'bg-amber-500/10 text-amber-800' :
                                  log.status === 'izin' ? 'bg-sky-500/10 text-sky-800' :
                                  'bg-[#C9A876]/10 text-[#8A6A3A]'
                                }`}>
                                  {log.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-2.5 pr-4 text-xs text-[#5B6350] italic truncate max-w-[120px]">{log.keterangan || '-'}</TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render Staff/Admin/Ustadz view
  return (
    <div className="space-y-6 flex flex-col">
      {/* Navigation Tabs (Premium Donezo capsule switcher) */}
      <div className="bg-white border border-[#E3DEC6] p-1 rounded-2xl inline-flex shadow-sm gap-1 self-start">
        <button
          onClick={() => setActiveTab('input')}
          className={`flex items-center px-4 py-2 text-xs font-bold rounded-xl transition-all gap-2 ${
            activeTab === 'input'
              ? 'bg-[#5B7553] text-[#F7F5F0] shadow-sm font-extrabold'
              : 'text-[#5B6350] hover:text-[#1C2620] hover:bg-[#F7F5F0]/60'
          }`}
        >
          <ClipboardCheck className="h-3.5 w-3.5" />
          Input Absensi Harian
        </button>
        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center px-4 py-2 text-xs font-bold rounded-xl transition-all gap-2 ${
            activeTab === 'rekap'
              ? 'bg-[#5B7553] text-[#F7F5F0] shadow-sm font-extrabold'
              : 'text-[#5B6350] hover:text-[#1C2620] hover:bg-[#F7F5F0]/60'
          }`}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Rekap Kehadiran
        </button>
      </div>

      {/* Header Title Block */}
      <div className="pb-2">
        <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">
          {activeTab === 'input' ? 'Input Absensi Harian' : 'Rekap Kehadiran Santri'}
        </h1>
        <p className="text-xs text-[#5B6350] mt-0.5">
          {activeTab === 'input' ? 'Tentukan halaqah, tanggal dan catat kehadiran santri dengan mudah.' : 'Pantau rekapitulasi kehadiran dan rasio absensi santri.'}
        </p>
      </div>

      {activeTab === 'input' && (
        <div className="space-y-6">
          {/* Header selectors */}
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6">
            <div className="grid gap-4 md:grid-cols-4 items-end">
              <div className="grid gap-2">
                <Label htmlFor="kelas-select" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Halaqah / Kelas</Label>
                <select
                  id="kelas-select"
                  value={selectedKelas}
                  onChange={(e) => {
                    setSelectedKelas(e.target.value);
                    setAttendanceLoaded(false);
                  }}
                  className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                >
                  <option value="" disabled>Pilih Halaqah</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.nama_kelas}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tanggal-input" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Tanggal</Label>
                <Input
                  id="tanggal-input"
                  type="date"
                  value={selectedTanggal}
                  onChange={(e) => {
                    setSelectedTanggal(e.target.value);
                    setAttendanceLoaded(false);
                  }}
                  className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sesi-select" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Sesi Pembelajaran</Label>
                <select
                  id="sesi-select"
                  value={selectedSesi}
                  onChange={(e) => {
                    setSelectedSesi(e.target.value);
                    setAttendanceLoaded(false);
                  }}
                  className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                >
                  <option value="pagi">Halaqah Pagi (Subuh)</option>
                  <option value="siang">Halaqah Siang (Ashar)</option>
                  <option value="sore">Halaqah Sore (Maghrib)</option>
                  <option value="malam">Halaqah Malam (Isya)</option>
                </select>
              </div>

              <Button 
                onClick={handleLoadStudents}
                disabled={!selectedKelas}
                className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold h-11 px-5 flex items-center justify-center gap-1.5 shadow-sm"
              >
                Mulai Absensi
              </Button>
            </div>
          </Card>

          {/* Attendance sheet marking list */}
          {attendanceLoaded && (
            <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
              <div className="flex flex-row items-center justify-between border-b border-[#E3DEC6] bg-[#F7F5F0]/50 p-6">
                <div>
                  <h3 className="font-heading text-[#1C2620] text-base font-black">Checklist Lembar Absensi</h3>
                  <p className="text-xs text-[#5B6350] mt-0.5">Ubah status kehadiran santri dan berikan keterangan jika diperlukan.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleMarkAllHadir} className="border-[#E3DEC6] rounded-xl text-xs font-bold px-4 h-9 bg-white text-[#5B7553]">
                  <UserCheck className="h-4 w-4 mr-1.5" />
                  Hadirkan Semua
                </Button>
              </div>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#F7F5F0]/40 border-b border-[#E3DEC6]">
                      <TableRow>
                        <TableHead className="w-32 pl-6">NIS</TableHead>
                        <TableHead>Nama Santri</TableHead>
                        <TableHead className="w-96 text-center">Status Kehadiran</TableHead>
                        <TableHead className="pr-6">Catatan / Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceSheet.map((item) => (
                        <TableRow key={item.santri_id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                          <TableCell className="font-bold pl-6 text-[#1C2620]">{item.nis}</TableCell>
                          <TableCell className="font-bold text-[#1C2620]">{item.nama}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              {[
                                { key: 'hadir', label: 'H', color: 'peer-checked:bg-emerald-600 peer-checked:text-white bg-emerald-50 text-emerald-800' },
                                { key: 'sakit', label: 'S', color: 'peer-checked:bg-amber-600 peer-checked:text-white bg-amber-50 text-amber-800' },
                                { key: 'izin', label: 'I', color: 'peer-checked:bg-sky-600 peer-checked:text-white bg-sky-50 text-sky-800' },
                                { key: 'alpha', label: 'A', color: 'peer-checked:bg-red-600 peer-checked:text-white bg-red-50 text-red-800' },
                                { key: 'terlambat', label: 'T', color: 'peer-checked:bg-[#C9A876] peer-checked:text-white bg-[#C9A876]/10 text-[#8A6A3A]' }
                              ].map((opt) => (
                                <label key={opt.key} className="cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`status-${item.santri_id}`}
                                    checked={item.status === opt.key}
                                    onChange={() => handleStatusChange(item.santri_id, opt.key)}
                                    className="sr-only peer"
                                  />
                                  <span className={`inline-flex items-center justify-center h-8 w-8 text-xs font-black uppercase rounded-xl border border-transparent transition-all hover:bg-neutral-100 peer-checked:shadow-sm ${opt.color}`}>
                                    {opt.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="pr-6">
                            <Input
                              placeholder="Catatan (opsional)"
                              value={item.keterangan}
                              onChange={(e) => handleKeteranganChange(item.santri_id, e.target.value)}
                              className="h-10 border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl text-xs px-4 focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end gap-3 p-6 border-t border-[#E3DEC6] bg-[#F7F5F0]/30">
                  <Button variant="outline" onClick={() => { setAttendanceLoaded(false); setAttendanceSheet([]); }} className="border-[#E3DEC6] rounded-xl text-xs font-bold px-5 h-9 bg-white text-[#5B6350]">
                    Batal
                  </Button>
                  <Button onClick={handleSaveAttendance} disabled={isSaving} className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-5 h-9 shadow-sm">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Kehadiran'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'rekap' && (
        <div className="space-y-6">
          {/* Filters Card */}
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6">
            <div className="grid gap-4 md:grid-cols-4 items-end">
              <div className="grid gap-2">
                <Label htmlFor="filter-kelas" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Halaqah / Kelas</Label>
                <select
                  id="filter-kelas"
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                >
                  <option value="">Semua Halaqah</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.nama_kelas}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="start-date" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Tanggal Mulai</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end-date" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Tanggal Selesai</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                />
              </div>

              <Button 
                variant="outline"
                onClick={() => {
                  setFilterKelas('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="border-[#E3DEC6] rounded-xl text-xs font-bold h-11 px-5 bg-white text-[#5B6350] hover:bg-[#F7F5F0]"
              >
                Reset Filter
              </Button>
            </div>
          </Card>

          {/* Recap Summary List */}
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-[#E3DEC6] bg-[#F7F5F0]/30">
              <h3 className="font-heading text-[#1C2620] text-base font-black">Rasio Kehadiran Santri</h3>
            </div>
            <CardContent className="p-0">
              {isLoadingRecap ? (
                <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
              ) : recap.length === 0 ? (
                <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada riwayat absensi pada filter terpilih.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                      <TableRow>
                        <TableHead className="w-32 pl-6">NIS</TableHead>
                        <TableHead>Nama Santri</TableHead>
                        <TableHead className="text-center w-24">Hadir</TableHead>
                        <TableHead className="text-center w-24">Sakit</TableHead>
                        <TableHead className="text-center w-24">Izin</TableHead>
                        <TableHead className="text-center w-24">Alpha</TableHead>
                        <TableHead className="text-center w-24">Lambat</TableHead>
                        <TableHead className="text-center w-36 pr-6">Rasio Kehadiran</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recap.map((row) => (
                        <TableRow key={row.santri_id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                          <TableCell className="font-bold text-[#1C2620] pl-6">{row.nis}</TableCell>
                          <TableCell className="font-bold text-[#1C2620]">{row.nama}</TableCell>
                          <TableCell className="text-center font-bold text-emerald-700">{row.rekap.hadir}</TableCell>
                          <TableCell className="text-center font-bold text-amber-700">{row.rekap.sakit}</TableCell>
                          <TableCell className="text-center font-bold text-sky-700">{row.rekap.izin}</TableCell>
                          <TableCell className="text-center font-bold text-[#8B3A3A]">{row.rekap.alpha}</TableCell>
                          <TableCell className="text-center font-bold text-[#8A6A3A]">{row.rekap.terlambat}</TableCell>
                          <TableCell className="text-center pr-6">
                            <Badge className={`px-2.5 py-0.5 border-0 text-xs font-black rounded-lg ${
                              row.persentase_kehadiran >= 90 ? 'bg-emerald-500/10 text-emerald-800' :
                              row.persentase_kehadiran >= 75 ? 'bg-amber-500/10 text-amber-800' :
                              'bg-[#8B3A3A]/10 text-[#8B3A3A]'
                            }`}>
                              {row.persentase_kehadiran}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AbsensiPage;
