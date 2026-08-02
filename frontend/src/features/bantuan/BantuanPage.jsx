import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink
} from 'lucide-react';

const BantuanPage = () => {
  // Local state for active accordion index
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Bagaimana cara wali melihat nilai rapor ananda?",
      a: "Wali Santri dapat mengakses menu 'Nilai Akademik' di sidebar sebelah kiri. Di sana, wali dapat melihat daftar nilai tugas, ujian harian, predikat, beserta rata-rata keseluruhan mata pelajaran diniyah."
    },
    {
      q: "Bagaimana cara ustadz mencatat setoran hafalan baru?",
      a: "Ustadz atau Admin dapat membuka menu 'Hafalan & Tahfidz' lalu klik tombol '+ Setoran Baru'. Pilih nama santri, tentukan nomor juz, nama surah, jangkauan ayat, serta berikan penilaian kelancaran & tajwid."
    },
    {
      q: "Kapan absensi harian santri diperbarui?",
      a: "Absensi santri diperbarui secara langsung (real-time) oleh ustadz pengampu halaqah di kelas masing-masing segera setelah sesi pagi, siang, sore, atau malam selesai dilaksanakan."
    },
    {
      q: "Mengapa grafik perkembangan setoran anak tidak muncul di dashboard wali?",
      a: "Pastikan ustadz telah menginput setoran hafalan terbaru untuk anak asuh Anda. Grafik setoran mingguan dihitung berdasarkan total ayat yang didepositkan oleh santri dalam kurun waktu 7 hari terakhir."
    },
    {
      q: "Bagaimana cara mengganti nomor WhatsApp atau email terdaftar?",
      a: "Untuk keamanan data santri, perubahan data sensitif seperti nomor WhatsApp dan email wali santri hanya dapat dilakukan oleh Administrator SIMKASAN melalui menu 'Master Data'."
    }
  ];

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header Block */}
      <div className="pb-2">
        <h1 className="font-heading text-3xl font-extrabold text-[#1C2620] tracking-tight">Bantuan</h1>
        <p className="text-xs text-[#5B6350] mt-0.5">Temukan solusi masalah Anda, pelajari cara penggunaan SIMKASAN, atau hubungi tim bantuan teknis.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: FAQ list */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-[#E3DEC6] bg-[#F7F5F0]/30">
              <h3 className="font-heading text-[#1C2620] text-base font-black flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-[#5B7553]" />
                Pertanyaan yang Sering Diajukan (FAQ)
              </h3>
            </div>
            <CardContent className="p-6 divide-y divide-[#E3DEC6]">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left text-xs font-black text-[#1C2620] hover:text-[#5B7553] transition-colors gap-4"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-[#5B6350]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#5B6350]" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-xs text-[#5B6350] leading-relaxed pl-1">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Support Channels */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-[#E3DEC6] shadow-sm bg-white rounded-3xl p-6">
            <h3 className="font-heading text-[#1C2620] text-base font-black flex items-center gap-2 mb-4">
              <MessageSquare className="h-4.5 w-4.5 text-[#C9A876]" />
              Hubungi Bantuan
            </h3>
            <p className="text-xs text-[#5B6350] leading-relaxed mb-6">
              Mengalami kendala teknis atau memiliki kendala akun? Hubungi layanan dukungan kami di bawah ini.
            </p>

            <div className="space-y-3.5">
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/20 hover:bg-[#F7F5F0]/30 transition-all text-xs font-bold text-[#1C2620]"
              >
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-800">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block">WhatsApp Dukungan</span>
                  <span className="text-[10px] text-[#5B6350] font-medium mt-0.5 flex items-center gap-0.5">
                    +62 812-3456-789 <ExternalLink className="h-2.5 w-2.5 inline" />
                  </span>
                </div>
              </a>

              <a
                href="mailto:support@simkasan.com"
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#E3DEC6] bg-[#F7F5F0]/20 hover:bg-[#F7F5F0]/30 transition-all text-xs font-bold text-[#1C2620]"
              >
                <div className="h-9 w-9 rounded-xl bg-[#5B7553]/15 flex items-center justify-center text-[#5B7553]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block">Email Resmi SIMKASAN</span>
                  <span className="text-[10px] text-[#5B6350] font-medium mt-0.5">support@simkasan.com</span>
                </div>
              </a>
            </div>

            <div className="mt-6 border-t border-[#E3DEC6] pt-4 text-[10px] text-[#5B6350] leading-normal font-semibold">
              <span className="font-black text-[#1C2620] block mb-1">Jam Operasional Layanan:</span>
              Senin - Jum'at: 08:00 - 16:00 WIB<br />
              Sabtu: 08:00 - 12:00 WIB
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BantuanPage;
