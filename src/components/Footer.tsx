import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#08090D] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                LX
              </div>
              <span className="font-display text-base font-bold tracking-tight text-white">
                Lonexora<span className="text-blue-400">Skills</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              AI-driven learning path generator for software engineers. Structured day-by-day technical curriculum, countdown timers, 10-question daily knowledge evaluations, permanent performance ledger, and verifiable certificates.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Official Lonexora Skills Credential Registry</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Curriculum</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  54 Engineering Tracks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  Full-Stack Web & Systems
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  Machine Learning & AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  Cloud Infrastructure & DevOps
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Verification</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-white transition-colors">
                  Verify Certificate ID
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('certificates')} className="hover:text-white transition-colors">
                  Credential Vault
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">
                  Create Account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
                  Student Sign In
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Lonexora Skills Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Structured Syllabus Engine</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Cryptographic Proof</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Permanent Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
