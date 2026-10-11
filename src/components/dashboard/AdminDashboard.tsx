import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AuditLog, Facility } from '../../types/health';
import { User } from '../../types/auth';
import {
  Shield,
  Users,
  Activity,
  FileText,
  AlertTriangle,
  Server,
  Calendar,
  Lock,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Database,
} from 'lucide-react';
import { SupabaseStatusCard } from '../common/SupabaseStatusCard';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    stats: any;
    users: any[];
    facilities: Facility[];
    recentAuditLogs: AuditLog[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOverview();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredUsers = (data?.users || []).filter((u) => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card-theme p-6 bg-gradient-to-r from-purple-500/10 via-emerald-500/5 to-transparent border-purple-200/80 dark:border-purple-900/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                System Administration & Governance
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">Security & Clinical Audit Logs</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Platform Administration Portal
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              User identity governance, healthcare facility directory, and tamper-evident audit logging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Server className="w-3.5 h-3.5" />
              <span>{data?.stats?.aiEngineStatus || '24CareAI Neural Engine Online'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: data?.stats?.totalUsers || 3, sub: `${data?.stats?.patientCount || 2} Patients · ${data?.stats?.doctorCount || 1} Doctors` },
          { label: 'Appointments Booked', value: data?.stats?.totalAppointments || 1, sub: 'Active & Follow-ups' },
          { label: 'Lab Reports Processed', value: data?.stats?.totalReportsAnalyzed || 1, sub: 'Multimodal OCR' },
          { label: 'Doctor Briefs Generated', value: data?.stats?.totalBriefsGenerated || 1, sub: 'SBAR Clinical Sheets' },
        ].map((stat, idx) => (
          <div key={idx} className="card-theme p-4 space-y-1">
            <span className="text-[11px] uppercase font-semibold text-gray-400">{stat.label}</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
            <span className="text-[10px] text-emerald-600 font-medium block">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Users Management Table */}
      <div className="card-theme p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              User Accounts Directory ({filteredUsers.length})
            </h3>
            <p className="text-[11px] text-gray-400">Role-based access enforcement</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50 text-xs">
              {['all', 'patient', 'doctor', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`py-1 px-2.5 rounded-md capitalize font-medium transition-colors ${
                    userRoleFilter === r
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search user..."
              className="py-1 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-transparent text-gray-900 dark:text-white w-40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-semibold text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Medical Details</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : u.role === 'doctor'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">{u.email}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-[11px]">
                    {u.role === 'doctor' ? u.specialty || 'General Medicine' : `Age ${u.age || 34} · Blood ${u.bloodGroup || 'B+'}`}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supabase Database Connection & Sync */}
      <SupabaseStatusCard onSyncComplete={fetchAdminData} />

      {/* Real-time Audit Trail */}
      <div className="card-theme p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" />
          Clinical Audit Trail & Security Logs ({data?.recentAuditLogs?.length || 0})
        </h3>
        <p className="text-[11px] text-gray-400">
          Immutable logging of logins, symptom triage executions, document OCR analyses, and emergency alerts.
        </p>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {data?.recentAuditLogs?.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-sm ${
                      log.category === 'EMERGENCY'
                        ? 'bg-rose-100 text-rose-700'
                        : log.category === 'AUTH'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {log.category}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">{log.action}</span>
                  {log.userEmail && (
                    <span className="text-[10px] text-gray-400 font-mono">by {log.userEmail}</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">{log.details}</p>
              </div>

              <span className="text-[10px] text-gray-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
