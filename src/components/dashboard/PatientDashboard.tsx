import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { HealthRecord, Appointment, MedicalReport } from '../../types/health';
import {
  Brain,
  FileText,
  FileCheck,
  Stethoscope,
  AlertTriangle,
  Pill,
  ShieldAlert,
  Calendar,
  Activity,
  HeartPulse,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Heart,
  Thermometer,
} from 'lucide-react';
import { Logo } from '../brand/Logo';

interface PatientDashboardProps {
  onNavigate: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [recRes, aptRes, repRes] = await Promise.all([
          api.getHealthMemory(),
          api.getAppointments(),
          api.getReports(),
        ]);
        setRecords(recRes.records || []);
        setAppointments(aptRes.appointments || []);
        setReports(repRes.reports || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const activeMedications = records.filter((r) => r.type === 'medication' && r.status === 'active');
  const criticalAllergies = records.filter((r) => r.type === 'allergy');
  const upcomingAppointments = appointments.filter((a) => a.status === 'confirmed');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Refined Welcome Banner with Integrated Decorative Health Graphic */}
      <div className="card-theme p-6 relative overflow-hidden bg-gradient-to-r from-emerald-500/12 via-teal-500/6 to-transparent border-emerald-300/80 dark:border-emerald-800 shadow-sm">
        {/* Decorative background vectors */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-20 dark:opacity-10 pointer-events-none hidden md:block">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <circle cx="100" cy="100" r="80" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" />
            <path
              d="M20 100H60L75 70L90 130L105 85L115 110L125 100H180"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Active Health Dossier
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Blood Group: <strong className="text-emerald-700 dark:text-emerald-400">{user?.bloodGroup || 'B+'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Good day, {user?.name || 'Priya Sharma'}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Your 24CareAI Personal Health Memory is synchronized. Review laboratory trends, generate a consultation brief, or run safety-first triage.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('triage')}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white shadow-md transition-all hover:scale-105 flex items-center gap-2 group"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Brain className="w-4 h-4 transition-transform group-hover:rotate-6" />
              <span>AI Symptom Triage</span>
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all hover:scale-105 flex items-center gap-2 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* Mini Vitals Metric Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Resting Heart Rate</span>
              <span className="font-extrabold text-gray-900 dark:text-white">72 bpm <span className="text-[10px] text-emerald-600 font-semibold">(Normal)</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Blood Pressure</span>
              <span className="font-extrabold text-gray-900 dark:text-white">118/76 mmHg</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Fasting Blood Glucose</span>
              <span className="font-extrabold text-gray-900 dark:text-white">92 mg/dL</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Oxygen (SpO2)</span>
              <span className="font-extrabold text-gray-900 dark:text-white">99% <span className="text-[10px] text-teal-600 font-semibold">(Optimal)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Five Coordinated Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[
          {
            id: 'triage',
            label: 'Check Symptoms',
            desc: 'AI Clinical Triage',
            icon: Brain,
            bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            borderColor: 'hover:border-emerald-400',
          },
          {
            id: 'reports',
            label: 'Upload Lab Report',
            desc: 'OCR & AI Analysis',
            icon: FileText,
            bgLight: 'bg-blue-50 dark:bg-blue-950/40',
            textColor: 'text-blue-700 dark:text-blue-300',
            borderColor: 'hover:border-blue-400',
          },
          {
            id: 'brief',
            label: 'Doctor Brief',
            desc: '1-Page Clinical Sheet',
            icon: FileCheck,
            bgLight: 'bg-teal-50 dark:bg-teal-950/40',
            textColor: 'text-teal-700 dark:text-teal-300',
            borderColor: 'hover:border-teal-400',
          },
          {
            id: 'directory',
            label: 'Find Doctors',
            desc: 'Clinics & Trauma Units',
            icon: Stethoscope,
            bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
            textColor: 'text-indigo-700 dark:text-indigo-300',
            borderColor: 'hover:border-indigo-400',
          },
          {
            id: 'memory',
            label: 'Health Memory',
            desc: 'History & Care Timeline',
            icon: HeartPulse,
            bgLight: 'bg-purple-50 dark:bg-purple-950/40',
            textColor: 'text-purple-700 dark:text-purple-300',
            borderColor: 'hover:border-purple-400',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`card-theme p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${item.borderColor} flex flex-col justify-between space-y-3 group`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bgLight} ${item.textColor} transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {item.label}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Snapshot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Medications */}
        <div className="card-theme p-5 space-y-3 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Active Medications ({activeMedications.length})
              </h3>
              <button
                onClick={() => onNavigate('memory')}
                className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {activeMedications.slice(0, 3).map((med) => (
                <div
                  key={med.id}
                  className="p-3 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 space-y-1 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {med.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{med.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span>Maintained in Health Memory</span>
            <span className="text-emerald-600 font-semibold">100% On Schedule</span>
          </div>
        </div>

        {/* Enhanced Critical Allergies Alert Panel */}
        <div className="card-theme p-5 space-y-3 flex flex-col justify-between border-rose-200/80 dark:border-rose-900/60 bg-gradient-to-b from-rose-50/30 to-transparent hover:shadow-sm transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 animate-pulse text-rose-600" />
                Critical Allergy Alert
              </h3>
              <button
                onClick={() => onNavigate('memory')}
                className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {criticalAllergies.length > 0 ? (
                criticalAllergies.map((al) => (
                  <div
                    key={al.id}
                    className="p-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/30 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold text-rose-900 dark:text-rose-100 flex items-center gap-1.5">
                        <span className="text-rose-600 font-black">⚠</span>
                        <span>{al.title}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold uppercase">
                        High Alert
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-800 dark:text-rose-300 line-clamp-1">{al.details}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No drug allergies recorded.</p>
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-rose-700 dark:text-rose-300 font-medium border-t border-rose-100 dark:border-rose-900/40">
            Automatically attached to Doctor Consultation Briefs
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="card-theme p-5 space-y-3 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Upcoming Consultations ({upcomingAppointments.length})
              </h3>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>Schedule</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 space-y-1.5 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {apt.doctorName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                        Confirmed
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {apt.specialty}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{apt.date}</span>
                      <span>·</span>
                      <span>{apt.timeSlot}</span>
                      <span>·</span>
                      <span>{apt.type}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-center space-y-1">
                  <p className="text-xs text-gray-500">No scheduled visits</p>
                  <button
                    onClick={() => onNavigate('directory')}
                    className="text-xs text-emerald-600 font-semibold hover:underline"
                  >
                    Book with a specialist →
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800">
            Includes both In-Person & Telehealth video links
          </div>
        </div>
      </div>

      {/* Recent Medical Reports & Longitudinal Health Memory Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Reports Highlights */}
        <div className="lg:col-span-6 card-theme p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Recent Diagnostic Lab Reports ({reports.length})
            </h3>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Analyze New Document →
            </button>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 2).map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 space-y-2 cursor-pointer hover:border-emerald-300 transition-colors"
                  onClick={() => onNavigate('reports')}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {rep.title}
                    </h4>
                    <span className="text-[10px] text-gray-400">{rep.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                    {rep.aiSummary}
                  </p>
                  {rep.keyParameters && rep.keyParameters.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rep.keyParameters.slice(0, 3).map((p, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            p.status === 'High' || p.status === 'Low'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {p.name}: {p.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No medical reports uploaded yet.</p>
          )}
        </div>

        {/* Health Memory Timeline Recent Activity */}
        <div className="lg:col-span-6 card-theme p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              Recent Health Memory Activity
            </h3>
            <button
              onClick={() => onNavigate('memory')}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Open Health Memory →
            </button>
          </div>

          <div className="space-y-2.5">
            {records.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-emerald-200 transition-colors"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {rec.title}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">{rec.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{rec.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
