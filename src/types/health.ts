export interface HealthRecord {
  id: string;
  userId: string;
  type: 'condition' | 'allergy' | 'medication' | 'report' | 'assessment' | 'note' | 'instruction';
  title: string;
  date: string;
  details: string;
  tags?: string[];
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  status?: 'active' | 'resolved' | 'monitoring' | 'discontinued';
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  userId: string;
  title: string;
  date: string;
  reportType: 'Blood Test' | 'Radiology / X-Ray' | 'Prescription' | 'Pathology' | 'Discharge Summary' | 'Other';
  fileName: string;
  fileSize?: string;
  extractedText: string;
  aiSummary: string;
  keyParameters: Array<{
    name: string;
    value: string;
    range: string;
    status: 'Normal' | 'High' | 'Low' | 'Abnormal' | 'Borderline';
  }>;
  doctorQuestions: string[];
  isSample?: boolean;
  createdAt: string;
}

export interface PatientBrief {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  date: string;
  reasonForVisit: string;
  symptomsSummary: string;
  relevantHistory: string;
  allergies: string[];
  currentMedications: string[];
  keyLabFindings: string;
  questionsForDoctor: string[];
  clinicianNotes?: string;
  shareCode?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  timeSlot: string;
  type: 'In-person' | 'Video Consultation' | 'Emergency Follow-up';
  reason: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  sharedBriefId?: string;
  notes?: string;
  createdAt: string;
  supabaseSynced?: boolean;
  supabaseError?: string;
}

export interface TriageResult {
  isEmergency: boolean;
  triageLevel: 'EMERGENCY_IMMEDIATE' | 'URGENT_SAME_DAY' | 'ROUTINE_PRIMARY_CARE' | 'SELF_CARE_MONITOR';
  urgencyBadge: string;
  emergencyAction?: string;
  redFlagReason?: string;
  summary: string;
  considerations: string[];
  redFlagWarnings?: string[];
  selfCareAdvice: string[];
  recommendedSpecialist: string;
  followUpQuestions: string[];
  disclaimer: string;
  fallbackNotice?: string;
}

export interface Doctor {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  experienceYears: number;
  facilityName: string;
  consultationFee: number;
  languages: string[];
  rating: number;
  consultationModes: string[];
  availableDays: string[];
  availableTimeSlots: string[];
  about: string;
  isSample: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  area: string;
  distanceKm: number;
  phone: string;
  emergency24x7: boolean;
  icuAvailable: boolean;
  rating: number;
  specialties: string[];
  isSample: boolean;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relation: string;
  phone: string;
  notifyOnSos: boolean;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  category: 'AUTH' | 'TRIAGE' | 'REPORT' | 'EMERGENCY' | 'DATA_ACCESS' | 'ADMIN';
  details: string;
  ip?: string;
  timestamp: string;
}
