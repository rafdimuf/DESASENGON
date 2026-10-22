'use client';

import React from 'react';
import { SuratFormData } from '@/types/surat';
import { VILLAGE_CONFIG, SURAT_TYPES } from '@/lib/surat-config';
import { formatIndonesianDate } from '@/lib/pdf-generator';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface SuratPaperPreviewProps {
  surat: SuratFormData;
  className?: string;
}

export function SuratPaperPreview({ surat, className = '' }: SuratPaperPreviewProps) {
  const isApproved = surat.status === 'DISETUJUI';
  const typeConfig = SURAT_TYPES[surat.jenisSurat];

  return (
    <div className={`relative bg-white text-slate-900 shadow-xl rounded-lg p-6 sm:p-10 border border-slate-200 overflow-hidden print:shadow-none print:border-none ${className}`}>
      {/* Draft Watermark Overlay */}
      {!isApproved && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden z-10">
          <div className="transform -rotate-30 text-slate-200/60 font-black text-4xl sm:text-6xl tracking-widest text-center uppercase border-8 border-dashed border-slate-200/60 py-4 px-8 rounded-2xl">
            DRAFT - BELUM DISAHKAN
          </div>
        </div>
      )}

      {/* Top Banner for Draft / Non-Approved */}
      {!isApproved ? (
        <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">STATUS DOKUMEN: {surat.status === 'DRAFT' ? 'DRAFT PENGISIAN' : 'MENUNGGU VERIFIKASI PERANGKAT DESA'}</span>
            <p className="text-[11px] text-amber-700">
              Dokumen ini belum memiliki kekuatan hukum dan belum dapat digunakan sebagai surat resmi hingga diperiksa, disetujui, dan ditandatangani oleh Kepala Desa Sukamaju.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">SURAT RESMI TELAH DISETUJUI & DITERBITKAN OLEH KEPALA DESA</span>
        </div>
      )}

      {/* Official Kop Surat */}
      <div className="text-center pb-3 border-b-2 border-slate-900 space-y-0.5 relative">
        <p className="text-xs sm:text-sm font-bold tracking-wider text-slate-800">
          PEMERINTAH {VILLAGE_CONFIG.regency}
        </p>
        <p className="text-xs sm:text-sm font-bold tracking-wider text-slate-800">
          {VILLAGE_CONFIG.district}
        </p>
        <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
          KANTOR {VILLAGE_CONFIG.villageName}
        </h2>
        <p className="text-[11px] text-slate-600">
          {VILLAGE_CONFIG.officeAddress} - Kode Pos {VILLAGE_CONFIG.postalCode}
        </p>
        <p className="text-[10px] text-slate-500">
          Pos-el: {VILLAGE_CONFIG.email} | Laman: {VILLAGE_CONFIG.website} | Telp: {VILLAGE_CONFIG.phone}
        </p>
        {/* Double Border Effect */}
        <div className="w-full border-b border-slate-900 mt-1" />
      </div>

      {/* Letter Title & Number */}
      <div className="text-center my-6 space-y-1">
        <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wide text-slate-900">
          {typeConfig?.officialTitle || 'SURAT KETERANGAN'}
        </h3>
        <p className="text-xs text-slate-700 font-mono">
          {isApproved && surat.nomorSurat ? (
            <span className="font-bold text-slate-900">Nomor: {surat.nomorSurat}</span>
          ) : (
            <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Nomor: [Menunggu Verifikasi & Penerbitan Resmi]
            </span>
          )}
        </p>
      </div>

      {/* Body Content */}
      <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-slate-800 font-serif">
        <p>
          Yang bertanda tangan di bawah ini Kepala {VILLAGE_CONFIG.villageName}, {VILLAGE_CONFIG.district}, {VILLAGE_CONFIG.regency}, dengan ini menerangkan dengan sebenarnya bahwa:
        </p>

        {/* Pemohon Details Grid */}
        <div className="ml-2 sm:ml-6 space-y-1.5 text-xs font-sans">
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">Nama Lengkap</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 font-semibold text-slate-900">{surat.nama || '-'}</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">NIK</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 font-mono font-medium text-slate-900">{surat.nik || '-'}</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">Tempat / Tgl Lahir</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 text-slate-900">
              {surat.tempatLahir || surat.tanggalLahir
                ? `${surat.tempatLahir || '-'}, ${formatIndonesianDate(surat.tanggalLahir)}`
                : '-'}
            </span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">Jenis Kelamin</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 text-slate-900">
              {surat.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
            </span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">Agama</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 text-slate-900">{surat.agama || 'Islam'}</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">Kewarganegaraan</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 text-slate-900">Warga Negara Indonesia (WNI)</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">Pekerjaan</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 text-slate-900">{surat.pekerjaan || '-'}</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-0.5">
            <span className="col-span-4 sm:col-span-3 text-slate-600 font-medium">Alamat Domisili</span>
            <span className="col-span-1 text-center font-bold">:</span>
            <span className="col-span-7 sm:col-span-8 text-slate-900">
              {surat.alamat}
              {surat.rt && `, RT ${surat.rt}`}
              {surat.rw && ` / RW ${surat.rw}`}
              {surat.dusun && `, ${surat.dusun}`}
              {`, ${VILLAGE_CONFIG.villageName}`}
            </span>
          </div>
        </div>

        {/* Dynamic Specific Narrative */}
        <div className="p-3 bg-slate-50/80 rounded border border-slate-200 text-xs sm:text-sm">
          {surat.jenisSurat === 'SKD' && (
            <p>
              Orang tersebut di atas adalah benar-benar warga yang bertempat tinggal dan berdomisili di wilayah {VILLAGE_CONFIG.villageName} dengan status kepemilikan hunian: <strong className="font-semibold text-slate-900">{surat.statusTempatTinggal || 'Rumah Sendiri'}</strong>, terhitung sejak <strong className="font-semibold text-slate-900">{surat.tinggalSejak || 'beberapa tahun lalu'}</strong> sampai saat surat keterangan ini dibuat.
            </p>
          )}

          {surat.jenisSurat === 'SKU' && (
            <div className="space-y-1">
              <p>
                Orang tersebut di atas adalah benar-benar penduduk {VILLAGE_CONFIG.villageName} yang memiliki dan menjalankan usaha aktif di wilayah desa dengan rincian:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-0.5 text-slate-900 font-medium">
                <li>Nama Usaha: <span className="font-bold">{surat.namaUsaha || '-'}</span></li>
                <li>Bidang Usaha: {surat.bidangUsaha || '-'}</li>
                <li>Lokasi Usaha: {surat.alamatUsaha || '-'}</li>
                <li>Mulai Beroperasi: Sejak tahun {surat.tahunBerdiri || '-'}</li>
              </ul>
            </div>
          )}

          {surat.jenisSurat === 'SKTM' && (
            <p>
              Berdasarkan hasil verifikasi kependudukan, keluarga tersebut di atas tergolong dalam <strong className="font-semibold text-slate-900">Keluarga Pra-Sejahtera / Tidak Mampu</strong> dengan estimasi penghasilan rata-rata <strong className="font-semibold text-slate-900">{surat.penghasilan || 'di bawah UMR'}</strong>. Keterangan ini diperuntukkan bagi <strong className="font-semibold text-slate-900">{surat.peruntukan || 'Pemohon'}</strong>{surat.namaAnggota ? ` (a.n. ${surat.namaAnggota})` : ''} untuk keperluan pengajuan ke <strong className="font-semibold text-slate-900">{surat.instansiTujuan || 'Instansi Terkait'}</strong>.
            </p>
          )}

          {surat.jenisSurat === 'PENGANTAR' && (
            <p>
              Dengan ini memberikan surat pengantar kepada pemohon guna memenuhi kelengkapan administrasi permohonan: <strong className="font-semibold text-slate-900">{surat.tujuanPengantar || surat.keperluan}</strong> yang ditujukan kepada <strong className="font-semibold text-slate-900">{surat.instansiTujuan || 'Instansi Terkait'}</strong>.
            </p>
          )}

          {surat.jenisSurat === 'UMUM' && (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Perihal: {surat.perihalKhusus || surat.keperluan}</p>
              <p className="whitespace-pre-line text-slate-700">{surat.isiKeterangan || '-'}</p>
            </div>
          )}
        </div>

        {/* Keperluan */}
        <p>
          Surat keterangan ini diberikan atas permohonan yang bersangkutan untuk keperluan:{' '}
          <strong className="font-semibold text-slate-900">{surat.keperluan}</strong>.
        </p>

        {surat.keteranganTambahan && (
          <p className="text-xs text-slate-600 italic">
            Catatan Tambahan: {surat.keteranganTambahan}
          </p>
        )}

        <p>
          Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
        </p>
      </div>

      {/* Signature Section */}
      <div className="mt-8 flex justify-end font-sans">
        <div className="text-center w-64 space-y-1">
          <p className="text-xs text-slate-600">
            Sukamaju, {isApproved && surat.approvedAt ? formatIndonesianDate(surat.approvedAt) : formatIndonesianDate(surat.createdAt)}
          </p>
          <p className="text-xs font-bold text-slate-900">{VILLAGE_CONFIG.headVillageTitle}</p>

          <div className="h-20 my-2 flex items-center justify-center">
            {isApproved ? (
              <div className="border border-blue-500 bg-blue-50/60 rounded p-2 text-center text-blue-700 space-y-0.5">
                <p className="text-[10px] font-bold tracking-wider">TERVERIFIKASI DIGITAL</p>
                <p className="text-[9px]">Pemerintah Desa Sukamaju</p>
                <p className="text-[9px] font-mono font-semibold">ID: {surat.trackingCode}</p>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 bg-slate-50/70 rounded p-2 text-center text-slate-500 space-y-0.5">
                <Clock className="h-4 w-4 mx-auto text-amber-500" />
                <p className="text-[9px] font-semibold text-amber-700">[ MENUNGGU VERIFIKASI ]</p>
                <p className="text-[9px] text-slate-400">Tanda tangan saat disetujui</p>
              </div>
            )}
          </div>

          <p className="text-xs font-bold underline text-slate-900">{VILLAGE_CONFIG.headVillageName}</p>
          {VILLAGE_CONFIG.headVillageNip && (
            <p className="text-[10px] text-slate-600 font-mono">NIP. {VILLAGE_CONFIG.headVillageNip}</p>
          )}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-8 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono gap-1">
        <span>SI-DESA Elektronik • Tracking: {surat.trackingCode}</span>
        <span>Status: {surat.status}</span>
      </div>
    </div>
  );
}
