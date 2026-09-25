import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, User as UserIcon, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterViewProps {
  onNavigate: (view: string, data?: any) => void;
  onRegisteredSuccess?: (email: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate, onRegisteredSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        targetRole,
        bio: bio.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        if (onRegisteredSuccess) {
          onRegisteredSuccess(email);
        } else {
          onNavigate('login', { registeredEmail: email });
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
            Create Your Lonexora Account
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Begin your AI-powered learning journey across 50+ technical disciplines
          </p>
        </div>

        {/* Card */}
        <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Registration Successful!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto mb-4">
                Your account is permanently registered in the database. Redirecting to the Login page...
              </p>
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

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
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Engineering Track
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Frontend Engineer">Frontend Engineer (React / Next.js)</option>
                    <option value="Backend Engineer">Backend Engineer (Java / Go / Node)</option>
                    <option value="AI / ML Engineer">AI & Machine Learning Engineer</option>
                    <option value="Cloud & DevOps Architect">Cloud & DevOps Architect</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                    <option value="Data Scientist">Data Scientist & Analytics Engineer</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 px-4 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Continue to Login</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <button
              onClick={() => onNavigate('login')}
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
