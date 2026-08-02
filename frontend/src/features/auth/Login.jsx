import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { GraduationCap, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan. Silakan periksa koneksi internet Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#5B7553]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#C9A876]/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C2620] shadow-md shadow-[#1C2620]/20 transform transition-transform hover:scale-105 duration-300">
            <GraduationCap className="h-10 w-10 text-[#C9A876]" />
          </div>
          <h2 className="mt-6 text-center font-heading text-3xl font-extrabold tracking-tight text-[#1C2620]">
            Masuk ke SIMKASAN
          </h2>
          <p className="mt-2 text-center text-sm text-[#5B6350]">
            Sistem Informasi Kegiatan Santri
          </p>
        </div>

        <div className="bg-white px-8 py-10 rounded-2xl border border-[#E3DEC6] shadow-xl shadow-[#1C2620]/5 backdrop-blur-sm">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-[#8B3A3A]/10 border border-[#8B3A3A]/30 p-4 text-[#8B3A3A] text-sm animate-shake">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#5B6350] mb-2">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                disabled={loading}
                {...register('email')}
                className={`block w-full rounded-lg border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#5B7553] ${
                  errors.email 
                    ? 'border-[#8B3A3A] focus:ring-[#8B3A3A]' 
                    : 'border-[#E3DEC6] focus:border-[#5B7553] bg-[#F7F5F0]/50'
                }`}
                placeholder="ustadz@simkasan.com atau wali@simkasan.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-[#8B3A3A] flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#5B6350] mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                  {...register('password')}
                  className={`block w-full rounded-lg border pl-4 pr-10 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#5B7553] ${
                    errors.password 
                      ? 'border-[#8B3A3A] focus:ring-[#8B3A3A]' 
                      : 'border-[#E3DEC6] focus:border-[#5B7553] bg-[#F7F5F0]/50'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6350] hover:text-[#1C2620] focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-[#8B3A3A] flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5B7553] hover:bg-[#4E6446] text-[#F7F5F0] py-3 rounded-lg font-semibold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses Masuk...
                </>
              ) : (
                'Masuk Aplikasi'
              )}
            </Button>
          </form>

          {/* Seed credentials tip */}
          <div className="mt-8 border-t border-[#E3DEC6] pt-6 text-center text-xs text-[#5B6350] space-y-2 bg-[#F7F5F0]/40 rounded-lg p-3">
            <p className="font-bold text-[#1C2620]">Akun Demo Pengujian:</p>
            <p><span className="font-semibold text-[#1C2620]">Admin:</span> admin@simkasan.com / password</p>
            <p><span className="font-semibold text-[#1C2620]">Ustadz:</span> ustadz@simkasan.com / password</p>
            <p><span className="font-semibold text-[#1C2620]">Wali:</span> wali@simkasan.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
