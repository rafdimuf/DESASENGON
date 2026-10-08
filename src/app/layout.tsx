import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SI-DESA | Sistem Informasi Administrasi Desa',
  description: 'Sistem Administrasi Desa Berbasis Web Terintegrasi - Kelola Data Penduduk, Kartu Keluarga, Wilayah, dan Persuratan secara Terstruktur dan Aman.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
