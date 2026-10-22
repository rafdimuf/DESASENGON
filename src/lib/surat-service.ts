import { SuratFormData } from '@/types/surat';
import { LetterStatus } from '@/types';
import { SURAT_TYPES } from './surat-config';

const STORAGE_KEY_LIST = 'si_desa_surat_submissions_v1';
const STORAGE_KEY_DRAFT = 'si_desa_surat_form_active_draft_v1';

export function generateTrackingCode(prefix: string): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `REG-${prefix}-${randomNum}`;
}

export function generateSafeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `surat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Initial realistic seed items to clearly showcase the differences between Draft vs Menunggu vs Disetujui
const INITIAL_SEED_DATA: SuratFormData[] = [
  {
    id: 'seed-surat-1-disetujui',
    trackingCode: 'REG-SKD-10294',
    status: 'DISETUJUI',
    isDraft: false,
    nomorSurat: '470 / 084 / DS-SKM / 2026',
    nik: '3201124508920003',
    nama: 'Rahmat Hidayat',
    tempatLahir: 'Nusantara',
    tanggalLahir: '1992-08-15',
    jenisKelamin: 'L',
    agama: 'Islam',
    pekerjaan: 'Karyawan Swasta',
    alamat: 'Jl. Melati No. 45, Dusun Krajan',
    rt: '003',
    rw: '002',
    dusun: 'Dusun Krajan',
    noTelepon: '081234567890',
    jenisSurat: 'SKD',
    keperluan: 'Kelengkapan berkas administrasi perpanjangan KTP dan pendaftaran NPWP',
    keteranganTambahan: 'Telah tinggal dan menetap dengan tertib di Dusun Krajan.',
    statusTempatTinggal: 'Rumah Milik Sendiri',
    tinggalSejak: '2016',
    checkedRequirements: ['Foto KTP asli pemohon', 'Foto Kartu Keluarga (KK)', 'Surat Pengantar RT / RW setempat'],
    createdAt: '2026-10-18T09:30:00.000Z',
    updatedAt: '2026-10-19T10:15:00.000Z',
    submittedAt: '2026-10-18T10:00:00.000Z',
    approvedAt: '2026-10-19T10:15:00.000Z',
    approverName: 'BUDI SANTOSO, S.Sos.',
    approverRole: 'Kepala Desa Sukamaju',
  },
  {
    id: 'seed-surat-2-menunggu',
    trackingCode: 'REG-SKU-29381',
    status: 'MENUNGGU_PERSETUJUAN',
    isDraft: false,
    nomorSurat: undefined,
    nik: '3201126702950001',
    nama: 'Siti Aminah',
    tempatLahir: 'Maju Jaya',
    tanggalLahir: '1995-02-27',
    jenisKelamin: 'P',
    agama: 'Islam',
    pekerjaan: 'Wiraswasta / Pedagang',
    alamat: 'Gang Mawar RT 01 / RW 04, Dusun Mekarsari',
    rt: '001',
    rw: '004',
    dusun: 'Dusun Mekarsari',
    noTelepon: '085712349988',
    jenisSurat: 'SKU',
    keperluan: 'Pengajuan Kredit Usaha Rakyat (KUR) BRI Cabang Maju Jaya',
    keteranganTambahan: 'Usaha bergerak di bidang sembako dan penjualan aneka kebutuhan pokok.',
    namaUsaha: 'Toko Berkah Siti Sembako',
    bidangUsaha: 'Perdagangan Sembako & Kelontong',
    alamatUsaha: 'Jl. Pasar Tradisional RT 01 / RW 04, Dusun Mekarsari',
    tahunBerdiri: '2021',
    checkedRequirements: ['Foto KTP asli pemilik usaha', 'Foto Kartu Keluarga (KK)', 'Surat Pengantar RT setempat', 'Foto kegiatan usaha / tempat usaha'],
    createdAt: '2026-10-20T14:20:00.000Z',
    updatedAt: '2026-10-20T14:25:00.000Z',
    submittedAt: '2026-10-20T14:25:00.000Z',
  },
  {
    id: 'seed-surat-3-draft',
    trackingCode: 'REG-SKTM-54312',
    status: 'DRAFT',
    isDraft: true,
    nomorSurat: undefined,
    nik: '3201121004880005',
    nama: 'Agus Setiawan',
    tempatLahir: 'Nusantara',
    tanggalLahir: '1988-04-10',
    jenisKelamin: 'L',
    agama: 'Islam',
    pekerjaan: 'Buruh Harian Lepas',
    alamat: 'Kampung Sukasari RT 02 / RW 03, Dusun Sukasari',
    rt: '002',
    rw: '003',
    dusun: 'Dusun Sukasari',
    noTelepon: '081399881122',
    jenisSurat: 'SKTM',
    keperluan: 'Permohonan Keringanan Biaya Kuliah (KIP Kuliah) Anak Pertama',
    keteranganTambahan: 'Draft permohonan sedang melengkapi scan kartu keluarga.',
    peruntukan: 'Anak Kandung (Pendidikan/Sekolah/Kuliah)',
    namaAnggota: 'Dimas Setiawan',
    instansiTujuan: 'Universitas Negeri Nusantara',
    penghasilan: '< Rp 500.000 / bulan',
    checkedRequirements: ['Foto KTP pemohon / orang tua'],
    createdAt: '2026-10-21T08:10:00.000Z',
    updatedAt: '2026-10-21T08:15:00.000Z',
  },
];

export class SuratStorageService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  static getList(): SuratFormData[] {
    if (!this.isBrowser()) return INITIAL_SEED_DATA;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_LIST);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(INITIAL_SEED_DATA));
        return INITIAL_SEED_DATA;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading surat from localStorage:', e);
      return INITIAL_SEED_DATA;
    }
  }

  static getById(id: string): SuratFormData | null {
    const list = this.getList();
    return list.find((item) => item.id === id) || null;
  }

  static saveDraft(data: Partial<SuratFormData>): SuratFormData {
    const existingDraft = this.getDraft();
    const id = data.id || existingDraft?.id || generateSafeId();
    const trackingCode = data.trackingCode || existingDraft?.trackingCode || generateTrackingCode(data.jenisSurat || 'SKD');
    const now = new Date().toISOString();

    const fullDraft: SuratFormData = {
      id,
      trackingCode,
      status: 'DRAFT',
      isDraft: true,
      nik: data.nik || '',
      nama: data.nama || '',
      tempatLahir: data.tempatLahir || '',
      tanggalLahir: data.tanggalLahir || '',
      jenisKelamin: data.jenisKelamin || 'L',
      agama: data.agama || 'Islam',
      pekerjaan: data.pekerjaan || '',
      alamat: data.alamat || '',
      rt: data.rt || '',
      rw: data.rw || '',
      dusun: data.dusun || 'Dusun Krajan',
      noTelepon: data.noTelepon || '',
      jenisSurat: data.jenisSurat || 'SKD',
      keperluan: data.keperluan || '',
      keteranganTambahan: data.keteranganTambahan || '',
      statusTempatTinggal: data.statusTempatTinggal || '',
      tinggalSejak: data.tinggalSejak || '',
      namaUsaha: data.namaUsaha || '',
      bidangUsaha: data.bidangUsaha || '',
      alamatUsaha: data.alamatUsaha || '',
      tahunBerdiri: data.tahunBerdiri || '',
      peruntukan: data.peruntukan || '',
      namaAnggota: data.namaAnggota || '',
      instansiTujuan: data.instansiTujuan || '',
      penghasilan: data.penghasilan || '',
      tujuanPengantar: data.tujuanPengantar || '',
      perihalKhusus: data.perihalKhusus || '',
      isiKeterangan: data.isiKeterangan || '',
      checkedRequirements: data.checkedRequirements || [],
      createdAt: existingDraft?.createdAt || now,
      updatedAt: now,
    };

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(fullDraft));

      // Also upsert in the list so it appears in riwayat as DRAFT
      const list = this.getList();
      const existingIdx = list.findIndex((item) => item.id === fullDraft.id);
      if (existingIdx >= 0) {
        list[existingIdx] = fullDraft;
      } else {
        list.unshift(fullDraft);
      }
      localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(list));
    }

    return fullDraft;
  }

  static getDraft(): SuratFormData | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static clearDraft(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEY_DRAFT);
  }

  static submit(data: Partial<SuratFormData>): SuratFormData {
    const now = new Date().toISOString();
    const id = data.id || generateSafeId();
    const jenis = data.jenisSurat || 'SKD';
    const trackingCode = data.trackingCode || generateTrackingCode(jenis);

    const submission: SuratFormData = {
      id,
      trackingCode,
      status: 'MENUNGGU_PERSETUJUAN',
      isDraft: false,
      nomorSurat: undefined, // Belum ada nomor resmi saat masih menunggu persetujuan
      nik: data.nik || '',
      nama: data.nama || '',
      tempatLahir: data.tempatLahir || '',
      tanggalLahir: data.tanggalLahir || '',
      jenisKelamin: data.jenisKelamin || 'L',
      agama: data.agama || 'Islam',
      pekerjaan: data.pekerjaan || '',
      alamat: data.alamat || '',
      rt: data.rt || '',
      rw: data.rw || '',
      dusun: data.dusun || 'Dusun Krajan',
      noTelepon: data.noTelepon || '',
      jenisSurat: jenis,
      keperluan: data.keperluan || '',
      keteranganTambahan: data.keteranganTambahan || '',
      statusTempatTinggal: data.statusTempatTinggal || '',
      tinggalSejak: data.tinggalSejak || '',
      namaUsaha: data.namaUsaha || '',
      bidangUsaha: data.bidangUsaha || '',
      alamatUsaha: data.alamatUsaha || '',
      tahunBerdiri: data.tahunBerdiri || '',
      peruntukan: data.peruntukan || '',
      namaAnggota: data.namaAnggota || '',
      instansiTujuan: data.instansiTujuan || '',
      penghasilan: data.penghasilan || '',
      tujuanPengantar: data.tujuanPengantar || '',
      perihalKhusus: data.perihalKhusus || '',
      isiKeterangan: data.isiKeterangan || '',
      checkedRequirements: data.checkedRequirements || [],
      createdAt: data.createdAt || now,
      updatedAt: now,
      submittedAt: now,
    };

    if (this.isBrowser()) {
      const list = this.getList();
      const existingIdx = list.findIndex((item) => item.id === submission.id);
      if (existingIdx >= 0) {
        list[existingIdx] = submission;
      } else {
        list.unshift(submission);
      }
      localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(list));
      this.clearDraft();
    }

    return submission;
  }

  static approveSurat(id: string): SuratFormData | null {
    if (!this.isBrowser()) return null;
    const list = this.getList();
    const item = list.find((s) => s.id === id);
    if (!item) return null;

    const typeConfig = SURAT_TYPES[item.jenisSurat];
    const prefix = typeConfig?.numberPrefix || '470';
    const seq = Math.floor(100 + Math.random() * 900);
    const officialNumber = `${prefix} / ${seq} / DS-SKM / ${new Date().getFullYear()}`;

    item.status = 'DISETUJUI';
    item.isDraft = false;
    item.nomorSurat = officialNumber;
    item.approvedAt = new Date().toISOString();
    item.approverName = 'BUDI SANTOSO, S.Sos.';
    item.approverRole = 'Kepala Desa Sukamaju';
    item.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(list));
    return item;
  }

  static updateStatus(id: string, status: LetterStatus, note?: string): SuratFormData | null {
    if (!this.isBrowser()) return null;
    const list = this.getList();
    const item = list.find((s) => s.id === id);
    if (!item) return null;

    item.status = status;
    item.isDraft = status === 'DRAFT';
    item.updatedAt = new Date().toISOString();
    if (note && status === 'DITOLAK') {
      item.rejectionReason = note;
    }

    localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(list));
    return item;
  }

  static delete(id: string): boolean {
    if (!this.isBrowser()) return false;
    const list = this.getList();
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(filtered));

    const draft = this.getDraft();
    if (draft && draft.id === id) {
      this.clearDraft();
    }
    return true;
  }
}
