import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSantri } from '../santri/useSantri';
import { useHafalan } from './useHafalan';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  User,
  Heart,
  Grid,
  Hash
} from 'lucide-react';

const HafalanPage = () => {
  const { user } = useAuth();
  const isWali = user?.roles?.includes('wali');
  const isStaff = user?.roles?.includes('admin') || user?.roles?.includes('ustadz');

  const { santris } = useSantri();
  
  const waliChildren = isWali ? (user?.santris || []) : [];

  // Filter state
  const [filterSantri, setFilterSantri] = useState(() => {
    if (isWali && user?.santris?.length > 0) {
      return user.santris[0].id.toString();
    }
    return '';
  });
  const filters = {
    ...(filterSantri && { santri_id: filterSantri })
  };

  const { records, isLoading, createHafalan, updateHafalan, deleteHafalan } = useHafalan(filters);

  // Wali child selection state
  const [selectedChildId, setSelectedChildId] = useState(() => {
    if (isWali && user?.santris?.length > 0) {
      return user.santris[0].id.toString();
    }
    return '';
  });

  // Auto select first child for wali
  React.useEffect(() => {
    if (isWali && waliChildren.length > 0 && !selectedChildId) {
      setSelectedChildId(waliChildren[0].id.toString());
      setFilterSantri(waliChildren[0].id.toString());
    }
  }, [waliChildren, isWali, selectedChildId]);

  // Form / Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form, setForm] = useState({
    santri_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    juz: 30,
    surah: '',
    ayat_mulai: 1,
    ayat_selesai: 10,
    nilai_kelancaran: 'Mumtaz',
    nilai_tajwid: 'Jayyid'
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormError('');
    setSelectedRecord(null);
    setForm({
      santri_id: santris[0]?.id?.toString() || '',
      tanggal: new Date().toISOString().split('T')[0],
      juz: 30,
      surah: '',
      ayat_mulai: 1,
      ayat_selesai: 10,
      nilai_kelancaran: 'Mumtaz',
      nilai_tajwid: 'Jayyid'
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (record) => {
    setDialogMode('edit');
    setFormError('');
    setSelectedRecord(record);
    setForm({
      santri_id: record.santri_id.toString(),
      tanggal: record.tanggal,
      juz: record.juz,
      surah: record.surah,
      ayat_mulai: record.ayat_mulai,
      ayat_selesai: record.ayat_selesai,
      nilai_kelancaran: record.nilai_kelancaran,
      nilai_tajwid: record.nilai_tajwid
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan setoran ini?')) {
      try {
        await deleteHafalan(id);
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus data.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (dialogMode === 'create') {
        await createHafalan(form);
      } else {
        await updateHafalan({ id: selectedRecord.id, data: form });
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat memproses data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate dynamic 30 Juz progress map for selected child
  const getJuzProgress = (childId) => {
    const studentRecords = records.filter(r => r.santri_id === parseInt(childId));
    
    return Array.from({ length: 30 }, (_, i) => {
      const juzNum = i + 1;
      const juzRecords = studentRecords.filter(r => r.juz === juzNum);
      
      let status = 0; // Belum mulai
      if (juzRecords.length > 0) {
        const hasMumtaz = juzRecords.some(r => r.nilai_kelancaran === 'Mumtaz' && r.nilai_tajwid === 'Mumtaz');
        status = hasMumtaz ? 2 : 1; // 2 = Khatam (green), 1 = Sedang dihafal (gold)
      }
      return { juz: juzNum, status };
    });
  };

  // Render Wali view
  if (isWali) {
    const selectedChild = waliChildren.find(c => c.id === parseInt(selectedChildId));
    const juzProgress = selectedChildId ? getJuzProgress(selectedChildId) : [];

    return (
      <div className="space-y-6 flex flex-col">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Progres Hafalan Al-Qur'an</h1>
            <p className="text-xs text-[#5B6350] mt-0.5">Ikuti perkembangan hafalan juz dan setoran harian ananda.</p>
          </div>
          
          {waliChildren.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#5B6350]">Pilih Anak:</span>
              <select
                value={selectedChildId}
                onChange={(e) => {
                  setSelectedChildId(e.target.value);
                  setFilterSantri(e.target.value);
                }}
                className="rounded-2xl border border-[#E3DEC6] bg-white px-3 py-1.5 text-xs focus-visible:outline-none h-9"
              >
                {waliChildren.map(c => (
                  <option key={c.id} value={c.id}>{c.nama}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Dynamic Peta Juz (Signature Element) */}
        {selectedChildId && (
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-[#E3DEC6] bg-[#F7F5F0]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-heading text-[#1C2620] text-base font-black">Peta Progres 30 Juz</h3>
                <p className="text-xs text-[#5B6350] mt-0.5">Warna indikator menunjukkan tahapan pencapaian juz Al-Qur'an.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3.5 text-[9px] font-black uppercase tracking-wider text-[#5B6350]">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-[#EDEAE2] border border-[#E3DEC6] inline-block"></span>
                  <span>Belum Mulai</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-[#C9A876] inline-block"></span>
                  <span>Sedang Menghafal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-[#5B7553] inline-block"></span>
                  <span>Selesai (Khatam)</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {juzProgress.map((item) => {
                  let bgClass = 'bg-[#EDEAE2] text-[#5B6350] border-[#E3DEC6]';
                  if (item.status === 1) bgClass = 'bg-[#C9A876] text-[#F7F5F0] border-[#C9A876] font-bold shadow-sm';
                  if (item.status === 2) bgClass = 'bg-[#5B7553] text-[#F7F5F0] border-[#5B7553] font-bold shadow-sm';
                  
                  return (
                    <div
                      key={item.juz}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all hover:scale-105 duration-200 cursor-pointer ${bgClass}`}
                    >
                      <span className="text-[8px] uppercase opacity-70 leading-none">Juz</span>
                      <span className="text-base font-black mt-1 leading-none">{item.juz}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Table */}
        <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-[#E3DEC6] bg-[#F7F5F0]/30">
            <h3 className="font-heading text-[#1C2620] text-base font-black">Riwayat Setoran Hafalan</h3>
          </div>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : records.length === 0 ? (
              <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada riwayat setoran hafalan.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                    <TableRow>
                      <TableHead className="pl-6">Tanggal</TableHead>
                      <TableHead>Juz</TableHead>
                      <TableHead>Surah</TableHead>
                      <TableHead>Ayat</TableHead>
                      <TableHead className="text-center">Kelancaran</TableHead>
                      <TableHead className="text-center">Tajwid</TableHead>
                      <TableHead className="pr-6">Ustadz Penerima</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((log) => (
                      <TableRow key={log.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                        <TableCell className="pl-6 font-bold text-[#1C2620]">{log.tanggal}</TableCell>
                        <TableCell className="font-black text-[#5B7553]">Juz {log.juz}</TableCell>
                        <TableCell className="font-bold text-[#1C2620]">{log.surah}</TableCell>
                        <TableCell className="text-xs text-[#5B6350]">Ayat {log.ayat_mulai} - {log.ayat_selesai}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`px-2.5 py-0.5 border-0 text-[10px] font-black rounded-lg ${
                            log.nilai_kelancaran === 'Mumtaz' ? 'bg-emerald-500/10 text-emerald-800' :
                            log.nilai_kelancaran === 'Jayyid' ? 'bg-[#C9A876]/20 text-[#8A6A3A]' :
                            'bg-amber-500/10 text-amber-800'
                          }`}>
                            {log.nilai_kelancaran}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`px-2.5 py-0.5 border-0 text-[10px] font-black rounded-lg ${
                            log.nilai_tajwid === 'Mumtaz' ? 'bg-emerald-500/10 text-emerald-800' :
                            log.nilai_tajwid === 'Jayyid' ? 'bg-[#C9A876]/20 text-[#8A6A3A]' :
                            'bg-amber-500/10 text-amber-800'
                          }`}>
                            {log.nilai_tajwid}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-xs text-[#5B6350] font-medium">{log.ustadz ? log.ustadz.name : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Staff/Ustadz view
  return (
    <div className="space-y-6 flex flex-col">
      {/* Header Block with filters & buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Jurnal Setoran Hafalan</h1>
          <p className="text-xs text-[#5B6350] mt-0.5">Catat dan kelola riwayat hafalan Al-Qur'an santri harian.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterSantri}
            onChange={(e) => setFilterSantri(e.target.value)}
            className="flex h-11 rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] w-48"
          >
            <option value="">Semua Santri</option>
            {santris.map(s => (
              <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>
            ))}
          </select>
          <Button 
            onClick={handleOpenCreate} 
            className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold h-11 px-5 flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Setoran Baru
          </Button>
        </div>
      </div>

      {/* Jurnal List Card */}
      <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
          ) : records.length === 0 ? (
            <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada riwayat setoran hafalan.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                  <TableRow>
                    <TableHead className="pl-6 w-32">Tanggal</TableHead>
                    <TableHead>Nama Santri</TableHead>
                    <TableHead>Juz</TableHead>
                    <TableHead>Surah</TableHead>
                    <TableHead>Ayat</TableHead>
                    <TableHead className="text-center">Kelancaran</TableHead>
                    <TableHead className="text-center">Tajwid</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead className="w-24 text-center pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((log) => (
                    <TableRow key={log.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                      <TableCell className="pl-6 font-bold text-[#1C2620]">{log.tanggal}</TableCell>
                      <TableCell className="font-bold text-[#1C2620]">{log.santri ? log.santri.nama : '-'}</TableCell>
                      <TableCell className="font-black text-[#5B7553]">Juz {log.juz}</TableCell>
                      <TableCell className="font-bold text-[#1C2620]">{log.surah}</TableCell>
                      <TableCell className="text-xs text-[#5B6350]">Ayat {log.ayat_mulai} - {log.ayat_selesai}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`px-2.5 py-0.5 border-0 text-[10px] font-black rounded-lg ${
                          log.nilai_kelancaran === 'Mumtaz' ? 'bg-emerald-500/10 text-emerald-800' :
                          log.nilai_kelancaran === 'Jayyid' ? 'bg-[#C9A876]/20 text-[#8A6A3A]' :
                          'bg-amber-500/10 text-amber-800'
                        }`}>
                          {log.nilai_kelancaran}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`px-2.5 py-0.5 border-0 text-[10px] font-black rounded-lg ${
                          log.nilai_tajwid === 'Mumtaz' ? 'bg-emerald-500/10 text-emerald-800' :
                          log.nilai_tajwid === 'Jayyid' ? 'bg-[#C9A876]/20 text-[#8A6A3A]' :
                          'bg-amber-500/10 text-amber-800'
                        }`}>
                          {log.nilai_tajwid}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-[#5B6350] font-medium">{log.ustadz ? log.ustadz.name : '-'}</TableCell>
                      <TableCell className="flex justify-center gap-1 pr-6">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(log)} className="h-8 w-8 text-[#5B7553] hover:bg-[#F7F5F0]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(log.id)} className="h-8 w-8 text-[#8B3A3A] hover:bg-[#8B3A3A]/5">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CRUD dialog modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl sm:max-w-xl bg-white border-[#E3DEC6] rounded-3xl p-6 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <DialogHeader className="pb-3">
              <DialogTitle className="font-heading text-lg font-black text-[#1C2620]">
                {dialogMode === 'create' ? 'Catat Setoran Baru' : 'Ubah Catatan Setoran'}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5B6350]">
                Masukkan detil pencapaian setoran hafalan santri di bawah.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="text-xs bg-[#8B3A3A]/10 border border-[#8B3A3A]/30 text-[#8B3A3A] p-3 rounded-xl flex items-center mb-2">
                <span>{formError}</span>
              </div>
            )}

            {/* Scrollable Fields wrapper */}
            <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4 max-h-[50vh] scrollbar-thin">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="santri_id" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Pilih Santri</Label>
                  <select
                    id="santri_id"
                    value={form.santri_id}
                    onChange={(e) => setForm(prev => ({ ...prev, santri_id: e.target.value }))}
                    required
                    className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                  >
                    <option value="" disabled>Pilih Santri</option>
                    {santris.map(s => (
                      <option key={s.id} value={s.id}>{s.nama}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tanggal" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Calendar className="h-3 w-3 text-[#5B6350]/60" /> Tanggal Setoran</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm(prev => ({ ...prev, tanggal: e.target.value }))}
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="juz" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Hash className="h-3 w-3 text-[#5B6350]/60" /> Juz</Label>
                  <Input
                    id="juz"
                    type="number"
                    min={1}
                    max={30}
                    value={form.juz}
                    onChange={(e) => setForm(prev => ({ ...prev, juz: parseInt(e.target.value) || 1 }))}
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>

                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="surah" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><BookOpen className="h-3 w-3 text-[#5B6350]/60" /> Nama Surah</Label>
                  <Input
                    id="surah"
                    value={form.surah}
                    onChange={(e) => setForm(prev => ({ ...prev, surah: e.target.value }))}
                    placeholder="Contoh: An-Naba', Al-Baqarah"
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ayat_mulai" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Ayat Mulai</Label>
                  <Input
                    id="ayat_mulai"
                    type="number"
                    min={1}
                    value={form.ayat_mulai}
                    onChange={(e) => setForm(prev => ({ ...prev, ayat_mulai: parseInt(e.target.value) || 1 }))}
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ayat_selesai" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Ayat Selesai</Label>
                  <Input
                    id="ayat_selesai"
                    type="number"
                    min={form.ayat_mulai}
                    value={form.ayat_selesai}
                    onChange={(e) => setForm(prev => ({ ...prev, ayat_selesai: parseInt(e.target.value) || 1 }))}
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nilai_kelancaran" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Award className="h-3 w-3 text-[#5B6350]/60" /> Nilai Kelancaran</Label>
                  <select
                    id="nilai_kelancaran"
                    value={form.nilai_kelancaran}
                    onChange={(e) => setForm(prev => ({ ...prev, nilai_kelancaran: e.target.value }))}
                    required
                    className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                  >
                    <option value="Mumtaz">Mumtaz (Sangat Lancar)</option>
                    <option value="Jayyid">Jayyid (Lancar)</option>
                    <option value="Maqbul">Maqbul (Cukup)</option>
                    <option value="Dhaif">Dhaif (Kurang)</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nilai_tajwid" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Heart className="h-3 w-3 text-[#5B6350]/60" /> Nilai Tajwid</Label>
                  <select
                    id="nilai_tajwid"
                    value={form.nilai_tajwid}
                    onChange={(e) => setForm(prev => ({ ...prev, nilai_tajwid: e.target.value }))}
                    required
                    className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                  >
                    <option value="Mumtaz">Mumtaz (Sangat Baik)</option>
                    <option value="Jayyid">Jayyid (Baik)</option>
                    <option value="Maqbul">Maqbul (Cukup)</option>
                    <option value="Dhaif">Dhaif (Kurang)</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="bg-[#F7F5F0]/60 p-4 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-2 border-t border-[#E3DEC6] mt-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting} className="border-[#E3DEC6] bg-white rounded-xl text-xs font-bold px-5 h-9 text-[#5B6350]">
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-5 h-9 shadow-sm">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Setoran'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HafalanPage;
