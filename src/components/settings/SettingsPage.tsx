import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { THEME_CONFIGS, ThemeColor, AppearanceMode, LayoutDensity, FontSize, CardRadius } from '../../types/theme';
import {
  User,
  Palette,
  Shield,
  Download,
  Trash2,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  HeartPulse,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
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

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState(user?.age ? String(user?.age) : '');
  const [gender, setGender] = useState(user?.gender || 'Female');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [allergies, setAllergies] = useState((user?.allergies || []).join(', '));
  const [chronicConditions, setChronicConditions] = useState((user?.chronicConditions || []).join(', '));
  const [emergencyContactName, setEmergencyContactName] = useState(user?.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(user?.emergencyContactPhone || '');
  const [dataSharingConsent, setDataSharingConsent] = useState(user?.dataSharingConsent ?? true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const success = await updateProfile({
      name,
      phone,
      age: age ? Number(age) : undefined,
      gender,
      bloodGroup,
      allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
      chronicConditions: chronicConditions.split(',').map((s) => s.trim()).filter(Boolean),
      emergencyContactName,
      emergencyContactPhone,
      dataSharingConsent,
    });
    setSavingProfile(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        'CRITICAL WARNING: This will permanently delete your account, medical history, lab reports, and all Health Memory records from 24CareAI. This action cannot be undone. Are you sure?'
      )
    ) {
      const token = localStorage.getItem('24care_token');
      await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
    }
  };

  const themeList: ThemeColor[] = ['mint', 'ocean', 'forest', 'lavender', 'rose', 'sunset', 'monochrome'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
          >
            Preferences & Controls
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">Encrypted Profile & UI Customization</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings & Privacy</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal medical identity, appearance themes, consent preferences, and data exports.
        </p>
      </div>

      {/* 1. Theme and Appearance Customization */}
      <div className="card-theme p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Built-In Theme & Personalization System
            </h2>
          </div>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Signature Mint
          </button>
        </div>

        {/* Color themes grid */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
            Color Palette
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {themeList.map((tKey) => {
              const conf = THEME_CONFIGS[tKey];
              const isSelected = themeColor === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => setThemeColor(tKey)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-2 shadow-xs font-semibold'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
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
                    <span className="text-xs text-gray-900 dark:text-gray-100 block truncate">
                      {conf.name}
                    </span>
                    {tKey === 'mint' && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                        Default
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode, Font, Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Appearance Mode
            </label>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setAppearanceMode(id as AppearanceMode)}
                  className={`flex-1 py-1.5 flex items-center justify-center gap-1 text-xs font-medium rounded-md transition-colors ${
                    appearanceMode === id
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Font Scale
            </label>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => setFontSize('standard')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  fontSize === 'standard'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  fontSize === 'large'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Large (+8%)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Card Corners
            </label>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => setCardRadius('modern')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  cardRadius === 'modern'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                    : 'text-gray-500'
                }`}
              >
                Modern
              </button>
              <button
                onClick={() => setCardRadius('soft')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  cardRadius === 'soft'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                    : 'text-gray-500'
                }`}
              >
                Soft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Medical Identity & Profile */}
      <div className="card-theme p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
          <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Medical Identity & Health Profile
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full py-2 px-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full py-2 px-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Known Drug / Environmental Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Shellfish, Latex"
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Chronic Medical Diagnoses (comma-separated)
            </label>
            <input
              type="text"
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              placeholder="e.g. Allergic Asthma, Hypertension, Type 2 Diabetes"
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Primary Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Emergency Contact Phone Number
              </label>
              <input
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="+91 98765 43211"
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="data-consent-check"
              checked={dataSharingConsent}
              onChange={(e) => setDataSharingConsent(e.target.checked)}
              className="rounded-sm border-gray-300 text-emerald-600"
            />
            <label htmlFor="data-consent-check" className="text-gray-700 dark:text-gray-300">
              Consent to encrypted Health Memory storage and tokenized Doctor Consultation Briefs
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={savingProfile}
              className="py-2 px-4 rounded-lg text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Privacy, Data Portability & Danger Zone */}
      <div className="card-theme p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Data Portability & Account Deletion
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Export Complete Health Records (JSON)</h3>
              <p className="text-gray-500 text-[11px]">
                Download a complete, machine-readable backup of your medical history, reports, and appointments.
              </p>
            </div>
            <a
              href="/api/user/export-data"
              download
              className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Export</span>
            </a>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
            <div>
              <h3 className="font-bold text-rose-900 dark:text-rose-100 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Permanent Account & Record Deletion
              </h3>
              <p className="text-rose-800 dark:text-rose-300 text-[11px] mt-0.5">
                Permanently erases your identity, Personal Health Memory, lab OCR records, and appointment history.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Permanently Delete My Account & Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
