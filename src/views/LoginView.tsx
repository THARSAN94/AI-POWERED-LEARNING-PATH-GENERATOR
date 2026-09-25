import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: string, data?: any) => void;
  registeredEmail?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, registeredEmail }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState(registeredEmail || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      setError(null);
      await demoLogin();
      onNavigate('dashboard');
    } catch (err: any) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#08090D]">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-sm shadow-blue-600/30 mb-4">
            LX
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sign In to Lonexora Skills
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Access your personalized learning paths, assessments, and certificates
          </p>
        </div>

        {/* Card */}
        <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-2xl">
          {registeredEmail && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>Registration complete! Please sign in with your registered password.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Shortcut */}
          <div className="mb-6 p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Testing or Evaluating?</p>
              <p className="text-[11px] text-slate-400">Log in immediately with pre-configured student profile</p>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading || loading}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {demoLoading ? 'Logging in...' : '1-Click Demo'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 px-4 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-slate-400">
            <span>Don't have an account yet? </span>
            <button
              onClick={() => onNavigate('register')}
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Register for Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
