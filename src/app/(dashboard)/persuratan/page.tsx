import {
  FileText,
  FilePlus,
  History,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SURAT_TYPES } from '@/lib/surat-config';

export default function PersuratanPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Layanan Persuratan</h1>
            <Badge variant="emerald" className="text-[10px]">Aktif & Siap Pakai</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Pembuatan, Preview, PDF Generation di Browser (jsPDF), dan Tracking Status Surat Administrasi Desa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/surat/riwayat">
            <Button variant="outline" className="gap-2 text-xs">
              <History className="h-4 w-4" />
              Riwayat Surat
            </Button>
          </Link>
          <Link href="/surat/ajukan">
            <Button variant="emerald" className="gap-2 shrink-0 text-xs shadow-sm">
              <FilePlus className="h-4 w-4" />
              Ajukan Surat Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/surat/ajukan" className="group">
          <Card className="h-full border-blue-200 bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-400 hover:shadow-md transition-all">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FilePlus className="h-6 w-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                    Formulir Pengajuan Surat Online
                  </h3>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Isi data diri dengan validasi NIK 16 digit, pilih dari 5 jenis surat, lengkapi keperluan khusus, dan simpan draft pengajuan.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <span>Mulai Isi Formulir</span>
                  <span>→</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/surat/riwayat" className="group">
          <Card className="h-full border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-400 hover:shadow-md transition-all">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <History className="h-6 w-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                    Riwayat, Preview & Unduh PDF
                  </h3>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lihat dokumen yang tersimpan, periksa preview surat lengkap dengan watermark draft, dan unduh PDF resmi jsPDF.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <span>Buka Riwayat Permohonan</span>
                  <span>→</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 5 Configured Letter Types Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            5 Jenis Template Surat yang Dikonfigurasi
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Setiap jenis surat memiliki aturan isian, formulir dinamis, dan template dokumen masing-masing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(SURAT_TYPES).map((st) => (
              <div
                key={st.code}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px] text-blue-700 border-blue-200">
                    {st.code}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">Prefix: {st.numberPrefix}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {st.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{st.requirements.length} syarat berkas</span>
                  <Link
                    href={`/surat/ajukan`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Ajukan Ini →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety & Standards Note */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-start gap-3.5 shadow-xs">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900">
            Standar Pengesahan & Penerbitan Dokumen SI-DESA
          </p>
          <p>
            Sistem membedakan secara tegas antara <strong>Draft Permohonan</strong> (dokumen sementara ber-watermark untuk pemeriksaan pemohon) dengan <strong>Surat Resmi Disahkan</strong> (memiliki nomor registrasi buku agenda desa dan tanda tangan verifikasi Kepala Desa). PDF digenerate langsung di sisi peramban menggunakan pustaka <strong>jsPDF</strong> dengan ukuran A4 portrait.
          </p>
        </div>
      </div>
    </div>
  );
}
