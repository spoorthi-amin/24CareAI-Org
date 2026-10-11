import React from 'react';
import {
  HeartPulse,
  Brain,
  FileText,
  FileCheck,
  Stethoscope,
  AlertTriangle,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Activity,
  Lock,
} from 'lucide-react';
import {
  HeroHealthIllustration,
  TriageIllustration,
  HealthMemoryIllustration,
  MedicalReportIllustration,
  DoctorBriefIllustration,
  DoctorDiscoveryIllustration,
  AppointmentIllustration,
} from '../illustrations/HealthIllustrations';
import { Logo } from '../brand/Logo';

interface LandingPageProps {
  onExploreDemo: () => void;
  onSignUp: () => void;
  onCheckSymptoms: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExploreDemo, onSignUp, onCheckSymptoms }) => {
  return (
    <div className="space-y-20 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12">
        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>AI-Powered Intelligent Healthcare & Emergency Response</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight sm:leading-none">
            Intelligent Care.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700">
              Every Hour.
            </span>
            <br />
            Personalized For You.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            24CareAI brings clinical symptom triage, longitudinal Personal Health Memory, multimodal lab report analysis, and rapid emergency assistance together in a tranquil mint-green sanctuary.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreDemo}
              className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:scale-105 flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Explore Platform Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onCheckSymptoms}
              className="py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-xs"
            >
              Check Symptoms Now
            </button>
            <button
              onClick={onSignUp}
              className="py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
            >
              Create Free Account
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Safety-first deterministic red flags
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              National 112 emergency hotline ready
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zero telemetry · User isolated
            </span>
          </div>
        </div>

        {/* Custom Hero Artwork */}
        <div className="max-w-4xl mx-auto mt-10 px-4">
          <div className="card-theme p-4 sm:p-6 shadow-2xl border-2 border-emerald-300/80 dark:border-emerald-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl relative overflow-hidden">
            {/* Top Bar with 24CareAI Brand */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Logo variant="compact" size="xs" showSubtitle={false} />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Active Clinical Workspace
                </span>
              </div>
              <span
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
              >
                Signature Mint Theme
              </span>
            </div>

            {/* Hero SVG Vector Illustration */}
            <HeroHealthIllustration />
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights with Custom Vector Illustrations */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Six Comprehensive Pillars of 24CareAI
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
            From emergency ambulance dispatch to doctor consultation briefs, everything connects seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              illustration: <TriageIllustration className="h-40" />,
              title: 'AI Symptom Checker & Triage',
              desc: 'Conversational voice or text intake with instant deterministic emergency red-flag checking, risk stratification, and recommended specialties.',
            },
            {
              illustration: <HealthMemoryIllustration className="h-40" />,
              title: 'Personal Health Memory',
              desc: 'Private longitudinal healthcare records including chronic diagnoses, allergy alerts, active medication dosages, and physician care plans.',
            },
            {
              illustration: <MedicalReportIllustration className="h-40" />,
              title: 'Medical Report OCR & Summaries',
              desc: 'Multimodal vision extracts diagnostic lab parameters faithfully, generates plain-language patient explanations, and suggests doctor questions.',
            },
            {
              illustration: <DoctorBriefIllustration className="h-40" />,
              title: 'AI Patient Consultation Briefs',
              desc: 'Generates concise 1-page clinical SBAR consultation sheets with share codes and printable views to make your doctor visits 3x more productive.',
            },
            {
              illustration: <DoctorDiscoveryIllustration className="h-40" />,
              title: 'Doctor & Facility Directory',
              desc: 'Search accredited clinicians and hospitals by distance, specialty, consultation fee, and 24x7 trauma unit availability.',
            },
            {
              illustration: <AppointmentIllustration className="h-40" />,
              title: 'Appointments & Emergency SOS',
              desc: 'Direct connection to national emergency services (112), automatic emergency contact alerts, nearest ICUs, and schedule coordination.',
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="card-theme p-6 space-y-3 transition-all hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg group flex flex-col justify-between"
            >
              <div className="py-2 transition-transform duration-300 group-hover:scale-105">
                {pillar.illustration}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{pillar.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How 24CareAI Works</h2>
          <p className="text-xs text-gray-500">Three thoughtful steps from uncertainty to clinical clarity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="card-theme p-5 space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              1
            </span>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">Record or Express Symptoms</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Speak or type how you feel, or upload a recent lab PDF or photo for instant multimodal analysis.
            </p>
          </div>

          <div className="card-theme p-5 space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              2
            </span>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">Clinical & AI Stratification</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Deterministic red flag rules immediately protect you. 24CareAI Clinical Intelligence assesses severity, potential considerations, and self-care comfort.
            </p>
          </div>

          <div className="card-theme p-5 space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              3
            </span>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">Navigate Next Steps</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Generate a consultation brief for your doctor, book an appointment, or call 112 emergency services with one click.
            </p>
          </div>
        </div>
      </section>

      {/* Patient Privacy & Safety Commitment */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Patient Privacy & Medical Safety Guarantee
              </h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              We never sell medical records. Health Memory remains isolated to your authenticated account. Export your complete data package or permanently delete your account at any time.
            </p>
          </div>

          <button
            onClick={onExploreDemo}
            className="py-2.5 px-5 rounded-xl text-xs font-bold text-white shadow-xs shrink-0 hover:opacity-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Start Exploring 24CareAI
          </button>
        </div>
      </section>
    </div>
  );
};
