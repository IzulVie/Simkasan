<?php

namespace Database\Seeders;

use App\Models\Hafalan;
use App\Models\Kegiatan;
use App\Models\Kelas;
use App\Models\Nilai;
use App\Models\Santri;
use App\Models\User;
use App\Models\WaliSantri;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Kelas
        $k7a = Kelas::create(['nama_kelas' => 'Kelas 7A (Halaqah Utsman)', 'tingkat' => '7']);
        $k7b = Kelas::create(['nama_kelas' => 'Kelas 7B (Halaqah Ali)', 'tingkat' => '7']);
        $k8a = Kelas::create(['nama_kelas' => 'Kelas 8A (Halaqah Umar)', 'tingkat' => '8']);
        $k9a = Kelas::create(['nama_kelas' => 'Kelas 9A (Halaqah Abu Bakar)', 'tingkat' => '9']);

        // 2. Seed Santri
        $s1 = Santri::create([
            'nis' => '202607001',
            'nama' => 'Muhammad Ali Fathur',
            'kelas_id' => $k7a->id,
            'tanggal_lahir' => '2013-05-12',
            'alamat' => 'Jl. Pesantren No. 12, Surabaya',
        ]);

        $s2 = Santri::create([
            'nis' => '202607002',
            'nama' => 'Budi Pratama',
            'kelas_id' => $k7a->id,
            'tanggal_lahir' => '2013-08-20',
            'alamat' => 'Jl. Ketintang Baru V, Surabaya',
        ]);

        $s3 = Santri::create([
            'nis' => '202608001',
            'nama' => 'Zainuddin Malik',
            'kelas_id' => $k8a->id,
            'tanggal_lahir' => '2012-02-14',
            'alamat' => 'Jl. Dharmahusada Permai, Surabaya',
        ]);

        $s4 = Santri::create([
            'nis' => '202609001',
            'nama' => 'Aisyah Az-Zahra',
            'kelas_id' => $k9a->id,
            'tanggal_lahir' => '2011-10-05',
            'alamat' => 'Jl. Manyar Kertoarjo, Surabaya',
        ]);

        // 3. Connect existing Wali user to selected children
        $waliUser = User::where('email', 'wali@simkasan.com')->first();
        $ustadzUser = User::where('email', 'ustadz@simkasan.com')->first();

        $ustadzId = $ustadzUser ? $ustadzUser->id : 1;

        if ($waliUser) {
            $wali = WaliSantri::create([
                'user_id' => $waliUser->id,
                'nama' => $waliUser->name,
                'no_hp' => '081234567890',
            ]);
            // Connect Wali to Ahmad Fulan and Aisyah Azzahra
            $wali->santris()->sync([$s1->id, $s4->id]);
        }

        // 4. Seed mock memorization logs
        Hafalan::create([
            'santri_id' => $s1->id,
            'tanggal' => '2026-07-28',
            'juz' => 30,
            'surah' => 'An-Naba\'',
            'ayat_mulai' => 1,
            'ayat_selesai' => 40,
            'nilai_kelancaran' => 'Mumtaz',
            'nilai_tajwid' => 'Jayyid',
            'ustadz_id' => $ustadzId,
        ]);

        Hafalan::create([
            'santri_id' => $s1->id,
            'tanggal' => '2026-07-30',
            'juz' => 1,
            'surah' => 'Al-Baqarah',
            'ayat_mulai' => 1,
            'ayat_selesai' => 20,
            'nilai_kelancaran' => 'Mumtaz',
            'nilai_tajwid' => 'Mumtaz',
            'ustadz_id' => $ustadzId,
        ]);

        Hafalan::create([
            'santri_id' => $s4->id,
            'tanggal' => '2026-07-29',
            'juz' => 30,
            'surah' => 'An-Nazi\'at',
            'ayat_mulai' => 1,
            'ayat_selesai' => 46,
            'nilai_kelancaran' => 'Jayyid',
            'nilai_tajwid' => 'Jayyid',
            'ustadz_id' => $ustadzId,
        ]);

        Hafalan::create([
            'santri_id' => $s4->id,
            'tanggal' => '2026-07-31',
            'juz' => 29,
            'surah' => 'Al-Mulk',
            'ayat_mulai' => 1,
            'ayat_selesai' => 30,
            'nilai_kelancaran' => 'Mumtaz',
            'nilai_tajwid' => 'Jayyid',
            'ustadz_id' => $ustadzId,
        ]);

        // 5. Seed academic grades (Nilai)
        Nilai::create([
            'santri_id' => $s1->id,
            'mapel' => 'Fikih Ibadah',
            'nilai' => 88,
            'ustadz_id' => $ustadzId,
            'tanggal' => '2026-07-25',
        ]);

        Nilai::create([
            'santri_id' => $s1->id,
            'mapel' => 'Tauhid & Aqidah',
            'nilai' => 90,
            'ustadz_id' => $ustadzId,
            'tanggal' => '2026-07-26',
        ]);

        Nilai::create([
            'santri_id' => $s4->id,
            'mapel' => 'Fikih Ibadah',
            'nilai' => 92,
            'ustadz_id' => $ustadzId,
            'tanggal' => '2026-07-25',
        ]);

        Nilai::create([
            'santri_id' => $s4->id,
            'mapel' => 'Bahasa Arab',
            'nilai' => 85,
            'ustadz_id' => $ustadzId,
            'tanggal' => '2026-07-27',
        ]);

        // 6. Seed mock activities (Kegiatan)
        Kegiatan::create([
            'nama_kegiatan' => 'Kajian Kitab Bulughul Maram',
            'tanggal' => '2026-08-02',
            'waktu' => '16:00 - 17:30',
            'deskripsi' => 'Kajian rutin ba\'da Ashar di Masjid Jami\' Pesantren.',
        ]);

        Kegiatan::create([
            'nama_kegiatan' => 'Mudarasah & Simak Setoran Akbar',
            'tanggal' => '2026-08-03',
            'waktu' => '05:30 - 07:00',
            'deskripsi' => 'Setoran hafalan juz baru serentak seluruh halaqah.',
        ]);

        Kegiatan::create([
            'nama_kegiatan' => 'Rapat Kerja Pengajar Pesantren',
            'tanggal' => '2026-08-04',
            'waktu' => '09:00 - 12:00',
            'deskripsi' => 'Evaluasi bulanan kurikulum tahfidz dan kegiatan belajar santri.',
        ]);
    }
}
