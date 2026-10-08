'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const pathNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  penduduk: 'Data Penduduk',
  'kartu-keluarga': 'Kartu Keluarga',
  kelahiran: 'Data Kelahiran',
  kematian: 'Data Kematian',
  pendatang: 'Data Pendatang',
  pindah: 'Data Pindah',
  wilayah: 'Wilayah',
  dusun: 'Dusun',
  rw: 'RW',
  rt: 'RT',
  persuratan: 'Persuratan',
  buat: 'Buat Surat',
  masuk: 'Surat Masuk',
  keluar: 'Surat Keluar',
  draft: 'Draft Surat',
  persetujuan: 'Menunggu Persetujuan',
  arsip: 'Arsip Surat',
  statistik: 'Statistik',
  'jenis-kelamin': 'Jenis Kelamin',
  umur: 'Kelompok Umur',
  pendidikan: 'Pendidikan',
  pekerjaan: 'Pekerjaan',
  pengaturan: 'Pengaturan',
  profil: 'Profil Desa',
  users: 'User & Role',
  templates: 'Template Surat',
  'audit-log': 'Audit Log',
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center text-xs text-slate-500 mb-4 py-1" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-blue-700 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const label = pathNameMap[segment] || segment.replace(/-/g, ' ');

          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              {isLast ? (
                <span className="font-semibold text-slate-800 capitalize">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-blue-700 transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
