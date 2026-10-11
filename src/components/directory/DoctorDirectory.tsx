import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Doctor, Facility, PatientBrief } from '../../types/health';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Video,
  Building,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  X,
  Stethoscope,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { saveAppointmentDirectlyToSupabase } from '../../services/supabase';

export const DoctorDirectory: React.FC<{
  initialSpecialty?: string;
  onAppointmentBooked?: () => void;
}> = ({ initialSpecialty, onAppointmentBooked }) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'facilities'>('doctors');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState(initialSpecialty || 'all');
  const [modeFilter, setModeFilter] = useState('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Location handling
  const [userLocation, setUserLocation] = useState<string>('Bengaluru Central (Detected)');
  const [detectingLoc, setDetectingLoc] = useState(false);

  // Booking Modal
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [bookingMode, setBookingMode] = useState<'In-person' | 'Video Consultation'>('In-person');
  const [bookingReason, setBookingReason] = useState('');
  const [briefs, setBriefs] = useState<PatientBrief[]>([]);
  const [selectedBriefId, setSelectedBriefId] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const [docRes, facRes, briefsRes] = await Promise.all([
        api.getDoctors({
          specialty: specialtyFilter !== 'all' ? specialtyFilter : undefined,
          mode: modeFilter !== 'all' ? modeFilter : undefined,
          search: searchQuery || undefined,
        }),
        api.getFacilities({
          specialty: specialtyFilter !== 'all' ? specialtyFilter : undefined,
          emergencyOnly: emergencyOnly,
          search: searchQuery || undefined,
        }),
        api.getBriefs(),
      ]);
      setDoctors(docRes.doctors || []);
      setFacilities(facRes.facilities || []);
      setBriefs(briefsRes.briefs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, [specialtyFilter, modeFilter, emergencyOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDirectory();
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLoc(false);
        setUserLocation(`Lat ${pos.coords.latitude.toFixed(2)}, Lng ${pos.coords.longitude.toFixed(2)} (GPS)`);
      },
      () => {
        setDetectingLoc(false);
        setUserLocation('Bengaluru Urban, Karnataka (Manual fallback)');
      }
    );
  };

  const handleOpenBooking = (doc: Doctor) => {
    setBookingDoctor(doc);
    setBookingTimeSlot(doc.availableTimeSlots[0] || '10:00 AM');
    setBookingMode((doc.consultationModes[0] as any) || 'In-person');
    setBookingReason(`Consultation for ${doc.specialty}`);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;

    setBookingLoading(true);
    try {
      const res = await api.bookAppointment({
        doctorId: bookingDoctor.id,
        doctorName: bookingDoctor.name,
        specialty: bookingDoctor.specialty,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        type: bookingMode,
        reason: bookingReason,
        sharedBriefId: selectedBriefId || undefined,
      });

      // Silently sync to Supabase in the background
      if (res?.appointment) {
        try {
          await saveAppointmentDirectlyToSupabase(res.appointment);
        } catch {
          // Silent fallback - server and local records intact
        }
      }

      setBookingLoading(false);
      setBookingSuccess(true);
    } catch (e: any) {
      console.error(e);
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
            >
              Verified Healthcare Providers
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Accredited Medical Network</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor & Facility Directory</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Discover accredited clinicians, hospitals, emergency trauma units, and digital consultation specialists.
          </p>
        </div>

        {/* Location selector */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <input
              type="text"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="bg-transparent border-none text-xs text-gray-800 dark:text-gray-200 focus:outline-hidden w-48"
              placeholder="Enter your location..."
            />
          </div>
          <button
            onClick={handleDetectLocation}
            disabled={detectingLoc}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Auto-detect GPS location"
          >
            <Navigation className={`w-3.5 h-3.5 ${detectingLoc ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Directory Tabs and Search Filter Bar */}
      <div className="card-theme p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`py-1.5 px-4 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'doctors'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Consulting Physicians ({doctors.length})
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`py-1.5 px-4 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'facilities'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hospitals & Trauma Units ({facilities.length})
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, specialty, or facility..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
            />
          </form>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Specialty:</span>
          {['all', 'Pulmonology', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology'].map((s) => (
            <button
              key={s}
              onClick={() => setSpecialtyFilter(s)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                specialtyFilter === s
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All Specialties' : s}
            </button>
          ))}

          {activeTab === 'doctors' ? (
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-semibold text-gray-400 uppercase">Mode:</span>
              {['all', 'In-person', 'Video Consultation'].map((m) => (
                <button
                  key={m}
                  onClick={() => setModeFilter(m)}
                  className={`py-0.5 px-2 rounded-md text-[11px] font-medium transition-colors ${
                    modeFilter === m ? 'border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {m === 'all' ? 'Any' : m}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="checkbox"
                id="emergency-only-filter"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="rounded-sm border-gray-300 text-rose-600"
              />
              <label htmlFor="emergency-only-filter" className="text-xs text-rose-600 dark:text-rose-400 font-medium cursor-pointer">
                24x7 Emergency Trauma Only
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card-theme p-6 animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/3"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-sm w-1/2"></div>
            </div>
          ))}
        </div>
      ) : activeTab === 'doctors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="card-theme p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {doc.name}
                      </h3>
                      {doc.isSample && (
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.2 rounded-sm">
                          Sample Clinician
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-gray-400 block">{doc.degree}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-md text-xs font-bold text-amber-700 dark:text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {doc.about}
                </p>

                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{doc.facilityName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{doc.experienceYears} years clinical experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Modes: {doc.consultationModes.join(' · ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Consultation Fee</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    ₹{doc.consultationFee}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenBooking(doc)}
                  className="py-2 px-4 rounded-lg text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="card-theme p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {fac.name}
                      </h3>
                      {fac.isSample && (
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.2 rounded-sm">
                          Sample Facility
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 block">{fac.type}</span>
                  </div>

                  {fac.emergency24x7 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      24/7 Trauma Care
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{fac.area} ({fac.distanceKm} km away)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Direct: {fac.phone}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
                    Departments:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {fac.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <a
                  href={`tel:${fac.phone}`}
                  className="py-1.5 px-3 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Facility
                </a>
                <button
                  onClick={() => alert(`Directions initiated for ${fac.name} via GPS.`)}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg card-theme p-6 shadow-2xl relative"
            style={{ backgroundColor: 'var(--surface-card)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Book Consultation Appointment
                </h2>
                <p className="text-xs text-gray-500">
                  With {bookingDoctor.name} ({bookingDoctor.specialty})
                </p>
              </div>
              <button
                onClick={() => setBookingDoctor(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Consultation Booked Successfully
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                    Your appointment with <span className="font-semibold text-gray-900 dark:text-white">{bookingDoctor.name}</span> has been confirmed.
                  </p>
                </div>

                {/* Consultation Details Card */}
                <div className="max-w-md mx-auto text-left rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/40 bg-linear-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/10 space-y-3 text-xs shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                      Consultation Overview
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] font-medium uppercase tracking-wider">Date & Time</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {bookingDate} · {bookingTimeSlot}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-medium uppercase tracking-wider">Consultation Type</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                        {bookingMode === 'Video Consultation' ? (
                          <Video className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        {bookingMode}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-medium uppercase tracking-wider">Specialty</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate">
                        {bookingDoctor.specialty}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-medium uppercase tracking-wider">Hospital / Facility</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate">
                        {bookingDoctor.facilityName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>A calendar reminder and clinical preparation instructions have been added to your Health Memory.</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setBookingDoctor(null);
                      if (onAppointmentBooked) onAppointmentBooked();
                    }}
                    className="py-2.5 px-6 rounded-xl text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    View Appointments
                  </button>
                  <button
                    onClick={() => setBookingDoctor(null)}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 pt-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Available Time Slot
                    </label>
                    <select
                      value={bookingTimeSlot}
                      onChange={(e) => setBookingTimeSlot(e.target.value)}
                      className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {bookingDoctor.availableTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Consultation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingDoctor.consultationModes.map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setBookingMode(m as any)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-colors ${
                          bookingMode === m
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold'
                            : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Reason for Consultation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    placeholder="e.g. Wheezing symptoms and winter medication review"
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                  />
                </div>

                {briefs.length > 0 && (
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                      Attach AI Patient Consultation Brief (Optional)
                    </label>
                    <select
                      value={selectedBriefId}
                      onChange={(e) => setSelectedBriefId(e.target.value)}
                      className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Do not attach brief</option>
                      {briefs.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} ({b.date})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-500">
                  Consultation Fee: <strong>₹{bookingDoctor.consultationFee}</strong> (Payable at facility or via telehealth link).
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setBookingDoctor(null)}
                    className="py-2 px-3 text-xs border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="py-2 px-4 text-xs font-semibold text-white rounded-lg shadow-xs"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {bookingLoading ? 'Confirming...' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
