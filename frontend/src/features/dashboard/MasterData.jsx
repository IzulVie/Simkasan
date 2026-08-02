import React, { useState } from 'react';
import { useKelas } from '../kelas/useKelas';
import { useSantri } from '../santri/useSantri';
import { useWali } from '../wali/useWali';
import { useUsers } from '../auth/useUsers';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  Calendar,
  Phone,
  Mail,
  Lock,
  User,
  Hash,
  ShieldCheck
} from 'lucide-react';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('santri'); // santri, kelas, wali, user
  
  // Custom hooks
  const { classes, createClass, updateClass, deleteClass, isLoading: loadingKelas } = useKelas();
  const { santris, createSantri, updateSantri, deleteSantri, isLoading: loadingSantris } = useSantri();
  const { walis, createWali, updateWali, deleteWali, isLoading: loadingWali } = useWali();
  const { users, createUser, updateUser, deleteUser, isLoading: loadingUsers } = useUsers();

  // Modals state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // create, edit
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  // 1. Kelas Form
  const [kelasForm, setKelasForm] = useState({ nama_kelas: '', tingkat: '' });
  // 2. Santri Form
  const [santriForm, setSantriForm] = useState({ nis: '', nama: '', kelas_id: '', tanggal_lahir: '', alamat: '', foto: '' });
  // 3. Wali Form
  const [waliForm, setWaliForm] = useState({ nama: '', no_hp: '', email: '', password: '', santri_ids: [] });
  // 4. User Form (Ustadz & Admin)
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'ustadz' });

  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [santriSearch, setSantriSearch] = useState('');

  const filteredSantris = santris.filter(s => 
    s.nama.toLowerCase().includes(santriSearch.toLowerCase()) && 
    !waliForm.santri_ids.includes(s.id)
  );

  // Open create modal
  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormError('');
    setSelectedItem(null);
    if (activeTab === 'kelas') {
      setKelasForm({ nama_kelas: '', tingkat: '' });
    } else if (activeTab === 'santri') {
      setSantriForm({ nis: '', nama: '', kelas_id: classes[0]?.id || '', tanggal_lahir: '', alamat: '', foto: '' });
    } else if (activeTab === 'wali') {
      setWaliForm({ nama: '', no_hp: '', email: '', password: '', santri_ids: [] });
    } else if (activeTab === 'user') {
      setUserForm({ name: '', email: '', password: '', role: 'ustadz' });
    }
    setSantriSearch('');
    setDialogOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (item) => {
    setDialogMode('edit');
    setFormError('');
    setSelectedItem(item);
    if (activeTab === 'kelas') {
      setKelasForm({ nama_kelas: item.nama_kelas, tingkat: item.tingkat });
    } else if (activeTab === 'santri') {
      setSantriForm({ 
        nis: item.nis, 
        nama: item.nama, 
        kelas_id: item.kelas_id || '', 
        tanggal_lahir: item.tanggal_lahir || '', 
        alamat: item.alamat || '',
        foto: item.foto || ''
      });
    } else if (activeTab === 'wali') {
      setWaliForm({ 
        nama: item.nama, 
        no_hp: item.no_hp, 
        email: item.email || '', 
        password: '', 
        santri_ids: item.santris ? item.santris.map(s => s.id) : [] 
      });
    } else if (activeTab === 'user') {
      setUserForm({
        name: item.name,
        email: item.email,
        password: '',
        role: item.role || 'ustadz'
      });
    }
    setSantriSearch('');
    setDialogOpen(true);
  };

  // Delete handler
  const handleDeleteItem = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        if (activeTab === 'kelas') {
          await deleteClass(id);
        } else if (activeTab === 'santri') {
          await deleteSantri(id);
        } else if (activeTab === 'wali') {
          await deleteWali(id);
        } else if (activeTab === 'user') {
          await deleteUser(id);
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Gagal menghapus data.');
      }
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      if (activeTab === 'kelas') {
        if (dialogMode === 'create') {
          await createClass(kelasForm);
        } else {
          await updateClass({ id: selectedItem.id, data: kelasForm });
        }
      } else if (activeTab === 'santri') {
        if (dialogMode === 'create') {
          await createSantri(santriForm);
        } else {
          await updateSantri({ id: selectedItem.id, data: santriForm });
        }
      } else if (activeTab === 'wali') {
        if (dialogMode === 'create') {
          await createWali(waliForm);
        } else {
          await updateWali({ id: selectedItem.id, data: waliForm });
        }
      } else if (activeTab === 'user') {
        if (dialogMode === 'create') {
          await createUser(userForm);
        } else {
          await updateUser({ id: selectedItem.id, data: userForm });
        }
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat memproses data. Periksa inputan Anda.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const toggleWaliSantriSelect = (santriId) => {
    setWaliForm(prev => {
      const exists = prev.santri_ids.includes(santriId);
      return {
        ...prev,
        santri_ids: exists 
          ? prev.santri_ids.filter(id => id !== santriId)
          : [...prev.santri_ids, santriId]
      };
    });
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* Tab Switcher Capsule (Premium Donezo Tab Style) */}
      <div className="bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] p-1 rounded-2xl flex md:inline-flex shadow-sm gap-1 overflow-x-auto max-w-full whitespace-nowrap scrollbar-none self-start">
        {[
          { id: 'santri', label: 'Data Santri', icon: GraduationCap },
          { id: 'kelas', label: 'Data Kelas', icon: BookOpen },
          { id: 'wali', label: 'Data Wali Santri', icon: Users },
          { id: 'user', label: 'Ustadz & Admin', icon: ShieldCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setFormError('');
            }}
            className={`flex items-center px-4 py-2 text-xs font-bold rounded-xl transition-all gap-2 ${
              activeTab === tab.id
                ? 'bg-[#5B7553] text-[#F7F5F0] shadow-sm font-extrabold'
                : 'text-[#5B6350] hover:text-[#1C2620] hover:bg-[#F7F5F0]/60'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Title Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">
            {activeTab === 'santri' && 'Data Santri'}
            {activeTab === 'kelas' && 'Data Kelas & Halaqah'}
            {activeTab === 'wali' && 'Data Wali Santri'}
            {activeTab === 'user' && 'Data Ustadz & Administrator'}
          </h1>
          <p className="text-xs text-[#5B6350] mt-0.5">
            {activeTab === 'santri' && 'Kelola biodata santri pesantren beserta penempatan kelas.'}
            {activeTab === 'kelas' && 'Kelola kelas pembelajaran dan tingkat bimbingan halaqah.'}
            {activeTab === 'wali' && 'Kelola wali santri, kredensial login, dan relasi anak asuh.'}
            {activeTab === 'user' && 'Kelola kredensial ustadz pengajar halaqah dan tim administrator SIMKASAN.'}
          </p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          {activeTab === 'santri' && 'Santri Baru'}
          {activeTab === 'kelas' && 'Kelas Baru'}
          {activeTab === 'wali' && 'Wali Baru'}
          {activeTab === 'user' && 'Pengelola Baru'}
        </Button>
      </div>

      {/* Main Table Card (Donezo Grid Style) */}
      <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {/* Data Tables */}
          {activeTab === 'santri' && (
            loadingSantris ? (
              <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : santris.length === 0 ? (
              <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada data santri.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                    <TableRow>
                      <TableHead className="w-32 pl-6">NIS</TableHead>
                      <TableHead>Nama Lengkap</TableHead>
                      <TableHead>Kelas/Halaqah</TableHead>
                      <TableHead>Tanggal Lahir</TableHead>
                      <TableHead className="w-24 text-center pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {santris.map((santri) => (
                      <TableRow key={santri.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                        <TableCell className="pl-6 font-bold text-[#1C2620]">{santri.nis}</TableCell>
                        <TableCell className="font-bold text-[#1C2620]">{santri.nama}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-[#5B7553]/10 text-[#5B7553] border-0 font-bold text-[10px] px-2 py-0.5">
                            {santri.kelas ? santri.kelas.nama_kelas : 'Belum Ditentukan'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-[#5B6350]">{santri.tanggal_lahir || '-'}</TableCell>
                        <TableCell className="flex justify-center gap-1 pr-6">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(santri)} className="h-8 w-8 text-[#5B7553] hover:bg-[#F7F5F0]">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(santri.id)} className="h-8 w-8 text-[#8B3A3A] hover:bg-[#8B3A3A]/5">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {activeTab === 'kelas' && (
            loadingKelas ? (
              <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : classes.length === 0 ? (
              <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada data kelas.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                    <TableRow>
                      <TableHead className="pl-6">Nama Kelas</TableHead>
                      <TableHead className="w-48">Tingkat</TableHead>
                      <TableHead className="w-48 text-center">Jumlah Santri</TableHead>
                      <TableHead className="w-24 text-center pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((c) => (
                      <TableRow key={c.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                        <TableCell className="pl-6 font-bold text-[#1C2620]">{c.nama_kelas}</TableCell>
                        <TableCell className="text-xs text-[#5B6350]">Tingkat {c.tingkat}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-[#5B7553]/15 text-[#5B7553] border-0 text-[10px] font-black px-2.5 py-0.5">
                            {c.santris_count || 0} Santri
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-center gap-1 pr-6">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(c)} className="h-8 w-8 text-[#5B7553] hover:bg-[#F7F5F0]">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(c.id)} className="h-8 w-8 text-[#8B3A3A] hover:bg-[#8B3A3A]/5">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {activeTab === 'wali' && (
            loadingWali ? (
              <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : walis.length === 0 ? (
              <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada data wali santri.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                    <TableRow>
                      <TableHead className="pl-6">Nama Wali</TableHead>
                      <TableHead>No HP</TableHead>
                      <TableHead>Email Login</TableHead>
                      <TableHead>Anak Asuh (Santri)</TableHead>
                      <TableHead className="w-24 text-center pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walis.map((wali) => (
                      <TableRow key={wali.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                        <TableCell className="pl-6 font-bold text-[#1C2620]">{wali.nama}</TableCell>
                        <TableCell className="text-xs text-[#5B6350]">{wali.no_hp}</TableCell>
                        <TableCell className="text-xs text-[#5B6350]">{wali.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {wali.santris && wali.santris.length > 0 ? (
                              wali.santris.map(s => (
                                <Badge key={s.id} className="bg-[#C9A876]/15 text-[#8A6A3A] border-0 text-[10px] font-black px-2 py-0.5">
                                  {s.nama}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-[10px] text-[#8B3A3A] font-bold">Belum Dipetakan</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="flex justify-center gap-1 pr-6">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(wali)} className="h-8 w-8 text-[#5B7553] hover:bg-[#F7F5F0]">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(wali.id)} className="h-8 w-8 text-[#8B3A3A] hover:bg-[#8B3A3A]/5">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {activeTab === 'user' && (
            loadingUsers ? (
              <div className="flex justify-center py-8 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-sm text-[#5B6350]">Belum ada data ustadz atau administrator.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7F5F0] border-b border-[#E3DEC6]">
                    <TableRow>
                      <TableHead className="pl-6">Nama Pengguna</TableHead>
                      <TableHead>Email Login</TableHead>
                      <TableHead>Jabatan / Role</TableHead>
                      <TableHead className="w-24 text-center pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((item) => (
                      <TableRow key={item.id} className="hover:bg-[#F7F5F0]/20 transition-colors">
                        <TableCell className="pl-6 font-bold text-[#1C2620]">{item.name}</TableCell>
                        <TableCell className="text-xs text-[#5B6350]">{item.email}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`border-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg ${
                              item.role === 'admin' 
                                ? 'bg-[#C9A876]/15 text-[#8A6A3A]' 
                                : 'bg-[#5B7553]/15 text-[#5B7553]'
                            }`}
                          >
                            {item.role === 'admin' ? 'Administrator' : 'Ustadz / Pengajar'}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-center gap-1 pr-6">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} className="h-8 w-8 text-[#5B7553] hover:bg-[#F7F5F0]">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} className="h-8 w-8 text-[#8B3A3A] hover:bg-[#8B3A3A]/5">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* CRUD dialog modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl sm:max-w-xl bg-white border-[#E3DEC6] rounded-3xl p-6 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <DialogHeader className="pb-3">
              <DialogTitle className="font-heading text-lg font-black text-[#1C2620]">
                {dialogMode === 'create' ? 'Tambah Data' : 'Ubah Data'} {
                  activeTab === 'kelas' ? 'Kelas' : activeTab === 'santri' ? 'Santri' : activeTab === 'wali' ? 'Wali Santri' : 'Pengelola'
                }
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5B6350]">
                Masukkan rincian informasi di bawah. Harap pastikan seluruh inputan valid.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="text-xs bg-[#8B3A3A]/10 border border-[#8B3A3A]/30 text-[#8B3A3A] p-3 rounded-xl flex items-center mb-2">
                <span>{formError}</span>
              </div>
            )}

            {/* Scrollable Fields Section */}
            <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4 max-h-[50vh] scrollbar-thin">
              {/* Render fields dynamically based on active tab */}
              {activeTab === 'kelas' && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nama_kelas" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Nama Kelas / Halaqah</Label>
                    <Input 
                      id="nama_kelas"
                      value={kelasForm.nama_kelas}
                      onChange={(e) => setKelasForm(prev => ({ ...prev, nama_kelas: e.target.value }))}
                      placeholder="Contoh: Kelas 7A (Halaqah Utsman)"
                      required
                      className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tingkat" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Tingkat (Tahun)</Label>
                    <Input 
                      id="tingkat"
                      value={kelasForm.tingkat}
                      onChange={(e) => setKelasForm(prev => ({ ...prev, tingkat: e.target.value }))}
                      placeholder="Contoh: 7, 8, atau 9"
                      required
                      className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'santri' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nis" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Hash className="h-3 w-3 text-[#5B6350]/60" /> NIS</Label>
                      <Input 
                        id="nis"
                        value={santriForm.nis}
                        onChange={(e) => setSantriForm(prev => ({ ...prev, nis: e.target.value }))}
                        placeholder="Contoh: 202601001"
                        required
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nama" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><User className="h-3 w-3 text-[#5B6350]/60" /> Nama Lengkap</Label>
                      <Input 
                        id="nama"
                        value={santriForm.nama}
                        onChange={(e) => setSantriForm(prev => ({ ...prev, nama: e.target.value }))}
                        placeholder="Nama Lengkap Santri"
                        required
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="kelas_id" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Pilih Kelas</Label>
                      <select
                        id="kelas_id"
                        value={santriForm.kelas_id}
                        onChange={(e) => setSantriForm(prev => ({ ...prev, kelas_id: e.target.value }))}
                        required
                        className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                      >
                        {classes.map(c => (
                          <option key={c.id} value={c.id}>{c.nama_kelas}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tanggal_lahir" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Calendar className="h-3 w-3 text-[#5B6350]/60" /> Tanggal Lahir</Label>
                      <Input 
                        id="tanggal_lahir"
                        type="date"
                        value={santriForm.tanggal_lahir}
                        onChange={(e) => setSantriForm(prev => ({ ...prev, tanggal_lahir: e.target.value }))}
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="alamat" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Alamat Rumah</Label>
                    <textarea
                      id="alamat"
                      value={santriForm.alamat}
                      onChange={(e) => setSantriForm(prev => ({ ...prev, alamat: e.target.value }))}
                      placeholder="Alamat asal wali / orang tua"
                      rows={2}
                      className="flex min-h-[60px] w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'wali' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="wali_nama" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><User className="h-3 w-3 text-[#5B6350]/60" /> Nama Wali</Label>
                      <Input 
                        id="wali_nama"
                        value={waliForm.nama}
                        onChange={(e) => setWaliForm(prev => ({ ...prev, nama: e.target.value }))}
                        placeholder="Nama Orang Tua / Wali"
                        required
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="no_hp" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Phone className="h-3 w-3 text-[#5B6350]/60" /> Nomor WhatsApp</Label>
                      <Input 
                        id="no_hp"
                        value={waliForm.no_hp}
                        onChange={(e) => setWaliForm(prev => ({ ...prev, no_hp: e.target.value }))}
                        placeholder="Contoh: 081234567890"
                        required
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Mail className="h-3 w-3 text-[#5B6350]/60" /> Email Akun Login</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={waliForm.email}
                        onChange={(e) => setWaliForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@login.com"
                        required={dialogMode === 'create'}
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Lock className="h-3 w-3 text-[#5B6350]/60" /> Password {dialogMode === 'edit' && '(Kosongi jika tidak diubah)'}</Label>
                      <Input 
                        id="password"
                        type="password"
                        value={waliForm.password}
                        onChange={(e) => setWaliForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Kata Sandi Login"
                        required={dialogMode === 'create'}
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Hubungan Anak (Santri)</Label>
                    
                    {/* Selected Santri Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {waliForm.santri_ids.map(id => {
                        const santri = santris.find(s => s.id === id);
                        if (!santri) return null;
                        return (
                          <Badge key={id} className="bg-[#5B7553] text-[#F7F5F0] border-0 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                            {santri.nama} ({santri.nis})
                            <button
                              type="button"
                              onClick={() => toggleWaliSantriSelect(id)}
                              className="hover:text-amber-200 focus:outline-none font-bold text-[13px] leading-none"
                            >
                              &times;
                            </button>
                          </Badge>
                        );
                      })}
                      {waliForm.santri_ids.length === 0 && (
                        <span className="text-xs text-[#8B3A3A] font-bold">Belum ada anak asuh yang dipilih.</span>
                      )}
                    </div>

                    {/* Search Input and matching dropdown */}
                    <div className="relative">
                      <div className="relative">
                        <Input
                          type="text"
                          value={santriSearch}
                          onChange={(e) => setSantriSearch(e.target.value)}
                          placeholder="Ketik nama santri untuk mencari..."
                          className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none w-full"
                        />
                        {santriSearch && (
                          <button
                            type="button"
                            onClick={() => setSantriSearch('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#5B6350] hover:text-[#1C2620]"
                          >
                            Batal
                          </button>
                        )}
                      </div>

                      {/* Matching Dropdown list */}
                      {santriSearch && filteredSantris.length > 0 && (
                        <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] rounded-2xl shadow-lg z-50 divide-y divide-[#E3DEC6]/50 dark:divide-[#2D3A33]/50">
                          {filteredSantris.map(s => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                toggleWaliSantriSelect(s.id);
                                setSantriSearch('');
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-[#1C2620] dark:text-[#EDEAE2] hover:bg-[#F7F5F0]/60 dark:hover:bg-[#2D3A33]/50 transition-colors font-bold flex items-center justify-between"
                            >
                              <span>{s.nama} <span className="text-[#5B6350] dark:text-[#A0A898] font-normal">({s.nis})</span></span>
                              <span className="text-[10px] text-[#5B7553] font-black uppercase tracking-wider">Pilih +</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {santriSearch && filteredSantris.length === 0 && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#1C2621] border border-[#E3DEC6] dark:border-[#2D3A33] rounded-2xl p-3 shadow-lg z-50 text-center text-xs text-[#8B3A3A] font-bold">
                          Tidak ada santri yang cocok atau santri sudah dipilih.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'user' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="user_name" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><User className="h-3 w-3 text-[#5B6350]/60" /> Nama Lengkap</Label>
                      <Input 
                        id="user_name"
                        value={userForm.name}
                        onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nama Ustadz / Admin"
                        required
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="user_role" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350]">Jabatan / Hak Akses</Label>
                      <select
                        id="user_role"
                        value={userForm.role}
                        onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                        required
                        className="flex h-11 w-full rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/30 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553]"
                      >
                        <option value="ustadz">Ustadz / Pengajar</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="user_email" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Mail className="h-3 w-3 text-[#5B6350]/60" /> Email Login</Label>
                      <Input 
                        id="user_email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="nama@email.com"
                        required
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="user_password" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] flex items-center gap-1"><Lock className="h-3 w-3 text-[#5B6350]/60" /> Password {dialogMode === 'edit' && '(Kosongi jika tidak diubah)'}</Label>
                      <Input 
                        id="user_password"
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Min. 8 karakter"
                        required={dialogMode === 'create'}
                        className="border-[#E3DEC6] bg-[#F7F5F0]/30 rounded-2xl h-11 px-4 text-xs focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="bg-[#F7F5F0]/60 p-4 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-2 border-t border-[#E3DEC6] mt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={formSubmitting} className="border-[#E3DEC6] bg-white rounded-xl text-xs font-bold px-5 h-9 text-[#5B6350]">
                Batal
              </Button>
              <Button type="submit" disabled={formSubmitting} className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-5 h-9 shadow-sm">
                {formSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Data'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterData;
