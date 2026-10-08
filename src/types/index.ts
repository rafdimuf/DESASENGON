export type UserRole = 'SUPER_ADMIN' | 'ADMIN_DESA' | 'OPERATOR' | 'KEPALA_DESA';

export type ResidentStatus = 'AKTIF' | 'MENINGGAL' | 'PINDAH' | 'DATANG';

export type LetterStatus = 'DRAFT' | 'MENUNGGU_PERSETUJUAN' | 'DISETUJUI' | 'DITOLAK' | 'SELESAI';

export interface UserProfile {
  id: string;
  user_id: string;
  village_id: string | null;
  full_name: string;
  email: string;
  role: UserRole;
  phone_number?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Village {
  id: string;
  name: string;
  code: string;
  district: string;
  regency: string;
  province: string;
  postal_code: string;
  head_village_name?: string | null;
  office_address?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdministrativeArea {
  id: string;
  village_id: string;
  name: string;
  type: 'DUSUN' | 'RW' | 'RT';
  parent_id?: string | null;
  leader_name?: string | null;
  created_at: string;
}

export interface Resident {
  id: string;
  nik: string;
  no_kk: string;
  nama_lengkap: string;
  jenis_kelamin: 'L' | 'P';
  tempat_lahir: string;
  tanggal_lahir: string;
  agama: string;
  pendidikan: string;
  pekerjaan: string;
  status_perkawinan: string;
  status_dalam_keluarga: string;
  kewarganegaraan: string;
  alamat: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  desa: string;
  status_kependudukan: ResidentStatus;
  nomor_telepon?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Household {
  id: string;
  no_kk: string;
  kepala_keluarga_id: string;
  alamat: string;
  dusun_id?: string | null;
  rt_id?: string | null;
  rw_id?: string | null;
  village_id: string;
  created_at: string;
  updated_at: string;
}

export interface LetterType {
  id: string;
  code: string;
  name: string;
  description?: string;
  requires_approval: boolean;
  number_format: string;
  created_at: string;
}

export interface Letter {
  id: string;
  letter_type_id: string;
  resident_id: string;
  village_id: string;
  letter_number: string;
  purpose: string;
  status: LetterStatus;
  requester_user_id: string;
  approver_user_id?: string | null;
  approval_note?: string | null;
  approved_at?: string | null;
  extra_data?: Record<string, unknown>;
  file_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  entity: string;
  record_id?: string | null;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at: string;
}
