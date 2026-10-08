import React from 'react';
import { Plus, Search, Filter, Database } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PendudukPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Penduduk</h1>
          <p className="text-xs text-slate-500">
            Kelola data kependudukan Desa Sukamaju secara terstruktur dan aman.
          </p>
        </div>
        <Button variant="default" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Tambah Penduduk
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari NIK, Nama, atau No KK..." className="pl-9 text-xs" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                Filter Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-3 bg-slate-50/50">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Modul Data Penduduk Siap Dihubungkan ke Database (Phase 2)</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Skema tabel database `residents` & `households` siap dimigrasikan pada Phase 2 untuk mendukung query, search, dan pagination.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
