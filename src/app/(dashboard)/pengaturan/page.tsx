import React from 'react';
import { Shield, Building2, FileSpreadsheet, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Sistem</h1>
        <p className="text-xs text-slate-500">
          Konfigurasi profil desa, manajemen pengguna & role RBAC, template surat, serta audit log keamanan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-700" /> Profil Desa
            </CardTitle>
            <CardDescription className="text-xs">Identitas resmi, alamat kantor, dan struktur pemerintahan desa.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-700" /> User & Role Management
            </CardTitle>
            <CardDescription className="text-xs">Kelola hak akses SUPER_ADMIN, ADMIN_DESA, OPERATOR, dan KEPALA_DESA.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-700" /> Template Surat
            </CardTitle>
            <CardDescription className="text-xs">Konfigurasi format penomoran dan isi surat keterangan resmi.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <History className="h-4 w-4 text-amber-700" /> Audit Log
            </CardTitle>
            <CardDescription className="text-xs">Catatan aktivitas pengguna dan riwayat perubahan data sensitif.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
