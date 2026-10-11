import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MedicalReport } from '../../types/health';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  Trash2,
  Calendar,
  FileCheck,
  Stethoscope,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { EmptyStateIllustration } from '../illustrations/HealthIllustrations';

export const ReportUploadPage: React.FC = () => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload form state
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState<MedicalReport['reportType']>('Blood Test');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const [saveToMemory, setSaveToMemory] = useState(true);

  // Active report detail modal
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.getReports();
      setReports(res.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit.');
      return;
    }

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFileBase64(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Please provide a report title.');
      return;
    }
    if (!fileBase64 && !rawText) {
      setError('Please attach a medical report document or enter report text.');
      return;
    }

    setError(null);
    setProcessing(true);

    try {
      const res = await api.analyzeReport({
        title,
        reportType,
        fileName: selectedFile?.name || `${title}.pdf`,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB',
        base64Data: fileBase64 || undefined,
        rawText: rawText || undefined,
        saveToMemory,
      });

      setSelectedReport(res.report);
      // Reset form
      setTitle('');
      setSelectedFile(null);
      setFileBase64(null);
      setRawText('');
      fetchReports();
    } catch (err: any) {
      setError(err.message || 'Report analysis failed.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this analyzed report?')) {
      await api.deleteReport(id);
      fetchReports();
      if (selectedReport?.id === id) setSelectedReport(null);
    }
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
              Multimodal Vision & OCR
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">24CareAI Clinical Document Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Report Upload & AI Summaries</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Extract lab parameters faithfully, receive plain-language explanations, and prepare questions for your physician.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleAnalyze} className="card-theme p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block border-b pb-2 border-gray-200 dark:border-gray-800">
              Upload Report File
            </span>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CBC & Thyroid Panel or Chest X-Ray"
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
              >
                <option value="Blood Test">Complete Blood Count / Metabolic Panel</option>
                <option value="Radiology / X-Ray">Radiology / Ultrasound / X-Ray</option>
                <option value="Prescription">Prescription / Medication Slip</option>
                <option value="Pathology">Pathology Biopsy / Cytology</option>
                <option value="Discharge Summary">Hospital Discharge Summary</option>
                <option value="Other">Other Clinical Document</option>
              </select>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attach Document / Image (PDF, JPG, PNG)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-gray-50/50 dark:bg-gray-800/20">
                <input
                  type="file"
                  id="report-file-input"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="report-file-input" className="cursor-pointer space-y-2 block">
                  <Upload className="w-6 h-6 mx-auto text-emerald-600 dark:text-emerald-400" />
                  <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {selectedFile ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedFile.name}</span>
                    ) : (
                      'Click to browse or drop document here'
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 block">Up to 20MB · Encrypted in memory</span>
                </label>
              </div>
            </div>

            {/* Manual text alternative */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Or Paste Report Text directly:
              </label>
              <textarea
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="e.g. Hemoglobin 12.8 g/dL, Fasting Glucose 94 mg/dL..."
                className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="save-report-mem"
                checked={saveToMemory}
                onChange={(e) => setSaveToMemory(e.target.checked)}
                className="rounded-sm border-gray-300 text-emerald-600"
              />
              <label htmlFor="save-report-mem" className="text-xs text-gray-700 dark:text-gray-300">
                Sync summary into Personal Health Memory
              </label>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              {processing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Processing OCR & 24CareAI Analysis...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Analyze & Extract Medical Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved Reports List & Active Analysis Result */}
        <div className="lg:col-span-7 space-y-4">
          {selectedReport && (
            <div className="card-theme p-5 border-2 border-emerald-300 dark:border-emerald-700/80 space-y-4 bg-emerald-50/20 dark:bg-emerald-950/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-primary-dark)' }}
                    >
                      {selectedReport.reportType}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{selectedReport.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedReport.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Plain language summary */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Plain Language Summary
                </h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white/80 dark:bg-gray-800/60 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  {selectedReport.aiSummary}
                </p>
              </div>

              {/* Key Parameters Table */}
              {selectedReport.keyParameters && selectedReport.keyParameters.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Extracted Diagnostic Parameters
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="py-2 px-3">Parameter</th>
                          <th className="py-2 px-3">Measured Value</th>
                          <th className="py-2 px-3">Reference Range</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {selectedReport.keyParameters.map((param, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{param.name}</td>
                            <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{param.value}</td>
                            <td className="py-2 px-3 text-gray-400 text-[11px]">{param.range || 'N/A'}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  param.status === 'High' || param.status === 'Low' || param.status === 'Abnormal'
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                }`}
                              >
                                {param.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Questions for doctor */}
              {selectedReport.doctorQuestions && selectedReport.doctorQuestions.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                    Suggested Questions for Your Physician
                  </h3>
                  <div className="space-y-1.5">
                    {selectedReport.doctorQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300"
                      >
                        "{q}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Extracted Text */}
              {selectedReport.extractedText && (
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer font-medium hover:text-gray-700 dark:hover:text-gray-300 py-1">
                    View Raw OCR Extraction Lines
                  </summary>
                  <pre className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap font-mono mt-2">
                    {selectedReport.extractedText}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* List of Previous Reports */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Analyzed Medical Documents ({reports.length})
            </h3>

            {loading ? (
              <div className="card-theme p-6 text-center text-xs text-gray-400 animate-pulse">
                Loading medical records...
              </div>
            ) : reports.length === 0 ? (
              <div className="card-theme p-8 text-center space-y-2">
                <EmptyStateIllustration type="reports" className="mb-1" />
                <p className="text-xs text-gray-500">No medical reports uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="card-theme p-3.5 flex items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer"
                    onClick={() => setSelectedReport(rep)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {rep.title}
                          </h4>
                          {rep.isSample && (
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.2 rounded-sm">
                              Sample
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{rep.aiSummary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedReport(rep)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md"
                        title="View Report Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rep.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md"
                        title="Delete Report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
