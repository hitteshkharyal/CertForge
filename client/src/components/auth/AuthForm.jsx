import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiUser, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

const AuthForm = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { user, login, register, isLoading } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        toast.success('Welcome back!');
      } else {
        await register(form);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Form card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl gradient-primary items-center justify-center text-white font-bold text-xl shadow-glow mb-4">
              C
            </div>
            <h1 className="text-2xl font-bold font-[Outfit] text-surface-100">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-surface-400 mt-2">
              {isLogin
                ? 'Sign in to manage your certificates'
                : 'Get started with CertForge for free'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5" htmlFor="auth-name">
                  Full Name
                </label>
                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                  <input
                    id="auth-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Hitesh Kumar"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5" htmlFor="auth-email">
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5" htmlFor="auth-password">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  id="auth-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              className="w-full"
              icon={HiArrowRight}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-surface-400 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
