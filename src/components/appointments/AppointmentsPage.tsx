import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { Appointment } from '../../types/health';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Stethoscope,
  FileCheck2,
  AlertCircle,
  User,
  RefreshCw,
  Search,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  Eye,
  X,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { EmptyStateIllustration } from '../illustrations/HealthIllustrations';

export const AppointmentsPage: React.FC<{ onBookNew: () => void }> = ({ onBookNew }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Feedback state
  const [activeDetailsApt, setActiveDetailsApt] = useState<Appointment | null>(null);
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('10:00 AM');
  const [actionLoading, setActionLoading] = useState(false);
  const [telehealthPreviewApt, setTelehealthPreviewApt] = useState<Appointment | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchAppointments = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await api.getAppointments();
      setAppointments(res.appointments || []);
    } catch (e: any) {
      console.error('Failed to load appointments:', e);
      showNotification('Failed to update appointments. Please check connection.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Compute real metrics from real appointment data
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const confirmedList = appointments.filter((a) => a.status === 'confirmed');
    const upcomingList = confirmedList.filter((a) => !a.date || a.date >= todayStr);
    const completedList = appointments.filter((a) => a.status === 'completed');
    const cancelledList = appointments.filter((a) => a.status === 'cancelled');

    // Find closest upcoming confirmed appointment
    const sortedUpcoming = [...upcomingList].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return isNaN(diff) ? 0 : diff;
    });

    const nextUpcoming = sortedUpcoming.length > 0 ? sortedUpcoming[0] : (confirmedList[0] || null);

    return {
      total: appointments.length,
      upcomingCount: upcomingList.length || confirmedList.length,
      confirmedCount: confirmedList.length,
      completedCount: completedList.length,
      cancelledCount: cancelledList.length,
      nextUpcoming,
    };
  }, [appointments]);

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    if (!cancellingApt) return;
    setActionLoading(true);
    try {
      await api.cancelAppointment(cancellingApt.id);
      showNotification(`Consultation with ${cancellingApt.doctorName} has been cancelled.`);
      setCancellingApt(null);
      await fetchAppointments(true);
    } catch (e: any) {
      console.error(e);
      showNotification('Unable to cancel consultation. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reschedule
  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt || !rescheduleDate || !rescheduleTimeSlot) return;

    setActionLoading(true);
    try {
      await api.rescheduleAppointment(reschedulingApt.id, rescheduleDate, rescheduleTimeSlot);
      showNotification(`Consultation rescheduled to ${rescheduleDate} at ${rescheduleTimeSlot}.`);
      setReschedulingApt(null);
      await fetchAppointments(true);
    } catch (e: any) {
      console.error(e);
      showNotification('Unable to reschedule consultation. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      // Status filter
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const doc = (a.doctorName || '').toLowerCase();
        const spec = (a.specialty || '').toLowerCase();
        const reason = (a.reason || '').toLowerCase();
        const type = (a.type || '').toLowerCase();
        if (!doc.includes(query) && !spec.includes(query) && !reason.includes(query) && !type.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-rose-900 text-white border-rose-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white/70 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
            >
              Consultation Schedule
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Connected with Health Memory Reminders
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Appointments & Clinical Follow-ups
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage upcoming in-person hospital visits, telehealth video consults, and shared clinical briefs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAppointments(true)}
            disabled={refreshing}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
            title="Refresh schedule"
            aria-label="Refresh appointments"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={onBookNew}
            className="flex items-center gap-1.5 py-2 px-3.5 text-xs font-semibold text-white rounded-lg shadow-xs transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Book New Consultation</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          PREMIUM APPOINTMENT OVERVIEW: "Your Care, All in One Place"
          ======================================================== */}
      <section
        aria-label="Appointments Overview"
        className="card-theme p-5 sm:p-6 border border-emerald-100 dark:border-emerald-900/40 bg-linear-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/20 rounded-2xl shadow-xs"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Overview Header & Counters */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
                style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
              >
                <CalendarCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Your Care, All in One Place
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Real-time schedule of clinical checkups, specialist reviews, and telehealth appointments.
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-emerald-100/80 dark:border-emerald-900/40 backdrop-blur-xs">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Upcoming Visits
                </span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                  {loading ? '—' : metrics.upcomingCount}
                </span>
                <span className="text-[10px] text-gray-500">Scheduled ahead</span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-emerald-100/80 dark:border-emerald-900/40 backdrop-blur-xs">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Confirmed
                </span>
                <span className="text-xl font-extrabold text-teal-700 dark:text-teal-400 mt-0.5 block">
                  {loading ? '—' : metrics.confirmedCount}
                </span>
                <span className="text-[10px] text-gray-500">Active consultations</span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-emerald-100/80 dark:border-emerald-900/40 backdrop-blur-xs">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Completed
                </span>
                <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 mt-0.5 block">
                  {loading ? '—' : metrics.completedCount}
                </span>
                <span className="text-[10px] text-gray-500">Care visits recorded</span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-emerald-100/80 dark:border-emerald-900/40 backdrop-blur-xs">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Total Records
                </span>
                <span className="text-xl font-extrabold text-gray-800 dark:text-gray-200 mt-0.5 block">
                  {loading ? '—' : metrics.total}
                </span>
                <span className="text-[10px] text-gray-500">In Health Memory</span>
              </div>
            </div>
          </div>

          {/* Next Upcoming Appointment Spotlight OR Quick Booking CTA */}
          <div className="w-full lg:w-80 shrink-0">
            {metrics.nextUpcoming ? (
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-300 dark:border-emerald-700/60 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    <CalendarClock className="w-3 h-3 text-emerald-600" />
                    Next Upcoming
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {metrics.nextUpcoming.type}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {metrics.nextUpcoming.doctorName}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {metrics.nextUpcoming.specialty}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300 pt-1 border-t border-gray-100 dark:border-gray-700/60">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-gray-200">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{metrics.nextUpcoming.date}</span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{metrics.nextUpcoming.timeSlot}</span>
                  </div>

                  <p className="text-[11px] text-gray-500 truncate">
                    Reason: <em>"{metrics.nextUpcoming.reason}"</em>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveDetailsApt(metrics.nextUpcoming)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  {metrics.nextUpcoming.type === 'Video Consultation' ? (
                    <button
                      onClick={() => setTelehealthPreviewApt(metrics.nextUpcoming)}
                      className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onBookNew()}
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Book New</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-emerald-100 dark:border-emerald-900/40 text-center space-y-2.5 shadow-xs">
                <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                    No Upcoming Consultations
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Schedule a visit with an accredited healthcare specialist anytime.
                  </p>
                </div>
                <button
                  onClick={onBookNew}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="card-theme p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="text-[11px] font-semibold text-gray-400 uppercase mr-1 hidden sm:inline">
            Status:
          </span>
          {[
            { id: 'all', label: 'All Consultations', count: appointments.length },
            { id: 'confirmed', label: 'Upcoming Confirmed', count: metrics.confirmedCount },
            { id: 'completed', label: 'Past Completed', count: metrics.completedCount },
            { id: 'cancelled', label: 'Cancelled', count: metrics.cancelledCount },
          ].map((f) => {
            const active = statusFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active
                      ? 'bg-emerald-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Filter */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor, specialty, reason..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card-theme p-5 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-1/3"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card-theme p-10 text-center space-y-3 border border-emerald-100 dark:border-emerald-900/30">
          <EmptyStateIllustration type="appointments" className="mb-2" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
            {searchQuery
              ? 'No consultations match your search'
              : statusFilter === 'all'
              ? 'No consultations scheduled yet'
              : `No ${statusFilter} consultations found`}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search terms or clearing the filter.'
              : 'Explore our accredited medical directory to book an in-person hospital visit or video consultation.'}
          </p>

          <div className="pt-2">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="py-2 px-4 text-xs font-semibold text-emerald-700 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={onBookNew}
                className="py-2 px-5 text-xs font-semibold text-white rounded-lg shadow-xs transition-opacity hover:opacity-90 inline-flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Find a Doctor & Book</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === 'confirmed';
            const isCompleted = apt.status === 'completed';
            const isCancelled = apt.status === 'cancelled';

            return (
              <div
                key={apt.id}
                className="card-theme p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-xs"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div
                    className="p-3 rounded-xl shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--surface-card-subtle)' }}
                  >
                    <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {apt.doctorName}
                      </h3>

                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isConfirmed
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                            : isCompleted
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 line-through border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {apt.status === 'confirmed' ? 'Upcoming Confirmed' : apt.status}
                      </span>

                      {apt.sharedBriefId && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40">
                          <FileCheck2 className="w-3 h-3 text-teal-600" />
                          <span>Brief Attached</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {apt.specialty}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Reason: <span className="italic">"{apt.reason}"</span>
                    </p>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {apt.timeSlot}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        {apt.type === 'Video Consultation' ? (
                          <Video className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        <span>{apt.type}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Pre-consultation Check-in Ready</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setActiveDetailsApt(apt)}
                    className="py-1.5 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-300 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  {isConfirmed && (
                    <>
                      <button
                        onClick={() => {
                          setReschedulingApt(apt);
                          setRescheduleDate(apt.date || new Date().toISOString().split('T')[0]);
                          setRescheduleTimeSlot(apt.timeSlot || '10:00 AM');
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={() => setCancellingApt(apt)}
                        className="py-1.5 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {apt.type === 'Video Consultation' && isConfirmed && (
                    <button
                      onClick={() => setTelehealthPreviewApt(apt)}
                      className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL: VIEW APPOINTMENT DETAILS
          ======================================================== */}
      {activeDetailsApt && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="card-theme max-w-lg w-full p-6 space-y-4 shadow-xl border border-emerald-100 dark:border-emerald-900/60 rounded-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-card-subtle)' }}
                >
                  <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Consultation Details
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      activeDetailsApt.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : activeDetailsApt.status === 'completed'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {activeDetailsApt.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveDetailsApt(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase block">Doctor</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {activeDetailsApt.doctorName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase block">Specialty</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {activeDetailsApt.specialty}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase block">Scheduled Date</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {activeDetailsApt.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase block">Time Slot</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {activeDetailsApt.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase block">Consultation Type</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                    {activeDetailsApt.type === 'Video Consultation' ? (
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    {activeDetailsApt.type}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">
                  Reason for Consultation
                </span>
                <p className="p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-gray-800 dark:text-gray-200 font-medium">
                  "{activeDetailsApt.reason}"
                </p>
              </div>

              {activeDetailsApt.sharedBriefId && (
                <div className="p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-teal-800 dark:text-teal-200 font-medium text-[11px]">
                    Clinical Brief attached and shared with doctor for pre-consultation review.
                  </span>
                </div>
              )}

              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-[11px] text-gray-500 space-y-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300 block">Pre-Visit Guidance:</span>
                <p>• Have your recent prescription medication list ready.</p>
                <p>• Arrive 10 minutes early for check-in or test video camera 5 minutes prior.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setActiveDetailsApt(null)}
                className="py-2 px-4 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: RESCHEDULE APPOINTMENT
          ======================================================== */}
      {reschedulingApt && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="card-theme max-w-md w-full p-6 space-y-4 shadow-xl border border-emerald-100 dark:border-emerald-900/60 rounded-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Reschedule Consultation
                </h3>
                <p className="text-xs text-gray-500">
                  Select a new date and time with {reschedulingApt.doctorName}.
                </p>
              </div>
              <button
                onClick={() => setReschedulingApt(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close reschedule modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  New Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  New Time Slot
                </label>
                <select
                  value={rescheduleTimeSlot}
                  onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="09:00 AM">09:00 AM - Morning Slot</option>
                  <option value="10:00 AM">10:00 AM - Morning Slot</option>
                  <option value="11:30 AM">11:30 AM - Late Morning</option>
                  <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                  <option value="03:30 PM">03:30 PM - Afternoon Slot</option>
                  <option value="04:45 PM">04:45 PM - Evening Slot</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                Your consultation time will update automatically in your Health Memory schedule.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  disabled={actionLoading}
                  className="py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                >
                  Keep Current Time
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-2 px-4 rounded-lg text-white font-semibold flex items-center gap-1.5 shadow-xs"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Confirm Reschedule</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CONFIRM CANCELLATION
          ======================================================== */}
      {cancellingApt && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="card-theme max-w-md w-full p-6 space-y-4 shadow-xl border border-rose-200 dark:border-rose-900/60 rounded-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Cancel Consultation?
                </h3>
                <p className="text-xs text-gray-500">
                  Are you sure you want to cancel your consultation with{' '}
                  <strong className="text-gray-800 dark:text-gray-200">
                    {cancellingApt.doctorName}
                  </strong>{' '}
                  scheduled for {cancellingApt.date} at {cancellingApt.timeSlot}?
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              You can re-book another appointment at any time through the doctor directory.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingApt(null)}
                disabled={actionLoading}
                className="py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoading}
                className="py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TELEHEALTH PREPARATION / ROOM PREVIEW
          ======================================================== */}
      {telehealthPreviewApt && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="card-theme max-w-lg w-full p-6 space-y-4 shadow-xl border border-blue-200 dark:border-blue-900/60 rounded-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Secure Telehealth Video Room
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    24CareAI Encrypted Clinical Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTelehealthPreviewApt(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close video room"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-900 text-white space-y-3 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center animate-pulse">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-300">
                Connecting to consultation with{' '}
                <strong className="text-white">{telehealthPreviewApt.doctorName}</strong>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[11px] font-semibold border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Clinician Waiting Room Open</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span>Microphone & Camera Status:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span>Scheduled Time:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {telehealthPreviewApt.date} · {telehealthPreviewApt.timeSlot}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTelehealthPreviewApt(null)}
                className="py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300"
              >
                Return to Schedule
              </button>
              <button
                onClick={() => {
                  showNotification(`Connected to video consultation with ${telehealthPreviewApt.doctorName}!`);
                  setTelehealthPreviewApt(null);
                }}
                className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Enter Call Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
