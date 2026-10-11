import { HealthRecord, MedicalReport, PatientBrief, Appointment, TriageResult, Doctor, Facility, EmergencyContact, AuditLog } from '../types/health';

function getHeaders() {
  const token = localStorage.getItem('24care_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Health Memory
  async getHealthMemory(patientId?: string): Promise<{ records: HealthRecord[] }> {
    const query = patientId ? `?patientId=${patientId}` : '';
    const res = await fetch(`/api/health-memory${query}`, { headers: getHeaders() });
    return res.json();
  },

  async createHealthRecord(data: Partial<HealthRecord>): Promise<{ record: HealthRecord }> {
    const res = await fetch('/api/health-memory', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateHealthRecord(id: string, data: Partial<HealthRecord>): Promise<{ record: HealthRecord }> {
    const res = await fetch(`/api/health-memory/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteHealthRecord(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/health-memory/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Triage
  async assessSymptoms(payload: {
    symptoms: string;
    duration?: string;
    severity?: number;
    onset?: string;
    factors?: string;
    age?: number;
    chronicHistory?: string[];
    allergies?: string[];
    saveToMemory?: boolean;
  }): Promise<TriageResult> {
    const res = await fetch('/api/triage/assess', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Reports
  async getReports(patientId?: string): Promise<{ reports: MedicalReport[] }> {
    const query = patientId ? `?patientId=${patientId}` : '';
    const res = await fetch(`/api/reports${query}`, { headers: getHeaders() });
    return res.json();
  },

  async analyzeReport(payload: {
    title: string;
    reportType?: string;
    fileName?: string;
    fileSize?: string;
    base64Data?: string;
    rawText?: string;
    saveToMemory?: boolean;
  }): Promise<{ report: MedicalReport }> {
    const res = await fetch('/api/reports/analyze', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteReport(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Consultation Brief
  async getBriefs(): Promise<{ briefs: PatientBrief[] }> {
    const res = await fetch('/api/briefs', { headers: getHeaders() });
    return res.json();
  },

  async generateBrief(payload: {
    reasonForVisit: string;
    currentSymptoms?: string;
    selectedRecordIds?: string[];
    customQuestions?: string[];
  }): Promise<{ brief: PatientBrief }> {
    const res = await fetch('/api/brief/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getSharedBrief(code: string): Promise<{ brief: PatientBrief }> {
    const res = await fetch(`/api/brief/share/${code}`);
    return res.json();
  },

  // Directory
  async getDoctors(filter?: { specialty?: string; mode?: string; search?: string }): Promise<{ doctors: Doctor[] }> {
    const params = new URLSearchParams();
    if (filter?.specialty) params.append('specialty', filter.specialty);
    if (filter?.mode) params.append('mode', filter.mode);
    if (filter?.search) params.append('search', filter.search);
    const res = await fetch(`/api/directory/doctors?${params.toString()}`);
    return res.json();
  },

  async getFacilities(filter?: { specialty?: string; emergencyOnly?: boolean; search?: string }): Promise<{ facilities: Facility[] }> {
    const params = new URLSearchParams();
    if (filter?.specialty) params.append('specialty', filter.specialty);
    if (filter?.emergencyOnly) params.append('emergencyOnly', 'true');
    if (filter?.search) params.append('search', filter.search);
    const res = await fetch(`/api/directory/facilities?${params.toString()}`);
    return res.json();
  },

  // Appointments
  async getAppointments(): Promise<{ appointments: Appointment[] }> {
    const res = await fetch('/api/appointments', { headers: getHeaders() });
    return res.json();
  },

  async bookAppointment(payload: Partial<Appointment>): Promise<{
    appointment: Appointment;
    supabase?: { synced: boolean; projectId: string; table: string; error: string | null };
  }> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    return result;
  },

  async getSupabaseStatus(): Promise<{
    configured: boolean;
    projectId: string;
    url: string;
    table: string;
    tableAccessible: boolean;
    tableError: string | null;
    rowCount: number;
    sqlSetup: string;
  }> {
    const res = await fetch('/api/supabase/status');
    return res.json();
  },

  async syncAllToSupabase(): Promise<{
    success: boolean;
    total: number;
    synced: number;
    failed: number;
    errors: string[];
  }> {
    const res = await fetch('/api/supabase/sync-all', {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  async cancelAppointment(id: string): Promise<{ appointment: Appointment }> {
    const res = await fetch(`/api/appointments/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return res.json();
  },

  async rescheduleAppointment(id: string, date: string, timeSlot: string): Promise<{ appointment: Appointment }> {
    const res = await fetch(`/api/appointments/${id}/reschedule`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ date, timeSlot }),
    });
    return res.json();
  },

  async updateAppointmentStatus(id: string, status: string, notes?: string): Promise<{ appointment: Appointment }> {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return res.json();
  },

  // Emergency SOS
  async getEmergencyContacts(): Promise<{ contacts: EmergencyContact[] }> {
    const res = await fetch('/api/emergency/contacts', { headers: getHeaders() });
    return res.json();
  },

  async addEmergencyContact(data: Partial<EmergencyContact>): Promise<{ contact: EmergencyContact }> {
    const res = await fetch('/api/emergency/contacts', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteEmergencyContact(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/emergency/contacts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  async triggerEmergencySos(payload: {
    locationLat?: number;
    locationLng?: number;
    manualAddress?: string;
    emergencyType?: string;
  }): Promise<any> {
    const res = await fetch('/api/emergency/sos-trigger', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Doctor Workspace
  async getDoctorWorkspace(): Promise<{
    doctor: any;
    appointments: Appointment[];
    patients: any[];
    briefs: PatientBrief[];
  }> {
    const res = await fetch('/api/doctor/workspace', { headers: getHeaders() });
    return res.json();
  },

  // Admin Overview
  async getAdminOverview(): Promise<{
    stats: any;
    users: any[];
    facilities: Facility[];
    recentAuditLogs: AuditLog[];
  }> {
    const res = await fetch('/api/admin/overview', { headers: getHeaders() });
    return res.json();
  },

  // Export Data
  exportDataUrl(): string {
    return '/api/user/export-data';
  },

  async deleteAccount(): Promise<{ message: string }> {
    const res = await fetch('/api/user/account', {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },
};
