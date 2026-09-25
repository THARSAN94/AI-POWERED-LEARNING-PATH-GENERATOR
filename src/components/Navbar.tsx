import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFont } from '../context/FontContext';
import { User as UserIcon, LogOut, Award, BookOpen, Clock, ShieldCheck, ChevronDown, Type } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, logout, demoLogin } = useAuth();
  const { activePreset, openFontModal } = useFont();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090D]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-left focus:outline-none group flex items-center gap-2"
        >
          <span className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
            Lonexora Skills
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('courses')}
            className={`transition-colors hover:text-white py-1 ${
              currentView === 'courses' ? 'text-white border-b-2 border-blue-500 font-semibold' : ''
            }`}
          >
            Catalog
          </button>
          {user && (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`transition-colors hover:text-white py-1 ${
                  currentView === 'dashboard' ? 'text-white border-b-2 border-blue-500 font-semibold' : ''
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('performance')}
                className={`transition-colors hover:text-white py-1 ${
                  currentView === 'performance' ? 'text-white border-b-2 border-blue-500 font-semibold' : ''
                }`}
              >
                History
              </button>
              <button
                onClick={() => onNavigate('certificates')}
                className={`transition-colors hover:text-white py-1 ${
                  currentView === 'certificates' ? 'text-white border-b-2 border-blue-500 font-semibold' : ''
                }`}
              >
                Certificates
              </button>
            </>
          )}
          <button
            onClick={() => onNavigate('verify')}
            className={`transition-colors hover:text-white py-1 flex items-center gap-1.5 ${
              currentView === 'verify' ? 'text-white border-b-2 border-blue-500 font-semibold' : ''
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Verify</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Font Customizer Button */}
          <button
            onClick={openFontModal}
            title="Change font style for entire web page"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg border border-white/[0.08] hover:border-white/20 bg-[#12141D] hover:bg-[#181B26] transition-colors focus:outline-none"
          >
            <Type className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline text-slate-400 text-[11px]">Font:</span>
            <span className="font-semibold text-white text-[11px]">{activePreset.name.split(' ')[0]}</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-[#12141d] px-3 py-1.5 text-xs text-slate-200 hover:border-white/20 transition-all focus:outline-none"
              >
                <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold text-xs border border-blue-500/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block font-medium truncate max-w-[120px]">{user.name}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-white/[0.1] bg-[#0E1017] p-2 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('profile')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={openFontModal}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <Type className="h-3.5 w-3.5 text-blue-400" />
                    <span>Typography Style</span>
                  </button>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>My Learning Paths</span>
                  </button>
                  <button
                    onClick={() => onNavigate('performance')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Assessment History</span>
                  </button>
                  <button
                    onClick={() => onNavigate('certificates')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Earned Certificates</span>
                  </button>
                  <div className="border-t border-white/[0.06] my-1" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={async () => {
                  await demoLogin();
                  onNavigate('dashboard');
                }}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] rounded-lg transition-colors whitespace-nowrap"
              >
                1-Click Demo
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/30 transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
