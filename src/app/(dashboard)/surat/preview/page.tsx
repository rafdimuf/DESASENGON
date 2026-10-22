'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Download,
  ArrowLeft,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuratFormData } from '@/types/surat';
import { SuratStorageService } from '@/lib/surat-service';
import { downloadSuratPdf, formatIndonesianDate } from '@/lib/pdf-generator';
import { SuratPaperPreview } from '@/components/surat/surat-paper-preview';
import { SURAT_TYPES } from '@/lib/surat-config';

function getSuratForPreview(id: string | null): SuratFormData | null {
  if (typeof window === 'undefined') return null;
  let item: SuratFormData | null = null;
  if (id) {
    item = SuratStorageService.getById(id);
  }
  if (!item) {
    // Fallback to active draft or latest item
    const draft = SuratStorageService.getDraft();
    if (draft && draft.nama) {
      item = draft;
    } else {
      const list = SuratStorageService.getList();
      if (list.length > 0) {
        item = list[0];
      }
    }
  }
  return item;
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [surat, setSurat] = useState<SuratFormData | null>(() => getSuratForPreview(id));
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  if (!surat) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Belum Ada Surat Yang Dipilih</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Silakan ajukan surat baru terlebih dahulu melalui formulir pengajuan online.
        </p>
        <Link href="/surat/ajukan">
          <Button variant="default" className="text-xs">
            Buka Formulir Pengajuan
          </Button>
        </Link>
      </div>
    );
  }

  const typeConfig = SURAT_TYPES[surat.jenisSurat];
  const isApproved = surat.status === 'DISETUJUI';
  const isPending = surat.status === 'MENUNGGU_PERSETUJUAN';
  const isDraft = surat.status === 'DRAFT';

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadSuratPdf(surat);
      setNotification({
        type: 'success',
        message: 'Berkas PDF berhasil digenerate melalui browser menggunakan jsPDF dan siap diunduh.',
      });
    } catch (e) {
      console.error(e);
      setNotification({
        type: 'error',
        message: 'Gagal membuat file PDF. Silakan coba kembali.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmitOfficial = async () => {
    setIsSubmitting(true);
    try {
      const updated = SuratStorageService.submit(surat);
      setSurat(updated);
      setNotification({
        type: 'success',
        message: `Permohonan surat berhasil dikirim! Status telah diperbarui menjadi "Menunggu Persetujuan". Kode Lacak: ${updated.trackingCode}`,
      });
    } catch {
      setNotification({
        type: 'error',
        message: 'Gagal mengirim permohonan.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo helper: Simulate Kepala Desa Approval
  const handleSimulateApproval = () => {
    const approved = SuratStorageService.approveSurat(surat.id);
    if (approved) {
      setSurat({ ...approved });
      setNotification({
        type: 'success',
        message: `Surat berhasil disetujui (Simulasi Kepala Desa). Nomor resmi telah diterbitkan: ${approved.nomorSurat}`,
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/surat/ajukan">
            <Button variant="outline" size="sm" className="h-9 gap-1 text-xs text-slate-700">
              <ArrowLeft className="h-4 w-4" />
              Kembali / Edit Data
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                Preview Dokumen Surat
              </h1>
              {isApproved && (
                <Badge variant="emerald" className="text-[10px]">DISETUJUI & RESMI</Badge>
              )}
              {isPending && (
                <Badge variant="amber" className="text-[10px]">MENUNGGU PERSETUJUAN</Badge>
              )}
              {isDraft && (
                <Badge variant="secondary" className="text-[10px]">DRAFT PENGAJUAN</Badge>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Tracking: {surat.trackingCode} • {typeConfig?.name}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download PDF jsPDF button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-xs gap-1.5 border-slate-300 text-slate-800 hover:bg-slate-50 hover:text-blue-700"
            title="Generate dan unduh dokumen PDF format kertas A4"
          >
            {isDownloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 text-blue-600" />
            )}
            Unduh PDF (jsPDF)
          </Button>

          {/* Submit official if draft */}
          {isDraft && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmitOfficial}
              disabled={isSubmitting}
              className="text-xs gap-1.5 bg-blue-700 hover:bg-blue-800"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Kirim Permohonan Resmi
            </Button>
          )}

          {/* Simulate Approval button for testing demo */}
          {!isApproved && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateApproval}
              className="text-xs gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              title="Simulasi Kades: Setujui permohonan dan terbitkan nomor surat resmi"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Simulasi ACC Kades
            </Button>
          )}

          <Link href="/surat/riwayat">
            <Button variant="ghost" size="sm" className="text-xs text-slate-600">
              Riwayat
            </Button>
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`flex items-start justify-between p-3 rounded-lg text-xs border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : notification.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Grid: Paper Document Preview + Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Paper View */}
        <div className="lg:col-span-8">
          <SuratPaperPreview surat={surat} />
        </div>

        {/* Right: Summary Information Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Status Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Status Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status Saat Ini:</span>
                  {isApproved && <Badge variant="emerald" className="text-[10px]">DISETUJUI</Badge>}
                  {isPending && <Badge variant="amber" className="text-[10px]">MENUNGGU ACC</Badge>}
                  {isDraft && <Badge variant="secondary" className="text-[10px]">DRAFT</Badge>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nomor Surat:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {surat.nomorSurat || 'Belum Terbit'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kode Lacak:</span>
                  <span className="font-mono text-slate-800">{surat.trackingCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tanggal Dibuat:</span>
                  <span>{formatIndonesianDate(surat.createdAt)}</span>
                </div>
                {surat.approvedAt && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Disahkan Pada:</span>
                    <span className="font-medium">{formatIndonesianDate(surat.approvedAt)}</span>
                  </div>
                )}
              </div>

              {/* Explanatory notes */}
              <div className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
                <p>
                  <strong>Perbedaan Status Dokumen:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>
                    <span className="font-semibold text-slate-800">Draft:</span> Berkas sementara yang belum dikirim ke petugas. Masih dapat diedit bebas dan memuat watermark.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">Menunggu:</span> Berkas telah dikirim dan tercatat dalam antrean verifikasi aparat desa.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">Disetujui:</span> Berkas telah ditandatangani Kepala Desa, memiliki nomor surat resmi, dan sah dipergunakan.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Specifications */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Spesifikasi Dokumen PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Ukuran Kertas</span>
                <span className="font-mono font-medium text-slate-900">A4 Portrait (210 x 297 mm)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Generator PDF</span>
                <span className="font-mono font-medium text-slate-900">jsPDF (Browser-side)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Nama File PDF</span>
                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[170px]" title="Nama file aman tanpa NIK lengkap">
                  {isApproved ? 'resmi' : 'draft'}-surat-{surat.jenisSurat.toLowerCase()}.pdf
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Watermark</span>
                <span className="font-medium text-slate-900">
                  {isApproved ? 'Tanpa Watermark' : 'DRAFT - BELUM DISAHKAN'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SuratPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat preview dokumen...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
