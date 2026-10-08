'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  UserPlus,
  UserMinus,
  UserCheck,
  FilePlus,
  FileCheck,
  Archive,
  FolderTree,
  Shield,
  FileSpreadsheet,
  History,
  Building2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavSubItem {
  title: string;
  href: string;
  icon?: React.ElementType;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  subItems?: NavSubItem[];
}

const navigationMenu: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Data Penduduk',
    icon: Users,
    subItems: [
      { title: 'Semua Penduduk', href: '/penduduk' },
      { title: 'Kartu Keluarga', href: '/kartu-keluarga' },
      { title: 'Data Kelahiran', href: '/penduduk/kelahiran', icon: UserPlus },
      { title: 'Data Kematian', href: '/penduduk/kematian', icon: UserMinus },
      { title: 'Data Pendatang', href: '/penduduk/pendatang', icon: UserCheck },
      { title: 'Data Pindah', href: '/penduduk/pindah', icon: UserMinus },
    ],
  },
  {
    title: 'Wilayah',
    icon: MapPin,
    subItems: [
      { title: 'Dusun', href: '/wilayah/dusun' },
      { title: 'RW', href: '/wilayah/rw' },
      { title: 'RT', href: '/wilayah/rt' },
    ],
  },
  {
    title: 'Persuratan',
    icon: FileText,
    subItems: [
      { title: 'Buat Surat', href: '/persuratan/buat', icon: FilePlus },
      { title: 'Surat Masuk', href: '/persuratan/masuk' },
      { title: 'Surat Keluar', href: '/persuratan/keluar' },
      { title: 'Draft Surat', href: '/persuratan/draft' },
      { title: 'Menunggu Persetujuan', href: '/persuratan/persetujuan', icon: FileCheck },
      { title: 'Arsip Surat', href: '/persuratan/arsip', icon: Archive },
    ],
  },
  {
    title: 'Statistik',
    icon: BarChart3,
    subItems: [
      { title: 'Statistik Penduduk', href: '/statistik/penduduk' },
      { title: 'Jenis Kelamin', href: '/statistik/jenis-kelamin' },
      { title: 'Umur', href: '/statistik/umur' },
      { title: 'Pendidikan', href: '/statistik/pendidikan' },
      { title: 'Pekerjaan', href: '/statistik/pekerjaan' },
      { title: 'Wilayah', href: '/statistik/wilayah' },
    ],
  },
  {
    title: 'Pengaturan',
    icon: Settings,
    subItems: [
      { title: 'Profil Desa', href: '/pengaturan/profil', icon: Building2 },
      { title: 'User & Role', href: '/pengaturan/users', icon: Shield },
      { title: 'Template Surat', href: '/pengaturan/templates', icon: FileSpreadsheet },
      { title: 'Audit Log', href: '/pengaturan/audit-log', icon: History },
    ],
  },
];

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Data Penduduk': pathname.startsWith('/penduduk') || pathname.startsWith('/kartu-keluarga'),
    'Wilayah': pathname.startsWith('/wilayah'),
    'Persuratan': pathname.startsWith('/persuratan'),
    'Statistik': pathname.startsWith('/statistik'),
    'Pengaturan': pathname.startsWith('/pengaturan'),
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-slate-800 shadow-xl lg:shadow-none",
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <FolderTree className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white group-hover:text-blue-300 transition-colors">
                SI-DESA
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                Sistem Administrasi Desa
              </p>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigationMenu.map((item) => {
            const Icon = item.icon;
            const hasSub = item.subItems && item.subItems.length > 0;
            const isGroupOpen = openGroups[item.title];
            const isDirectActive = item.href === pathname;
            const isSubActive = hasSub && item.subItems?.some((sub) => pathname.startsWith(sub.href));

            if (!hasSub && item.href) {
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    isDirectActive
                      ? "bg-blue-600 text-white shadow-sm font-semibold"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isDirectActive ? "text-white" : "text-slate-400")} />
                  <span>{item.title}</span>
                </Link>
              );
            }

            return (
              <div key={item.title} className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    isSubActive
                      ? "bg-slate-800/80 text-blue-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5", isSubActive ? "text-blue-400" : "text-slate-400")} />
                    <span>{item.title}</span>
                  </div>
                  {isGroupOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {isGroupOpen && item.subItems && (
                  <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 my-1">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubItemActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onCloseMobile}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150",
                            isSubItemActive
                              ? "bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-500"
                              : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                          )}
                        >
                          {SubIcon && <SubIcon className="h-3.5 w-3.5 text-slate-400" />}
                          <span>{sub.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Desa Sukamaju</span>
            <span className="rounded bg-blue-900/60 text-blue-300 px-1.5 py-0.5 text-[10px] font-mono">
              v1.0.0
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Kec. Maju Jaya, Kab. Nusantara</p>
        </div>
      </aside>
    </>
  );
}
