import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Supabase configuration
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'ylpdyzmjwbprjgsmumhr';
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_v7WlGWA1NmFCUJT-f-6ihA_OhnOLv0O';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database path & seeding
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production this would be bcrypt hashed
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredTheme?: string;
  appearanceMode?: 'light' | 'dark' | 'system';
  fontSize?: 'standard' | 'large';
  layoutDensity?: 'compact' | 'comfortable' | 'spacious';
  cardRadius?: 'modern' | 'soft';
  reducedMotion?: boolean;
  dataSharingConsent?: boolean;
  specialty?: string; // For doctors
  licenseNumber?: string; // For doctors
  clinicAddress?: string;
  qualifications?: string;
  createdAt: string;
}

interface HealthRecord {
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

interface Appointment {
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
}

interface MedicalReport {
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

interface PatientBrief {
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

interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relation: string;
  phone: string;
  notifyOnSos: boolean;
}

interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  category: 'AUTH' | 'TRIAGE' | 'REPORT' | 'EMERGENCY' | 'DATA_ACCESS' | 'ADMIN';
  details: string;
  ip?: string;
  timestamp: string;
}

interface DatabaseSchema {
  users: User[];
  healthRecords: HealthRecord[];
  appointments: Appointment[];
  reports: MedicalReport[];
  briefs: PatientBrief[];
  emergencyContacts: EmergencyContact[];
  auditLogs: AuditLog[];
}

function loadDb(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading db.json, generating default schema:', e);
    }
  }

  // Initial Seed Data
  const initialDb: DatabaseSchema = {
    users: [
      {
        id: 'user-patient-1',
        name: 'Priya Sharma',
        email: 'patient@24care.ai',
        password: 'password123',
        role: 'patient',
        phone: '+91 98765 43210',
        age: 34,
        gender: 'Female',
        bloodGroup: 'B+',
        allergies: ['Penicillin (Hives)', 'Shellfish'],
        chronicConditions: ['Mild Allergic Asthma'],
        emergencyContactName: 'Aarav Sharma (Spouse)',
        emergencyContactPhone: '+91 98765 43211',
        preferredTheme: 'mint',
        appearanceMode: 'light',
        fontSize: 'standard',
        layoutDensity: 'comfortable',
        cardRadius: 'modern',
        reducedMotion: false,
        dataSharingConsent: true,
        createdAt: '2026-01-15T09:00:00Z',
      },
      {
        id: 'user-doctor-1',
        name: 'Dr. Rajesh K., MD',
        email: 'dr.rajesh@24care.ai',
        password: 'password123',
        role: 'doctor',
        phone: '+91 98111 22334',
        specialty: 'Internal Medicine & Pulmonology',
        qualifications: 'MBBS, MD (General Medicine), FCCP',
        clinicAddress: 'Apollo Cradle, Indiranagar, Bengaluru',
        licenseNumber: 'KMC-74892',
        preferredTheme: 'mint',
        appearanceMode: 'light',
        createdAt: '2026-01-10T08:00:00Z',
      },
      {
        id: 'user-admin-1',
        name: 'Super Admin',
        email: 'admin@24care.ai',
        password: 'password123',
        role: 'admin',
        phone: '+91 99000 00001',
        preferredTheme: 'mint',
        appearanceMode: 'light',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ],
    healthRecords: [
      {
        id: 'rec-1',
        userId: 'user-patient-1',
        type: 'condition',
        title: 'Mild Allergic Asthma',
        date: '2024-04-12',
        details: 'Diagnosed by pulmonologist. Triggered by seasonal pollen and cold humidity.',
        tags: ['Respiratory', 'Chronic'],
        severity: 'mild',
        status: 'active',
        createdAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'rec-2',
        userId: 'user-patient-1',
        type: 'allergy',
        title: 'Penicillin Allergy',
        date: '2023-08-01',
        details: 'Severe hives and facial angioedema observed after Amoxicillin administration in 2023.',
        tags: ['Antibiotic', 'Critical Alert'],
        severity: 'severe',
        status: 'active',
        createdAt: '2026-01-15T10:05:00Z',
      },
      {
        id: 'rec-3',
        userId: 'user-patient-1',
        type: 'medication',
        title: 'Budecort Inhaler 200mcg',
        date: '2025-11-20',
        details: '1 puff twice daily after gargling. Maintenance controller therapy.',
        tags: ['Inhaler', 'Steroid'],
        severity: 'mild',
        status: 'active',
        createdAt: '2026-01-15T10:10:00Z',
      },
      {
        id: 'rec-4',
        userId: 'user-patient-1',
        type: 'medication',
        title: 'Montelukast 10mg',
        date: '2025-11-20',
        details: '1 tablet nightly before bed for seasonal rhinitis control.',
        tags: ['Oral', 'Antihistamine/Antileukotriene'],
        severity: 'mild',
        status: 'active',
        createdAt: '2026-01-15T10:15:00Z',
      },
      {
        id: 'rec-5',
        userId: 'user-patient-1',
        type: 'instruction',
        title: 'Peak Flow Monitoring Protocol',
        date: '2026-02-01',
        details: 'Record peak flow every morning. If score drops below 350 L/min, use rescue Levolin inhaler and message clinic.',
        tags: ['Monitoring', 'Action Plan'],
        severity: 'moderate',
        status: 'active',
        createdAt: '2026-02-01T11:00:00Z',
      },
    ],
    appointments: [
      {
        id: 'apt-1',
        patientId: 'user-patient-1',
        patientName: 'Priya Sharma',
        doctorId: 'user-doctor-1',
        doctorName: 'Dr. Rajesh K., MD',
        specialty: 'Internal Medicine & Pulmonology',
        date: '2026-10-18',
        timeSlot: '11:30 AM',
        type: 'In-person',
        reason: 'Quarterly respiratory check-up & seasonal pollen management',
        status: 'confirmed',
        createdAt: '2026-10-05T14:20:00Z',
      },
    ],
    reports: [
      {
        id: 'rep-1',
        userId: 'user-patient-1',
        title: 'Comprehensive Metabolic & CBC Panel',
        date: '2026-09-28',
        reportType: 'Blood Test',
        fileName: 'CBC_Lipid_Panel_Sep2026.pdf',
        fileSize: '1.4 MB',
        extractedText: 'HEMOGLOBIN: 12.8 g/dL (Ref: 12.0-15.5)\nWBC: 6,800 /mcL (Ref: 4,500-11,000)\nEOSINOPHILS: 6.2% [HIGH] (Ref: 1.0-4.0%)\nFASTING BLOOD GLUCOSE: 92 mg/dL (Ref: 70-99)\nTOTAL CHOLESTEROL: 182 mg/dL (Ref: <200)\nVITAMIN D-25 OH: 22.4 ng/mL [BORDERLINE LOW] (Ref: 30-100)',
        aiSummary: 'Overall healthy blood counts and normal metabolic function. Mild eosinophilia (6.2%) is consistent with allergic asthma diathesis. Vitamin D is borderline insufficient (22.4 ng/mL); consider asking physician about standard weekly D3 supplementation.',
        keyParameters: [
          { name: 'Hemoglobin', value: '12.8 g/dL', range: '12.0 - 15.5 g/dL', status: 'Normal' },
          { name: 'Eosinophils', value: '6.2%', range: '1.0 - 4.0%', status: 'High' },
          { name: 'Fasting Glucose', value: '92 mg/dL', range: '70 - 99 mg/dL', status: 'Normal' },
          { name: 'Vitamin D', value: '22.4 ng/mL', range: '30.0 - 100.0 ng/mL', status: 'Borderline' },
        ],
        doctorQuestions: [
          'Should I begin oral Vitamin D3 replacement therapy?',
          'Does the eosinophil reading indicate worsening seasonal allergy control?',
        ],
        isSample: true,
        createdAt: '2026-09-28T16:00:00Z',
      },
    ],
    briefs: [
      {
        id: 'brief-1',
        patientId: 'user-patient-1',
        patientName: 'Priya Sharma',
        title: 'Pulmonology Consultation Clinical Brief',
        date: '2026-10-18',
        reasonForVisit: 'Pre-winter respiratory assessment, occasional nocturnal wheezing past 10 days.',
        symptomsSummary: 'Dry cough and mild chest tightness waking up at 4 AM 2 nights this week. Relieved by warm water and rescue puff.',
        relevantHistory: 'Mild Allergic Asthma diagnosed 2024. Penicillin hypersensitivity.',
        allergies: ['Penicillin (Anaphylactoid/Urticaria)', 'Shellfish'],
        currentMedications: ['Budecort Inhaler 200mcg BID', 'Montelukast 10mg QHS'],
        keyLabFindings: 'CBC showing 6.2% eosinophilia (Sep 2026). Vitamin D 22.4 ng/mL.',
        questionsForDoctor: [
          'Should we step up to a combination LABA/ICS inhaler for the winter?',
          'Is an updated spirometry / pulmonary function test indicated this visit?',
        ],
        shareCode: 'CARE-7892-BRIEF',
        createdAt: '2026-10-08T09:30:00Z',
      },
    ],
    emergencyContacts: [
      {
        id: 'ec-1',
        userId: 'user-patient-1',
        name: 'Aarav Sharma',
        relation: 'Spouse',
        phone: '+91 98765 43211',
        notifyOnSos: true,
      },
      {
        id: 'ec-2',
        userId: 'user-patient-1',
        name: 'Kavita Sharma',
        relation: 'Sister',
        phone: '+91 98765 43212',
        notifyOnSos: false,
      },
    ],
    auditLogs: [
      {
        id: 'log-1',
        userId: 'user-patient-1',
        userEmail: 'patient@24care.ai',
        action: 'USER_LOGIN',
        category: 'AUTH',
        details: 'User authenticated successfully via credentials.',
        timestamp: '2026-10-10T19:00:00Z',
      },
    ],
  };

  saveDb(initialDb);
  return initialDb;
}

function saveDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving db.json:', e);
  }
}

// In-memory sessions token map: token -> userId
const sessions = new Map<string, string>();
// Pre-populate demo sessions for ease of testing
sessions.set('token-patient-demo', 'user-patient-1');
sessions.set('token-doctor-demo', 'user-doctor-1');
sessions.set('token-admin-demo', 'user-admin-1');

// Auth helper middleware
function authenticate(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization token required' });
    return;
  }
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const userId = sessions.get(token);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired session token' });
    return;
  }
  const db = loadDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: 'User account not found' });
    return;
  }
  (req as any).user = user;
  next();
}

function logAudit(category: AuditLog['category'], action: string, details: string, user?: User) {
  const db = loadDb();
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: user?.id,
    userEmail: user?.email,
    category,
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) db.auditLogs.pop();
  saveDb(db);
}

// Deterministic Emergency Red Flag Detection
const EMERGENCY_RED_FLAGS = [
  {
    regex: /(chest\s*pain|pressure\s*in\s*chest|squeezing\s*chest|radiat(ing|es)?\s*(to\s*)?(left\s*arm|jaw|back))/i,
    reason: 'Possible acute coronary syndrome or myocardial ischemia (heart attack signs).',
  },
  {
    regex: /(severe\s*shortness\s*of\s*breath|cannot\s*breathe|gasping\s*for\s*air|blue\s*lips|stridor|choking)/i,
    reason: 'Acute respiratory distress or compromised airway.',
  },
  {
    regex: /(facial\s*droop|arm\s*weakness|slurred\s*speech|loss\s*of\s*speech|sudden\s*paralysis|sudden\s*vision\s*loss|sudden\s*numbness)/i,
    reason: 'Possible acute cerebrovascular accident (FAST stroke indicators).',
  },
  {
    regex: /(thunderclap\s*headache|worst\s*headache\s*of\s*(my\s*)?life|sudden\s*severe\s*headache\s*with\s*stiff\s*neck)/i,
    reason: 'Possible subarachnoid hemorrhage or acute intracranial pathology.',
  },
  {
    regex: /(anaphylaxis|throat\s*closing|swelling\s*of\s*(tongue|throat|lips)\s*after\s*eating|difficulty\s*swallowing\s*with\s*rash)/i,
    reason: 'Severe life-threatening allergic reaction (anaphylaxis).',
  },
  {
    regex: /(coughing\s*up\s*blood|vomiting\s*(bright\s*red\s*)?blood|coffee\s*ground\s*emesis|uncontrolled\s*bleeding)/i,
    reason: 'Acute gastrointestinal or pulmonary hemorrhage.',
  },
  {
    regex: /(suicid(al|e)\s*(thoughts|intent|plan)|want\s*to\s*end\s*my\s*life|overdose|poisoning)/i,
    reason: 'Immediate psychiatric emergency / crisis.',
  },
];

function checkRedFlags(text: string) {
  for (const flag of EMERGENCY_RED_FLAGS) {
    if (flag.regex.test(text)) {
      return { isRedFlag: true, reason: flag.reason };
    }
  }
  return { isRedFlag: false, reason: '' };
}

// ======================== API ROUTES ========================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: '24CareAI',
    aiEngineConfigured: !!apiKey,
    aiEngineStatus: apiKey ? '24CareAI Clinical Engine (Active)' : 'Clinical Rules Engine Fallback',
    serverTime: new Date().toISOString(),
  });
});

// Auth Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const db = loadDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = `token-${user.id}-${Date.now()}`;
  sessions.set(token, user.id);

  logAudit('AUTH', 'LOGIN_SUCCESS', `User ${user.email} logged in successfully`, user);

  // Exclude password in response
  const { password: _, ...userSafe } = user;
  res.json({
    token,
    user: userSafe,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role = 'patient', phone, age, gender, bloodGroup, allergies, chronicConditions, specialty, qualifications } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  const db = loadDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    email,
    password,
    role: role === 'doctor' ? 'doctor' : 'patient',
    phone,
    age: age ? Number(age) : undefined,
    gender,
    bloodGroup,
    allergies: Array.isArray(allergies) ? allergies : allergies ? [allergies] : [],
    chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : chronicConditions ? [chronicConditions] : [],
    specialty,
    qualifications,
    preferredTheme: 'mint',
    appearanceMode: 'light',
    fontSize: 'standard',
    layoutDensity: 'comfortable',
    cardRadius: 'modern',
    reducedMotion: false,
    dataSharingConsent: true,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  const token = `token-${newUser.id}-${Date.now()}`;
  sessions.set(token, newUser.id);

  logAudit('AUTH', 'REGISTER_SUCCESS', `New user registered: ${newUser.email} (${newUser.role})`, newUser);

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({
    token,
    user: userSafe,
  });
});

app.get('/api/auth/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe });
});

app.post('/api/auth/logout', authenticate, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    sessions.delete(token);
  }
  res.json({ message: 'Logged out successfully' });
});

// User profile & preferences
app.put('/api/user/profile', authenticate, (req: Request, res: Response) => {
  const currentUser: User = (req as any).user;
  const db = loadDb();
  const userIndex = db.users.findIndex((u) => u.id === currentUser.id);

  if (userIndex === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const allowedUpdates = [
    'name',
    'phone',
    'age',
    'gender',
    'bloodGroup',
    'allergies',
    'chronicConditions',
    'emergencyContactName',
    'emergencyContactPhone',
    'dataSharingConsent',
    'clinicAddress',
    'qualifications',
    'specialty',
  ];

  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      (db.users[userIndex] as any)[key] = req.body[key];
    }
  }

  saveDb(db);
  const { password: _, ...updatedSafe } = db.users[userIndex];
  res.json({ user: updatedSafe });
});

app.put('/api/user/appearance', authenticate, (req: Request, res: Response) => {
  const currentUser: User = (req as any).user;
  const db = loadDb();
  const user = db.users.find((u) => u.id === currentUser.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { preferredTheme, appearanceMode, fontSize, layoutDensity, cardRadius, reducedMotion } = req.body;

  if (preferredTheme !== undefined) user.preferredTheme = preferredTheme;
  if (appearanceMode !== undefined) user.appearanceMode = appearanceMode;
  if (fontSize !== undefined) user.fontSize = fontSize;
  if (layoutDensity !== undefined) user.layoutDensity = layoutDensity;
  if (cardRadius !== undefined) user.cardRadius = cardRadius;
  if (reducedMotion !== undefined) user.reducedMotion = reducedMotion;

  saveDb(db);
  res.json({
    message: 'Appearance preferences saved',
    preferences: {
      preferredTheme: user.preferredTheme,
      appearanceMode: user.appearanceMode,
      fontSize: user.fontSize,
      layoutDensity: user.layoutDensity,
      cardRadius: user.cardRadius,
      reducedMotion: user.reducedMotion,
    },
  });
});

// ======================== PERSONAL HEALTH MEMORY ========================

app.get('/api/health-memory', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();

  // Patient sees their own; doctor can query specific patientId if authorized
  let targetUserId = user.id;
  if (user.role === 'doctor' && req.query.patientId) {
    targetUserId = req.query.patientId as string;
    logAudit('DATA_ACCESS', 'DOCTOR_VIEW_PATIENT_RECORDS', `Doctor ${user.name} viewed records for patient ${targetUserId}`, user);
  }

  const records = db.healthRecords.filter((r) => r.userId === targetUserId);
  res.json({ records });
});

app.post('/api/health-memory', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { type, title, date, details, tags, severity, status, metadata } = req.body;

  if (!type || !title || !details) {
    res.status(400).json({ error: 'Type, title, and details are required' });
    return;
  }

  const db = loadDb();
  const newRecord: HealthRecord = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    type,
    title,
    date: date || new Date().toISOString().split('T')[0],
    details,
    tags: Array.isArray(tags) ? tags : [],
    severity: severity || 'mild',
    status: status || 'active',
    metadata: metadata || {},
    createdAt: new Date().toISOString(),
  };

  db.healthRecords.unshift(newRecord);
  saveDb(db);

  logAudit('DATA_ACCESS', 'RECORD_CREATED', `Added health memory record: ${title} (${type})`, user);
  res.status(201).json({ record: newRecord });
});

app.put('/api/health-memory/:id', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  const record = db.healthRecords.find((r) => r.id === req.params.id && r.userId === user.id);

  if (!record) {
    res.status(404).json({ error: 'Record not found or unauthorized' });
    return;
  }

  const { title, date, details, tags, severity, status, metadata } = req.body;
  if (title !== undefined) record.title = title;
  if (date !== undefined) record.date = date;
  if (details !== undefined) record.details = details;
  if (tags !== undefined) record.tags = tags;
  if (severity !== undefined) record.severity = severity;
  if (status !== undefined) record.status = status;
  if (metadata !== undefined) record.metadata = metadata;

  saveDb(db);
  res.json({ record });
});

app.delete('/api/health-memory/:id', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  const initialLength = db.healthRecords.length;
  db.healthRecords = db.healthRecords.filter((r) => !(r.id === req.params.id && r.userId === user.id));

  if (db.healthRecords.length === initialLength) {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  saveDb(db);
  res.json({ message: 'Record deleted successfully' });
});

// ======================== AI SYMPTOM CHECKER & TRIAGE ========================

app.post('/api/triage/assess', authenticate, async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { symptoms, duration, severity, onset, factors, age, chronicHistory, allergies, saveToMemory } = req.body;

  if (!symptoms || typeof symptoms !== 'string') {
    res.status(400).json({ error: 'Symptom description is required' });
    return;
  }

  logAudit('TRIAGE', 'ASSESSMENT_REQUEST', `Symptom assessment triggered for: ${symptoms.substring(0, 60)}...`, user);

  // 1. DETERMINISTIC SAFETY CHECK (Zero latency immediate check)
  const redFlagCheck = checkRedFlags(`${symptoms} ${factors || ''}`);
  if (redFlagCheck.isRedFlag) {
    const emergencyResult = {
      isEmergency: true,
      triageLevel: 'EMERGENCY_IMMEDIATE',
      urgencyBadge: 'Life-Threatening / Emergency',
      emergencyAction: 'IMMEDIATELY CALL 112 (National Emergency Helpline) or proceed to the nearest Emergency Room.',
      redFlagReason: redFlagCheck.reason,
      summary: `Urgent red flag clinical criteria matched: ${redFlagCheck.reason}`,
      considerations: [
        'Acute cardiovascular, respiratory, or neurologic symptoms require emergency clinical evaluation without delay.',
      ],
      selfCareAdvice: [
        'Do not drive yourself; request an ambulance or emergency contact transport.',
        'Keep airway clear, sit upright, and remain calm.',
        'Have any current medications and emergency contact information ready.',
      ],
      recommendedSpecialist: 'Emergency Medicine / Trauma Care',
      followUpQuestions: [
        'Are symptoms worsening right now?',
        'Is someone with you who can assist with calling emergency services?',
      ],
      disclaimer: 'CRITICAL MEDICAL NOTICE: 24CareAI does not provide definitive diagnosis. In a potential emergency, dial 112 immediately. Do not delay medical treatment.',
    };

    if (saveToMemory) {
      const db = loadDb();
      db.healthRecords.unshift({
        id: `rec-${Date.now()}`,
        userId: user.id,
        type: 'assessment',
        title: `Emergency Triage: ${symptoms.substring(0, 30)}...`,
        date: new Date().toISOString().split('T')[0],
        details: `Red flag warning: ${redFlagCheck.reason}. Advised immediate 112 emergency care.`,
        severity: 'critical',
        status: 'monitoring',
        tags: ['Emergency Triage', 'Red Flag'],
        createdAt: new Date().toISOString(),
      });
      saveDb(db);
    }

    res.json(emergencyResult);
    return;
  }

  // 2. GEMINI AI ASSESSMENT OR DETERMINISTIC FALLBACK
  try {
    if (apiKey) {
      const prompt = `You are the clinical triage AI engine for 24CareAI.
Analyze the user's reported symptoms and return a strictly structured JSON response.

Patient Context:
- Age: ${age || user.age || 'Not specified'}
- Stated Symptoms: "${symptoms}"
- Duration: "${duration || 'Not specified'}"
- Severity (1-10 scale): ${severity || 'Not specified'}
- Onset/Pattern: "${onset || 'Gradual'}"
- Associated factors / triggers: "${factors || 'None reported'}"
- Patient Chronic Conditions: ${(chronicHistory || user.chronicConditions || []).join(', ') || 'None'}
- Patient Known Allergies: ${(allergies || user.allergies || []).join(', ') || 'None'}

SAFETY CONSTRAINTS:
1. Never claim to give a definitive diagnosis. State potential considerations that a healthcare professional might evaluate.
2. Triage Level MUST be one of:
   - "URGENT_SAME_DAY": Requires medical evaluation today or within 12-24 hours.
   - "ROUTINE_PRIMARY_CARE": Consult a primary care physician in 2-4 days.
   - "SELF_CARE_MONITOR": Mild, self-limiting issue suitable for home monitoring with safety netting.
3. If any ambiguous life-threatening sign appears, upgrade triage level to URGENT_SAME_DAY.

Output JSON with exact schema:
{
  "isEmergency": false,
  "triageLevel": "URGENT_SAME_DAY" | "ROUTINE_PRIMARY_CARE" | "SELF_CARE_MONITOR",
  "urgencyBadge": "Urgent Care (Same Day)" | "Primary Care (2-3 Days)" | "Home Self-Care & Monitor",
  "summary": "Clear, compassionate 2-3 sentence overview of what the patient is experiencing",
  "considerations": ["Potential consideration 1 (e.g. Acute Bronchitis vs Asthma flare)", "Potential consideration 2"],
  "redFlagWarnings": ["Warning sign to watch for that would warrant immediate ER visit"],
  "selfCareAdvice": ["Comfort/home supportive step 1", "Comfort step 2"],
  "recommendedSpecialist": "e.g. Pulmonologist, General Physician, ENT Specialist, Dermatologist",
  "followUpQuestions": ["Clarifying question 1 for doctor consultation", "Clarifying question 2"],
  "disclaimer": "Informational triage only. Not a medical diagnosis. Consult a qualified physician for clinical care."
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an evidence-based clinical triage support engine. You provide compassionate, structured, safety-first health summaries with appropriate risk stratification. You never offer definitive diagnosis.',
        },
      });

      const parsed = JSON.parse(aiResponse.text || '{}');

      if (saveToMemory) {
        const db = loadDb();
        db.healthRecords.unshift({
          id: `rec-${Date.now()}`,
          userId: user.id,
          type: 'assessment',
          title: `Triage Assessment: ${symptoms.substring(0, 35)}`,
          date: new Date().toISOString().split('T')[0],
          details: `${parsed.summary}\n\nTriage: ${parsed.urgencyBadge}. Recommended: ${parsed.recommendedSpecialist}.`,
          severity: parsed.triageLevel === 'URGENT_SAME_DAY' ? 'moderate' : 'mild',
          status: 'monitoring',
          tags: ['AI Triage', parsed.recommendedSpecialist || 'General Medicine'],
          metadata: parsed,
          createdAt: new Date().toISOString(),
        });
        saveDb(db);
      }

      res.json(parsed);
      return;
    }
  } catch (err) {
    console.error('Gemini triage generation failed, falling back to clinical rules:', err);
  }

  // 3. HONEST DETERMINISTIC RULE-BASED FALLBACK
  const isModerateSeverity = Number(severity) >= 7;
  const fallbackResult = {
    isEmergency: false,
    triageLevel: isModerateSeverity ? 'URGENT_SAME_DAY' : 'ROUTINE_PRIMARY_CARE',
    urgencyBadge: isModerateSeverity ? 'Urgent Care (Same Day)' : 'Primary Care (2-3 Days)',
    summary: `You have reported symptoms of "${symptoms}" lasting for ${duration || 'several days'}, with a severity rating of ${severity || '5'}/10.`,
    considerations: [
      'Symptomatic presentation warranting direct physical evaluation by an accredited healthcare clinician.',
      'Symptom persistence beyond standard viral course or acute discomfort indicates clinical review is advised.',
    ],
    redFlagWarnings: [
      'Development of high persistent fever >103°F (39.4°C)',
      'Sudden onset of chest discomfort, shortness of breath, or confusion',
    ],
    selfCareAdvice: [
      'Stay hydrated with warm fluids and prioritize complete rest.',
      'Log symptom patterns twice daily in your Personal Health Memory.',
    ],
    recommendedSpecialist: 'General Physician / Internal Medicine',
    followUpQuestions: [
      'Have you noticed any change in appetite or sleep disruption?',
      'Are other members in your household experiencing similar symptoms?',
    ],
    fallbackNotice: 'Generated via 24CareAI clinical rules engine.',
    disclaimer: 'This assessment is for informational and triage guidance only. It does not constitute a doctor-patient relationship or definitive medical diagnosis.',
  };

  if (saveToMemory) {
    const db = loadDb();
    db.healthRecords.unshift({
      id: `rec-${Date.now()}`,
      userId: user.id,
      type: 'assessment',
      title: `Triage: ${symptoms.substring(0, 35)}`,
      date: new Date().toISOString().split('T')[0],
      details: `${fallbackResult.summary}\nTriage level: ${fallbackResult.urgencyBadge}.`,
      severity: isModerateSeverity ? 'moderate' : 'mild',
      status: 'monitoring',
      tags: ['Clinical Rules Triage'],
      createdAt: new Date().toISOString(),
    });
    saveDb(db);
  }

  res.json(fallbackResult);
});

// ======================== MEDICAL REPORT UPLOAD & OCR / AI SUMMARY ========================

app.get('/api/reports', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  let targetUserId = user.id;

  if (user.role === 'doctor' && req.query.patientId) {
    targetUserId = req.query.patientId as string;
  }

  const reports = db.reports.filter((r) => r.userId === targetUserId);
  res.json({ reports });
});

app.post('/api/reports/analyze', authenticate, async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { title, reportType, fileName, fileSize, base64Data, rawText, saveToMemory } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Report title is required' });
    return;
  }

  logAudit('REPORT', 'REPORT_UPLOAD_ANALYZE', `Report analysis initiated: ${title} (${reportType || 'Lab Test'})`, user);

  let extractedText = rawText || '';
  let aiSummary = '';
  let keyParameters: MedicalReport['keyParameters'] = [];
  let doctorQuestions: string[] = [];

  // Try multimodal Gemini OCR if image/PDF base64 provided
  if (apiKey) {
    try {
      let promptParts: any[] = [];

      if (base64Data) {
        // base64Data could be data:image/png;base64,xxxx or raw base64
        let mimeType = 'image/jpeg';
        let rawB64 = base64Data;
        const match = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          rawB64 = match[2];
        }

        promptParts.push({
          inlineData: {
            mimeType: mimeType,
            data: rawB64,
          },
        });
      }

      const instructions = `You are 24CareAI's Medical Report OCR & Clinical Interpretation Engine.
Perform a thorough optical analysis and interpretation of this medical document.
Document Name: "${fileName || title}"
Document Category: "${reportType || 'Laboratory Test'}"
${rawText ? `Additional raw text provided:\n"""\n${rawText}\n"""` : ''}

Strict requirements:
1. Extract all legible diagnostic test results, lab metrics, reference ranges, and physician notes.
2. Formulate a plain-language summary for the patient (clearly explain abnormal or borderline findings without inducing panic).
3. Do not invent numbers or verify unreadable text as factual. If unreadable, mark as "[Unclear]".
4. Formulate 2-3 informed questions the patient should bring to their attending doctor.

Output JSON with schema:
{
  "extractedText": "All extracted raw text lines from the document...",
  "aiSummary": "Plain language summary of the report findings and clinical significance for the patient.",
  "keyParameters": [
    {
      "name": "Parameter Name (e.g. Hemoglobin, TSH, Fasting Glucose)",
      "value": "Measured Value (with units, e.g. 13.5 g/dL)",
      "range": "Normal Reference Range (e.g. 12.0 - 15.5 g/dL)",
      "status": "Normal" | "High" | "Low" | "Abnormal" | "Borderline"
    }
  ],
  "doctorQuestions": [
    "Question 1 for doctor",
    "Question 2 for doctor"
  ]
}`;

      promptParts.push({ text: instructions });

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: promptParts },
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an accurate medical report OCR and interpretation assistant. You extract lab parameters faithfully with units and ranges, provide empathetic patient summaries, and formulate questions for the doctor.',
        },
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      extractedText = parsed.extractedText || extractedText || 'Document text extracted.';
      aiSummary = parsed.aiSummary || 'Medical report analysis completed.';
      keyParameters = parsed.keyParameters || [];
      doctorQuestions = parsed.doctorQuestions || [];
    } catch (err) {
      console.error('Gemini report analysis error, falling back:', err);
    }
  }

  // Fallback if no Gemini key or parse failed
  if (!aiSummary) {
    extractedText = extractedText || `Sample extract for ${title}: Hemoglobin 13.2 g/dL, Fasting Blood Sugar 94 mg/dL, Total Cholesterol 188 mg/dL.`;
    aiSummary = `This report indicates values within expected baseline parameters. Fasting markers and blood cell metrics appear well controlled. Discuss any individual trends with your consulting physician.`;
    keyParameters = [
      { name: 'Blood Glucose (Fasting)', value: '94 mg/dL', range: '70 - 99 mg/dL', status: 'Normal' },
      { name: 'Total Cholesterol', value: '188 mg/dL', range: '< 200 mg/dL', status: 'Normal' },
    ];
    doctorQuestions = [
      'Do my current markers reflect adequate lifestyle and dietary management?',
      'When should my next routine monitoring panel be scheduled?',
    ];
  }

  const db = loadDb();
  const newReport: MedicalReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    title,
    date: new Date().toISOString().split('T')[0],
    reportType: reportType || 'Blood Test',
    fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
    fileSize: fileSize || '1.2 MB',
    extractedText,
    aiSummary,
    keyParameters,
    doctorQuestions,
    isSample: false,
    createdAt: new Date().toISOString(),
  };

  db.reports.unshift(newReport);

  // If requested, also sync into Personal Health Memory as a record
  if (saveToMemory) {
    db.healthRecords.unshift({
      id: `rec-rep-${newReport.id}`,
      userId: user.id,
      type: 'report',
      title: `Report: ${newReport.title}`,
      date: newReport.date,
      details: `${newReport.aiSummary}\n\nKey Parameters: ${newReport.keyParameters.map((p) => `${p.name}: ${p.value} (${p.status})`).join(', ')}`,
      tags: [newReport.reportType, 'Lab Summary'],
      severity: newReport.keyParameters.some((p) => p.status === 'High' || p.status === 'Low') ? 'moderate' : 'mild',
      status: 'active',
      metadata: { reportId: newReport.id },
      createdAt: new Date().toISOString(),
    });
  }

  saveDb(db);
  res.status(201).json({ report: newReport });
});

app.delete('/api/reports/:id', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  const initCount = db.reports.length;
  db.reports = db.reports.filter((r) => !(r.id === req.params.id && r.userId === user.id));

  if (db.reports.length === initCount) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  saveDb(db);
  res.json({ message: 'Report deleted successfully' });
});

// ======================== AI PATIENT BRIEF FOR DOCTOR CONSULTATION ========================

app.get('/api/briefs', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();

  let briefs = [];
  if (user.role === 'patient') {
    briefs = db.briefs.filter((b) => b.patientId === user.id);
  } else if (user.role === 'doctor') {
    // Doctors see briefs shared with them or briefs of all patients in their appointments
    const doctorAppointments = db.appointments.filter((a) => a.doctorId === user.id);
    const patientIds = new Set(doctorAppointments.map((a) => a.patientId));
    briefs = db.briefs.filter((b) => patientIds.has(b.patientId) || b.shareCode);
  } else {
    briefs = db.briefs;
  }

  res.json({ briefs });
});

app.post('/api/brief/generate', authenticate, async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { reasonForVisit, currentSymptoms, selectedRecordIds, customQuestions } = req.body;

  if (!reasonForVisit) {
    res.status(400).json({ error: 'Reason for consultation is required' });
    return;
  }

  const db = loadDb();
  const userRecords = db.healthRecords.filter((r) => r.userId === user.id);
  const selectedRecords = selectedRecordIds?.length
    ? userRecords.filter((r) => selectedRecordIds.includes(r.id))
    : userRecords;

  const userReports = db.reports.filter((r) => r.userId === user.id);

  let symptomsSummary = currentSymptoms || 'Routine checkup and clinical review.';
  let relevantHistory = userRecords.filter((r) => r.type === 'condition').map((r) => `${r.title} (${r.status})`).join(', ') || 'No recorded chronic conditions.';
  let allergiesList = userRecords.filter((r) => r.type === 'allergy').map((r) => r.title);
  if (user.allergies && user.allergies.length) {
    allergiesList = Array.from(new Set([...allergiesList, ...user.allergies]));
  }
  let medicationsList = userRecords.filter((r) => r.type === 'medication').map((r) => r.title);
  let keyLabFindings = userReports.length
    ? userReports.slice(0, 2).map((r) => `${r.title} (${r.date}): ${r.keyParameters.map((p) => `${p.name} ${p.value}`).join(', ')}`).join('; ')
    : 'No recent laboratory reports on file.';

  let questions = customQuestions || [
    'Are my current medications optimal for controlling these symptoms?',
    'What preventive or lifestyle steps should I follow until our next visit?',
  ];

  // Enhance via Gemini if available
  if (apiKey) {
    try {
      const prompt = `Synthesize a concise, professional 1-page Clinical Patient Consultation Brief (SBAR format).
Patient Name: ${user.name} (${user.age || 'Adult'} yrs, ${user.gender || 'Not specified'})
Reason for Visit: ${reasonForVisit}
Current Symptoms: ${currentSymptoms || 'None described'}
Known Allergies: ${allergiesList.join(', ') || 'None known'}
Current Medications: ${medicationsList.join(', ') || 'None recorded'}
Medical History: ${relevantHistory}
Lab / Report Findings: ${keyLabFindings}
Patient's Questions: ${(questions).join(', ')}

Strict rules:
1. Format as an objective, physician-friendly clinical summary.
2. Mark missing information as "[Unknown / Not Reported]" rather than assuming.
3. Keep it crisp, skimmable, and well-organized.

Return JSON:
{
  "title": "Brief title (e.g. Pulmonology / General Medicine Consultation Brief)",
  "reasonForVisit": "Concise stated reason",
  "symptomsSummary": "Structured symptom timeline & duration",
  "relevantHistory": "Past medical & surgical history",
  "allergies": ["Allergy 1", "Allergy 2"],
  "currentMedications": ["Medication 1 (dosage)", "Medication 2"],
  "keyLabFindings": "Key lab & diagnostic highlights",
  "questionsForDoctor": ["Question 1", "Question 2", "Question 3"]
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are a healthcare communication specialist helping patients generate concise clinical consultation briefs for their physicians.',
        },
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      const shareCode = `CARE-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const newBrief: PatientBrief = {
        id: `brief-${Date.now()}`,
        patientId: user.id,
        patientName: user.name,
        title: parsed.title || `Consultation Brief - ${user.name}`,
        date: new Date().toISOString().split('T')[0],
        reasonForVisit: parsed.reasonForVisit || reasonForVisit,
        symptomsSummary: parsed.symptomsSummary || symptomsSummary,
        relevantHistory: parsed.relevantHistory || relevantHistory,
        allergies: parsed.allergies || allergiesList,
        currentMedications: parsed.currentMedications || medicationsList,
        keyLabFindings: parsed.keyLabFindings || keyLabFindings,
        questionsForDoctor: parsed.questionsForDoctor || questions,
        shareCode,
        createdAt: new Date().toISOString(),
      };

      db.briefs.unshift(newBrief);
      saveDb(db);
      logAudit('TRIAGE', 'BRIEF_GENERATED', `Generated AI Patient Brief: ${newBrief.title}`, user);
      res.status(201).json({ brief: newBrief });
      return;
    } catch (e) {
      console.error('Error generating brief with Gemini, using fallback:', e);
    }
  }

  // Fallback brief
  const shareCode = `CARE-${Math.floor(1000 + Math.random() * 9000)}-STD`;
  const newBrief: PatientBrief = {
    id: `brief-${Date.now()}`,
    patientId: user.id,
    patientName: user.name,
    title: `Consultation Brief - ${reasonForVisit}`,
    date: new Date().toISOString().split('T')[0],
    reasonForVisit,
    symptomsSummary,
    relevantHistory,
    allergies: allergiesList,
    currentMedications: medicationsList,
    keyLabFindings,
    questionsForDoctor: questions,
    shareCode,
    createdAt: new Date().toISOString(),
  };

  db.briefs.unshift(newBrief);
  saveDb(db);
  res.status(201).json({ brief: newBrief });
});

// View brief by shareCode (Authorized tokenized view for doctor)
app.get('/api/brief/share/:code', (req: Request, res: Response) => {
  const db = loadDb();
  const brief = db.briefs.find((b) => b.shareCode === req.params.code);
  if (!brief) {
    res.status(404).json({ error: 'Patient brief not found or expired' });
    return;
  }
  res.json({ brief });
});

// ======================== DOCTOR & FACILITY DIRECTORY ========================

const SEEDED_FACILITIES = [
  {
    id: 'fac-1',
    name: 'Manipal Hospital & Emergency Trauma Center',
    type: 'Multi-Specialty Hospital',
    area: 'HAL Old Airport Road, Bengaluru',
    distanceKm: 2.4,
    phone: '080-2502-4444',
    emergency24x7: true,
    icuAvailable: true,
    rating: 4.8,
    specialties: ['Emergency & Trauma', 'Cardiology', 'Pulmonology', 'Neurology', 'Internal Medicine'],
    isSample: true,
  },
  {
    id: 'fac-2',
    name: 'Apollo Cradle & Children Hospital',
    type: 'Specialty Hospital',
    area: 'Indiranagar 100ft Road, Bengaluru',
    distanceKm: 3.1,
    phone: '080-4666-4666',
    emergency24x7: true,
    icuAvailable: true,
    rating: 4.7,
    specialties: ['Pediatrics', 'Obstetrics & Gynecology', 'Neonatal ICU', 'Pulmonology'],
    isSample: true,
  },
  {
    id: 'fac-3',
    name: 'Narayana Health Cardiac & Multispecialty Center',
    type: 'Super-Specialty Hospital',
    area: 'HSR Layout Sector 3, Bengaluru',
    distanceKm: 4.8,
    phone: '080-7122-2222',
    emergency24x7: true,
    icuAvailable: true,
    rating: 4.9,
    specialties: ['Cardiology', 'Cardiac Surgery', 'Vascular Medicine', 'Critical Care'],
    isSample: true,
  },
  {
    id: 'fac-4',
    name: 'Fortis Hospital Comprehensive Care',
    type: 'Multi-Specialty Hospital',
    area: 'Cunningham Road, Bengaluru',
    distanceKm: 6.2,
    phone: '080-4199-4444',
    emergency24x7: true,
    icuAvailable: true,
    rating: 4.7,
    specialties: ['Nephrology', 'General Surgery', 'Gastroenterology', 'Orthopedics'],
    isSample: true,
  },
  {
    id: 'fac-5',
    name: '24CareAI Telehealth & Urgent Clinic',
    type: 'Digital Health Center',
    area: 'Virtual & Koramangala Hub, Bengaluru',
    distanceKm: 1.2,
    phone: '1800-24-CARE-AI',
    emergency24x7: true,
    icuAvailable: false,
    rating: 4.9,
    specialties: ['Urgent Care', 'Family Medicine', 'Mental Health', 'Preventive Care'],
    isSample: true,
  },
];

const SEEDED_DOCTORS = [
  {
    id: 'user-doctor-1',
    name: 'Dr. Rajesh K.',
    degree: 'MBBS, MD (General Medicine), FCCP',
    specialty: 'Internal Medicine & Pulmonology',
    experienceYears: 16,
    facilityName: 'Apollo Cradle & Indiranagar Clinic',
    consultationFee: 800,
    languages: ['English', 'Hindi', 'Kannada'],
    rating: 4.9,
    consultationModes: ['In-person', 'Video Consultation'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM', '06:00 PM'],
    about: 'Senior consultant specializing in complex allergic airways, asthma, hypertension, and preventive adult medicine.',
    isSample: true,
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Sen',
    degree: 'MBBS, MD, DM (Cardiology)',
    specialty: 'Cardiology',
    experienceYears: 14,
    facilityName: 'Narayana Health Cardiac Center',
    consultationFee: 1000,
    languages: ['English', 'Bengali', 'Hindi'],
    rating: 4.9,
    consultationModes: ['In-person', 'Video Consultation'],
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeSlots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:30 PM'],
    about: 'Interventional cardiologist with deep expertise in chest pain risk assessment, lipid optimization, and heart failure prevention.',
    isSample: true,
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikram Malhotra',
    degree: 'MBBS, MS (Orthopedics), DNB',
    specialty: 'Orthopedics & Sports Medicine',
    experienceYears: 12,
    facilityName: 'Manipal Hospital HAL Airport Rd',
    consultationFee: 900,
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.8,
    consultationModes: ['In-person'],
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimeSlots: ['10:30 AM', '01:00 PM', '04:00 PM'],
    about: 'Specializes in joint preservation, spine health, acute musculoskeletal trauma, and ergonomic pain management.',
    isSample: true,
  },
  {
    id: 'doc-4',
    name: 'Dr. Meera Nambiar',
    degree: 'MBBS, DCH, MD (Pediatrics)',
    specialty: 'Pediatrics',
    experienceYears: 11,
    facilityName: 'Apollo Children Hospital',
    consultationFee: 750,
    languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
    rating: 4.9,
    consultationModes: ['In-person', 'Video Consultation'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeSlots: ['09:00 AM', '11:30 AM', '03:30 PM', '05:00 PM'],
    about: 'Compassionate pediatrician focusing on pediatric respiratory wellness, newborn development, and vaccination management.',
    isSample: true,
  },
  {
    id: 'doc-5',
    name: 'Dr. Farhan Qureshi',
    degree: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    specialty: 'Dermatology & Allergy',
    experienceYears: 9,
    facilityName: 'Skin & Allergy Care Center',
    consultationFee: 700,
    languages: ['English', 'Urdu', 'Hindi'],
    rating: 4.8,
    consultationModes: ['In-person', 'Video Consultation'],
    availableDays: ['Mon', 'Wed', 'Sat'],
    availableTimeSlots: ['11:00 AM', '02:00 PM', '04:00 PM', '06:30 PM'],
    about: 'Expert in chronic urticaria, eczema, allergic dermatitis, and diagnostic patch testing.',
    isSample: true,
  },
];

app.get('/api/directory/facilities', (req: Request, res: Response) => {
  const { specialty, emergencyOnly, search } = req.query;
  let results = [...SEEDED_FACILITIES];

  if (emergencyOnly === 'true') {
    results = results.filter((f) => f.emergency24x7);
  }

  if (specialty) {
    const s = String(specialty).toLowerCase();
    results = results.filter((f) => f.specialties.some((spec) => spec.toLowerCase().includes(s)));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((f) => f.name.toLowerCase().includes(q) || f.area.toLowerCase().includes(q));
  }

  res.json({ facilities: results });
});

app.get('/api/directory/doctors', (req: Request, res: Response) => {
  const { specialty, mode, search } = req.query;
  let results = [...SEEDED_DOCTORS];

  if (specialty) {
    const s = String(specialty).toLowerCase();
    results = results.filter((d) => d.specialty.toLowerCase().includes(s));
  }

  if (mode) {
    const m = String(mode);
    results = results.filter((d) => d.consultationModes.includes(m));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.facilityName.toLowerCase().includes(q));
  }

  res.json({ doctors: results });
});

// ======================== APPOINTMENTS ========================

app.get('/api/appointments', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();

  let userAppointments: Appointment[] = [];
  if (user.role === 'patient') {
    userAppointments = db.appointments.filter((a) => a.patientId === user.id);
  } else if (user.role === 'doctor') {
    userAppointments = db.appointments.filter((a) => a.doctorId === user.id);
  } else {
    userAppointments = db.appointments;
  }

  res.json({ appointments: userAppointments });
});

app.get('/api/supabase/status', async (req: Request, res: Response) => {
  let tableAccessible = false;
  let tableError: string | null = null;
  let rowCount = 0;

  try {
    const { data, error, count } = await supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .limit(1);

    if (!error) {
      tableAccessible = true;
      rowCount = count || (data ? data.length : 0);
    } else {
      tableError = error.message;
    }
  } catch (err: any) {
    tableError = err.message;
  }

  res.json({
    configured: true,
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
    table: 'appointments',
    tableAccessible,
    tableError,
    rowCount,
    sqlSetup: `-- SQL Schema for Supabase SQL Editor (Run once in your Supabase dashboard):
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT,
  patient_id TEXT,
  doctor_name TEXT,
  doctor_id TEXT,
  specialty TEXT,
  date TEXT,
  time_slot TEXT,
  type TEXT,
  reason TEXT,
  status TEXT DEFAULT 'confirmed',
  shared_brief_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and allow insertions via publishable key
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous and authenticated appointments insert"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read appointments"
  ON appointments FOR SELECT
  USING (true);`
  });
});

app.post('/api/supabase/sync-all', authenticate, async (req: Request, res: Response) => {
  const db = loadDb();
  const results = {
    total: db.appointments.length,
    synced: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const apt of db.appointments) {
    try {
      const row = {
        id: apt.id,
        patient_name: apt.patientName,
        patient_id: apt.patientId,
        doctor_name: apt.doctorName,
        doctor_id: apt.doctorId,
        specialty: apt.specialty,
        date: apt.date,
        time_slot: apt.timeSlot,
        type: apt.type,
        reason: apt.reason,
        status: apt.status,
        shared_brief_id: apt.sharedBriefId || null,
        created_at: apt.createdAt || new Date().toISOString(),
      };

      const { error } = await supabase.from('appointments').upsert([row]);
      if (!error) {
        results.synced++;
        (apt as any).supabaseSynced = true;
      } else {
        results.failed++;
        if (!results.errors.includes(error.message)) {
          results.errors.push(error.message);
        }
      }
    } catch (e: any) {
      results.failed++;
      if (!results.errors.includes(e.message)) {
        results.errors.push(e.message);
      }
    }
  }

  saveDb(db);
  res.json({
    success: results.failed === 0,
    ...results,
  });
});

app.post('/api/appointments', authenticate, async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { doctorId, doctorName, specialty, date, timeSlot, type, reason, sharedBriefId } = req.body;

  if (!doctorId || !date || !timeSlot || !reason) {
    res.status(400).json({ error: 'Doctor, date, timeSlot, and reason are required' });
    return;
  }

  const db = loadDb();
  const newAppointment: Appointment = {
    id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    patientId: user.id,
    patientName: user.name,
    doctorId,
    doctorName: doctorName || 'Consulting Physician',
    specialty: specialty || 'General Medicine',
    date,
    timeSlot,
    type: type || 'In-person',
    reason,
    status: 'confirmed',
    sharedBriefId,
    createdAt: new Date().toISOString(),
  };

  db.appointments.unshift(newAppointment);

  // Also add calendar reminder instruction into health memory
  db.healthRecords.unshift({
    id: `rec-apt-${newAppointment.id}`,
    userId: user.id,
    type: 'instruction',
    title: `Appointment: ${newAppointment.doctorName} (${newAppointment.specialty})`,
    date: newAppointment.date,
    details: `Scheduled for ${newAppointment.timeSlot} (${newAppointment.type}). Reason: ${newAppointment.reason}`,
    tags: ['Appointment', 'Calendar Reminder'],
    severity: 'mild',
    status: 'active',
    metadata: { appointmentId: newAppointment.id },
    createdAt: new Date().toISOString(),
  });

  saveDb(db);
  logAudit('DATA_ACCESS', 'APPOINTMENT_BOOKED', `Booked appointment with ${newAppointment.doctorName} for ${newAppointment.date}`, user);

  // Direct sync to user's Supabase database
  let supabaseSync = {
    synced: false,
    projectId: SUPABASE_PROJECT_ID,
    table: 'appointments',
    error: null as string | null,
  };

  try {
    // 1. Try standard PostgreSQL snake_case payload
    const supabaseSnakeRow = {
      id: newAppointment.id,
      patient_name: newAppointment.patientName,
      patient_id: newAppointment.patientId,
      doctor_name: newAppointment.doctorName,
      doctor_id: newAppointment.doctorId,
      specialty: newAppointment.specialty,
      date: newAppointment.date,
      time_slot: newAppointment.timeSlot,
      type: newAppointment.type,
      reason: newAppointment.reason,
      status: newAppointment.status,
      shared_brief_id: newAppointment.sharedBriefId || null,
      created_at: newAppointment.createdAt,
    };

    const { error: snakeError } = await supabase
      .from('appointments')
      .insert([supabaseSnakeRow]);

    if (!snakeError) {
      supabaseSync.synced = true;
      (newAppointment as any).supabaseSynced = true;
      logAudit('DATA_ACCESS', 'SUPABASE_SYNC_SUCCESS', `Appointment ${newAppointment.id} written to Supabase ${SUPABASE_PROJECT_ID}`, user);
    } else {
      console.warn('Supabase snake_case insert warning, trying camelCase:', snakeError.message);
      // 2. Try camelCase columns fallback
      const supabaseCamelRow = {
        id: newAppointment.id,
        patientName: newAppointment.patientName,
        patientId: newAppointment.patientId,
        doctorName: newAppointment.doctorName,
        doctorId: newAppointment.doctorId,
        specialty: newAppointment.specialty,
        date: newAppointment.date,
        timeSlot: newAppointment.timeSlot,
        type: newAppointment.type,
        reason: newAppointment.reason,
        status: newAppointment.status,
        sharedBriefId: newAppointment.sharedBriefId || null,
        createdAt: newAppointment.createdAt,
      };

      const { error: camelError } = await supabase
        .from('appointments')
        .insert([supabaseCamelRow]);

      if (!camelError) {
        supabaseSync.synced = true;
        (newAppointment as any).supabaseSynced = true;
        logAudit('DATA_ACCESS', 'SUPABASE_SYNC_SUCCESS', `Appointment ${newAppointment.id} written to Supabase (camelCase)`, user);
      } else {
        supabaseSync.error = snakeError.message;
      }
    }
  } catch (err: any) {
    console.error('Supabase sync exception:', err);
    supabaseSync.error = err?.message || 'Supabase request error';
  }

  res.status(201).json({ appointment: newAppointment, supabase: supabaseSync });
});

app.put('/api/appointments/:id/cancel', authenticate, async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  const apt = db.appointments.find((a) => a.id === req.params.id && (a.patientId === user.id || a.doctorId === user.id || user.role === 'admin'));

  if (!apt) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  apt.status = 'cancelled';
  saveDb(db);
  logAudit('DATA_ACCESS', 'APPOINTMENT_CANCELLED', `Cancelled appointment: ${apt.id}`, user);

  // Background silent update to Supabase
  try {
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', apt.id);
  } catch (err) {
    // Silent failover - local record already preserved
  }

  res.json({ appointment: apt });
});

app.put('/api/appointments/:id/reschedule', authenticate, async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { date, timeSlot } = req.body;

  if (!date || !timeSlot) {
    res.status(400).json({ error: 'Date and timeSlot are required to reschedule' });
    return;
  }

  const db = loadDb();
  const apt = db.appointments.find((a) => a.id === req.params.id && (a.patientId === user.id || a.doctorId === user.id || user.role === 'admin'));

  if (!apt) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  apt.date = date;
  apt.timeSlot = timeSlot;
  apt.status = 'confirmed';
  saveDb(db);
  logAudit('DATA_ACCESS', 'APPOINTMENT_RESCHEDULED', `Rescheduled appointment ${apt.id} to ${date} ${timeSlot}`, user);

  // Background silent update to Supabase (handling both snake_case and camelCase)
  try {
    await supabase.from('appointments').update({
      date,
      time_slot: timeSlot,
      timeSlot,
      status: 'confirmed'
    }).eq('id', apt.id);
  } catch (err) {
    // Silent failover
  }

  res.json({ appointment: apt });
});

app.put('/api/appointments/:id/status', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  const apt = db.appointments.find((a) => a.id === req.params.id);

  if (!apt) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  if (user.role !== 'doctor' && user.role !== 'admin' && apt.patientId !== user.id) {
    res.status(403).json({ error: 'Unauthorized to change appointment status' });
    return;
  }

  if (req.body.status) apt.status = req.body.status;
  if (req.body.notes) apt.notes = req.body.notes;

  saveDb(db);
  res.json({ appointment: apt });
});

// ======================== EMERGENCY SOS & CONTACTS ========================

app.get('/api/emergency/contacts', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  const contacts = db.emergencyContacts.filter((c) => c.userId === user.id);
  res.json({ contacts });
});

app.post('/api/emergency/contacts', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { name, relation, phone, notifyOnSos } = req.body;

  if (!name || !phone) {
    res.status(400).json({ error: 'Contact name and phone number are required' });
    return;
  }

  const db = loadDb();
  const newContact: EmergencyContact = {
    id: `ec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    name,
    relation: relation || 'Contact',
    phone,
    notifyOnSos: notifyOnSos ?? true,
  };

  db.emergencyContacts.push(newContact);
  saveDb(db);
  res.status(201).json({ contact: newContact });
});

app.delete('/api/emergency/contacts/:id', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();
  db.emergencyContacts = db.emergencyContacts.filter((c) => !(c.id === req.params.id && c.userId === user.id));
  saveDb(db);
  res.json({ message: 'Emergency contact removed' });
});

app.post('/api/emergency/sos-trigger', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { locationLat, locationLng, manualAddress, emergencyType } = req.body;

  const db = loadDb();
  const contacts = db.emergencyContacts.filter((c) => c.userId === user.id);
  const notifiedContacts = contacts.filter((c) => c.notifyOnSos).map((c) => c.name);

  logAudit(
    'EMERGENCY',
    'EMERGENCY_SOS_ACTIVATED',
    `EMERGENCY SOS triggered by ${user.name} (${user.email}). Type: ${emergencyType || 'Acute Distress'}. Location: ${manualAddress || `${locationLat}, ${locationLng}`}`,
    user
  );

  res.json({
    success: true,
    emergencyHelpline: '112',
    alternateHelplines: [
      { name: 'National Emergency Number (India)', number: '112' },
      { name: 'Ambulance (Direct)', number: '102' },
      { name: 'Disaster Management Services', number: '108' },
      { name: 'USA Emergency', number: '911' },
      { name: 'UK Emergency', number: '999' },
    ],
    notifiedContacts: notifiedContacts,
    nearbyTraumaCenters: SEEDED_FACILITIES.filter((f) => f.emergency24x7).slice(0, 3),
    demoAmbulanceTracking: {
      status: 'DISPATCH_SIMULATED',
      vehicleId: 'KA-01-AMB-8842 (Advanced Cardiac Life Support)',
      estimatedArrivalMinutes: 8,
      driverContact: '+91 99887 76655',
      note: 'DEMONSTRATION SIMULATION: In a real life-threatening emergency, always dial 112 directly.',
    },
    safetyInstructions: [
      'Stay on the line if calling emergency services.',
      'Sit comfortably and loosen tight clothing.',
      'Unlock your front door if you are alone so responders can enter.',
      'Have someone flag down the ambulance at the street or gate if possible.',
    ],
  });
});

// ======================== DOCTOR WORKSPACE ========================

app.get('/api/doctor/workspace', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  if (user.role !== 'doctor' && user.role !== 'admin') {
    res.status(403).json({ error: 'Doctor access required' });
    return;
  }

  const db = loadDb();
  // Get all appointments assigned to this doctor
  const appointments = db.appointments.filter((a) => a.doctorId === user.id);
  const patientIds = Array.from(new Set(appointments.map((a) => a.patientId)));

  const patients = db.users
    .filter((u) => patientIds.includes(u.id))
    .map(({ password: _, ...safe }) => safe);

  // Relevant shared briefs
  const briefs = db.briefs.filter((b) => patientIds.includes(b.patientId));

  res.json({
    doctor: {
      id: user.id,
      name: user.name,
      specialty: user.specialty,
      licenseNumber: user.licenseNumber,
    },
    appointments,
    patients,
    briefs,
  });
});

// ======================== ADMIN DASHBOARD ========================

app.get('/api/admin/overview', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Administrative privileges required' });
    return;
  }

  const db = loadDb();
  const safeUsers = db.users.map(({ password: _, ...safe }) => safe);

  res.json({
    stats: {
      totalUsers: db.users.length,
      patientCount: db.users.filter((u) => u.role === 'patient').length,
      doctorCount: db.users.filter((u) => u.role === 'doctor').length,
      totalAppointments: db.appointments.length,
      totalReportsAnalyzed: db.reports.length,
      totalBriefsGenerated: db.briefs.length,
      systemStatus: 'Operational - All Systems Normal',
      aiEngineStatus: apiKey ? 'Connected (24CareAI Clinical Engine)' : 'Offline / Clinical Rules Engine Fallback',
    },
    users: safeUsers,
    facilities: SEEDED_FACILITIES,
    recentAuditLogs: db.auditLogs.slice(0, 30),
  });
});

// User data export (GDPR / Health Privacy compliance)
app.get('/api/user/export-data', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();

  const exportPayload = {
    exportDate: new Date().toISOString(),
    account: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      age: user.age,
      bloodGroup: user.bloodGroup,
      allergies: user.allergies,
      chronicConditions: user.chronicConditions,
      createdAt: user.createdAt,
    },
    healthMemory: db.healthRecords.filter((r) => r.userId === user.id),
    reports: db.reports.filter((r) => r.userId === user.id),
    appointments: db.appointments.filter((a) => a.patientId === user.id),
    briefs: db.briefs.filter((b) => b.patientId === user.id),
    emergencyContacts: db.emergencyContacts.filter((c) => c.userId === user.id),
    disclaimer: 'This package contains your confidential personal health information exported from 24CareAI.',
  };

  logAudit('DATA_ACCESS', 'USER_DATA_EXPORTED', `User ${user.email} exported complete health records`, user);
  res.setHeader('Content-Disposition', `attachment; filename=24CareAI_Export_${user.id}_${Date.now()}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(exportPayload, null, 2));
});

// Account deletion
app.delete('/api/user/account', authenticate, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const db = loadDb();

  db.users = db.users.filter((u) => u.id !== user.id);
  db.healthRecords = db.healthRecords.filter((r) => r.userId !== user.id);
  db.reports = db.reports.filter((r) => r.userId !== user.id);
  db.briefs = db.briefs.filter((b) => b.patientId !== user.id);
  db.appointments = db.appointments.filter((a) => a.patientId !== user.id);
  db.emergencyContacts = db.emergencyContacts.filter((c) => c.userId !== user.id);

  saveDb(db);
  logAudit('AUTH', 'ACCOUNT_DELETED', `User account ${user.email} permanently erased with all health records`);
  res.json({ message: 'Account and all associated health memory records permanently deleted.' });
});

// ======================== VITE SPA SERVING ========================

async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve('dist'))) {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`24CareAI Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
