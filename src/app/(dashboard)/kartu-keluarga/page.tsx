import React from 'react';
import { Home, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KartuKeluargaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kartu Keluarga (KK)</h1>
          <p className="text-xs text-slate-500">
            Pengelolaan Data Keluarga, Kepala Keluarga, dan Anggota KK Desa Sukamaju.
          </p>
        </div>
        <Button variant="default" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Tambah Kartu Keluarga
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Cari Nomor KK / Nama Kepala Keluarga..." className="pl-9 text-xs" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-3 bg-slate-50/50">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <Home className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Modul Kartu Keluarga Initialized</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Relasi `households` & `residents` dengan keunikan Nomor KK akan diaktifkan pada skema PostgreSQL Phase 2.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
