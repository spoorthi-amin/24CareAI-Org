import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Appointment, PatientBrief } from '../../types/health';
import { User } from '../../types/auth';
import {
  Stethoscope,
  Users,
  Calendar,
  FileCheck,
  FileText,
  Clock,
  CheckCircle2,
  Video,
  MapPin,
  ClipboardList,
  AlertCircle,
  Eye,
  Save,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const [workspace, setWorkspace] = useState<{
    doctor: any;
    appointments: Appointment[];
    patients: any[];
    briefs: PatientBrief[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedBrief, setSelectedBrief] = useState<PatientBrief | null>(null);

  // Clinical notes state
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const res = await api.getDoctorWorkspace();
      setWorkspace(res);
      if (res.briefs && res.briefs.length > 0) {
        setSelectedBrief(res.briefs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    await api.updateAppointmentStatus(id, status);
    fetchWorkspace();
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNote(true);
    try {
      await api.updateAppointmentStatus(id, 'completed', clinicalNotes);
      setSavingNote(false);
      setNoteSuccess(true);
      fetchWorkspace();
      setTimeout(() => {
        setNoteSuccess(false);
        setActiveAppointmentId(null);
        setClinicalNotes('');
      }, 1500);
    } catch (e) {
      console.error(e);
      setSavingNote(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card-theme p-6 bg-gradient-to-r from-blue-500/10 via-emerald-500/5 to-transparent border-blue-200/80 dark:border-blue-900/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Doctor Clinical Workspace
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">License: KMC-74892</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {workspace?.doctor?.name || 'Dr. Rajesh K., MD'}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {workspace?.doctor?.specialty || 'Internal Medicine & Pulmonology'} · Apollo Cradle & Hospital Clinic
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
              <span className="text-[10px] text-gray-400 block uppercase">Scheduled Visits</span>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {workspace?.appointments?.length || 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
              <span className="text-[10px] text-gray-400 block uppercase">Roster Patients</span>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {workspace?.patients?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Appointments Roster */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-theme p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Patient Consultation Schedule ({workspace?.appointments?.length || 0})
            </h3>

            {loading ? (
              <p className="text-xs text-gray-400">Loading clinical schedule...</p>
            ) : workspace?.appointments?.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No scheduled patients on today's roster.</p>
            ) : (
              <div className="space-y-3">
                {workspace?.appointments?.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-2.5 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          {apt.patientName}
                        </h4>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                          Reason: {apt.reason}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{apt.date}</span>
                      <span>·</span>
                      <span>{apt.timeSlot}</span>
                      <span>·</span>
                      <span>{apt.type}</span>
                    </div>

                    {/* Actions and Consultation Notes Toggle */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
                      {activeAppointmentId === apt.id ? (
                        <div className="w-full space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={clinicalNotes}
                            onChange={(e) => setClinicalNotes(e.target.value)}
                            placeholder="Enter clinical examination notes, prescription, and follow-up plan..."
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-transparent text-gray-900 dark:text-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setActiveAppointmentId(null)}
                              className="py-1 px-2.5 rounded-md border border-gray-300 text-gray-600 dark:text-gray-300 text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(apt.id)}
                              disabled={savingNote}
                              className="py-1 px-3 rounded-md bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>{savingNote ? 'Saving...' : 'Save & Complete'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setActiveAppointmentId(apt.id);
                              setClinicalNotes(apt.notes || '');
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>{apt.notes ? 'Edit Clinical Notes' : 'Add Consultation Notes'}</span>
                          </button>

                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'completed')}
                              className="text-xs text-emerald-600 hover:underline"
                            >
                              Mark Completed
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Shared AI Patient Consultation Briefs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-theme p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Shared Patient Consultation Briefs ({workspace?.briefs?.length || 0})
            </h3>

            {workspace?.briefs?.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No patient consultation briefs shared yet.</p>
            ) : selectedBrief ? (
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-gray-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                      Patient SBAR Brief
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedBrief.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Patient: <strong>{selectedBrief.patientName}</strong> · Code: {selectedBrief.shareCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/60">
                    <strong className="block text-gray-500 text-[10px] uppercase">Reason for Consultation</strong>
                    <p className="text-gray-900 dark:text-gray-100">{selectedBrief.reasonForVisit}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/60">
                    <strong className="block text-gray-500 text-[10px] uppercase">Symptom Timeline</strong>
                    <p className="text-gray-800 dark:text-gray-200">{selectedBrief.symptomsSummary}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-200">
                    <strong className="block text-rose-700 dark:text-rose-300 text-[10px] uppercase">Allergies</strong>
                    <p>{selectedBrief.allergies?.join(', ') || 'None recorded'}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200">
                    <strong className="block text-emerald-700 dark:text-emerald-300 text-[10px] uppercase">Active Medications</strong>
                    <p>{selectedBrief.currentMedications?.join(', ') || 'None recorded'}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/60">
                    <strong className="block text-gray-500 text-[10px] uppercase">Questions Patient Asks</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-800 dark:text-gray-200">
                      {selectedBrief.questionsForDoctor?.map((q, idx) => (
                        <li key={idx}>"{q}"</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
