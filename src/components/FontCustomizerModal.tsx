import React, { useEffect } from 'react';
import { useFont } from '../context/FontContext';
import { Type, Check, X, Sparkles, RefreshCw } from 'lucide-react';

export const FontCustomizerModal: React.FC = () => {
  const { font, setFont, fontPresets, isModalOpen, closeFontModal } = useFont();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeFontModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeFontModal]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#0E1017] p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  Typography & Font Style
                </h3>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Global System
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize the typographic appearance for the entire Lonexora Skills web application.
              </p>
            </div>
          </div>

          <button
            onClick={closeFontModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Font Presets Grid */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {fontPresets.map((preset) => {
            const isSelected = font === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setFont(preset.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/[0.08] shadow-md shadow-blue-500/10 ring-1 ring-blue-500/40'
                    : 'border-white/[0.08] bg-[#08090D] hover:bg-[#12141D] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {preset.name}
                    </span>
                    <span className="text-[11px] text-slate-400">· {preset.category}</span>
                    {preset.id === 'brakestone' && (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {preset.headingsFont} / {preset.bodyFont}
                    </span>
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'border border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                  {preset.description}
                </p>

                {/* Typography specimen sample */}
                <div
                  className="pt-2 border-t border-white/[0.06] text-xs text-slate-300"
                  style={{ fontFamily: `'${preset.headingsFont}', Georgia, serif` }}
                >
                  <span className="text-[11px] text-slate-500 font-mono block mb-0.5">Specimen:</span>
                  <span className="font-semibold text-white text-sm">
                    {preset.previewSample}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & quick reset */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Changes persist automatically across all pages and sessions.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFont('brakestone')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Default</span>
            </button>
            <button
              onClick={closeFontModal}
              className="px-4 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
