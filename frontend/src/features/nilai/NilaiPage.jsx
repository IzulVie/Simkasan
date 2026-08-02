import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSantri } from '../santri/useSantri';
import { useNilai } from './useNilai';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  GraduationCap, 
  Calendar, 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  User,
  BookOpen
} from 'lucide-react';

const NilaiPage = () => {
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

  const { records, isLoading, createNilai, updateNilai, deleteNilai } = useNilai(filters);

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
    mapel: '',
    nilai: 85,
    tanggal: new Date().toISOString().split('T')[0]
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormError('');
    setSelectedRecord(null);
    setForm({
      santri_id: santris[0]?.id?.toString() || '',
      mapel: '',
      nilai: 85,
      tanggal: new Date().toISOString().split('T')[0]
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (record) => {
    setDialogMode('edit');
    setFormError('');
    setSelectedRecord(record);
    setForm({
      santri_id: record.santri_id.toString(),
      mapel: record.mapel,
      nilai: record.nilai,
      tanggal: record.tanggal
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan nilai ini?')) {
      try {
        await deleteNilai(id);
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
        await createNilai(form);
      } else {
        await updateNilai({ id: selectedRecord.id, data: form });
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat memproses data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Wali view
  if (isWali) {
    return (
      <div className="space-y-6 flex flex-col">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Rapor & Nilai Akademik</h1>
            <p className="text-xs text-[#5B6350] mt-0.5">Pantau perolehan nilai mata pelajaran kepesantrenan ananda.</p>
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

        {/* Academic Card Recap */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          <div className="bg-white border border-[#E3DEC6] shadow-sm rounded-3xl p-6 relative overflow-hidden transition-all hover:translate-y-[-2px]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Nilai Rata-rata</span>
            <h3 className="font-heading text-4xl font-black mt-2 text-[#5B7553] tracking-tight">
              {records.length > 0 
                ? round(records.reduce((acc, r) => acc + r.nilai, 0) / records.length, 1) 
                : '-'}
            </h3>
          </div>
          
          <div className="bg-white border border-[#E3DEC6] shadow-sm rounded-3xl p-6 relative overflow-hidden transition-all hover:translate-y-[-2px]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Nilai Tertinggi</span>
            <h3 className="font-heading text-4xl font-black mt-2 text-[#C9A876] tracking-tight">
              {records.length > 0 ? Math.max(...records.map(r => r.nilai)) : '-'}
            </h3>
          </div>

          <div className="bg-white border border-[#E3DEC6] shadow-sm rounded-3xl p-6 relative overflow-hidden transition-all hover:translate-y-[-2px]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Total Pelajaran Dinilai</span>
            <h3 className="font-heading text-4xl font-black mt-2 text-[#1C2620] tracking-tight">
              {records.length}
            </h3>
          </div>
        </div>

        {/* Grades Table */}
        <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-[#E3DEC6] bg-[#F7F5F0]/30">
            <h3 className="font-heading text-[#1C2620] text-base font-black">Daftar Nilai Ujian & Tugas</h3>
          </div>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : records.length === 0 ? (
              <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada riwayat perolehan nilai akademik.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                    <TableRow>
                      <TableHead className="pl-6">Tanggal</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                      <TableHead className="text-center">Nilai Angka</TableHead>
                      <TableHead className="text-center">Predikat</TableHead>
                      <TableHead className="pr-6">Ustadz Pengampu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((log) => (
                      <TableRow key={log.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                        <TableCell className="pl-6 font-bold text-[#1C2620]">{log.tanggal}</TableCell>
                        <TableCell className="font-bold text-[#1C2620]">{log.mapel}</TableCell>
                        <TableCell className="text-center font-extrabold text-lg text-[#5B7553]">{log.nilai}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`px-2.5 py-0.5 border-0 text-[10px] font-black rounded-lg ${
                            log.nilai >= 85 ? 'bg-emerald-500/10 text-emerald-800' :
                            log.nilai >= 75 ? 'bg-[#C9A876]/20 text-[#8A6A3A]' :
                            'bg-amber-500/10 text-amber-800'
                          }`}>
                            {log.nilai >= 85 ? 'Mumtaz (A)' : log.nilai >= 75 ? 'Jayyid (B)' : 'Maqbul (C)'}
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
          <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Kelola Nilai Akademik</h1>
          <p className="text-xs text-[#5B6350] mt-0.5">Catat perolehan nilai mata pelajaran diniyah/pesantren santri.</p>
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
            <Plus className="h-4 w-4" /> Input Nilai Baru
          </Button>
        </div>
      </div>

      {/* Grades List Card */}
      <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
          ) : records.length === 0 ? (
            <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada riwayat perolehan nilai.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                  <TableRow>
                    <TableHead className="pl-6 w-32">Tanggal</TableHead>
                    <TableHead>Nama Santri</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead className="text-center">Nilai Angka</TableHead>
                    <TableHead className="text-center">Predikat</TableHead>
                    <TableHead>Ustadz Pencatat</TableHead>
                    <TableHead className="w-24 text-center pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((log) => (
                    <TableRow key={log.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                      <TableCell className="pl-6 font-bold text-[#1C2620]">{log.tanggal}</TableCell>
                      <TableCell className="font-bold text-[#1C2620]">{log.santri ? log.santri.nama : '-'}</TableCell>
                      <TableCell className="font-bold text-[#1C2620]">{log.mapel}</TableCell>
                      <TableCell className="text-center font-extrabold text-lg text-[#5B7553]">{log.nilai}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`px-2.5 py-0.5 border-0 text-[10px] font-black rounded-lg ${
                          log.nilai >= 85 ? 'bg-emerald-500/10 text-emerald-800' :
                          log.nilai >= 75 ? 'bg-[#C9A876]/20 text-[#8A6A3A]' :
                          'bg-amber-500/10 text-amber-800'
                        }`}>
                          {log.nilai >= 85 ? 'A' : log.nilai >= 75 ? 'B' : 'C'}
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
                {dialogMode === 'create' ? 'Input Nilai Baru' : 'Ubah Catatan Nilai'}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5B6350]">
                Masukkan nilai mata pelajaran santri. Nilai maksimal 100.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="text-xs bg-[#8B3A3A]/10 border border-[#8B3A3A]/30 text-[#8B3A3A] p-3 rounded-xl flex items-center mb-2">
                <span>{formError}</span>
              </div>
            )}

            {/* Scrollable Fields Wrapper */}
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
                  <Label htmlFor="tanggal" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Calendar className="h-3 w-3 text-[#5B6350]/60" /> Tanggal Penilaian</Label>
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
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="mapel" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><BookOpen className="h-3 w-3 text-[#5B6350]/60" /> Mata Pelajaran</Label>
                  <Input
                    id="mapel"
                    value={form.mapel}
                    onChange={(e) => setForm(prev => ({ ...prev, mapel: e.target.value }))}
                    placeholder="Contoh: Fikih, Tauhid, Nahwu, Shorof"
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nilai" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Award className="h-3 w-3 text-[#5B6350]/60" /> Nilai Angka</Label>
                  <Input
                    id="nilai"
                    type="number"
                    min={0}
                    max={100}
                    value={form.nilai}
                    onChange={(e) => setForm(prev => ({ ...prev, nilai: parseInt(e.target.value) || 0 }))}
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
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
                  'Simpan Nilai'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Simple utility function for rounding
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export default NilaiPage;
