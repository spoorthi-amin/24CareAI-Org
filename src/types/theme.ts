export type ThemeColor = 'mint' | 'ocean' | 'forest' | 'lavender' | 'rose' | 'sunset' | 'monochrome';

export type AppearanceMode = 'light' | 'dark' | 'system';

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

export type FontSize = 'standard' | 'large';

export type CardRadius = 'modern' | 'soft';

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  description: string;
  primaryMint: string;
  actionGreen: string;
  deepForest: string;
  paleMintBg: string;
  softSage: string;
  surface: string;
  darkSurface: string;
  darkBg: string;
  previewColor: string;
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeConfig> = {
  mint: {
    id: 'mint',
    name: 'Mint Green',
    description: 'Signature tranquil mint & forest green clinical palette',
    primaryMint: '#A7F3D0',
    actionGreen: '#059669',
    deepForest: '#064E3B',
    paleMintBg: '#F0FDF4',
    softSage: '#D1FAE5',
    surface: '#FFFFFF',
    darkSurface: '#062B21',
    darkBg: '#031712',
    previewColor: '#059669',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Clean medical navy, cyan highlights, and serene azure',
    primaryMint: '#BAE6FD',
    actionGreen: '#0284C7',
    deepForest: '#0C4A6E',
    paleMintBg: '#F0F9FF',
    softSage: '#E0F2FE',
    surface: '#FFFFFF',
    darkSurface: '#082F49',
    darkBg: '#031525',
    previewColor: '#0284C7',
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    description: 'Deep woodland green, botanical pine, and calming sage',
    primaryMint: '#BBF7D0',
    actionGreen: '#16A34A',
    deepForest: '#14532D',
    paleMintBg: '#F0FDF4',
    softSage: '#DCFCE7',
    surface: '#FFFFFF',
    darkSurface: '#143621',
    darkBg: '#091C10',
    previewColor: '#16A34A',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft modern lilac, periwinkle accents, and soothing violet',
    primaryMint: '#DDD6FE',
    actionGreen: '#7C3AED',
    deepForest: '#4C1D95',
    paleMintBg: '#F5F3FF',
    softSage: '#EDE9FE',
    surface: '#FFFFFF',
    darkSurface: '#2E1065',
    darkBg: '#170638',
    previewColor: '#7C3AED',
  },
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    description: 'Warm, welcoming blossom tones and gentle berry accents',
    primaryMint: '#FECDD3',
    actionGreen: '#E11D48',
    deepForest: '#881337',
    paleMintBg: '#FFF1F2',
    softSage: '#FFE4E6',
    surface: '#FFFFFF',
    darkSurface: '#4C0519',
    darkBg: '#28020B',
    previewColor: '#E11D48',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Peach',
    description: 'Inviting apricot, warm terracotta, and gentle amber',
    primaryMint: '#FED7AA',
    actionGreen: '#EA580C',
    deepForest: '#7C2D12',
    paleMintBg: '#FFF7ED',
    softSage: '#FFEDD5',
    surface: '#FFFFFF',
    darkSurface: '#431407',
    darkBg: '#240802',
    previewColor: '#EA580C',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Minimalist high-contrast slate and distraction-free silver',
    primaryMint: '#E2E8F0',
    actionGreen: '#334155',
    deepForest: '#0F172A',
    paleMintBg: '#F8FAFC',
    softSage: '#F1F5F9',
    surface: '#FFFFFF',
    darkSurface: '#1E293B',
    darkBg: '#0F172A',
    previewColor: '#475569',
  },
};
