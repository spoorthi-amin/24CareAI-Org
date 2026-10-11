import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types/health';

export const SUPABASE_PROJECT_ID =
  (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID || 'ylpdyzmjwbprjgsmumhr';

export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_v7WlGWA1NmFCUJT-f-6ihA_OhnOLv0O';

// Initialize Supabase Client for client-side operations
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SQL_SETUP_SCRIPT = `-- ====================================================================
-- 24CareAI: Supabase Table & Policy Setup for Appointments
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new
-- ====================================================================

-- 1. Create the appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
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
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow inserting appointments using publishable / anon key
DROP POLICY IF EXISTS "Allow public insert to appointments" ON public.appointments;
CREATE POLICY "Allow public insert to appointments"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Policy: Allow reading appointments
DROP POLICY IF EXISTS "Allow public read from appointments" ON public.appointments;
CREATE POLICY "Allow public read from appointments"
  ON public.appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Policy: Allow updating appointments (status, cancellation)
DROP POLICY IF EXISTS "Allow public update to appointments" ON public.appointments;
CREATE POLICY "Allow public update to appointments"
  ON public.appointments
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
`;

export interface SupabaseHealthStatus {
  configured: boolean;
  projectId: string;
  url: string;
  tableAccessible: boolean;
  tableError: string | null;
  rowCount: number;
}

/**
 * Checks connection to the user's Supabase project and verifies if
 * the 'appointments' table exists and is accessible.
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthStatus> {
  try {
    const { data, error, count } = await supabaseClient
      .from('appointments')
      .select('id', { count: 'exact' })
      .limit(1);

    if (error) {
      return {
        configured: true,
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        tableAccessible: false,
        tableError: error.message,
        rowCount: 0,
      };
    }

    return {
      configured: true,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      tableAccessible: true,
      tableError: null,
      rowCount: count ?? (data ? data.length : 0),
    };
  } catch (err: any) {
    return {
      configured: true,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      tableAccessible: false,
      tableError: err?.message || 'Network error reaching Supabase',
      rowCount: 0,
    };
  }
}

/**
 * Saves an appointment directly to the user's Supabase table.
 * Supports standard PostgreSQL snake_case with fallback to camelCase.
 */
export async function saveAppointmentDirectlyToSupabase(
  appointment: Appointment
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Try standard PostgreSQL snake_case columns
    const snakeCaseRow = {
      id: appointment.id,
      patient_name: appointment.patientName,
      patient_id: appointment.patientId,
      doctor_name: appointment.doctorName,
      doctor_id: appointment.doctorId,
      specialty: appointment.specialty,
      date: appointment.date,
      time_slot: appointment.timeSlot,
      type: appointment.type,
      reason: appointment.reason,
      status: appointment.status,
      shared_brief_id: appointment.sharedBriefId || null,
      notes: appointment.notes || null,
      created_at: appointment.createdAt || new Date().toISOString(),
    };

    const { error: snakeError } = await supabaseClient
      .from('appointments')
      .insert([snakeCaseRow]);

    if (!snakeError) {
      return { success: true };
    }

    // 2. Fallback to camelCase columns if user created table with camelCase
    const camelCaseRow = {
      id: appointment.id,
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      doctorName: appointment.doctorName,
      doctorId: appointment.doctorId,
      specialty: appointment.specialty,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      type: appointment.type,
      reason: appointment.reason,
      status: appointment.status,
      sharedBriefId: appointment.sharedBriefId || null,
      notes: appointment.notes || null,
      createdAt: appointment.createdAt || new Date().toISOString(),
    };

    const { error: camelError } = await supabaseClient
      .from('appointments')
      .insert([camelCaseRow]);

    if (!camelError) {
      return { success: true };
    }

    return { success: false, error: snakeError.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save to Supabase' };
  }
}

/**
 * Fetches appointments saved directly in Supabase
 */
export async function fetchAppointmentsFromSupabase(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabaseClient
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      patientId: row.patient_id || row.patientId || '',
      patientName: row.patient_name || row.patientName || 'Unknown Patient',
      doctorId: row.doctor_id || row.doctorId || '',
      doctorName: row.doctor_name || row.doctorName || 'Doctor',
      specialty: row.specialty || 'General',
      date: row.date || '',
      timeSlot: row.time_slot || row.timeSlot || '',
      type: row.type || 'In-person',
      reason: row.reason || '',
      status: row.status || 'confirmed',
      sharedBriefId: row.shared_brief_id || row.sharedBriefId,
      notes: row.notes,
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      supabaseSynced: true,
    }));
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    return [];
  }
}
