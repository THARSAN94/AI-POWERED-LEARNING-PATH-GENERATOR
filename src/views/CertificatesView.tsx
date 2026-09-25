import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface CertificatesViewProps {
  onNavigate: (view: string, data?: any) => void;
  selectedCertId?: string;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onNavigate, selectedCertId }) => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCerts() {
      try {
        setLoading(true);
        const res = await api.getCertificates();
        setCertificates(res.certificates);
        if (selectedCertId) {
          const found = res.certificates.find(c => c.id === selectedCertId);
          if (found) setActiveCert(found);
          else if (res.certificates.length > 0) setActiveCert(res.certificates[0]);
        } else if (res.certificates.length > 0) {
          setActiveCert(res.certificates[0]);
        }
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, [selectedCertId]);

  const handleCopyLink = () => {
    if (!activeCert) return;
    const url = `${window.location.origin}/verify/${activeCert.certificateCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D]">
        <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading verifiable certificates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Award className="h-4 w-4" />
              <span>Lonexora Skills Academy Credentials</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Cryptographically Verifiable</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Earned Certifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Official completion credentials backed by daily 10-question assessments. Scannable QR code allows any recruiter or university to independently verify validity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('verify')}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Public Verification Portal</span>
            </button>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="surface-card p-12 rounded-xl text-center space-y-4 max-w-xl mx-auto">
            <div className="h-14 w-14 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <Award className="h-7 w-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete all daily modules in your active learning roadmap and achieve passing scores on every day's 10-question assessment to earn your official verified certificate!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all"
              >
                Go to Active Path
              </button>
              <button
                onClick={() => onNavigate('courses')}
                className="px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-[#12141D] border border-white/[0.08] rounded-lg transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Multiple cert switcher tabs if user has multiple */}
            {certificates.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs text-slate-400 font-medium mr-2">Select Certificate:</span>
                {certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => setActiveCert(cert)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      activeCert?.id === cert.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-[#12141D] text-slate-400 border border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {cert.courseName}
                  </button>
                ))}
              </div>
            )}

            {/* Actions Bar above Certificate */}
            {activeCert && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0E1017] border border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Credential ID: <strong className="font-mono text-white">{activeCert.certificateCode}</strong></span>
                  <span className="text-emerald-400 font-medium ml-2">● Verified Authentic</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#181B26] hover:bg-[#222736] rounded-lg transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Verification URL'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>
            )}

            {/* CEREMONIAL CERTIFICATE CANVAS */}
            {activeCert && (
              <div className="relative mx-auto max-w-4xl print:max-w-none print:m-0 print:border-none">
                <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-[#0B0D14] via-[#0E1018] to-[#0B0D14] p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden text-center space-y-6">
                  {/* Subtle decorative background watermarks */}
                  <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

                  {/* Header / Crest */}
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-6 mb-4">
                    <div className="text-left flex items-center gap-3">
                      <div className="h-11 w-11 rounded-lg bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                        LX
                      </div>
                      <div>
                        <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                          Lonexora Skills Academy
                        </h2>
                        <p className="text-[10px] uppercase tracking-widest text-amber-400/90 font-medium">
                          Institute of Advanced Engineering & Technical Sciences
                        </p>
                      </div>
                    </div>

                    <img
                      src="/src/assets/images/certificate_seal_badge_1790181537015.jpg"
                      alt="Lonexora Gold Seal"
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-amber-400 shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-2 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                      Official Certificate of Professional Mastery
                    </p>
                    <p className="text-xs text-slate-400">
                      This formal certification is solemnly presented to
                    </p>
                    <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight py-2">
                      {activeCert.userName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                      for the exemplary completion of the rigorous day-by-day curriculum, practical hands-on exercises, and high-standard daily knowledge assessments in
                    </p>
                  </div>

                  {/* Course Title Badge Box */}
                  <div className="rounded-xl border border-amber-500/20 bg-[#12141D] p-5 max-w-2xl mx-auto">
                    <h4 className="font-display text-xl sm:text-2xl font-bold text-blue-300 tracking-tight mb-1">
                      {activeCert.courseName}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {activeCert.durationWeeks} Weeks · {activeCert.totalDays} Daily Engineering Modules · Overall Average {activeCert.averageScore}%
                    </p>
                  </div>

                  {/* Signatures & QR Code Footer */}
                  <div className="pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-left">
                    {/* Left: Signatures */}
                    <div className="space-y-1">
                      <div className="font-serif italic text-base text-slate-200 border-b border-slate-700 pb-1 w-44">
                        Dr. Evelyn Vance
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Dean of Technical Education
                      </p>
                      <p className="text-[10px] text-slate-500">Lonexora Skills Academy</p>
                    </div>

                    {/* Center: Unique ID & Dates */}
                    <div className="text-center sm:text-center space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Credential ID</p>
                      <p className="font-mono text-xs font-bold text-amber-400">{activeCert.certificateCode}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Date Issued: <strong className="text-slate-300">{activeCert.completionDate}</strong>
                      </p>
                      <p className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Cryptographically Verified</span>
                      </p>
                    </div>

                    {/* Right: Scannable QR Code */}
                    <div className="flex flex-col items-center sm:items-end">
                      <div className="p-2 bg-white rounded-lg shadow-lg border border-slate-200">
                        <img
                          src={activeCert.qrCodeDataUrl}
                          alt={`QR Code verification for ${activeCert.certificateCode}`}
                          className="w-20 h-20 sm:w-24 sm:h-24"
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">
                        Scan with camera to verify
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
