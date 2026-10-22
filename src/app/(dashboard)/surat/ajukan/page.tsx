'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FileText,
  Home,
  Store,
  HeartHandshake,
  Send,
  Save,
  Eye,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  RotateCcw,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SuratTypeCode, SuratFormData } from '@/types/surat';
import { SURAT_TYPES, LIST_DUSUN, LIST_AGAMA, LIST_PEKERJAAN } from '@/lib/surat-config';
import { SuratStorageService } from '@/lib/surat-service';
import { downloadSuratPdf } from '@/lib/pdf-generator';

const suratFormSchema = z.object({
  // Bagian A: Data Pemohon
  nik: z
    .string()
    .min(1, 'NIK wajib diisi')
    .regex(/^\d{16}$/, 'NIK harus tepat 16 digit angka (string numerik)'),
  nama: z.string().min(3, 'Nama lengkap wajib diisi minimal 3 karakter'),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  jenisKelamin: z.enum(['L', 'P'], { required_error: 'Pilih jenis kelamin' }),
  agama: z.string().optional(),
  pekerjaan: z.string().optional(),
  alamat: z.string().min(5, 'Alamat lengkap wajib diisi minimal 5 karakter'),
  rt: z.string().max(5).optional(),
  rw: z.string().max(5).optional(),
  dusun: z.string().optional(),
  noTelepon: z.string().optional(),

  // Bagian B: Detail Pengajuan
  jenisSurat: z.enum(['SKD', 'SKU', 'SKTM', 'PENGANTAR', 'UMUM']),
  keperluan: z.string().min(5, 'Tujuan / keperluan pembuatan surat wajib diisi minimal 5 karakter'),
  keteranganTambahan: z.string().optional(),

  // Field Khusus
  statusTempatTinggal: z.string().optional(),
  tinggalSejak: z.string().optional(),
  namaUsaha: z.string().optional(),
  bidangUsaha: z.string().optional(),
  alamatUsaha: z.string().optional(),
  tahunBerdiri: z.string().optional(),
  peruntukan: z.string().optional(),
  namaAnggota: z.string().optional(),
  instansiTujuan: z.string().optional(),
  penghasilan: z.string().optional(),
  tujuanPengantar: z.string().optional(),
  perihalKhusus: z.string().optional(),
  isiKeterangan: z.string().optional(),
});

type SuratFormValues = z.infer<typeof suratFormSchema>;

export default function AjukanSuratPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<SuratTypeCode>('SKD');
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SuratFormValues>({
    resolver: zodResolver(suratFormSchema),
    defaultValues: {
      jenisSurat: 'SKD',
      jenisKelamin: 'L',
      agama: 'Islam',
      dusun: 'Dusun Krajan',
      nik: '',
      nama: '',
      alamat: '',
      keperluan: '',
      statusTempatTinggal: 'Rumah Milik Sendiri',
      tinggalSejak: '2020',
      bidangUsaha: 'Perdagangan Sembako & Kelontong',
      penghasilan: '< Rp 500.000 / bulan',
      peruntukan: 'Diri Sendiri (Pemohon)',
    },
  });

  // Load existing draft from localStorage if available
  useEffect(() => {
    const draft = SuratStorageService.getDraft();
    if (draft) {
      setSelectedType(draft.jenisSurat);
      reset({
        ...draft,
        jenisSurat: draft.jenisSurat,
        jenisKelamin: draft.jenisKelamin || 'L',
      });
      if (draft.checkedRequirements) {
        const reqMap: Record<string, boolean> = {};
        draft.checkedRequirements.forEach((r) => {
          reqMap[r] = true;
        });
        setCheckedRequirements(reqMap);
      }
      setNotification({
        type: 'info',
        message: 'Draft permohonan yang belum selesai berhasil dimuat kembali.',
      });
    }
  }, [reset]);

  const currentTypeConfig = SURAT_TYPES[selectedType];

  const handleSelectType = (code: SuratTypeCode) => {
    setSelectedType(code);
    setValue('jenisSurat', code);
    if (!watch('keperluan') || watch('keperluan') === SURAT_TYPES[selectedType]?.defaultPurpose) {
      setValue('keperluan', SURAT_TYPES[code].defaultPurpose);
    }
  };

  const handleToggleRequirement = (req: string) => {
    setCheckedRequirements((prev) => ({
      ...prev,
      [req]: !prev[req],
    }));
  };

  // Demo Autofill helper
  const handleAutofillDemo = () => {
    setValue('nik', '3201121509900002');
    setValue('nama', 'Bambang Sudarsono');
    setValue('tempatLahir', 'Nusantara');
    setValue('tanggalLahir', '1990-09-15');
    setValue('jenisKelamin', 'L');
    setValue('agama', 'Islam');
    setValue('pekerjaan', 'Wiraswasta / Pedagang');
    setValue('alamat', 'Jl. Melati RT 02 / RW 01');
    setValue('rt', '002');
    setValue('rw', '001');
    setValue('dusun', 'Dusun Krajan');
    setValue('noTelepon', '081234567899');
    setValue('keperluan', currentTypeConfig.defaultPurpose);
    setValue('keteranganTambahan', 'Permohonan diajukan untuk melengkapi syarat administrasi resmi.');

    if (selectedType === 'SKD') {
      setValue('statusTempatTinggal', 'Rumah Milik Sendiri');
      setValue('tinggalSejak', '2019');
    } else if (selectedType === 'SKU') {
      setValue('namaUsaha', 'Toko Sembako Berkah');
      setValue('bidangUsaha', 'Perdagangan Sembako & Kelontong');
      setValue('alamatUsaha', 'Jl. Raya Desa Sukamaju No. 8');
      setValue('tahunBerdiri', '2021');
    } else if (selectedType === 'SKTM') {
      setValue('peruntukan', 'Anak Kandung (Pendidikan/Sekolah/Kuliah)');
      setValue('namaAnggota', 'Rizky Sudarsono');
      setValue('instansiTujuan', 'Universitas Terbuka');
      setValue('penghasilan', 'Rp 500.000 - Rp 1.000.000 / bulan');
    } else if (selectedType === 'PENGANTAR') {
      setValue('instansiTujuan', 'Polsek Maju Jaya');
      setValue('tujuanPengantar', 'Permohonan Penerbitan SKCK Baru');
    } else if (selectedType === 'UMUM') {
      setValue('perihalKhusus', 'Keterangan Beda Ejaan Nama di KTP dan Ijazah');
      setValue('isiKeterangan', 'Menerangkan bahwa nama Bambang Sudarsono di KTP adalah orang yang sama dengan Bambang S. di Ijazah.');
    }

    // Check all requirements
    const allReqs: Record<string, boolean> = {};
    currentTypeConfig.requirements.forEach((r) => {
      allReqs[r] = true;
    });
    setCheckedRequirements(allReqs);

    setNotification({
      type: 'info',
      message: 'Data contoh penduduk berhasil diisikan ke formulir.',
    });
  };

  // Simpan Draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const currentValues = watch();
      const activeReqs = Object.keys(checkedRequirements).filter((k) => checkedRequirements[k]);

      const saved = SuratStorageService.saveDraft({
        ...currentValues,
        jenisSurat: selectedType,
        checkedRequirements: activeReqs,
      });

      setNotification({
        type: 'success',
        message: `Draft surat (${saved.trackingCode}) berhasil disimpan. Anda dapat melanjutkan pengisian kapan saja di menu Riwayat.`,
      });
    } catch {
      setNotification({
        type: 'error',
        message: 'Gagal menyimpan draft.',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Unduh PDF Langsung (Draft PDF)
  const handleDownloadDirectPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const currentValues = watch();
      if (!currentValues.nama || !currentValues.nik) {
        setNotification({
          type: 'error',
          message: 'Silakan isi setidaknya Nama Lengkap dan NIK untuk membuat berkas PDF draft.',
        });
        setIsDownloadingPdf(false);
        return;
      }

      const activeReqs = Object.keys(checkedRequirements).filter((k) => checkedRequirements[k]);
      const tempSurat: SuratFormData = {
        id: 'draft-temp',
        trackingCode: SuratStorageService.getDraft()?.trackingCode || 'REG-DRAFT',
        status: 'DRAFT',
        isDraft: true,
        nik: currentValues.nik,
        nama: currentValues.nama,
        tempatLahir: currentValues.tempatLahir,
        tanggalLahir: currentValues.tanggalLahir,
        jenisKelamin: currentValues.jenisKelamin,
        agama: currentValues.agama,
        pekerjaan: currentValues.pekerjaan,
        alamat: currentValues.alamat || 'Alamat Belum Diisi',
        rt: currentValues.rt,
        rw: currentValues.rw,
        dusun: currentValues.dusun,
        noTelepon: currentValues.noTelepon,
        jenisSurat: selectedType,
        keperluan: currentValues.keperluan || currentTypeConfig.defaultPurpose,
        keteranganTambahan: currentValues.keteranganTambahan,
        statusTempatTinggal: currentValues.statusTempatTinggal,
        tinggalSejak: currentValues.tinggalSejak,
        namaUsaha: currentValues.namaUsaha,
        bidangUsaha: currentValues.bidangUsaha,
        alamatUsaha: currentValues.alamatUsaha,
        tahunBerdiri: currentValues.tahunBerdiri,
        peruntukan: currentValues.peruntukan,
        namaAnggota: currentValues.namaAnggota,
        instansiTujuan: currentValues.instansiTujuan,
        penghasilan: currentValues.penghasilan,
        tujuanPengantar: currentValues.tujuanPengantar,
        perihalKhusus: currentValues.perihalKhusus,
        isiKeterangan: currentValues.isiKeterangan,
        checkedRequirements: activeReqs,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await downloadSuratPdf(tempSurat);
      setNotification({
        type: 'success',
        message: 'PDF Draft berhasil dibuat dan diunduh ke komputer Anda (format kertas A4).',
      });
    } catch (e) {
      console.error(e);
      setNotification({
        type: 'error',
        message: 'Terjadi kesalahan saat memproses file PDF.',
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Preview Surat (Validates then navigates)
  const onPreviewSubmit = (data: SuratFormValues) => {
    const activeReqs = Object.keys(checkedRequirements).filter((k) => checkedRequirements[k]);
    const saved = SuratStorageService.saveDraft({
      ...data,
      jenisSurat: selectedType,
      checkedRequirements: activeReqs,
    });

    router.push(`/surat/preview?id=${saved.id}`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pengajuan Surat Online
            </h1>
            <Badge variant="emerald" className="text-[10px]">Layanan Mandiri Warga</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Isi formulir pengajuan surat administrasi desa. Dokumen draft dapat ditinjau dan diunduh sebelum diverifikasi aparat desa.
          </p>
        </div>

        {/* Quick Helper Action */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutofillDemo}
            className="text-xs gap-1.5 border-dashed border-blue-300 text-blue-700 hover:bg-blue-50"
            title="Isi form otomatis untuk pengujian cepat"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Contoh Data Demo
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              SuratStorageService.clearDraft();
              reset();
              setCheckedRequirements({});
              setNotification({ type: 'info', message: 'Formulir telah dikosongkan.' });
            }}
            className="text-xs gap-1 text-slate-500 hover:text-red-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
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
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />}
            {notification.type === 'info' && <Info className="h-4 w-4 text-blue-600 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Security & Validation Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">Prinsip Keamanan & Validasi Identitas Kependudukan</p>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Format NIK divalidasi tepat 16 karakter numerik teks string. NIK yang lolos validasi format tidak otomatis dianggap sebagai identitas resmi tanpa pencocokan data kependudukan oleh petugas. Seluruh dokumen yang diunduh sebelum disahkan berstatus <strong>DRAFT</strong>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onPreviewSubmit)} className="space-y-6">
        {/* Step 1: Pemilihan Jenis Surat */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white font-bold">1</span>
                Pilih Jenis Surat
              </span>
              <span className="text-xs font-normal text-slate-500">Tersedia 5 jenis template surat</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Setiap jenis surat memiliki konfigurasi isian, persyaratan dokumen, dan template resmi yang berbeda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(
                [
                  { code: 'SKD', icon: Home, label: 'Keterangan Domisili', badge: 'SKD' },
                  { code: 'SKU', icon: Store, label: 'Keterangan Usaha', badge: 'SKU' },
                  { code: 'SKTM', icon: HeartHandshake, label: 'Keterangan Tidak Mampu', badge: 'SKTM' },
                  { code: 'PENGANTAR', icon: Send, label: 'Surat Pengantar', badge: 'SP' },
                  { code: 'UMUM', icon: FileText, label: 'Keterangan Umum', badge: 'SKU-U' },
                ] as const
              ).map((item) => {
                const isSelected = selectedType === item.code;
                const Icon = item.icon;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelectType(item.code)}
                    className={`flex flex-col items-start text-left p-3.5 rounded-xl border transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge
                        variant={isSelected ? 'default' : 'outline'}
                        className="text-[10px] font-mono px-1.5 py-0"
                      >
                        {item.badge}
                      </Badge>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                      {SURAT_TYPES[item.code].description}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Bagian A — Data Pemohon */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white font-bold">2</span>
                Bagian A — Data Diri Pemohon
              </span>
              <span className="text-xs font-normal text-slate-500">Wajib sesuai KTP/KK</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Masukkan identitas pemohon. Validasi NIK menggunakan string numerik tepat 16 digit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NIK */}
              <div className="space-y-1.5">
                <Label htmlFor="nik" required>
                  NIK (Nomor Induk Kependudukan)
                </Label>
                <div className="relative">
                  <Input
                    id="nik"
                    {...register('nik')}
                    placeholder="Contoh: 3201123456780001 (16 digit)"
                    maxLength={16}
                    className="font-mono text-xs"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                    {watch('nik')?.length || 0}/16
                  </span>
                </div>
                {errors.nik ? (
                  <p className="text-[11px] text-red-500">{errors.nik.message}</p>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Disimpan sebagai string teks agar digit nol di awal tidak terpotong.
                  </p>
                )}
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <Label htmlFor="nama" required>
                  Nama Lengkap Pemohon
                </Label>
                <Input
                  id="nama"
                  {...register('nama')}
                  placeholder="Nama lengkap sesuai KTP"
                  className="text-xs"
                />
                {errors.nama && (
                  <p className="text-[11px] text-red-500">{errors.nama.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Tempat Lahir */}
              <div className="space-y-1.5">
                <Label htmlFor="tempatLahir">Tempat Lahir (Opsional)</Label>
                <Input
                  id="tempatLahir"
                  {...register('tempatLahir')}
                  placeholder="Kota/Kabupaten lahir"
                  className="text-xs"
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-1.5">
                <Label htmlFor="tanggalLahir">Tanggal Lahir (Opsional)</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  {...register('tanggalLahir')}
                  className="text-xs"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1.5">
                <Label required>Jenis Kelamin</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue('jenisKelamin', 'L')}
                    className={`py-2 px-3 text-xs rounded-md border text-center transition-all ${
                      watch('jenisKelamin') === 'L'
                        ? 'bg-blue-600 text-white border-blue-600 font-medium'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Laki-Laki
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('jenisKelamin', 'P')}
                    className={`py-2 px-3 text-xs rounded-md border text-center transition-all ${
                      watch('jenisKelamin') === 'P'
                        ? 'bg-blue-600 text-white border-blue-600 font-medium'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Perempuan
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Agama */}
              <div className="space-y-1.5">
                <Label htmlFor="agama">Agama</Label>
                <select
                  id="agama"
                  {...register('agama')}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {LIST_AGAMA.map((ag) => (
                    <option key={ag} value={ag}>
                      {ag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pekerjaan */}
              <div className="space-y-1.5">
                <Label htmlFor="pekerjaan">Pekerjaan</Label>
                <select
                  id="pekerjaan"
                  {...register('pekerjaan')}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="">Pilih Pekerjaan</option>
                  {LIST_PEKERJAAN.map((pk) => (
                    <option key={pk} value={pk}>
                      {pk}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1.5">
              <Label htmlFor="alamat" required>
                Alamat Tempat Tinggal / Domisili Lengkap
              </Label>
              <Textarea
                id="alamat"
                {...register('alamat')}
                placeholder="Jalan, Gang, Nomor Rumah, Dusun / Wilayah"
                className="text-xs min-h-[60px]"
              />
              {errors.alamat && (
                <p className="text-[11px] text-red-500">{errors.alamat.message}</p>
              )}
            </div>

            {/* RT / RW / Dusun / No HP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rt">RT (Opsional)</Label>
                <Input
                  id="rt"
                  {...register('rt')}
                  placeholder="001"
                  maxLength={5}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rw">RW (Opsional)</Label>
                <Input
                  id="rw"
                  {...register('rw')}
                  placeholder="002"
                  maxLength={5}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dusun">Dusun (Opsional)</Label>
                <select
                  id="dusun"
                  {...register('dusun')}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {LIST_DUSUN.map((ds) => (
                    <option key={ds} value={ds}>
                      {ds}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noTelepon">No. WhatsApp / HP</Label>
                <Input
                  id="noTelepon"
                  {...register('noTelepon')}
                  placeholder="0812xxxx"
                  className="text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Bagian B — Detail Pengajuan Khusus */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white font-bold">3</span>
                Bagian B — Detail & Keperluan {currentTypeConfig.name}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono text-blue-700 bg-blue-50">
                Template: {currentTypeConfig.code}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Field isian khusus disesuaikan dengan jenis surat yang dipilih.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Keperluan Utama */}
            <div className="space-y-1.5">
              <Label htmlFor="keperluan" required>
                Tujuan / Keperluan Pembuatan Surat
              </Label>
              <Input
                id="keperluan"
                {...register('keperluan')}
                placeholder={`Contoh: ${currentTypeConfig.defaultPurpose}`}
                className="text-xs"
              />
              {errors.keperluan && (
                <p className="text-[11px] text-red-500">{errors.keperluan.message}</p>
              )}
            </div>

            {/* Field Dinamis Berdasarkan Jenis Surat */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Info className="h-4 w-4 text-blue-600" />
                <span>Field Spesifik {currentTypeConfig.name}</span>
              </div>

              {/* SKD Special Fields */}
              {selectedType === 'SKD' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="statusTempatTinggal" required>
                      Status Kepemilikan Tempat Tinggal
                    </Label>
                    <select
                      id="statusTempatTinggal"
                      {...register('statusTempatTinggal')}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <option value="Rumah Milik Sendiri">Rumah Milik Sendiri</option>
                      <option value="Sewa / Kontrak">Sewa / Kontrak</option>
                      <option value="Menumpang Orang Tua / Saudara">Menumpang Orang Tua / Saudara</option>
                      <option value="Rumah Dinas / Asrama">Rumah Dinas / Asrama</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="tinggalSejak" required>
                      Tinggal di Alamat Ini Sejak
                    </Label>
                    <Input
                      id="tinggalSejak"
                      {...register('tinggalSejak')}
                      placeholder="Contoh: Tahun 2019 atau Sejak Lahir"
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* SKU Special Fields */}
              {selectedType === 'SKU' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="namaUsaha" required>
                        Nama Usaha / Toko
                      </Label>
                      <Input
                        id="namaUsaha"
                        {...register('namaUsaha')}
                        placeholder="Contoh: Toko Sembako Berkah / Bengkel Mandiri"
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bidangUsaha" required>
                        Bidang / Sektor Usaha
                      </Label>
                      <select
                        id="bidangUsaha"
                        {...register('bidangUsaha')}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <option value="Perdagangan Sembako & Kelontong">Perdagangan Sembako & Kelontong</option>
                        <option value="Kuliner / Makanan & Minuman">Kuliner / Makanan & Minuman</option>
                        <option value="Pertanian / Perkebunan">Pertanian / Perkebunan</option>
                        <option value="Peternakan & Perikanan">Peternakan & Perikanan</option>
                        <option value="Jasa & Perbengkelan">Jasa & Perbengkelan</option>
                        <option value="Konveksi & Kerajinan Tangan">Konveksi & Kerajinan Tangan</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="alamatUsaha" required>
                        Alamat / Lokasi Tempat Usaha
                      </Label>
                      <Input
                        id="alamatUsaha"
                        {...register('alamatUsaha')}
                        placeholder="Alamat lokasi tempat usaha beroperasi"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tahunBerdiri" required>
                        Mulai Berdiri / Beroperasi
                      </Label>
                      <Input
                        id="tahunBerdiri"
                        {...register('tahunBerdiri')}
                        placeholder="Contoh: 2021"
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SKTM Special Fields */}
              {selectedType === 'SKTM' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="peruntukan" required>
                        Peruntukan Surat
                      </Label>
                      <select
                        id="peruntukan"
                        {...register('peruntukan')}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <option value="Diri Sendiri (Pemohon)">Diri Sendiri (Pemohon)</option>
                        <option value="Anak Kandung (Pendidikan/Sekolah/Kuliah)">
                          Anak Kandung (Pendidikan/Sekolah/Kuliah)
                        </option>
                        <option value="Orang Tua (Pengobatan/Kesehatan)">
                          Orang Tua (Pengobatan/Kesehatan)
                        </option>
                        <option value="Keluarga Satu KK">Keluarga Satu KK</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="namaAnggota">
                        Nama Yang Bersangkutan (Jika untuk Anak / Orang Tua)
                      </Label>
                      <Input
                        id="namaAnggota"
                        {...register('namaAnggota')}
                        placeholder="Kosongkan jika untuk pemohon sendiri"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="instansiTujuan" required>
                        Instansi / Lembaga Tujuan
                      </Label>
                      <Input
                        id="instansiTujuan"
                        {...register('instansiTujuan')}
                        placeholder="Contoh: RSUD Kabupaten Nusantara / Universitas Negeri"
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="penghasilan" required>
                        Estimasi Penghasilan Bulanan
                      </Label>
                      <select
                        id="penghasilan"
                        {...register('penghasilan')}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <option value="< Rp 500.000 / bulan">&lt; Rp 500.000 / bulan</option>
                        <option value="Rp 500.000 - Rp 1.000.000 / bulan">
                          Rp 500.000 - Rp 1.000.000 / bulan
                        </option>
                        <option value="Rp 1.000.000 - Rp 1.500.000 / bulan">
                          Rp 1.000.000 - Rp 1.500.000 / bulan
                        </option>
                        <option value="Tidak Berpenghasilan Tetap">Tidak Berpenghasilan Tetap</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PENGANTAR Special Fields */}
              {selectedType === 'PENGANTAR' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="instansiTujuan" required>
                      Instansi Tujuan
                    </Label>
                    <Input
                      id="instansiTujuan"
                      {...register('instansiTujuan')}
                      placeholder="Contoh: Polsek Maju Jaya / Kantor Kecamatan / KUA"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="tujuanPengantar" required>
                      Maksud / Hal Pengantar
                    </Label>
                    <Input
                      id="tujuanPengantar"
                      {...register('tujuanPengantar')}
                      placeholder="Contoh: Pengurusan Surat Catatan Kepolisian (SKCK)"
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* UMUM Special Fields */}
              {selectedType === 'UMUM' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="perihalKhusus" required>
                      Perihal Keterangan
                    </Label>
                    <Input
                      id="perihalKhusus"
                      {...register('perihalKhusus')}
                      placeholder="Contoh: Keterangan Beda Penulisan Nama pada Dokumen"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="isiKeterangan" required>
                      Uraian Pokok Keterangan Lengkap
                    </Label>
                    <Textarea
                      id="isiKeterangan"
                      {...register('isiKeterangan')}
                      placeholder="Tuliskan fakta atau hal-hal yang perlu diterangkan secara rinci..."
                      className="text-xs min-h-[80px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Keterangan Tambahan */}
            <div className="space-y-1.5">
              <Label htmlFor="keteranganTambahan">Keterangan Tambahan (Opsional)</Label>
              <Textarea
                id="keteranganTambahan"
                {...register('keteranganTambahan')}
                placeholder="Informasi atau catatan penting lainnya..."
                className="text-xs min-h-[60px]"
              />
            </div>

            {/* Persyaratan Dokumen Pendukung Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <Label>Kelengkapan Berkas & Persyaratan Terkait</Label>
                <span className="text-[10px] text-slate-400">Centang berkas yang sudah siap</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTypeConfig.requirements.map((req) => {
                  const isChecked = !!checkedRequirements[req];
                  return (
                    <label
                      key={req}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/50 text-slate-900 font-medium'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRequirement(req)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="leading-tight">{req}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Bagian C — Tindakan & Action Bar */}
        <Card className="border-slate-200 bg-slate-50/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Simpan Draft */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="gap-1.5 text-xs bg-white text-slate-700"
                >
                  {isSavingDraft ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5 text-slate-600" />
                  )}
                  Simpan Draft
                </Button>

                {/* Unduh Langsung PDF Draft */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadDirectPdf}
                  disabled={isDownloadingPdf}
                  className="gap-1.5 text-xs bg-white text-slate-700 hover:text-blue-700"
                  title="Unduh dokumen draft langsung dalam format PDF jsPDF"
                >
                  {isDownloadingPdf ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5 text-blue-600" />
                  )}
                  Unduh Draft PDF
                </Button>
              </div>

              {/* Preview Surat & Submit */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="submit"
                  variant="default"
                  className="gap-2 text-xs w-full sm:w-auto bg-blue-700 hover:bg-blue-800 shadow-sm"
                >
                  <Eye className="h-4 w-4" />
                  Preview Surat & Validasi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
