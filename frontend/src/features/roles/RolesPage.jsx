import React, { useState } from 'react';
import { useRole } from './useRole';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Unlock,
  CheckSquare
} from 'lucide-react';

const PERMISSION_LABELS = {
  'menu_master_data': { title: 'Kelola Master Data', desc: 'Melihat & mengubah data Kelas, Santri, dan Wali Santri' },
  'menu_absensi': { title: 'Kelola Absensi', desc: 'Mencatat & merekap kehadiran harian santri' },
  'menu_hafalan': { title: 'Kelola Hafalan', desc: 'Mencatat & menyimak setoran juz/surah santri' },
  'menu_nilai': { title: 'Kelola Nilai Akademik', desc: 'Menginput rapor & nilai pelajaran santri' },
  'menu_kegiatan': { title: 'Kelola Kegiatan', desc: 'Menambah & menyunting agenda pondok pesantren' },
  'menu_iuran': { title: 'Kelola Iuran & Syahriah', desc: 'Membuat & memverifikasi status pembayaran bulanan' },
  'manage_roles': { title: 'Manajemen Hak Akses', desc: 'Menambah & mengatur izin akses masing-masing role' }
};

const SYSTEM_ROLES = ['admin', 'ustadz', 'wali'];

const RolesPage = () => {
  const { 
    roles, 
    isLoadingRoles, 
    permissions, 
    isLoadingPermissions, 
    createRole, 
    isCreating, 
    updateRole, 
    isUpdating, 
    deleteRole, 
    isDeleting 
  } = useRole();

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  // Selected item states
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Form states
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle open dialog for new role
  const handleOpenCreate = () => {
    setDialogMode('create');
    setSelectedRole(null);
    setRoleName('');
    setSelectedPermissions([]);
    setErrorMsg('');
    setDialogOpen(true);
  };

  // Handle open dialog for editing role
  const handleOpenEdit = (role) => {
    setDialogMode('edit');
    setSelectedRole(role);
    setRoleName(role.name.toUpperCase());
    setSelectedPermissions(role.permissions.map(p => p.name));
    setErrorMsg('');
    setDialogOpen(true);
  };

  // Toggle permission selection
  const handleTogglePermission = (permName) => {
    setSelectedPermissions(prev => 
      prev.includes(permName) 
        ? prev.filter(p => p !== permName) 
        : [...prev, permName]
    );
  };

  // Toggle all permissions (Select All / Unselect All)
  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map(p => p.name));
    }
  };

  // Handle form submission (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!roleName.trim()) {
      setErrorMsg('Nama role tidak boleh kosong.');
      return;
    }

    try {
      if (dialogMode === 'create') {
        const res = await createRole({
          name: roleName.trim(),
          permissions: selectedPermissions
        });
        alert(res.message || 'Role baru berhasil dibuat.');
      } else {
        const res = await updateRole({
          id: selectedRole.id,
          name: roleName.trim(),
          permissions: selectedPermissions
        });
        alert(res.message || 'Role berhasil diperbarui.');
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan sistem.');
    }
  };

  // Handle open delete dialog
  const handleOpenDelete = (role) => {
    setSelectedRole(role);
    setDeleteOpen(true);
  };

  // Handle delete action
  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;
    try {
      const res = await deleteRole(selectedRole.id);
      alert(res.message || 'Role berhasil dihapus.');
      setDeleteOpen(false);
      setSelectedRole(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menghapus role.');
    }
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header Block */}
      <div className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] dark:text-[#EDEAE2] tracking-tight">Hak Akses & Role</h1>
          <p className="text-xs text-[#5B6350] dark:text-[#A0A898] mt-0.5">Kelola hak akses dinamis dan izin fitur masing-masing role pengurus pesantren.</p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 shadow-sm self-start md:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Role Baru
        </Button>
      </div>

      {/* Main List */}
      {isLoadingRoles || isLoadingPermissions ? (
        <div className="flex justify-center py-12 text-[#5B7553]"><Loader2 className="animate-spin h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const isSystem = SYSTEM_ROLES.includes(role.name.toLowerCase());
            return (
              <Card 
                key={role.id} 
                className="border-[#E3DEC6] dark:border-[#2D3A33] shadow-sm bg-white dark:bg-[#1C2621] rounded-3xl overflow-hidden transition-all hover:shadow-md duration-300 flex flex-col justify-between"
              >
                <CardHeader className="p-6 pb-4 border-b border-[#E3DEC6]/40 dark:border-[#2D3A33]/40">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="font-heading text-base font-black text-[#1C2620] dark:text-[#EDEAE2] uppercase tracking-wide flex items-center gap-1.5">
                        <Shield className="h-4.5 w-4.5 text-[#5B7553]" />
                        {role.name}
                      </CardTitle>
                      <CardDescription className="text-[10px] text-[#5B6350] dark:text-[#A0A898] mt-0.5 font-bold">
                        Guard: {role.guard_name}
                      </CardDescription>
                    </div>
                    {isSystem ? (
                      <Badge className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-black text-[9px] uppercase px-2 py-0.5 rounded-md border-0 flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5" />
                        Role Sistem
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 font-black text-[9px] uppercase px-2 py-0.5 rounded-md border-0 flex items-center gap-1">
                        <Unlock className="h-2.5 w-2.5" />
                        Role Kustom
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 py-4 flex-grow space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898] block">Izin Fitur Aktif:</span>
                  {role.permissions.length === 0 ? (
                    <p className="text-xs text-[#8B3A3A] italic font-bold">Tidak ada izin fitur yang diaktifkan untuk role ini.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map((perm) => (
                        <Badge 
                          key={perm.id} 
                          className="bg-[#5B7553]/10 text-[#5B7553] dark:bg-[#5B7553]/25 dark:text-[#EDEAE2] font-bold text-[9px] px-2 py-0.5 rounded-md border-0 hover:bg-[#5B7553]/10"
                        >
                          {PERMISSION_LABELS[perm.name]?.title || perm.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-6 pt-4 border-t border-[#E3DEC6]/40 dark:border-[#2D3A33]/40 bg-[#F7F5F0]/30 dark:bg-[#121815]/20 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(role)}
                    className="border-[#E3DEC6] bg-white dark:bg-[#1C2621] rounded-xl text-xs font-bold px-3.5 h-9 text-[#5B6350] dark:text-[#A0A898] flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Izin
                  </Button>
                  {!isSystem && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenDelete(role)}
                      className="bg-transparent hover:bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold px-3.5 h-9 shadow-none hover:text-rose-600 flex items-center gap-1 cursor-pointer border border-transparent"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog: Create or Edit Role */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#1C2621] border-[#E3DEC6] dark:border-[#2D3A33] rounded-3xl p-6 max-w-lg select-none shadow-2xl transition-colors duration-300">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="pb-4 border-b border-[#E3DEC6]/50 dark:border-[#2D3A33]/50">
              <DialogTitle className="font-heading text-lg font-black text-[#1C2620] dark:text-[#EDEAE2] flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#5B7553]" />
                {dialogMode === 'create' ? 'Tambah Role Baru' : 'Edit Izin Hak Akses'}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5B6350] dark:text-[#A0A898] mt-1">
                {dialogMode === 'create' 
                  ? 'Definisikan nama role dan centang izin akses fitur di dashboard.' 
                  : 'Modifikasi izin akses untuk role sistem atau kustom.'}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-400 p-3 rounded-xl text-[11px] font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Role Name Input */}
              <div className="grid gap-2">
                <Label htmlFor="role_name" className="text-[10px] font-black uppercase tracking-wider text-[#5B6350] dark:text-[#A0A898]">Nama Role</Label>
                <Input
                  id="role_name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Contoh: BENDAHARA, KEPALA ASRAMA"
                  required
                  disabled={dialogMode === 'edit' && SYSTEM_ROLES.includes(selectedRole?.name.toLowerCase())}
                  className="border-[#E3DEC6] dark:border-[#2D3A33] bg-[#F7F5F0]/30 dark:bg-[#121815]/30 rounded-2xl h-11 px-4 text-xs font-bold focus:ring-1 focus:ring-[#5B7553] focus:border-[#5B7553] focus:outline-none disabled:opacity-60"
                />
              </div>

              {/* Permissions Checkboxes Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-[#E3DEC6]/40 dark:border-[#2D3A33]/40 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1C2620] dark:text-[#EDEAE2]">Daftar Izin Akses Fitur Dashboard</span>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[10px] font-black uppercase text-[#5B7553] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckSquare className="h-3 w-3" />
                    {selectedPermissions.length === permissions.length ? 'Batal Centang Semua' : 'Centang Semua'}
                  </button>
                </div>

                <div className="divide-y divide-[#E3DEC6]/30 dark:divide-[#2D3A33]/30">
                  {permissions.map((perm) => {
                    const info = PERMISSION_LABELS[perm.name] || { title: perm.name, desc: 'Izin sistem kustom.' };
                    const isChecked = selectedPermissions.includes(perm.name);
                    return (
                      <div 
                        key={perm.id} 
                        onClick={() => handleTogglePermission(perm.name)}
                        className="flex items-start gap-3 py-3 cursor-pointer hover:bg-[#F7F5F0]/40 dark:hover:bg-[#121815]/20 rounded-xl px-2 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by div onClick to make the whole row interactive
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#5B7553] focus:ring-[#5B7553] accent-[#5B7553]"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#1C2620] dark:text-[#EDEAE2] block">{info.title}</span>
                          <span className="text-[10px] text-[#5B6350] dark:text-[#A0A898] leading-normal block">{info.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="bg-[#F7F5F0]/60 dark:bg-[#121815]/60 p-4 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-2 border-t border-[#E3DEC6] dark:border-[#2D3A33] mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)} 
                disabled={isCreating || isUpdating} 
                className="border-[#E3DEC6] dark:border-[#2D3A33] bg-white dark:bg-[#1C2621] rounded-xl text-xs font-bold px-5 h-9 text-[#5B6350] dark:text-[#A0A898] cursor-pointer"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating || isUpdating} 
                className="bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] rounded-xl text-xs font-bold px-5 h-9 shadow-sm cursor-pointer"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Hak Akses'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Delete Confirm */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white dark:bg-[#1C2621] border-[#E3DEC6] dark:border-[#2D3A33] rounded-3xl p-6 max-w-sm select-none shadow-2xl transition-colors duration-300">
          <DialogHeader className="pb-4 border-b border-[#E3DEC6]/50 dark:border-[#2D3A33]/50">
            <DialogTitle className="font-heading text-base font-black text-[#1C2620] dark:text-[#EDEAE2] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              Hapus Role
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5B6350] dark:text-[#A0A898] mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus role <strong>{selectedRole?.name.toUpperCase()}</strong>? Pengguna yang memegang role ini akan kehilangan hak aksesnya.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="bg-[#F7F5F0]/60 dark:bg-[#121815]/60 p-4 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-2 border-t border-[#E3DEC6] dark:border-[#2D3A33] mt-2">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting} className="border-[#E3DEC6] dark:border-[#2D3A33] bg-white dark:bg-[#1C2621] rounded-xl text-xs font-bold px-5 h-9 text-[#5B6350] dark:text-[#A0A898] cursor-pointer">
              Batal
            </Button>
            <Button 
              type="button" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting} 
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold px-5 h-9 shadow-sm cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPage;
