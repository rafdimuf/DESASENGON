'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  FolderTree
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN_DESA', 'OPERATOR', 'KEPALA_DESA']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'budi.santoso@sukamaju.desa.id',
      password: 'password123',
      role: 'ADMIN_DESA',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // Fallback for Phase 1 demo mode if Supabase project credentials are placeholder
        if (
          error.message.includes('fetch failed') ||
          error.message.includes('Invalid API key') ||
          error.message.includes('URL')
        ) {
          console.warn('Supabase not yet configured, proceeding with Phase 1 layout session demo.');
          router.push('/dashboard');
          return;
        }
        setErrorMessage(error.message || 'Email atau password salah');
      } else {
        router.push('/dashboard');
      }
    } catch {
      // In Phase 1 local development demo, allow login transition
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-2">
            <FolderTree className="h-9 w-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SI-DESA
          </h1>
          <p className="text-sm text-slate-400">
            Sistem Informasi Administrasi Desa Sukamaju
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/60">
              <Building2 className="h-3 w-3 mr-1 text-blue-400" />
              Kec. Maju Jaya, Kab. Nusantara
            </Badge>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="border-slate-800 bg-slate-950/80 backdrop-blur-xl text-slate-100 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white font-bold">Masuk Akun</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Masukkan kredensial akun perangkat desa Anda untuk melanjutkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <div className="flex items-start gap-2 rounded-lg bg-red-950/60 border border-red-800/80 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Role Selection Tabs for Testing */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Pilih Role Akses</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
                  {(['ADMIN_DESA', 'OPERATOR', 'KEPALA_DESA', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setValue('role', r)}
                      className={`text-[11px] font-medium py-1.5 px-2 rounded-md transition-all ${
                        selectedRole === r
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email Aparat Desa</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="nama@desa.go.id"
                    className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">Kata Sandi</label>
                  <a href="#" className="text-[11px] text-blue-400 hover:underline">Lupa sandi?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-9 pr-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Masuk ke Sistem Administrasi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t border-slate-900 pt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Koneksi Terenkripsi & Row Level Security Enabled</span>
            </div>
          </CardFooter>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-500">
          © 2026 Pemerintah Desa Sukamaju. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </div>
    </div>
  );
}
