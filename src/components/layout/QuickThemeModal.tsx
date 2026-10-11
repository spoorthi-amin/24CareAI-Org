import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEME_CONFIGS, ThemeColor, AppearanceMode, LayoutDensity, FontSize, CardRadius } from '../../types/theme';
import { Check, Moon, Sun, Monitor, RefreshCw, X, Sparkles } from 'lucide-react';

interface QuickThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickThemeModal: React.FC<QuickThemeModalProps> = ({ isOpen, onClose }) => {
  const {
    themeColor,
    setThemeColor,
    appearanceMode,
    setAppearanceMode,
    fontSize,
    setFontSize,
    layoutDensity,
    setLayoutDensity,
    cardRadius,
    setCardRadius,
    reducedMotion,
    setReducedMotion,
    activeConfig,
    isDark,
    resetToDefaults,
  } = useTheme();

  if (!isOpen) return null;

  const themeList: ThemeColor[] = ['mint', 'ocean', 'forest', 'lavender', 'rose', 'sunset', 'monochrome'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto card-theme p-6 shadow-2xl relative"
        style={{ backgroundColor: 'var(--surface-card)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-sage)' }}>
              <Sparkles className="w-5 h-5" style={{ color: 'var(--color-primary-dark)' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance & Theme Personalization</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tailor your clinical environment to your visual preference</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-4">
          {/* 1. Color Palette */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Color Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {themeList.map((tKey) => {
                const conf = THEME_CONFIGS[tKey];
                const isSelected = themeColor === tKey;
                return (
                  <button
                    key={tKey}
                    onClick={() => setThemeColor(tKey)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-2 shadow-sm font-semibold'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{
                      borderColor: isSelected ? conf.actionGreen : undefined,
                      backgroundColor: isSelected ? (isDark ? '#062B21' : conf.paleMintBg) : undefined,
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: conf.actionGreen }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs truncate text-gray-900 dark:text-gray-100">{conf.name}</div>
                      {tKey === 'mint' && <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Default Signature</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Appearance Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Appearance Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => {
                const isSelected = appearanceMode === id;
                return (
                  <button
                    key={id}
                    onClick={() => setAppearanceMode(id as AppearanceMode)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Typography & Spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Font Scale
              </label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={() => setFontSize('standard')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    fontSize === 'standard'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  Standard (100%)
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    fontSize === 'large'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  Large (108%)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Layout Density
              </label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50">
                {(['compact', 'comfortable', 'spacious'] as LayoutDensity[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setLayoutDensity(d)}
                    className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-md transition-colors ${
                      layoutDensity === d
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Card Corners & Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Card Corners
              </label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={() => setCardRadius('modern')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    cardRadius === 'modern'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Modern (14px)
                </button>
                <button
                  onClick={() => setCardRadius('soft')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    cardRadius === 'soft'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Soft (20px)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Motion
              </label>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-medium text-left flex items-center justify-between transition-colors ${
                  reducedMotion
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>Reduce animations</span>
                <span className="text-[11px] font-semibold">{reducedMotion ? 'Enabled' : 'Default'}</span>
              </button>
            </div>
          </div>

          {/* 5. Live Preview Card */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Live Theme Preview
            </label>
            <div
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700/60 transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">Active Theme: {activeConfig.name}</span>
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: 'var(--color-sage)',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Clinical Ready
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{activeConfig.description}</p>
              <div className="flex gap-2">
                <button
                  className="py-1.5 px-3 text-xs font-medium text-white shadow-xs"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  Primary Action
                </button>
                <button
                  className="py-1.5 px-3 text-xs font-medium border border-gray-300 dark:border-gray-600"
                  style={{
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  Secondary Action
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Signature Mint
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 text-xs font-medium text-white shadow-xs transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-btn)',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
