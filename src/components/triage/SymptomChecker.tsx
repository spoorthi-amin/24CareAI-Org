import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { TriageResult } from '../../types/health';
import {
  Brain,
  Mic,
  MicOff,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  BookmarkPlus,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Stethoscope,
} from 'lucide-react';

export const SymptomChecker: React.FC<{ onNavigateToSOS: () => void; onNavigateToDirectory: (specialty?: string) => void }> = ({
  onNavigateToSOS,
  onNavigateToDirectory,
}) => {
  const { user } = useAuth();

  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('2 days');
  const [severity, setSeverity] = useState(4);
  const [onset, setOnset] = useState('Gradual');
  const [factors, setFactors] = useState('');
  const [saveToMemory, setSaveToMemory] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionInstance) return;
    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      try {
        recognitionInstance.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms first.');
      return;
    }

    setError(null);
    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await api.assessSymptoms({
        symptoms,
        duration,
        severity,
        onset,
        factors,
        age: user?.age,
        chronicHistory: user?.chronicConditions,
        allergies: user?.allergies,
        saveToMemory,
      });

      setResult(res);
      if (saveToMemory) {
        setSavedSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error conducting triage assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setDuration('2 days');
    setSeverity(4);
    setOnset('Gradual');
    setFactors('');
    setResult(null);
    setSavedSuccess(false);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
            >
              Safety-First Clinical Triage
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Deterministic Red Flag Rules + 24CareAI Clinical Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Clinical Symptom Triage</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Describe how you are feeling in natural language or use voice intake. Instant emergency red flag verification.
          </p>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Assessment
          </button>
        )}
      </div>

      {/* Emergency Notice Warning */}
      <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-900 dark:text-rose-200">
          <strong>Immediate Emergency Warning:</strong> If experiencing crushing chest pain, difficulty breathing, slurred speech, sudden facial droop, or severe allergic reaction, do not wait for AI evaluation.
          <button
            onClick={onNavigateToSOS}
            className="ml-2 font-bold underline hover:text-rose-700 dark:hover:text-rose-100"
          >
            Open Emergency SOS (Dial 112) →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Intake Questionnaire Form */}
        <div className={`${result ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <form onSubmit={handleAssess} className="card-theme p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                1. Symptom Intake
              </span>
              {user && (
                <span className="text-[11px] text-gray-500">
                  Patient: <strong className="text-gray-800 dark:text-gray-200">{user.name}</strong> ({user.age || '34'} yrs)
                </span>
              )}
            </div>

            {/* Symptoms Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  What symptoms are you experiencing? <span className="text-rose-500">*</span>
                </label>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                      isListening
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 font-semibold animate-pulse'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                  </button>
                )}
              </div>
              <textarea
                required
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Dry cough waking me up at night, scratchy throat, mild shortness of breath after climbing stairs, low energy since Tuesday..."
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-xs text-gray-900 dark:text-white focus:outline-emerald-500"
              />
            </div>

            {/* Quick Symptom Chips */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Common Inquiries:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Cough with nocturnal wheezing',
                  'Persistent dull headache & eye fatigue',
                  'Fever with body chills & fatigue',
                  'Abdominal bloating & cramping after meals',
                  'Skin rash with itching after medication',
                ].map((chip) => (
                  <button
                    type="button"
                    key={chip}
                    onClick={() => setSymptoms(chip)}
                    className="text-[11px] py-1 px-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration and Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                >
                  <option value="Less than 24 hours">Less than 24 hours</option>
                  <option value="2 to 3 days">2 to 3 days</option>
                  <option value="4 to 7 days">4 to 7 days</option>
                  <option value="1 to 2 weeks">1 to 2 weeks</option>
                  <option value="More than a month (chronic)">More than a month (chronic)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    Discomfort Severity (1-10)
                  </label>
                  <span className={`text-xs font-bold ${severity >= 8 ? 'text-rose-600' : severity >= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {severity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>1 (Mild)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>
            </div>

            {/* Onset and Associated factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Onset Pattern
                </label>
                <select
                  value={onset}
                  onChange={(e) => setOnset(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                >
                  <option value="Gradual worsening">Gradual worsening</option>
                  <option value="Sudden onset">Sudden acute onset</option>
                  <option value="Intermittent / comes and goes">Intermittent / comes and goes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Triggers / Relieving Factors
                </label>
                <input
                  type="text"
                  value={factors}
                  onChange={(e) => setFactors(e.target.value)}
                  placeholder="e.g. Cold weather, lying flat, pollen"
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Context from user health memory */}
            {user && (user.chronicConditions?.length || user.allergies?.length) ? (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs space-y-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-[11px] uppercase">
                  Context Included from Health Memory:
                </span>
                <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                  {user.chronicConditions?.length ? `Conditions: ${user.chronicConditions.join(', ')}` : ''}
                  {user.allergies?.length ? ` · Allergies: ${user.allergies.join(', ')}` : ''}
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="save-memory-check"
                checked={saveToMemory}
                onChange={(e) => setSaveToMemory(e.target.checked)}
                className="rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="save-memory-check" className="text-xs text-gray-700 dark:text-gray-300">
                Automatically save this assessment to my Personal Health Memory
              </label>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Symptoms with 24CareAI Clinical Engine...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Run Clinical Triage Assessment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Assessment Result Panel */}
        {result && (
          <div className="lg:col-span-7 space-y-4 animate-in fade-in duration-200">
            {/* Urgency Header */}
            <div
              className={`p-5 rounded-2xl border ${
                result.isEmergency
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                  : result.triageLevel === 'URGENT_SAME_DAY'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      result.isEmergency
                        ? 'bg-rose-600 text-white'
                        : result.triageLevel === 'URGENT_SAME_DAY'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {result.urgencyBadge}
                  </span>
                  {result.fallbackNotice && (
                    <span className="text-[11px] text-gray-500">({result.fallbackNotice})</span>
                  )}
                </div>

                {savedSuccess && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved to Health Memory
                  </span>
                )}
              </div>

              {result.isEmergency ? (
                <div className="space-y-3 mt-3">
                  <h3 className="text-base font-bold text-rose-900 dark:text-rose-100 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    Immediate Emergency Evaluation Recommended
                  </h3>
                  <p className="text-xs text-rose-800 dark:text-rose-200 font-medium">
                    {result.emergencyAction}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={onNavigateToSOS}
                      className="py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Dial 112 / Emergency Assistance Now
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Clinical Impression & Summary
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Considerations & Self-care */}
            <div className="card-theme p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  Potential Clinical Considerations (For Physician Evaluation)
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {result.considerations?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.redFlagWarnings && result.redFlagWarnings.length > 0 && (
                <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Red Flags to Watch (Seek Immediate Care If Occur)
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                    {result.redFlagWarnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Comfort & Supportive Home Steps
                </h4>
                <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  {result.selfCareAdvice?.map((advice, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Specialist and Action Button */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase font-medium">Recommended Specialist</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {result.recommendedSpecialist || 'General Physician'}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateToDirectory(result.recommendedSpecialist)}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 shadow-xs transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Find {result.recommendedSpecialist} →
                </button>
              </div>
            </div>

            {/* Questions to Ask Doctor */}
            {result.followUpQuestions && result.followUpQuestions.length > 0 && (
              <div className="card-theme p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Helpful Questions to Ask Your Doctor
                </h4>
                <div className="space-y-1.5">
                  {result.followUpQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40 text-xs text-gray-700 dark:text-gray-300"
                    >
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-[11px] text-gray-400 text-center italic">
              {result.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
