import { jsPDF } from 'jspdf';
import { SuratFormData } from '@/types/surat';
import { VILLAGE_CONFIG, SURAT_TYPES } from './surat-config';

// Format date to Indonesian localized string (e.g. 21 Oktober 2026)
export function formatIndonesianDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

// Generate safe filename without sensitive full NIK
export function getSafePdfFileName(surat: SuratFormData): string {
  const typeCode = surat.jenisSurat.toLowerCase();
  const prefix = surat.status === 'DISETUJUI' ? 'resmi' : 'draft';
  const cleanTracking = surat.trackingCode.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${prefix}-surat-${typeCode}-${cleanTracking}.pdf`;
}

export async function generateSuratPdf(surat: SuratFormData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const marginLeft = 20;
  const marginRight = 20;
  const contentWidth = pageWidth - marginLeft - marginRight; // 170 mm
  let currentY = 16;

  const isApproved = surat.status === 'DISETUJUI';
  const typeConfig = SURAT_TYPES[surat.jenisSurat];

  // ==========================================
  // WATERMARK (If Draft or Not Yet Approved)
  // ==========================================
  if (!isApproved) {
    doc.saveGraphicsState();
    doc.setTextColor(218, 224, 233); // Very light slate gray
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    // Draw diagonal draft watermark
    doc.text('DRAFT - BELUM DISAHKAN', pageWidth / 2, pageHeight / 2 + 10, {
      align: 'center',
      angle: -38,
    });
    doc.restoreGraphicsState();
  }

  // ==========================================
  // TOP DRAFT BANNER (If not approved)
  // ==========================================
  if (!isApproved) {
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.setDrawColor(245, 158, 11); // Amber 500
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, currentY, contentWidth, 9, 1.5, 1.5, 'FD');

    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(
      'PERHATIAN: DOKUMEN INI ADALAH DRAFT PENGAJUAN ONLINE — BELUM SAH SEBELUM DIVERIFIKASI & DISETUJUI KEPALA DESA',
      pageWidth / 2,
      currentY + 5.5,
      { align: 'center' }
    );
    currentY += 13;
  }

  // ==========================================
  // KOP SURAT PEMERINTAH DESA
  // ==========================================
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`PEMERINTAH ${VILLAGE_CONFIG.regency}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFontSize(12);
  doc.text(VILLAGE_CONFIG.district, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5.5;

  doc.setFontSize(14);
  doc.text(`KANTOR ${VILLAGE_CONFIG.villageName}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `${VILLAGE_CONFIG.officeAddress} - Kode Pos ${VILLAGE_CONFIG.postalCode}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 4;

  doc.setFontSize(7.5);
  doc.text(
    `Pos-el: ${VILLAGE_CONFIG.email} | Laman: ${VILLAGE_CONFIG.website} | Telp: ${VILLAGE_CONFIG.phone}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 4;

  // Double horizontal separator line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.7);
  doc.line(marginLeft, currentY, pageWidth - marginRight, currentY);
  currentY += 1;
  doc.setLineWidth(0.2);
  doc.line(marginLeft, currentY, pageWidth - marginRight, currentY);
  currentY += 8;

  // ==========================================
  // JUDUL & NOMOR SURAT
  // ==========================================
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const title = typeConfig?.officialTitle || 'SURAT KETERANGAN';
  doc.text(title, pageWidth / 2, currentY, { align: 'center' });

  // Underline title
  const titleWidth = doc.getTextWidth(title);
  doc.setLineWidth(0.4);
  doc.line((pageWidth - titleWidth) / 2, currentY + 1, (pageWidth + titleWidth) / 2, currentY + 1);
  currentY += 6;

  // Nomor Surat (Only official if approved, otherwise clearly marked as draft)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  if (isApproved && surat.nomorSurat) {
    doc.text(`Nomor: ${surat.nomorSurat}`, pageWidth / 2, currentY, { align: 'center' });
  } else {
    doc.setTextColor(180, 83, 9); // Amber warning color
    doc.text(`Nomor: [Menunggu Penerbitan & Verifikasi Resmi]`, pageWidth / 2, currentY, {
      align: 'center',
    });
    doc.setTextColor(15, 23, 42);
  }
  currentY += 8;

  // ==========================================
  // KALIMAT PEMBUKA
  // ==========================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const introText =
    `Yang bertanda tangan di bawah ini Kepala ${VILLAGE_CONFIG.villageName}, ${VILLAGE_CONFIG.district}, ${VILLAGE_CONFIG.regency}, dengan ini menerangkan dengan sebenarnya bahwa:`;
  const splitIntro = doc.splitTextToSize(introText, contentWidth);
  doc.text(splitIntro, marginLeft, currentY);
  currentY += splitIntro.length * 5 + 3;

  // ==========================================
  // DATA PEMOHON (Tabular format with aligned colons)
  // ==========================================
  const labelX = marginLeft + 6;
  const colonX = marginLeft + 48;
  const valueX = marginLeft + 52;
  const valueWidth = contentWidth - 52;

  const dataRows: [string, string][] = [
    ['Nama Lengkap', surat.nama || '-'],
    ['NIK', surat.nik || '-'],
    [
      'Tempat / Tgl Lahir',
      surat.tempatLahir || surat.tanggalLahir
        ? `${surat.tempatLahir || '-'}, ${formatIndonesianDate(surat.tanggalLahir)}`
        : '-',
    ],
    ['Jenis Kelamin', surat.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'],
    ['Agama', surat.agama || 'Islam'],
    ['Kewarganegaraan', 'Warga Negara Indonesia (WNI)'],
    ['Pekerjaan', surat.pekerjaan || 'Wiraswasta'],
    [
      'Alamat Tempat Tinggal',
      `${surat.alamat}${surat.rt ? `, RT ${surat.rt}` : ''}${surat.rw ? ` / RW ${surat.rw}` : ''}${surat.dusun ? `, ${surat.dusun}` : ''}, ${VILLAGE_CONFIG.villageName}`,
    ],
  ];

  for (const [label, val] of dataRows) {
    doc.setFont('helvetica', 'normal');
    doc.text(label, labelX, currentY);
    doc.text(':', colonX, currentY);

    const splitVal = doc.splitTextToSize(val, valueWidth);
    doc.text(splitVal, valueX, currentY);
    currentY += Math.max(splitVal.length * 4.6, 5);
  }
  currentY += 3;

  // ==========================================
  // ISI KHUSUS MENURUT JENIS SURAT
  // ==========================================
  let spesifikText = '';
  if (surat.jenisSurat === 'SKD') {
    spesifikText = `Orang tersebut di atas adalah benar-benar warga penduduk yang bertempat tinggal dan berdomisili di wilayah ${VILLAGE_CONFIG.villageName} dengan status tempat tinggal ${surat.statusTempatTinggal || 'Rumah Sendiri'} sejak ${surat.tinggalSejak || 'beberapa tahun lalu'} hingga saat surat keterangan ini dibuat.`;
  } else if (surat.jenisSurat === 'SKU') {
    spesifikText = `Orang tersebut di atas adalah benar-benar warga ${VILLAGE_CONFIG.villageName} yang memiliki dan mengelola usaha aktif sebagai berikut:\n• Nama Usaha : ${surat.namaUsaha || '-'}\n• Bidang Usaha : ${surat.bidangUsaha || '-'}\n• Lokasi Usaha : ${surat.alamatUsaha || '-'}\n• Berdiri Sejak : ${surat.tahunBerdiri || '-'}\nUsaha tersebut dinyatakan benar-benar beroperasi dan tidak dalam sengketa.`;
  } else if (surat.jenisSurat === 'SKTM') {
    spesifikText = `Berdasarkan pendataan kependudukan kami, keluarga yang bersangkutan tergolong dalam keluarga Pra-Sejahtera / Berpenghasilan Rendah dengan estimasi penghasilan ${surat.penghasilan || 'di bawah rata-rata'}. Surat keterangan ini diperuntukkan bagi ${surat.peruntukan || 'Pemohon'}${surat.namaAnggota ? ` (a.n. ${surat.namaAnggota})` : ''} guna keperluan pengajuan ke ${surat.instansiTujuan || 'instansi terkait'}.`;
  } else if (surat.jenisSurat === 'PENGANTAR') {
    spesifikText = `Dengan ini memberikan surat pengantar kepada orang tersebut di atas untuk memenuhi kelengkapan administrasi: ${surat.tujuanPengantar || surat.keperluan} yang ditujukan kepada ${surat.instansiTujuan || 'Instansi Terkait'}.`;
  } else {
    spesifikText = `Menerangkan perihal: ${surat.perihalKhusus || surat.keperluan}.\n${surat.isiKeterangan || ''}`;
  }

  const splitSpesifik = doc.splitTextToSize(spesifikText, contentWidth);
  doc.text(splitSpesifik, marginLeft, currentY);
  currentY += splitSpesifik.length * 4.6 + 3;

  // Keperluan Pokok
  const tujuanText = `Surat keterangan ini dibuat atas permohonan yang bersangkutan untuk keperluan: ${surat.keperluan}.`;
  const splitTujuan = doc.splitTextToSize(tujuanText, contentWidth);
  doc.setFont('helvetica', 'normal');
  doc.text(splitTujuan, marginLeft, currentY);
  currentY += splitTujuan.length * 4.6 + 3;

  // Keterangan Tambahan jika ada
  if (surat.keteranganTambahan) {
    const ketText = `Keterangan tambahan: ${surat.keteranganTambahan}`;
    const splitKet = doc.splitTextToSize(ketText, contentWidth);
    doc.text(splitKet, marginLeft, currentY);
    currentY += splitKet.length * 4.6 + 3;
  }

  // ==========================================
  // KALIMAT PENUTUP
  // ==========================================
  const closingText =
    'Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.';
  const splitClosing = doc.splitTextToSize(closingText, contentWidth);
  doc.text(splitClosing, marginLeft, currentY);
  currentY += splitClosing.length * 4.6 + 8;

  // ==========================================
  // TANDA TANGAN PEJABAT
  // ==========================================
  const ttdWidth = 75;
  const ttdX = pageWidth - marginRight - ttdWidth;

  const dateLabel = isApproved && surat.approvedAt
    ? formatIndonesianDate(surat.approvedAt)
    : formatIndonesianDate(surat.createdAt);

  doc.text(`Sukamaju, ${dateLabel}`, ttdX, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.text(VILLAGE_CONFIG.headVillageTitle, ttdX, currentY);
  currentY += 5;

  if (isApproved) {
    // Official stamp / sign placeholder
    doc.setDrawColor(37, 99, 235);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(ttdX, currentY, 65, 18, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setTextColor(29, 78, 216);
    doc.text('DIVERIFIKASI SECARA ELEKTRONIK', ttdX + 4, currentY + 7);
    doc.text(`KEPALA DESA SUKAMAJU`, ttdX + 4, currentY + 12);
    doc.text(`ID VALIDASI: ${surat.trackingCode}`, ttdX + 4, currentY + 16);
    currentY += 23;
  } else {
    // Draft disclaimer box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(ttdX, currentY, 65, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('[ MENUNGGU VERIFIKASI ]', ttdX + 32, currentY + 8, { align: 'center' });
    doc.text('Tanda tangan & cap basah sah', ttdX + 32, currentY + 12, { align: 'center' });
    doc.text('akan dibubuhkan saat terbit', ttdX + 32, currentY + 15.5, { align: 'center' });
    currentY += 23;
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(VILLAGE_CONFIG.headVillageName, ttdX, currentY);
  currentY += 4;

  if (VILLAGE_CONFIG.headVillageNip) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`NIP. ${VILLAGE_CONFIG.headVillageNip}`, ttdX, currentY);
  }

  // ==========================================
  // FOOTER (Meta & Tracking)
  // ==========================================
  const footerY = pageHeight - 12;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(marginLeft, footerY - 3, pageWidth - marginRight, footerY - 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // Slate 400
  const footerText = `Dokumen dibuat melalui SI-DESA • Kode Registrasi: ${surat.trackingCode} • Status: ${surat.status} • Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
  doc.text(footerText, marginLeft, footerY);

  return doc.output('blob');
}

export async function downloadSuratPdf(surat: SuratFormData): Promise<void> {
  const blob = await generateSuratPdf(surat);
  const fileName = getSafePdfFileName(surat);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
