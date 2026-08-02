# Master Prompt: Sistem Manajemen Kegiatan Santri (SIMKASAN)

> File ini adalah master prompt untuk AI coding tool (Antigravity/Claude Code/Cursor).
> Baca keseluruhan dokumen sebelum mulai eksekusi. Kerjakan bertahap sesuai fase, jangan loncat fase.

---

## 1. Ringkasan Proyek

Aplikasi web untuk pesantren mengelola kegiatan santri: absensi, hafalan (tahfidz), nilai akademik, jadwal kegiatan, dan laporan harian. Ada 3 sisi akses:

- **Admin** — kelola master data, atur role, monitoring keseluruhan
- **Ustadz/Pengasuh** — input absensi, input setoran hafalan, input nilai, buat laporan kegiatan harian per santri
- **Wali Santri (orang tua)** — akses read-only: rekap absen, progres hafalan, nilai, jadwal kegiatan mendatang anaknya

Nama kerja sistem: **SIMKASAN** (Sistem Informasi Kegiatan Santri) — bebas diganti nanti.

---

## 2. Tech Stack

### Backend
- Laravel 12 (instalasi polos via `laravel new`, JANGAN pakai Breeze/Jetstream)
- Sanctum untuk token-based auth (SPA authentication, bukan Passport)
- Spatie `laravel-permission` untuk role & permission granular
- MySQL sebagai database
- Laravel Queue (database driver dulu, cukup untuk skala pesantren) untuk job rekap otomatis
- Laravel Excel (maatwebsite/excel) — dipakai nanti kalau butuh export rapor/rekap, tapi jangan install di fase awal, tambahkan saat modul terkait dikerjakan

### Frontend
- React 19 + Vite
- TailwindCSS v4
- **shadcn/ui** sebagai basis komponen (Radix primitives + Tailwind, di-generate lewat CLI shadcn, BUKAN library komponen visual seperti Ant Design/MUI)
- React Router v6 untuk routing + route guard per role
- TanStack Query (react-query) untuk data fetching & caching ke API
- Axios sebagai HTTP client (dengan interceptor Sanctum token)
- Zod + React Hook Form untuk validasi form

### Struktur Repo
Monorepo, 1 repo root dengan struktur:

```
simkasan/
├── backend/          # Laravel 12 API
├── frontend/          # React 19 SPA
└── promt.md
```

---

## 3. Arahan Desain (WAJIB DIBACA SEBELUM BIKIN UI)

**Jangan pakai default shadcn (zinc/neutral + Inter tanpa modifikasi).** Ini harus terasa dirancang khusus untuk konteks pesantren, bukan template admin dashboard generik.

### Prinsip
- Ini aplikasi kerja harian (data-heavy: tabel, form, rekap) — desain harus **fungsional dulu, estetika kedua**. Tapi "fungsional" bukan alasan untuk jatuh ke tampilan Bootstrap/AdminLTE generik.
- Hindari AI-slop yang umum: JANGAN pakai (a) krem hangat + serif kontras tinggi + aksen terracotta, (b) hitam pekat + aksen hijau/vermilion neon tunggal, (c) layout broadsheet garis tipis. Ketiganya default AI, bukan pilihan.
- Restraint adalah kuncinya — satu elemen signature yang berani, sisanya tenang dan konsisten.

### Token Desain (starting point, boleh disesuaikan saat eksplorasi)
- **Warna dasar**: netral hangat gelap untuk sidebar/nav (bukan hitam pekat), putih/off-white untuk content area, satu warna aksen yang merefleksikan identitas pesantren (hijau tua/zaitun cocok — asosiasi Islami tanpa jadi klise hijau terang masjid-clipart). Contoh starting palette: `#1C2620` (deep olive-black, sidebar), `#F7F5F0` (off-white, background), `#5B7553` (sage/olive accent), `#C9A876` (muted gold, dipakai sangat terbatas untuk highlight/badge prestasi), `#8B3A3A` (muted terracotta-red, dipakai HANYA untuk status alpha/urgent)
- **Tipografi**: display/heading pakai geometric sans yang tegas (misal General Sans atau Plus Jakarta Sans), body pakai sans yang nyaman dibaca panjang (Inter cukup untuk body, karena ini konteks data bukan storytelling — asal jangan dipakai juga di heading)
- **Layout**: sidebar fixed kiri untuk admin/ustadz (navigasi modul), dashboard wali lebih card-based karena kontennya progress-oriented bukan tabel-manajemen
- **Signature element**: pertimbangkan progress hafalan divisualisasikan sebagai "peta juz" (30 kotak/segmen merepresentasikan 30 juz, terisi sesuai progres) — ini elemen yang related langsung ke konten (bukan dekorasi generik) dan bisa jadi visual paling diingat di dashboard wali
- Sebelum ngoding komponen, bikin dulu compact token plan (warna 4-6 hex bernama, tipografi 2 role, 1 layout concept per dashboard, 1 signature element) dan review sendiri: apakah ini template default atau benar dibuat untuk konteks pesantren?

---

## 4. Modul Inti (Scope Sekarang — JANGAN tambah fitur di luar ini dulu)

1. **Auth & Role** — login (Sanctum), 3 role: admin, ustadz, wali. Wali bisa punya >1 santri (relasi many-to-many).
2. **Master Data** — Santri, Kelas/Halaqah, Ustadz, relasi Wali-Santri
3. **Absensi** — input per sesi (bukan cuma 1x/hari), status (hadir/izin/sakit/alpha/terlambat), rekap per periode
4. **Hafalan/Tahfidz** — input setoran (surah, juz, halaman, nilai kelancaran, nilai tajwid, tanggal, ustadz pencatat), riwayat lengkap (bukan cuma snapshot terakhir), target vs realisasi
5. **Nilai Akademik** — input nilai per mapel/kegiatan per semester
6. **Kegiatan & Jadwal** — kalender kegiatan (rutin & mendatang), laporan kegiatan harian per santri (catatan ustadz)
7. **Dashboard Wali** — gabungan read-only dari semua modul di atas, filtered ke santri milik wali yang login

*(Fitur tambahan seperti pembayaran SPP, notifikasi WA, leaderboard — dikesampingkan dulu sesuai arahan, JANGAN dikerjakan di fase ini)*

---

## 5. Skema Database (High-Level)

```
users              (id, name, email, password, role via spatie)
santris            (id, nis, nama, kelas_id, tanggal_lahir, alamat, foto)
kelas              (id, nama_kelas, tingkat)
wali_santri        (id, user_id, nama, no_hp)
wali_santri_santri (pivot: wali_santri_id, santri_id)
absensis           (id, santri_id, tanggal, sesi, status, keterangan, dicatat_oleh)
hafalans           (id, santri_id, surah, juz, halaman_awal, halaman_akhir, nilai_kelancaran, nilai_tajwid, tanggal, ustadz_id, catatan)
target_hafalans    (id, santri_id, juz_target, deadline)
nilais             (id, santri_id, mapel, nilai, semester, tahun_ajaran, dicatat_oleh)
kegiatans          (id, nama, deskripsi, tanggal, tipe: rutin/mendatang)
laporan_harians    (id, santri_id, kegiatan_id, tanggal, catatan, ustadz_id)
```

Catatan: sesuaikan nama kolom & tambahkan migration relasi (foreign key + index) sesuai best practice Laravel 12.

---

## 6. Instruksi Eksekusi untuk AI Agent

### Fase 0 — Setup & Analisis (WAJIB sebelum ngoding apapun)
1. Konfirmasi struktur monorepo sudah sesuai section 2
2. Setup Laravel 12 di `backend/`, install Sanctum, Spatie permission — konfigurasi dulu tanpa bikin fitur
3. Setup React 19 + Vite di `frontend/`, install Tailwind v4, init shadcn/ui CLI, setup axios + react-query provider
4. Buat file `.env.example` yang jelas untuk kedua sisi

### Fase 1 — Auth & Role
- Buat migration users (extend default), tabel roles/permissions via Spatie
- Endpoint: register (admin only, untuk buat akun ustadz/wali), login, logout, me
- Middleware role-check per endpoint
- Frontend: halaman login, route guard per role, layout shell kosong per role (sidebar admin/ustadz, dashboard card wali)

### Fase 2 — Master Data
- CRUD Santri, Kelas, relasi Wali-Santri (many-to-many)
- Frontend: tabel management (pakai shadcn `DataTable` pattern), form create/edit dengan React Hook Form + Zod

### Fase 3 — Absensi
- CRUD input absensi per sesi, endpoint rekap (group by periode)
- Frontend: form input cepat untuk ustadz (bisa checklist massal per kelas), tampilan rekap untuk wali

### Fase 4 — Hafalan
- CRUD setoran hafalan, endpoint progress (juz completed vs total)
- Frontend: form input untuk ustadz, visualisasi "peta juz" untuk dashboard wali (signature element — lihat section 3)

### Fase 5 — Nilai & Kegiatan
- CRUD nilai per mapel/semester
- CRUD kegiatan (kalender) + laporan harian per santri
- Frontend: kalender kegiatan, tabel nilai, feed laporan harian

### Fase 6 — Dashboard Wali (Integrasi)
- Gabungkan semua data di atas jadi 1 dashboard per santri, dengan switcher kalau wali punya >1 anak
- Review UI keseluruhan terhadap prinsip desain di section 3 — apakah masih terasa generic template? Revisi kalau iya.

**Setelah setiap fase**: jalankan build/lint, laporkan singkat apa yang selesai dan asumsi apa yang diambil, baru lanjut fase berikutnya. Jangan skip konfirmasi ini.

---

## 7. Konvensi Kode

- Backend: Form Request untuk validasi (jangan validasi inline di controller), API Resource untuk response shape, service class untuk business logic yang lebih dari CRUD sederhana (misal kalkulasi rekap)
- Frontend: 1 folder per modul di `src/features/`, hooks custom untuk data fetching (`useSantri`, `useAbsensi`, dst), komponen shadcn di-generate lewat CLI lalu di-modifikasi, jangan copy-paste manual dari dokumentasi
- Penamaan: bahasa Indonesia untuk domain terms (santri, ustadz, hafalan, kegiatan) konsisten di database, API, dan UI — jangan campur dengan istilah Inggris (student, teacher) di tempat yang berbeda-beda