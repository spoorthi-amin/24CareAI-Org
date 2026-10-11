import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SQL_SETUP_SCRIPT,
  checkSupabaseHealth,
  SupabaseHealthStatus,
} from '../../services/supabase';
import { api } from '../../services/api';

interface SupabaseStatusCardProps {
  compact?: boolean;
  onSyncComplete?: () => void;
}

export const SupabaseStatusCard: React.FC<SupabaseStatusCardProps> = ({
  compact = false,
  onSyncComplete,
}) => {
  const [status, setStatus] = useState<SupabaseHealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await checkSupabaseHealth();
      setStatus(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await api.syncAllToSupabase();
      if (res.success || res.synced > 0) {
        setSyncMessage(`Successfully synced ${res.synced} appointment(s) to Supabase!`);
        checkStatus();
        if (onSyncComplete) onSyncComplete();
      } else if (res.errors && res.errors.length > 0) {
        setSyncMessage(`Sync note: ${res.errors[0]}`);
      } else {
        setSyncMessage('All appointments are already up to date.');
      }
    } catch (e: any) {
      setSyncMessage(`Sync failed: ${e.message}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const isReady = status?.tableAccessible;

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 px-3 rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-emerald-900 dark:text-emerald-200">
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Supabase:</span>
          <span className="font-mono text-[11px] bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300">
            {SUPABASE_PROJECT_ID}
          </span>
        </div>
        {loading ? (
          <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin ml-auto" />
        ) : isReady ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 ml-auto font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Live Synced ({status.rowCount} records)
          </span>
        ) : (
          <button
            onClick={() => setShowSql(true)}
            className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 ml-auto font-medium hover:underline"
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Table Setup Required
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card-theme p-4 sm:p-5 border border-emerald-200 dark:border-emerald-800/40 bg-linear-to-br from-emerald-50/40 via-white to-mint-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Admin Console
              </span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Database Infrastructure & Cloud Storage Sync
              </h3>
              {isReady ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active & Auto-Saving
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Table Setup Needed
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Backend PostgreSQL synchronization for clinical consultations, system logs, and data persistence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={checkStatus}
            disabled={loading}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs transition-colors"
            title="Refresh Supabase connection"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Metadata details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs">
        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80">
          <span className="text-[10px] font-semibold uppercase text-gray-400 block">Project ID</span>
          <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate">
            {SUPABASE_PROJECT_ID}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80">
          <span className="text-[10px] font-semibold uppercase text-gray-400 block">Database Table</span>
          <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate">
            public.appointments
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80">
          <span className="text-[10px] font-semibold uppercase text-gray-400 block">Database Status</span>
          <span className="text-xs font-semibold mt-0.5 block">
            {isReady ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Connected ({status?.rowCount ?? 0} rows)
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                Table not created yet
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Action / Guidance Banner */}
      {!isReady && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs space-y-2 mt-1">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                One-Time Setup: Create the appointments table in Supabase
              </p>
              <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-0.5">
                Your credentials are connected! Simply run the ready-to-use SQL script once in your Supabase SQL Editor so new bookings can be stored directly into your project.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1 pl-6">
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'SQL Copied to Clipboard!' : 'Copy 1-Click SQL'}</span>
            </button>
            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-md border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-200 text-xs font-medium hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setShowSql(!showSql)}
              className="text-amber-700 dark:text-amber-400 text-xs font-medium hover:underline inline-flex items-center gap-1 ml-auto"
            >
              <span>{showSql ? 'Hide SQL Code' : 'View SQL Code'}</span>
              {showSql ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}

      {/* Sync banner if ready */}
      {isReady && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs mt-1">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Real-time synchronization active. Every booked consultation is saved to Supabase table <strong>appointments</strong>.
            </span>
          </div>
          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="inline-flex items-center gap-1 py-1 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync All Bookings'}</span>
          </button>
        </div>
      )}

      {syncMessage && (
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-medium mt-2">
          {syncMessage}
        </div>
      )}

      {/* Expandable SQL Viewer */}
      {showSql && (
        <div className="mt-3 p-3 rounded-lg bg-gray-900 text-gray-100 text-xs space-y-2 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-gray-400 font-semibold uppercase">
              SQL Script (Run once in Supabase SQL Editor)
            </span>
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1 py-1 px-2 rounded bg-gray-800 hover:bg-gray-700 text-white text-[11px] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-2.5 rounded bg-black/60 overflow-x-auto text-[11px] font-mono leading-relaxed text-emerald-300">
            {SQL_SETUP_SCRIPT}
          </pre>
          <p className="text-[11px] text-gray-400">
            After clicking <strong>RUN</strong> in the Supabase SQL editor, return here and click the refresh button above.
          </p>
        </div>
      )}
    </div>
  );
};
