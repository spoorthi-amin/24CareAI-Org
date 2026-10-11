import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../brand/Logo';
import {
  Activity,
  HeartPulse,
  Brain,
  FileText,
  FileCheck,
  Stethoscope,
  Calendar,
  AlertTriangle,
  Palette,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Settings as SettingsIcon,
  Shield,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openThemeModal: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openThemeModal, openAuthModal }) => {
  const { user, isAuthenticated, logout, switchRoleQuick } = useAuth();
  const { themeColor, activeConfig, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'triage', label: 'AI Triage', icon: Brain },
    { id: 'memory', label: 'Health Memory', icon: HeartPulse },
    { id: 'reports', label: 'Reports & OCR', icon: FileText },
    { id: 'brief', label: 'Doctor Brief', icon: FileCheck },
    { id: 'directory', label: 'Doctors & Clinics', icon: Stethoscope },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'emergency', label: 'Emergency SOS', icon: AlertTriangle, isAlert: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: isDark ? 'rgba(6, 43, 33, 0.94)' : 'rgba(255, 255, 255, 0.94)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="focus:outline-hidden text-left py-1"
            >
              <Logo variant="horizontal" size="md" />
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              if (item.isAlert) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 ml-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-transform hover:scale-105 animate-pulse"
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                    <span>Emergency SOS</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'font-semibold shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--color-sage)' : undefined,
                    color: isActive ? 'var(--color-primary-dark)' : undefined,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Role Switcher */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-xs font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  title="Switch test roles (Patient, Doctor, Admin)"
                >
                  {user?.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  ) : user?.role === 'doctor' ? (
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span className="capitalize text-gray-800 dark:text-gray-200">
                    {user?.role || 'Patient'} View
                  </span>
                </button>

                {roleDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 card-theme p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                    style={{ backgroundColor: 'var(--surface-card)' }}
                  >
                    <div className="px-2 py-1 text-[10px] uppercase font-semibold text-gray-400">
                      Switch Role Perspective
                    </div>
                    <button
                      onClick={() => {
                        switchRoleQuick('patient');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left ${
                        user?.role === 'patient' ? 'bg-emerald-50 dark:bg-emerald-950/40 font-semibold text-emerald-800 dark:text-emerald-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Patient (Priya)</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRoleQuick('doctor');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left ${
                        user?.role === 'doctor' ? 'bg-blue-50 dark:bg-blue-950/40 font-semibold text-blue-800 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      <span>Doctor (Dr. Rajesh)</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRoleQuick('admin');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left ${
                        user?.role === 'admin' ? 'bg-purple-50 dark:bg-purple-950/40 font-semibold text-purple-800 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-600" />
                      <span>System Admin</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Theme switcher */}
            <button
              onClick={openThemeModal}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title={`Active Theme: ${activeConfig.name}. Click to customize.`}
            >
              <Palette className="w-4 h-4" style={{ color: activeConfig.actionGreen }} />
            </button>

            {/* Settings button */}
            <button
              onClick={() => setCurrentTab('settings')}
              className={`p-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${
                currentTab === 'settings'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title="Settings & Privacy"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="py-1.5 px-3 rounded-lg text-xs font-medium text-white shadow-xs transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.isAlert
                    ? 'bg-rose-600 text-white font-semibold'
                    : isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.isAlert && (
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase">Emergency</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
