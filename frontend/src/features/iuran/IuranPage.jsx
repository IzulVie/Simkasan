import React, { useState } from 'react';
import { useKelas } from '../kelas/useKelas';
import { useIuran } from './useIuran';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Wallet, 
  Plus, 
  CheckCircle2, 
  Loader2, 
  Search, 
  Calendar, 
  User, 
  FileSpreadsheet, 
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const IuranPage = () => {
  const { classes } = useKelas();

  // Filter States
  const [filterKelas, setFilterKelas] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear().toString());
  const [filterStatus, setFilterStatus] = useState('');

  const activeFilters = {
    ...(filterKelas && { kelas_id: filterKelas }),
    ...(filterBulan && { bulan: filterBulan }),
    ...(filterTahun && { tahun: filterTahun }),
    ...(filterStatus && { status: filterStatus }),
  };

  const { iurans, isLoading, generateIuran, isGenerating, markAsLunas, isMarking } = useIuran(activeFilters);

  // Modal States
  const [genDialogOpen, setGenDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedIuran, setSelectedIuran] = useState(null);

  // Form States
  const [genForm, setGenForm] = useState({
    bulan: (new Date().getMonth() + 1).toString(),
    tahun: new Date().getFullYear().toString(),
    kelas_id: ''
  });
  const [keteranganLunas, setKeteranganLunas] = useState('');
  const [formError, setFormError] = useState('');

  // Handle Generate Submit
  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await generateIuran({
        bulan: parseInt(genForm.bulan),
        tahun: parseInt(genForm.tahun),
        kelas_id: genForm.kelas_id ? parseInt(genForm.kelas_id) : null
      });
      alert(res.message || 'Kewajiban iuran berhasil dibuat.');
      setGenDialogOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Gagal men-generate data iuran.');
    }
  };

  // Open Confirm Dialog for Lunas
  const handleOpenConfirm = (iuran) => {
    setSelectedIuran(iuran);
    setKeteranganLunas('');
    setConfirmDialogOpen(true);
  };

  // Handle Lunas Confirm Submit
  const handleConfirmLunas = async () => {
    if (!selectedIuran) return;
    try {
      await markAsLunas({
        id: selectedIuran.id,
        keterangan: keteranganLunas
      });
      setConfirmDialogOpen(false);
      setSelectedIuran(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal mengubah status iuran.');
    }
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header Block */}
      <div className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] dark:text-[#EDEAE2] tracking-tight">Iuran & Syahriah</h1>
          <p className="text-xs text-[#5B6350] dark:text-[#A0A898] mt-0.5">Kelola status pelunasan iuran bulanan santri secara administratif.</p>
        </div>
        <Button 
          onClick={() => {
            setFormError('');
            setGenDialogOpen(true);
          }}
          className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 shadow-sm self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Generate Tagihan Bulanan
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="border-[#E3DEC6] dark:border-[#2D3A33] shadow-sm bg-white dark:bg-[#1C2621] rounded-3xl transition-colors duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Kelas Filter */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Filter Kelas</Label>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 px-3 py-2 text-xs text-[#1C2620] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#5B7553]"
              >
                <option value="">Semua Kelas</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id.toString()}>{c.nama_kelas}</option>
                ))}
              </select>
            </div>

            {/* Bulan Filter */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Filter Bulan</Label>
              <select
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 px-3 py-2 text-xs text-[#1C2620] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#5B7553]"
              >
                <option value="">Semua Bulan</option>
                {NAMA_BULAN.map((name, idx) => (
                  <option key={name} value={(idx + 1).toString()}>{name}</option>
                ))}
              </select>
            </div>

            {/* Tahun Filter */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Filter Tahun</Label>
              <select
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 px-3 py-2 text-xs text-[#1C2620] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#5B7553]"
              >
                <option value="">Semua Tahun</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Filter Status</Label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 px-3 py-2 text-xs text-[#1C2620] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#5B7553]"
              >
                <option value="">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="belum_lunas">Belum Lunas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table Card */}
      <Card className="border-[#E3DEC6] dark:border-[#2D3A33] shadow-sm bg-white dark:bg-[#1C2621] rounded-3xl overflow-hidden transition-colors duration-300">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
          ) : iurans.length === 0 ? (
            <p className="text-center py-12 text-sm text-[#5B6350] dark:text-[#A0A898] font-bold">Belum ada data catatan iuran.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F7F5F0] dark:bg-[#1C2621] border-b border-[#E3DEC6] dark:border-[#2D3A33]">
                  <TableRow>
                    <TableHead className="pl-6 py-4 text-xs font-black uppercase text-[#5B6350] dark:text-[#A0A898]">Santri</TableHead>
                    <TableHead className="py-4 text-xs font-black uppercase text-[#5B6350] dark:text-[#A0A898]">Kelas</TableHead>
                    <TableHead className="py-4 text-xs font-black uppercase text-[#5B6350] dark:text-[#A0A898]">Bulan / Tahun</TableHead>
                    <TableHead className="py-4 text-xs font-black uppercase text-[#5B6350] dark:text-[#A0A898]">Status</TableHead>
                    <TableHead className="py-4 text-xs font-black uppercase text-[#5B6350] dark:text-[#A0A898]">Keterangan</TableHead>
                    <TableHead className="py-4 text-xs font-black uppercase text-[#5B6350] dark:text-[#A0A898]">Konfirmator / Waktu</TableHead>
                    <TableHead className="pr-6 py-4 text-xs font-black uppercase text-[#5B6350] dark:text-[#A0A898] text-center w-36">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#E3DEC6]/50 dark:divide-[#2D3A33]/50">
                  {iurans.map((iuran) => (
                    <TableRow key={iuran.id} className="hover:bg-[#F7F5F0]/20 dark:hover:bg-[#2D3A33]/10 transition-colors">
                      <TableCell className="pl-6 py-4 font-bold text-[#1C2620] dark:text-[#EDEAE2]">
                        <div>
                          <p className="text-xs font-black">{iuran.santri?.nama}</p>
                          <p className="text-[10px] text-[#5B6350] dark:text-[#A0A898] font-bold mt-0.5">NIS: {iuran.santri?.nis}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-xs">
                        <Badge variant="outline" className="bg-[#5B7553]/10 dark:bg-[#5B7553]/20 text-[#5B7553] dark:text-[#A0A898] border-0 font-bold text-[9px] px-2 py-0.5">
                          {iuran.santri?.kelas}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-xs font-bold text-[#1C2620] dark:text-[#EDEAE2]">
                        {NAMA_BULAN[iuran.bulan - 1]} {iuran.tahun}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`font-black text-[9px] uppercase px-2.5 py-0.5 rounded-lg ${
                          iuran.status === 'lunas'
                            ? 'bg-[#5B7553]/15 text-[#5B7553] dark:bg-[#5B7553]/30 dark:text-[#EDEAE2]'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {iuran.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-[#5B6350] dark:text-[#A0A898] italic max-w-[180px] truncate">
                        {iuran.keterangan || '-'}
                      </TableCell>
                      <TableCell className="py-4 text-xs text-[#1C2620] dark:text-[#EDEAE2]">
                        {iuran.status === 'lunas' ? (
                          <div>
                            <p className="font-bold flex items-center gap-1"><User className="h-3 w-3 text-[#5B7553]" /> {iuran.konfirmator?.name}</p>
                            <p className="text-[9px] text-[#5B6350] dark:text-[#A0A898] mt-0.5">
                              {iuran.tanggal_konfirmasi ? new Date(iuran.tanggal_konfirmasi).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              }) : '-'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[#5B6350] dark:text-[#A0A898]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-center">
                        {iuran.status !== 'lunas' ? (
                          <Button
                            size="sm"
                            onClick={() => handleOpenConfirm(iuran)}
                            className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-[10px] font-black uppercase tracking-wider px-3 h-8 shadow-xs w-full flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Tandai Lunas
                          </Button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-black uppercase flex items-center justify-center gap-1">
                            ✔️ Terverifikasi
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog 1: Generate Tagihan */}
      <Dialog open={genDialogOpen} onOpenChange={setGenDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#1C2621] border-[#E3DEC6] dark:border-[#2D3A33] rounded-3xl p-6 max-w-sm select-none shadow-2xl transition-colors duration-300">
          <form onSubmit={handleGenerateSubmit}>
            <DialogHeader className="pb-4 border-b border-[#E3DEC6]/50 dark:border-[#2D3A33]/50">
              <DialogTitle className="font-heading text-lg font-black text-[#1C2620] dark:text-[#EDEAE2] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#5B7553]" />
                Generate Tagihan
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5B6350] dark:text-[#A0A898] mt-1">
                Buat pencatatan tagihan iuran kosong (Belum Lunas) secara massal.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-400 p-3 rounded-xl text-[11px] font-bold">
                  {formError}
                </div>
              )}

              {/* Bulan Select */}
              <div className="grid gap-2">
                <Label htmlFor="gen_bulan" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Pilih Bulan</Label>
                <select
                  id="gen_bulan"
                  value={genForm.bulan}
                  onChange={(e) => setGenForm(prev => ({ ...prev, bulan: e.target.value }))}
                  required
                  className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 px-4 py-2 text-xs text-[#1C2620] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#5B7553]"
                >
                  {NAMA_BULAN.map((name, idx) => (
                    <option key={name} value={(idx + 1).toString()}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Tahun Select */}
              <div className="grid gap-2">
                <Label htmlFor="gen_tahun" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Pilih Tahun</Label>
                <select
                  id="gen_tahun"
                  value={genForm.tahun}
                  onChange={(e) => setGenForm(prev => ({ ...prev, tahun: e.target.value }))}
                  required
                  className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 px-4 py-2 text-xs text-[#1C2620] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#5B7553]"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              {/* Kelas Select (Optional) */}
              <div className="grid gap-2">
                <Label htmlFor="gen_kelas" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Target Kelas (Opsional)</Label>
                <select
                  id="gen_kelas"
                  value={genForm.kelas_id}
                  onChange={(e) => setGenForm(prev => ({ ...prev, kelas_id: e.target.value }))}
                  className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 px-4 py-2 text-xs text-[#1C2620] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#5B7553]"
                >
                  <option value="">Semua Santri Aktif</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id.toString()}>{c.nama_kelas}</option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="bg-[#F7F5F0]/60 dark:bg-[#121815]/60 p-4 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-2 border-t border-[#E3DEC6] dark:border-[#2D3A33] mt-2">
              <Button type="button" variant="outline" onClick={() => setGenDialogOpen(false)} disabled={isGenerating} className="border-[#E3DEC6] dark:border-[#2D3A33] bg-white dark:bg-[#1C2621] rounded-xl text-xs font-bold px-5 h-9 text-[#5B6350] dark:text-[#A0A898] cursor-pointer">
                Batal
              </Button>
              <Button type="submit" disabled={isGenerating} className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-5 h-9 shadow-sm cursor-pointer">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Proses...
                  </>
                ) : (
                  'Generate Sekarang'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Konfirmasi Tandai Lunas */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#1C2621] border-[#E3DEC6] dark:border-[#2D3A33] rounded-3xl p-6 max-w-sm select-none shadow-2xl transition-colors duration-300">
          <DialogHeader className="pb-4 border-b border-[#E3DEC6]/50 dark:border-[#2D3A33]/50">
            <DialogTitle className="font-heading text-base font-black text-[#1C2620] dark:text-[#EDEAE2] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Konfirmasi Pelunasan
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5B6350] dark:text-[#A0A898] mt-1.5 leading-relaxed">
              Apakah Anda yakin telah menerima pembayaran iuran santri <strong>{selectedIuran?.santri?.nama}</strong> untuk bulan <strong>{selectedIuran && NAMA_BULAN[selectedIuran.bulan - 1]} {selectedIuran?.tahun}</strong> secara tunai/transfer?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="lunas_keterangan" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-[#5B6350]/75" />
                Catatan / Keterangan Pembayaran
              </Label>
              <Input
                id="lunas_keterangan"
                value={keteranganLunas}
                onChange={(e) => setKeteranganLunas(e.target.value)}
                placeholder="Contoh: Transfer Mandiri An. Ahmad"
                className="border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="bg-[#F7F5F0]/60 dark:bg-[#121815]/60 p-4 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-2 border-t border-[#E3DEC6] dark:border-[#2D3A33] mt-2">
            <Button type="button" variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={isMarking} className="border-[#E3DEC6] dark:border-[#2D3A33] bg-white dark:bg-[#1C2621] rounded-xl text-xs font-bold px-5 h-9 text-[#5B6350] dark:text-[#A0A898] cursor-pointer">
              Batal
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirmLunas}
              disabled={isMarking} 
              className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-5 h-9 shadow-sm cursor-pointer"
            >
              {isMarking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Ya, Tandai Lunas'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IuranPage;
