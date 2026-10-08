import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function StatistikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Statistik Kependudukan</h1>
        <p className="text-xs text-slate-500">
          Visualisasi Grafik Demografi Penduduk, Pendidikan, Pekerjaan, dan Persuratan.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-3 bg-slate-50/50">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Modul Grafik & Statistik Initialized</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Integrasi grafik Recharts dengan sumber data teragregasi dari database PostgreSQL disiapkan untuk Phase 10.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
