'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SuratFormData } from '@/types/surat';
import { LetterStatus } from '@/types';
import { SuratStorageService } from '@/lib/surat-service';
import { SURAT_TYPES } from '@/lib/surat-config';
import { formatIndonesianDate, downloadSuratPdf } from '@/lib/pdf-generator';

const statusBadgeMap: Record<LetterStatus, { variant: 'default' | 'emerald' | 'amber' | 'destructive' | 'secondary'; label: string }> = {
  DRAFT: { variant: 'secondary', label: 'DRAFT' },
  MENUNGGU_PERSETUJUAN: { variant: 'amber', label: 'MENUNGGU VERIFIKASI' },
  DISETUJUI: { variant: 'emerald', label: 'DISETUJUI RESMI' },
  DITOLAK: { variant: 'destructive', label: 'DITOLAK' },
  SELESAI: { variant: 'default', label: 'SELESAI' },
};

export default function SuratRiwayatPage() {
  const [list, setList] = useState<SuratFormData[]>(() => {
    if (typeof window === 'undefined') return [];
    return SuratStorageService.getList();
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    const data = SuratStorageService.getList();
    setList(data);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus arsip/draft surat ini?')) {
      SuratStorageService.delete(id);
      loadData();
      setNotification('Dokumen berhasil dihapus dari daftar riwayat.');
    }
  };

  const handleDownload = async (surat: SuratFormData) => {
    setDownloadingId(surat.id);
    try {
      await downloadSuratPdf(surat);
      setNotification(`File PDF untuk ${surat.nama} (${surat.trackingCode}) berhasil diunduh.`);
    } catch {
      setNotification('Gagal membuat PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Filtered Items
  const filteredList = list.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nik.includes(searchQuery) ||
      item.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keperluan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nomorSurat && item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesType = filterType === 'ALL' || item.jenisSurat === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // KPI Statistics
  const totalCount = list.length;
  const pendingCount = list.filter((s) => s.status === 'MENUNGGU_PERSETUJUAN').length;
  const approvedCount = list.filter((s) => s.status === 'DISETUJUI').length;
  const draftCount = list.filter((s) => s.status === 'DRAFT').length;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Riwayat Pengajuan Surat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh surat yang diajukan, disimpan sebagai draft, atau telah diverifikasi oleh Pemerintah Desa Sukamaju.
          </p>
        </div>

        <Link href="/surat/ajukan">
          <Button variant="emerald" className="gap-2 shrink-0 text-xs">
            <Plus className="h-4 w-4" />
            Ajukan Surat Baru
          </Button>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="hover:border-blue-300">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-slate-500">Total Pengajuan</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Semua permohonan</p>
          </CardContent>
        </Card>

        <Card className="hover:border-amber-300">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-amber-700">Menunggu ACC</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
            <p className="text-[10px] text-amber-600/80 mt-0.5">Verifikasi aparat</p>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-300">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-emerald-700">Disetujui Resmi</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount}</p>
            <p className="text-[10px] text-emerald-600/80 mt-0.5">Nomor surat terbit</p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-slate-500">Draft Pengisian</p>
            <p className="text-2xl font-bold text-slate-700 mt-1">{draftCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Belum dikirim</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification */}
      {notification && (
        <div className="flex items-center justify-between p-3 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="font-bold text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIK, kode, atau keperluan..."
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-9 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">Semua Status</option>
                <option value="DISETUJUI">Disetujui Resmi</option>
                <option value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</option>
                <option value="DRAFT">Draft Belum Dikirim</option>
                <option value="DITOLAK">Ditolak</option>
              </select>

              {/* Filter Jenis */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-9 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">Semua Jenis Surat</option>
                <option value="SKD">Domisili (SKD)</option>
                <option value="SKU">Usaha (SKU)</option>
                <option value="SKTM">Tidak Mampu (SKTM)</option>
                <option value="PENGANTAR">Pengantar (SP)</option>
                <option value="UMUM">Keterangan Umum</option>
              </select>

              {(searchQuery || filterStatus !== 'ALL' || filterType !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('ALL');
                    setFilterType('ALL');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Daftar Permohonan Surat</span>
            <span className="text-xs font-normal text-slate-500 font-mono">
              Menampilkan {filteredList.length} dari {totalCount} permohonan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Tidak ada data surat yang cocok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan ubah kata kunci pencarian atau buat pengajuan surat baru.
              </p>
              <Link href="/surat/ajukan">
                <Button variant="default" size="sm" className="text-xs">
                  Ajukan Surat Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Kode & Tanggal</th>
                    <th className="py-3 px-4">Nama Pemohon & NIK</th>
                    <th className="py-3 px-4">Jenis Surat</th>
                    <th className="py-3 px-4">Tujuan / Keperluan</th>
                    <th className="py-3 px-4">Nomor Surat / Status</th>
                    <th className="py-3 px-4 text-right">Aksi Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map((item) => {
                    const typeConfig = SURAT_TYPES[item.jenisSurat];
                    const badgeInfo = statusBadgeMap[item.status] || {
                      variant: 'secondary',
                      label: item.status,
                    };

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Kode & Tanggal */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-mono font-semibold text-slate-900">
                            {item.trackingCode}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {formatIndonesianDate(item.createdAt)}
                          </div>
                        </td>

                        {/* Nama Pemohon & NIK */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-semibold text-slate-900">{item.nama}</div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            NIK: {item.nik}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.dusun || 'Desa Sukamaju'}
                          </div>
                        </td>

                        {/* Jenis Surat */}
                        <td className="py-3.5 px-4 align-top">
                          <Badge variant="outline" className="font-semibold text-[10px] text-blue-700 border-blue-200 bg-blue-50/50">
                            {typeConfig?.name || item.jenisSurat}
                          </Badge>
                        </td>

                        {/* Keperluan */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <p className="line-clamp-2 text-slate-700 leading-snug">
                            {item.keperluan}
                          </p>
                          {item.keteranganTambahan && (
                            <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                              {item.keteranganTambahan}
                            </p>
                          )}
                        </td>

                        {/* Status & Nomor */}
                        <td className="py-3.5 px-4 align-top space-y-1">
                          <Badge variant={badgeInfo.variant} className="text-[10px] py-0.5">
                            {badgeInfo.label}
                          </Badge>
                          <div className="text-[10px] font-mono text-slate-500">
                            {item.nomorSurat ? (
                              <span className="font-semibold text-slate-800">{item.nomorSurat}</span>
                            ) : (
                              <span className="text-amber-600">[Menunggu Verifikasi]</span>
                            )}
                          </div>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 align-top text-right space-x-1 whitespace-nowrap">
                          {/* Preview Link */}
                          <Link href={`/surat/preview?id=${item.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs text-blue-700 hover:bg-blue-50"
                              title="Lihat preview surat lengkap"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Preview
                            </Button>
                          </Link>

                          {/* Download PDF jsPDF button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(item)}
                            disabled={downloadingId === item.id}
                            className="h-8 px-2 text-xs text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Unduh format dokumen PDF A4"
                          >
                            {downloadingId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5 text-slate-600" />
                            )}
                          </Button>

                          {/* Delete Action */}
                          {item.status === 'DRAFT' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 px-2 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Hapus draft"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
