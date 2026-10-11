import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PatientBrief, HealthRecord } from '../../types/health';
import {
  FileCheck,
  Sparkles,
  Printer,
  Copy,
  Check,
  Share2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  Plus,
  Trash2,
  Edit3,
} from 'lucide-react';

export const PatientBriefGenerator: React.FC = () => {
  const { user } = useAuth();
  const [briefs, setBriefs] = useState<PatientBrief[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form input
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [currentSymptoms, setCurrentSymptoms] = useState('');
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState<string[]>([
    'Are my current medications optimal for controlling these symptoms?',
    'Should I adjust any physical activity or dietary habits?',
  ]);

  // Active viewing brief
  const [activeBrief, setActiveBrief] = useState<PatientBrief | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [briefsRes, recordsRes] = await Promise.all([
        api.getBriefs(),
        api.getHealthMemory(),
      ]);
      setBriefs(briefsRes.briefs || []);
      setRecords(recordsRes.records || []);
      if (briefsRes.briefs && briefsRes.briefs.length > 0) {
        setActiveBrief(briefsRes.briefs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddQuestion = () => {
    if (customQuestion.trim()) {
      setQuestionsList([...questionsList, customQuestion.trim()]);
      setCustomQuestion('');
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestionsList(questionsList.filter((_, i) => i !== idx));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonForVisit.trim()) return;

    setGenerating(true);
    try {
      const res = await api.generateBrief({
        reasonForVisit,
        currentSymptoms,
        selectedRecordIds,
        customQuestions: questionsList,
      });
      setActiveBrief(res.brief);
      setBriefs([res.brief, ...briefs]);
      setReasonForVisit('');
      setCurrentSymptoms('');
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyShare = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
            >
              Clinical SBAR Synthesis
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">24CareAI Clinical Documentation Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Patient Consultation Brief</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Synthesize your symptoms, medical history, medications, and lab findings into a concise 1-page clinical sheet for your doctor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleGenerate} className="card-theme p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block border-b pb-2 border-gray-200 dark:border-gray-800">
              Prepare Consultation Brief
            </span>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for Doctor Consultation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                placeholder="e.g. Pre-winter asthma review or Persistent tension headaches"
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Symptom Summary / Timeline
              </label>
              <textarea
                rows={3}
                value={currentSymptoms}
                onChange={(e) => setCurrentSymptoms(e.target.value)}
                placeholder="e.g. Mild shortness of breath at night, dry cough past 10 days..."
                className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
              />
            </div>

            {/* Questions for doctor */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Questions You Want to Ask Your Doctor
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Add a specific question..."
                  className="flex-1 py-1.5 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuestion();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {questionsList.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800/40 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <span className="truncate pr-2">"{q}"</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-gray-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              {generating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Clinical Brief...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Generate Consultation Brief</span>
                </>
              )}
            </button>
          </form>

          {/* Previous Briefs History */}
          <div className="card-theme p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Previously Generated Briefs ({briefs.length})
            </h3>
            <div className="space-y-1.5">
              {briefs.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBrief(b)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                    activeBrief?.id === b.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 font-semibold text-emerald-900 dark:text-emerald-200'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <span className="truncate">{b.title}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">{b.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Brief View Sheet (Print Ready) */}
        <div className="lg:col-span-7 space-y-4">
          {activeBrief ? (
            <div className="card-theme p-6 space-y-5 bg-white dark:bg-gray-900 border-2 border-emerald-200 dark:border-emerald-800/80 shadow-md">
              {/* Header with actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
                    >
                      Physician Consultation Brief
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{activeBrief.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {activeBrief.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Patient: <strong>{activeBrief.patientName || user?.name}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                    title="Print consultation sheet"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  {activeBrief.shareCode && (
                    <button
                      onClick={() => handleCopyShare(activeBrief.shareCode!)}
                      className="py-1.5 px-3 rounded-lg border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-1.5 transition-colors"
                      title="Copy secure share code for doctor"
                    >
                      {copiedCode === activeBrief.shareCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === activeBrief.shareCode ? 'Copied' : activeBrief.shareCode}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SBAR Clinical Sections */}
              <div className="space-y-4 text-xs">
                {/* 1. Situation / Chief Complaint */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-1">
                  <h3 className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-[10px]">
                    Situation & Chief Reason for Consultation
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {activeBrief.reasonForVisit}
                  </p>
                </div>

                {/* 2. Symptom Presentation */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-1">
                  <h3 className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-[10px]">
                    Reported Symptoms & Onset Timeline
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                    {activeBrief.symptomsSummary}
                  </p>
                </div>

                {/* 3. Background: Allergies, Meds, History */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-1">
                    <h3 className="font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 text-[10px]">
                      Known Allergies & Adverse Reactions
                    </h3>
                    <ul className="text-gray-800 dark:text-gray-200 space-y-0.5">
                      {activeBrief.allergies && activeBrief.allergies.length > 0 ? (
                        activeBrief.allergies.map((a, i) => (
                          <li key={i} className="flex items-center gap-1.5 font-medium text-rose-700 dark:text-rose-300">
                            <span>⚠</span>
                            <span>{a}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No known allergies on record</li>
                      )}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-1">
                    <h3 className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 text-[10px]">
                      Current Medications & Maintenance Regimens
                    </h3>
                    <ul className="text-gray-800 dark:text-gray-200 space-y-0.5">
                      {activeBrief.currentMedications && activeBrief.currentMedications.length > 0 ? (
                        activeBrief.currentMedications.map((m, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-emerald-600">·</span>
                            <span>{m}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">None reported</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* 4. Past Medical History & Labs */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-1">
                  <h3 className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-[10px]">
                    Relevant Medical History & Diagnostic Highlights
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    <strong>History:</strong> {activeBrief.relevantHistory || 'None'}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed pt-1">
                    <strong>Laboratory Findings:</strong> {activeBrief.keyLabFindings || 'None recorded'}
                  </p>
                </div>

                {/* 5. Patient Questions */}
                {activeBrief.questionsForDoctor && activeBrief.questionsForDoctor.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                    <h3 className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 text-[10px] flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Specific Questions to Address During Consultation
                    </h3>
                    <ul className="space-y-1">
                      {activeBrief.questionsForDoctor.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-gray-800 dark:text-gray-200">
                          <span className="text-emerald-600 font-bold">{idx + 1}.</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer notice */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-400 text-center">
                Prepared via 24CareAI Patient Brief Generator for Clinical Consultation.
              </div>
            </div>
          ) : (
            <div className="card-theme p-12 text-center text-xs text-gray-400">
              Generate a consultation brief or select an existing one to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
