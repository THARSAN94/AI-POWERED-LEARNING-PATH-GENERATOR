import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFont } from '../context/FontContext';
import { api } from '../api';
import { DashboardStats } from '../types';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Save,
  Check,
  Type
} from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (view: string, data?: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const { font, setFont, fontPresets, openFontModal } = useFont();
  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setTargetRole(user.targetRole || 'Full Stack Developer');
      setBio(user.bio || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getDashboardStats();
        setStats(res.stats);
      } catch (err) {
        console.error('Failed to load user stats:', err);
      }
    }
    loadStats();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({ name, targetRole, bio });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <span>Account Management</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Learner Profile</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Student Profile & Target Tracks
            </h1>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Stats Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="surface-card p-4 rounded-xl">
              <span className="text-xs text-slate-400">Total Tracks</span>
              <p className="font-mono text-2xl font-bold text-white tabular-nums mt-1">{stats.totalPaths}</p>
            </div>
            <div className="surface-card p-4 rounded-xl">
              <span className="text-xs text-slate-400">Days Mastered</span>
              <p className="font-mono text-2xl font-bold text-emerald-400 tabular-nums mt-1">{stats.totalDaysCompleted}</p>
            </div>
            <div className="surface-card p-4 rounded-xl">
              <span className="text-xs text-slate-400">Quiz Accuracy</span>
              <p className="font-mono text-2xl font-bold text-sky-400 tabular-nums mt-1">{stats.avgScore}%</p>
            </div>
            <div className="surface-card p-4 rounded-xl">
              <span className="text-xs text-slate-400">Certificates</span>
              <p className="font-mono text-2xl font-bold text-amber-400 tabular-nums mt-1">{stats.totalCertificates}</p>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        <div className="surface-card p-6 sm:p-8 rounded-xl shadow-xl">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center gap-4 border-b border-white/[0.06] pb-6">
              <div className="h-14 w-14 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{user?.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Registered account · Persistent cloud database storage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-slate-500">(Permanent)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#08090D]/50 pl-10 pr-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Engineering Role
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
                  <option value="Systems & Mobile Developer">Systems & Mobile Developer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Learning Objectives / Professional Focus
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your technical goals and learning background..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] p-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Typography Font Style Preference */}
            <div className="pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Type className="h-4 w-4 text-blue-400" />
                  <label className="block text-xs font-semibold text-slate-200">
                    Application Typography Style
                  </label>
                </div>
                <button
                  type="button"
                  onClick={openFontModal}
                  className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Specimen Gallery
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Select your preferred font system across the entire web application.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {fontPresets.map((preset) => {
                  const isSelected = font === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFont(preset.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/[0.12] text-white ring-1 ring-blue-500/40 shadow-sm'
                          : 'border-white/[0.08] bg-[#08090D] text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white block truncate">{preset.name.split(' ')[0]}</span>
                        {isSelected && <span className="h-2 w-2 rounded-full bg-blue-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate font-mono">{preset.headingsFont}</span>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">{preset.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <Check className="h-4 w-4" />
                  <span>Profile updated in database</span>
                </span>
              ) : <span />}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
