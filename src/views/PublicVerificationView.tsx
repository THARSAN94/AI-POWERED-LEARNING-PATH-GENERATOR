import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

interface PublicVerificationViewProps {
  initialCode?: string;
  onNavigate: (view: string, data?: any) => void;
}

export const PublicVerificationView: React.FC<PublicVerificationViewProps> = ({
  initialCode = '',
  onNavigate,
}) => {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  const handleVerify = async (codeToVerify?: string) => {
    const targetCode = (codeToVerify || code).trim();
    if (!targetCode) {
      setError('Please provide a valid certificate credential ID.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setVerificationData(null);
      const res = await api.verifyCertificate(targetCode);
      if (res.valid && res.certificate) {
        setVerificationData(res.certificate);
      } else {
        setError(res.error || 'Certificate not found in Lonexora Skills registry.');
      }
    } catch (err: any) {
      setError(err.message || 'Credential ID could not be found or verified.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Lonexora Skills Credential Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Verify the authenticity and completion records of any Lonexora Skills certificate. Enter the credential ID below or scan the QR code printed on the physical or digital certificate.
          </p>
        </div>

        {/* Search input form */}
        <div className="surface-card p-6 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter Credential ID (e.g. LX-8A2F1C4E)..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#08090D] pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none uppercase tracking-wider transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Credential</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error notification */}
        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center space-y-2">
            <XCircle className="h-7 w-7 text-rose-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Verification Failed</h3>
            <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          </div>
        )}

        {/* Verified Certificate Details Card */}
        {verificationData && (
          <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 border-emerald-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Official Verified Credential
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {verificationData.certificateCode}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-500">Accredited Issuer</span>
                <p className="text-xs font-semibold text-white">{verificationData.issuer}</p>
              </div>
            </div>

            {/* Recipient info */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Certified Recipient
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  {verificationData.recipientName}
                </h2>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#08090D] p-5 space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">
                  Curriculum Completed
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {verificationData.courseName}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Duration</span>
                    <p className="font-medium text-slate-300 font-mono">{verificationData.durationWeeks} Weeks</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Daily Modules</span>
                    <p className="font-medium text-slate-300 font-mono">{verificationData.totalDays} Days</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Grade Average</span>
                    <p className="font-semibold text-emerald-400 font-mono tabular-nums">{verificationData.averageScore}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Issue Date</span>
                    <p className="font-medium text-slate-300 font-mono">{verificationData.completionDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Permanently cryptographically signed and stored in Lonexora Skills database.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
