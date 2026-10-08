'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Breadcrumb } from './breadcrumb';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-900 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          userRole="ADMIN_DESA"
          userName="Budi Santoso"
          userEmail="budi.santoso@sukamaju.desa.id"
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
