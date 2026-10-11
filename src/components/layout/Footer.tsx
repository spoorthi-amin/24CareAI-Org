import React from 'react';
import { Logo } from '../brand/Logo';
import { ShieldAlert, PhoneCall, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Medical Safety Banner */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/20 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="font-semibold">Clinical Safety Notice:</strong> 24CareAI is an intelligent health support and triage navigation system. It does not provide definitive medical diagnosis or replace professional clinical judgment. Always consult an accredited physician. In life-threatening emergencies, immediately call <strong>112 (India National Emergency)</strong> or your local emergency dispatch.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Brand */}
          <div className="space-y-3">
            <Logo variant="horizontal" size="sm" />
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              AI-Powered Intelligent Healthcare, Triage, Personal Health Memory, and Emergency Response Platform.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Platform Modules
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <button onClick={() => onNavigate('triage')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  AI Symptom Triage & Red Flags
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('memory')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Personal Health Memory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reports')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Medical Report OCR & Summaries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brief')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  AI Consultation Brief Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('directory')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Doctor & Clinic Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Emergency Hotlines
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>India Emergency: <strong>112</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>Direct Ambulance: <strong>102 / 108</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-gray-400" />
                <span>USA: <strong>911</strong> · UK: <strong>999</strong></span>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency')} className="text-rose-600 dark:text-rose-400 font-semibold hover:underline">
                  Open Emergency SOS Workspace →
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Compliance */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Privacy & Control
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>End-to-end user data isolation</li>
              <li>Patient consent before record sharing</li>
              <li>Tokenized doctor brief access</li>
              <li>Complete GDPR JSON data export</li>
              <li>Permanent account deletion available in Settings</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 gap-2">
          <div>
            © {new Date().getFullYear()} 24CareAI. Intelligent Healthcare Technology Architecture.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('settings')} className="hover:underline">Privacy Settings</button>
            <span>·</span>
            <button onClick={() => onNavigate('settings')} className="hover:underline">Appearance Preferences</button>
            <span>·</span>
            <span>Mint Green Signature UI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
