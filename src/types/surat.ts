import { LetterStatus } from './index';

export type SuratTypeCode = 'SKD' | 'SKU' | 'SKTM' | 'PENGANTAR' | 'UMUM';

export interface SuratTypeConfig {
  code: SuratTypeCode;
  name: string;
  officialTitle: string;
  numberPrefix: string;
  description: string;
  defaultPurpose: string;
  icon: string;
  color: string;
  requirements: string[];
  fields: {
    name: string;
    label: string;
    placeholder: string;
    type: 'text' | 'select' | 'number' | 'textarea';
    required: boolean;
    options?: string[];
    helperText?: string;
  }[];
}

export interface SuratFormData {
  id: string;
  trackingCode: string;
  status: LetterStatus;
  isDraft: boolean;
  nomorSurat?: string;

  // Bagian A: Data Pemohon
  nik: string;
  nama: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin: 'L' | 'P';
  agama?: string;
  pekerjaan?: string;
  alamat: string;
  rt?: string;
  rw?: string;
  dusun?: string;
  noTelepon?: string;

  // Bagian B: Detail Pengajuan
  jenisSurat: SuratTypeCode;
  keperluan: string;
  keteranganTambahan?: string;

  // Field Khusus SKD (Domisili)
  statusTempatTinggal?: string;
  tinggalSejak?: string;

  // Field Khusus SKU (Usaha)
  namaUsaha?: string;
  bidangUsaha?: string;
  alamatUsaha?: string;
  tahunBerdiri?: string;

  // Field Khusus SKTM (Tidak Mampu)
  peruntukan?: string;
  namaAnggota?: string;
  instansiTujuan?: string;
  penghasilan?: string;

  // Field Khusus PENGANTAR
  tujuanPengantar?: string;

  // Field Khusus UMUM
  perihalKhusus?: string;
  isiKeterangan?: string;

  // Persyaratan
  checkedRequirements?: string[];

  // Meta
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  approverName?: string;
  approverRole?: string;
  rejectionReason?: string;
}
