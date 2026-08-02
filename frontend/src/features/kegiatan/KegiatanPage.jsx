import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useKegiatan } from './useKegiatan';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  FileText,
  Bookmark
} from 'lucide-react';

const KegiatanPage = () => {
  const { user } = useAuth();
  const isStaff = user?.roles?.includes('admin') || user?.roles?.includes('ustadz');

  // Filters (optional)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const filters = {
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate }),
  };

  const { activities, isLoading, createKegiatan, updateKegiatan, deleteKegiatan } = useKegiatan(filters);

  // Form / Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [form, setForm] = useState({
    nama_kegiatan: '',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '16:00 - 17:00',
    deskripsi: ''
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormError('');
    setSelectedActivity(null);
    setForm({
      nama_kegiatan: '',
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '16:00 - 17:00',
      deskripsi: ''
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (activity) => {
    setDialogMode('edit');
    setFormError('');
    setSelectedActivity(activity);
    setForm({
      nama_kegiatan: activity.nama_kegiatan,
      tanggal: activity.tanggal,
      waktu: activity.waktu,
      deskripsi: activity.deskripsi || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal kegiatan ini?')) {
      try {
        await deleteKegiatan(id);
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
        await createKegiatan(form);
      } else {
        await updateKegiatan({ id: selectedActivity.id, data: form });
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat memproses data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Jadwal & Kegiatan Pesantren</h1>
          <p className="text-xs text-[#5B6350] mt-0.5">Ikuti kalender agenda bimbingan, kajian, dan program pembelajaran santri.</p>
        </div>

        {isStaff && (
          <Button 
            onClick={handleOpenCreate} 
            className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold h-11 px-5 flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Agenda Baru
          </Button>
        )}
      </div>

      {/* Agenda Calendar Board */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main List */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-[#E3DEC6] bg-[#F7F5F0]/30">
              <h3 className="font-heading text-[#1C2620] text-base font-black">Daftar Agenda Terdekat</h3>
            </div>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
              ) : activities.length === 0 ? (
                <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada agenda kegiatan terjadwal.</p>
              ) : (
                <div className="divide-y divide-[#E3DEC6]">
                  {activities.map((act) => (
                    <div key={act.id} className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all hover:bg-[#F7F5F0]/20">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-[#5B7553]/10 text-[#5B7553] border-0 text-[10px] font-black flex items-center gap-1 px-2 py-0.5 rounded-lg">
                            <Calendar className="h-3 w-3" /> {act.tanggal}
                          </Badge>
                          <Badge variant="outline" className="bg-[#C9A876]/15 text-[#8A6A3A] border-0 text-[10px] font-black flex items-center gap-1 px-2 py-0.5 rounded-lg">
                            <Clock className="h-3 w-3" /> {act.waktu}
                          </Badge>
                        </div>
                        <h4 className="font-heading text-lg font-black text-[#1C2620]">{act.nama_kegiatan}</h4>
                        <p className="text-xs text-[#5B6350] leading-relaxed pr-6">{act.deskripsi || 'Tidak ada deskripsi tambahan.'}</p>
                      </div>

                      {isStaff && (
                        <div className="flex gap-1 self-end sm:self-start">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(act)} className="h-8 w-8 text-[#5B7553] hover:bg-[#F7F5F0]">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(act.id)} className="h-8 w-8 text-[#8B3A3A] hover:bg-[#8B3A3A]/5">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info Calendar */}
        <div className="space-y-6">
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6">
            <h3 className="font-heading text-[#1C2620] text-base font-black flex items-center gap-2 mb-4">
              <Bookmark className="h-4.5 w-4.5 text-[#C9A876]" />
              Catatan Harian
            </h3>
            <div className="space-y-4 text-xs text-[#5B6350] leading-relaxed">
              <div className="border-l-4 border-[#5B7553] pl-3.5 py-1.5 bg-[#5B7553]/5 rounded-r-xl">
                <span className="font-black text-[#1C2620] block mb-0.5">Tata Tertib Halaqah</span>
                Santri wajib berada di area masjid 10 menit sebelum adzan berkumandang untuk persiapan tilawah.
              </div>
              <div className="border-l-4 border-[#C9A876] pl-3.5 py-1.5 bg-[#C9A876]/10 rounded-r-xl">
                <span className="font-black text-[#1C2620] block mb-0.5">Pakaian / Seragam</span>
                Gunakan jubah putih bersih pada halaqah malam (Isya) dan kajian umum akhir pekan.
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CRUD dialog modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl sm:max-w-xl bg-white border-[#E3DEC6] rounded-3xl p-6 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <DialogHeader className="pb-3">
              <DialogTitle className="font-heading text-lg font-black text-[#1C2620]">
                {dialogMode === 'create' ? 'Tambah Agenda Baru' : 'Ubah Agenda Kegiatan'}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5B6350]">
                Masukkan detail informasi agenda pesantren di bawah.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="text-xs bg-[#8B3A3A]/10 border border-[#8B3A3A]/30 text-[#8B3A3A] p-3 rounded-xl flex items-center mb-2">
                <span>{formError}</span>
              </div>
            )}

            {/* Scrollable Fields Wrapper */}
            <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4 max-h-[50vh] scrollbar-thin">
              <div className="grid gap-2">
                <Label htmlFor="nama_kegiatan" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Nama Agenda Kegiatan</Label>
                <Input
                  id="nama_kegiatan"
                  value={form.nama_kegiatan}
                  onChange={(e) => setForm(prev => ({ ...prev, nama_kegiatan: e.target.value }))}
                  placeholder="Contoh: Kajian Fikih Bulughul Maram"
                  required
                  className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tanggal" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Calendar className="h-3 w-3 text-[#5B6350]/60" /> Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm(prev => ({ ...prev, tanggal: e.target.value }))}
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="waktu" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Clock className="h-3 w-3 text-[#5B6350]/60" /> Waktu Sesi</Label>
                  <Input
                    id="waktu"
                    value={form.waktu}
                    onChange={(e) => setForm(prev => ({ ...prev, waktu: e.target.value }))}
                    placeholder="Contoh: 16:00 - 17:30 WIB"
                    required
                    className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deskripsi" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><FileText className="h-3 w-3 text-[#5B6350]/60" /> Deskripsi Tambahan</Label>
                <textarea
                  id="deskripsi"
                  value={form.deskripsi}
                  onChange={(e) => setForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                  placeholder="Tuliskan keterangan detail lokasi, kitab kajian, atau persyaratan lainnya..."
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                />
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
                  'Simpan Agenda'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KegiatanPage;
