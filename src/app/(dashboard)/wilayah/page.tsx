import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WilayahPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Wilayah Administratif</h1>
          <p className="text-xs text-slate-500">
            Struktur Hirarki Wilayah Desa Sukamaju: Dusun → RW → RT.
          </p>
        </div>
        <Button variant="default" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Tambah Wilayah
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-3 bg-slate-50/50">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Modul Wilayah Administratif Initialized</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Struktur hirarki `villages` → `administrative_areas` → `dusun` → `rw` → `rt` disiapkan untuk Phase 2.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
