import React from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Home,
  FileText,
  Clock,
  TrendingUp,
  MapPin,
  FilePlus,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Building2,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                <Sparkles className="h-3 w-3 mr-1" /> Phase 1: Inisialisasi Sistem Aktif
              </Badge>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-300">Desa Sukamaju</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white pt-1">
              Selamat Datang, Admin Desa
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Sistem Informasi Administrasi Desa (SI-DESA) siap digunakan untuk pengelolaan kependudukan, wilayah, dan persuratan resmi.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/persuratan/buat">
              <Button variant="emerald" size="sm" className="gap-2">
                <FilePlus className="h-4 w-4" />
                Buat Surat Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Penduduk */}
        <Card className="hover:border-blue-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Total Penduduk</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3,450</div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">+12</span> bulan ini
            </p>
          </CardContent>
        </Card>

        {/* Laki-laki */}
        <Card className="hover:border-blue-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Laki-Laki</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,780</div>
            <p className="text-[11px] text-slate-500 mt-1">51.6% dari populasi</p>
          </CardContent>
        </Card>

        {/* Perempuan */}
        <Card className="hover:border-blue-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Perempuan</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,670</div>
            <p className="text-[11px] text-slate-500 mt-1">48.4% dari populasi</p>
          </CardContent>
        </Card>

        {/* Total KK */}
        <Card className="hover:border-blue-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Total KK</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Home className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">920</div>
            <p className="text-[11px] text-slate-500 mt-1">Kepala Keluarga</p>
          </CardContent>
        </Card>

        {/* Surat Bulan Ini */}
        <Card className="hover:border-blue-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Surat Bulan Ini</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">142</div>
            <p className="text-[11px] text-slate-500 mt-1">Diproses & Arsip</p>
          </CardContent>
        </Card>

        {/* Menunggu Persetujuan */}
        <Card className="hover:border-amber-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Persetujuan</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">8</div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Perlu ACC Kades</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Modules & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access Shortcuts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-700" />
            Modul Utama Sistem Administrasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/penduduk" className="group">
              <Card className="h-full transition-all group-hover:border-blue-400 group-hover:shadow-md">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">Data Penduduk</h3>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Kelola NIK, KK, status kelahiran, kematian, pendatang, dan pindah.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/persuratan/buat" className="group">
              <Card className="h-full transition-all group-hover:border-emerald-400 group-hover:shadow-md">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">Layanan Persuratan</h3>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Buat Domisili, SKU, SKTM, Pengantar, dan cetak PDF terverifikasi.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/wilayah/dusun" className="group">
              <Card className="h-full transition-all group-hover:border-purple-400 group-hover:shadow-md">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-purple-700">Wilayah Administratif</h3>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Struktur Dusun, RW, RT, dan pemetaan geografis lokasi penduduk.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/statistik/penduduk" className="group">
              <Card className="h-full transition-all group-hover:border-amber-400 group-hover:shadow-md">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-amber-700">Statistik & Laporan</h3>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Demografi jenis kelamin, kelompok umur, pendidikan, dan pekerjaan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* System Architecture & Status Card */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Status & Arsitektur Sistem
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Spesifikasi SI-DESA Phase 1 (Standard Verification)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Framework</span>
              <Badge variant="outline" className="font-mono text-[10px]">Next.js App Router</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Type System</span>
              <Badge variant="outline" className="font-mono text-[10px] text-blue-700 border-blue-200">TypeScript Strict</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Database & RLS</span>
              <Badge variant="outline" className="font-mono text-[10px] text-emerald-700 border-emerald-200">Supabase PostgreSQL</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Authentication</span>
              <Badge variant="outline" className="font-mono text-[10px]">Supabase Auth SSR</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Role Access Control</span>
              <Badge variant="outline" className="font-mono text-[10px] text-purple-700 border-purple-200">RBAC + RLS</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Styling & UI</span>
              <Badge variant="outline" className="font-mono text-[10px]">Tailwind CSS + shadcn</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
