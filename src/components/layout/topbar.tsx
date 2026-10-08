'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  Building2,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';

interface TopbarProps {
  onOpenMobileSidebar?: () => void;
  userRole?: UserRole;
  userName?: string;
  userEmail?: string;
}

const roleBadgeColor: Record<UserRole, "default" | "emerald" | "amber" | "destructive"> = {
  SUPER_ADMIN: 'destructive',
  ADMIN_DESA: 'default',
  KEPALA_DESA: 'emerald',
  OPERATOR: 'amber',
};

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_DESA: 'Admin Desa',
  KEPALA_DESA: 'Kepala Desa',
  OPERATOR: 'Operator',
};

export function Topbar({
  onOpenMobileSidebar,
  userRole = 'ADMIN_DESA',
  userName = 'Budi Santoso',
  userEmail = 'budi.santoso@desa.go.id',
}: TopbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Phase 1 logout action
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-2xs">
      {/* Left side: Mobile menu toggle + Village Context */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden focus:outline-none"
          aria-label="Buka Menu Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200">
          <Building2 className="h-4 w-4 text-blue-700" />
          <span>Desa Sukamaju</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">Kec. Maju Jaya</span>
        </div>
      </div>

      {/* Center Search Bar Placeholder */}
      <div className="hidden md:flex items-center w-72 lg:w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIK, Nama Penduduk, atau Nomor Surat..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Side: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Icon */}
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Notifikasi"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200" />

        {/* User Card & Role */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white font-semibold text-xs shadow-xs">
            {userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {userName}
              </span>
              <Badge variant={roleBadgeColor[userRole]} className="text-[10px] py-0 px-1.5">
                {roleLabels[userRole]}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">{userEmail}</p>
          </div>
        </div>

        {/* Quick Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-slate-600 hover:text-red-600 hover:bg-red-50 ml-1"
          title="Keluar / Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline text-xs font-medium ml-1.5">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
