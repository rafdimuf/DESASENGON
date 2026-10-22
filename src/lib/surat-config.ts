import { SuratTypeConfig, SuratTypeCode } from '@/types/surat';

export interface VillageConfig {
  province: string;
  regency: string;
  district: string;
  villageName: string;
  officeAddress: string;
  postalCode: string;
  email: string;
  phone: string;
  website: string;
  headVillageName: string;
  headVillageTitle: string;
  headVillageNip?: string;
}

export const VILLAGE_CONFIG: VillageConfig = {
  province: 'JAWA BARAT',
  regency: 'KABUPATEN NUSANTARA',
  district: 'KECAMATAN MAJU JAYA',
  villageName: 'DESA SUKAMAJU',
  officeAddress: 'Jl. Raya Sukamaju No. 12, Sukamaju',
  postalCode: '45123',
  email: 'desa@sukamaju.desa.id',
  phone: '(0231) 889210',
  website: 'https://sukamaju.desa.id',
  headVillageName: 'BUDI SANTOSO, S.Sos.',
  headVillageTitle: 'Kepala Desa Sukamaju',
  headVillageNip: '19780512 200501 1 008',
};

export const SURAT_TYPES: Record<SuratTypeCode, SuratTypeConfig> = {
  SKD: {
    code: 'SKD',
    name: 'Surat Keterangan Domisili',
    officialTitle: 'SURAT KETERANGAN DOMISILI',
    numberPrefix: '470',
    description: 'Surat keterangan resmi yang menerangkan bahwa pemohon benar-benar berdomisili dan bertempat tinggal di wilayah desa.',
    defaultPurpose: 'Persyaratan kelengkapan administrasi kependudukan / perpanjangan KTP / lamaran pekerjaan',
    icon: 'Home',
    color: 'emerald',
    requirements: [
      'Foto KTP asli pemohon',
      'Foto Kartu Keluarga (KK)',
      'Surat Pengantar RT / RW setempat',
      'Bukti tempat tinggal / surat pernyataan pemilik kontrakan (jika sewa)',
    ],
    fields: [
      {
        name: 'statusTempatTinggal',
        label: 'Status Kepemilikan Tempat Tinggal',
        placeholder: 'Pilih status tempat tinggal',
        type: 'select',
        required: true,
        options: [
          'Rumah Milik Sendiri',
          'Sewa / Kontrak',
          'Menumpang Orang Tua / Saudara',
          'Rumah Dinas / Asrama',
        ],
        helperText: 'Status legal kepemilikan hunian saat ini',
      },
      {
        name: 'tinggalSejak',
        label: 'Tinggal di Alamat Ini Sejak',
        placeholder: 'Contoh: Januari 2021 atau Tahun 2018',
        type: 'text',
        required: true,
        helperText: 'Lama waktu menetap di domisili yang diajukan',
      },
    ],
  },
  SKU: {
    code: 'SKU',
    name: 'Surat Keterangan Usaha',
    officialTitle: 'SURAT KETERANGAN USAHA (SKU)',
    numberPrefix: '510',
    description: 'Surat keterangan yang menyatakan bahwa pemohon memiliki dan menjalankan usaha produktif di lingkungan desa.',
    defaultPurpose: 'Pengajuan Kredit Usaha Rakyat (KUR) / Permohonan Pinjaman Bank / Perizinan Usaha Mikro',
    icon: 'Store',
    color: 'blue',
    requirements: [
      'Foto KTP asli pemilik usaha',
      'Foto Kartu Keluarga (KK)',
      'Surat Pengantar RT setempat',
      'Foto kegiatan usaha / tempat usaha',
    ],
    fields: [
      {
        name: 'namaUsaha',
        label: 'Nama Usaha / Toko',
        placeholder: 'Contoh: Warung Berkah Jaya / Bengkel Mandiri',
        type: 'text',
        required: true,
        helperText: 'Nama usaha yang terpasang di lokasi',
      },
      {
        name: 'bidangUsaha',
        label: 'Bidang / Jenis Usaha',
        placeholder: 'Pilih atau tulis bidang usaha',
        type: 'select',
        required: true,
        options: [
          'Perdagangan Sembako & Kelontong',
          'Kuliner / Makanan & Minuman',
          'Pertanian / Perkebunan',
          'Peternakan & Perikanan',
          'Jasa & Perbengkelan',
          'Konveksi & Kerajinan Tangan',
          'Lainnya',
        ],
        helperText: 'Sektor usaha yang sedang dijalankan',
      },
      {
        name: 'alamatUsaha',
        label: 'Alamat Lokasi Tempat Usaha',
        placeholder: 'Contoh: Jl. Diponegoro RT 02 / RW 01, Dusun Krajan',
        type: 'text',
        required: true,
        helperText: 'Lokasi fisik tempat kegiatan usaha beroperasi',
      },
      {
        name: 'tahunBerdiri',
        label: 'Tahun Mulai Beroperasi',
        placeholder: 'Contoh: 2020',
        type: 'text',
        required: true,
        helperText: 'Tahun pertama kali usaha mulai beroperasi',
      },
    ],
  },
  SKTM: {
    code: 'SKTM',
    name: 'Surat Keterangan Tidak Mampu',
    officialTitle: 'SURAT KETERANGAN TIDAK MAMPU (SKTM)',
    numberPrefix: '401',
    description: 'Surat keterangan untuk keluarga pra-sejahtera guna pengajuan keringanan biaya pengobatan, pendidikan, atau bansos.',
    defaultPurpose: 'Permohonan Keringanan Biaya Rumah Sakit / Beasiswa Pendidikan / KIP Kuliah',
    icon: 'HeartHandshake',
    color: 'amber',
    requirements: [
      'Foto KTP pemohon / orang tua',
      'Foto Kartu Keluarga (KK)',
      'Surat Pengantar RT & RW yang menyatakan status pra-sejahtera',
      'Surat Pernyataan Tidak Mampu bermaterai (jika diminta lembaga tujuan)',
    ],
    fields: [
      {
        name: 'peruntukan',
        label: 'Peruntukan Surat Untuk',
        placeholder: 'Pilih peruntukan',
        type: 'select',
        required: true,
        options: [
          'Diri Sendiri (Pemohon)',
          'Anak Kandung (Pendidikan/Sekolah/Kuliah)',
          'Orang Tua (Pengobatan/Kesehatan)',
          'Keluarga Satu KK',
        ],
        helperText: 'Siapa yang membutuhkan bantuan/keringanan',
      },
      {
        name: 'namaAnggota',
        label: 'Nama yang Bersangkutan (Jika untuk Anak/Orang Tua)',
        placeholder: 'Kosongkan jika untuk pemohon sendiri',
        type: 'text',
        required: false,
        helperText: 'Nama anak yang sekolah atau nama pasien yang dirawat',
      },
      {
        name: 'instansiTujuan',
        label: 'Instansi / Lembaga Tujuan',
        placeholder: 'Contoh: RSUD Kabupaten Nusantara / Universitas Negeri / Dinas Sosial',
        type: 'text',
        required: true,
        helperText: 'Pihak yang meminta dokumen keterangan tidak mampu ini',
      },
      {
        name: 'penghasilan',
        label: 'Estimasi Penghasilan Rata-Rata Bulanan',
        placeholder: 'Pilih kisaran penghasilan',
        type: 'select',
        required: true,
        options: [
          '< Rp 500.000 / bulan',
          'Rp 500.000 - Rp 1.000.000 / bulan',
          'Rp 1.000.000 - Rp 1.500.000 / bulan',
          'Tidak Berpenghasilan Tetap',
        ],
        helperText: 'Kisaran rata-rata total pendapatan keluarga per bulan',
      },
    ],
  },
  PENGANTAR: {
    code: 'PENGANTAR',
    name: 'Surat Pengantar Desa',
    officialTitle: 'SURAT PENGANTAR',
    numberPrefix: '474',
    description: 'Surat pengantar resmi dari desa untuk pengurusan berkas ke instansi vertikal seperti Kepolisian, KUA, atau Kecamatan.',
    defaultPurpose: 'Pengantar Pengurusan SKCK ke Polsek / Pengurusan KTP-el ke Kecamatan / Pengantar Nikah',
    icon: 'Send',
    color: 'purple',
    requirements: [
      'Foto KTP asli',
      'Foto Kartu Keluarga (KK)',
      'Surat Pengantar dari Ketua RT setempat',
      'Pas foto 4x6 (2 lembar untuk arsip instansi terkait)',
    ],
    fields: [
      {
        name: 'instansiTujuan',
        label: 'Instansi / Lembaga Tujuan',
        placeholder: 'Contoh: Polsek Maju Jaya / Kantor Kecamatan / KUA',
        type: 'text',
        required: true,
        helperText: 'Kantor atau lembaga tempat berkas akan diserahkan',
      },
      {
        name: 'tujuanPengantar',
        label: 'Maksud Pengantar',
        placeholder: 'Contoh: Permohonan Penerbitan Surat Keterangan Catatan Kepolisian (SKCK)',
        type: 'text',
        required: true,
        helperText: 'Uraian keperluan spesifik di instansi tersebut',
      },
    ],
  },
  UMUM: {
    code: 'UMUM',
    name: 'Surat Keterangan Umum',
    officialTitle: 'SURAT KETERANGAN',
    numberPrefix: '470',
    description: 'Surat keterangan serbaguna untuk keperluan administratif khusus yang tidak tercakup dalam surat keterangan standar lainnya.',
    defaultPurpose: 'Keterangan Beda Nama Ijazah / Keterangan Belum Menikah / Keterangan Kehilangan / Rekomendasi Warga',
    icon: 'FileText',
    color: 'slate',
    requirements: [
      'Foto KTP asli pemohon',
      'Foto Kartu Keluarga (KK)',
      'Surat Pengantar RT / RW setempat',
      'Dokumen pendukung relevan (Ijazah, Akta, Laporan Kehilangan Polsek, dll)',
    ],
    fields: [
      {
        name: 'perihalKhusus',
        label: 'Perihal Pokok Keterangan',
        placeholder: 'Contoh: Keterangan Beda Penulisan Nama pada Ijazah dan KTP',
        type: 'text',
        required: true,
        helperText: 'Judul atau topik permasalahan administratif',
      },
      {
        name: 'isiKeterangan',
        label: 'Uraian Isi Keterangan Lengkap',
        placeholder: 'Tuliskan secara lengkap fakta atau hal yang perlu diterangkan oleh pemerintah desa...',
        type: 'textarea',
        required: true,
        helperText: 'Jelaskan kronologi atau rincian keterangan secara gamblang',
      },
    ],
  },
};

export const LIST_DUSUN = [
  'Dusun Krajan',
  'Dusun Mekarsari',
  'Dusun Sukasari',
  'Dusun Margamulya',
  'Dusun Sindangjaya',
];

export const LIST_AGAMA = [
  'Islam',
  'Kristen Protestan',
  'Katolik',
  'Hindu',
  'Buddha',
  'Konghucu',
];

export const LIST_PEKERJAAN = [
  'Petani / Pekebun',
  'Wiraswasta / Pedagang',
  'Karyawan Swasta',
  'Pegawai Negeri Sipil (PNS)',
  'Buruh Harian Lepas',
  'Ibu Rumah Tangga',
  'Pelajar / Mahasiswa',
  'Belum / Tidak Bekerja',
  'Pensiunan',
  'Lainnya',
];
