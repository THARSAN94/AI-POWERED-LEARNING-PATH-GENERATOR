import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FontPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  headingsFont: string;
  bodyFont: string;
  previewSample: string;
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'brakestone',
    name: 'Brakestone Serif',
    category: 'Requested Exact Style (Default)',
    description: 'High-contrast transitional serif with sharp bracketed serifs, bulb terminals, and stately editorial craftsmanship.',
    headingsFont: 'Libre Baskerville',
    bodyFont: 'Libre Baskerville',
    previewSample: 'Brakestone — Structured Engineering Curriculum',
  },
  {
    id: 'baskervville',
    name: 'Baskervville Heritage',
    category: 'Refined Historic Serif',
    description: 'Classic English transitional typeface with tall proportions and delicate bracketed terminals.',
    headingsFont: 'Baskervville',
    bodyFont: 'Baskervville',
    previewSample: 'Permanent Ledger & Cryptographic Verification',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'High-Contrast Didone',
    description: 'Influenced by the Enlightenment transition from quills to steel pens, featuring pronounced thick/thin strokes.',
    headingsFont: 'Playfair Display',
    bodyFont: 'Libre Baskerville',
    previewSample: 'Daily Milestones & 10-Question Knowledge Quizzes',
  },
  {
    id: 'cormorant',
    name: 'Cormorant Garamond',
    category: 'Artisanal Renaissance Serif',
    description: 'Traditional fine-drawn renaissance serif with sculpted terminals and exceptional grace.',
    headingsFont: 'Cormorant Garamond',
    bodyFont: 'Cormorant Garamond',
    previewSample: 'Lonexora Skills Credential & Knowledge Registry',
  },
  {
    id: 'outfit',
    name: 'Outfit Sans',
    category: 'Modern Geometric Sans',
    description: 'Clean modern sans-serif alternative for digital screens and terminals.',
    headingsFont: 'Outfit',
    bodyFont: 'Outfit',
    previewSample: 'Interactive Code Sandbox & Terminal Output',
  },
];

interface FontContextType {
  font: string;
  setFont: (fontId: string) => void;
  fontPresets: FontPreset[];
  activePreset: FontPreset;
  isModalOpen: boolean;
  openFontModal: () => void;
  closeFontModal: () => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const STORAGE_KEY = 'lonexora_font_theme_v2';

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [font, setFontState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && FONT_PRESETS.some(p => p.id === stored)) {
        return stored;
      }
    } catch (e) {
      // LocalStorage unavailable
    }
    // Default to the exact requested Brakestone serif font style!
    return 'brakestone';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Apply font attribute on <html> and <body> elements
    document.documentElement.setAttribute('data-font', font);
    document.body.setAttribute('data-font', font);
    try {
      localStorage.setItem(STORAGE_KEY, font);
    } catch (e) {
      // ignore
    }
  }, [font]);

  const setFont = (fontId: string) => {
    if (FONT_PRESETS.some(p => p.id === fontId)) {
      setFontState(fontId);
    }
  };

  const activePreset = FONT_PRESETS.find(p => p.id === font) || FONT_PRESETS[0];

  return (
    <FontContext.Provider
      value={{
        font,
        setFont,
        fontPresets: FONT_PRESETS,
        activePreset,
        isModalOpen,
        openFontModal: () => setIsModalOpen(true),
        closeFontModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
