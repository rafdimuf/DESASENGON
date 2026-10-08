import React from 'react';
import { FileText, FilePlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PersuratanPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Layanan Persuratan</h1>
          <p className="text-xs text-slate-500">
            Sistem Pembuatan, Preview, PDF Generation, dan Approval Surat Administrasi Desa.
          </p>
        </div>
        <Link href="/persuratan/buat">
          <Button variant="emerald" className="gap-2 shrink-0">
            <FilePlus className="h-4 w-4" />
            Buat Surat Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-3 bg-slate-50/50">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Modul Persuratan Initialized</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Sistem template `letter_types`, `letter_templates`, dan `letters` dengan workflow approval disiapkan untuk Phase 8 & 9.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
