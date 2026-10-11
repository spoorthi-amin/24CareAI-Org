import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { HealthRecord } from '../../types/health';
import {
  HeartPulse,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  AlertCircle,
  Pill,
  ShieldAlert,
  FileText,
  Activity,
  CheckCircle2,
  Download,
  Calendar,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { EmptyStateIllustration } from '../illustrations/HealthIllustrations';

export const HealthMemoryPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);

  // Form states
  const [type, setType] = useState<HealthRecord['type']>('condition');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState('');
  const [severity, setSeverity] = useState<HealthRecord['severity']>('mild');
  const [status, setStatus] = useState<HealthRecord['status']>('active');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.getHealthMemory();
      setRecords(res.records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openAddModal = () => {
    setEditingRecord(null);
    setType('condition');
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setDetails('');
    setTags('');
    setSeverity('mild');
    setStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (rec: HealthRecord) => {
    setEditingRecord(rec);
    setType(rec.type);
    setTitle(rec.title);
    setDate(rec.date);
    setDetails(rec.details);
    setTags((rec.tags || []).join(', '));
    setSeverity(rec.severity || 'mild');
    setStatus(rec.status || 'active');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = tags
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    if (editingRecord) {
      await api.updateHealthRecord(editingRecord.id, {
        type,
        title,
        date,
        details,
        tags: tagArray,
        severity,
        status,
      });
    } else {
      await api.createHealthRecord({
        type,
        title,
        date,
        details,
        tags: tagArray,
        severity,
        status,
      });
    }
    setModalOpen(false);
    fetchRecords();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record from your Health Memory?')) {
      await api.deleteHealthRecord(id);
      fetchRecords();
    }
  };

  // Filter & Search
  const filteredRecords = records.filter((rec) => {
    const matchesType = filterType === 'all' || rec.type === filterType;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.tags && rec.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (recType: HealthRecord['type']) => {
    switch (recType) {
      case 'allergy':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-emerald-500" />;
      case 'report':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'assessment':
        return <Activity className="w-4 h-4 text-purple-500" />;
      default:
        return <HeartPulse className="w-4 h-4 text-emerald-600" />;
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
              Private Health Memory
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Isolated & User-Authenticated</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Health Memory</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Organized timeline of medical history, medications, allergies, reports, and doctor recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/api/user/export-data"
            download
            className="flex items-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Download complete encrypted JSON health backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </a>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold text-white rounded-lg shadow-xs transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="card-theme p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records, medications, symptoms, or tags..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white focus:outline-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'condition', label: 'Conditions' },
              { id: 'allergy', label: 'Allergies' },
              { id: 'medication', label: 'Medications' },
              { id: 'report', label: 'Lab Reports' },
              { id: 'assessment', label: 'Triage History' },
              { id: 'instruction', label: 'Care Plans' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filterType === f.id
                    ? 'font-semibold shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: filterType === f.id ? 'var(--color-sage)' : undefined,
                  color: filterType === f.id ? 'var(--color-primary-dark)' : undefined,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Record Timeline */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card-theme p-4 animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/4"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-3/4"></div>
            </div>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="card-theme p-10 text-center space-y-3">
          <EmptyStateIllustration type={searchQuery ? 'search' : 'history'} className="mb-2" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {searchQuery || filterType !== 'all' ? 'No matching records found' : 'Your Personal Health Memory is Ready'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search criteria or resetting the category filter.'
              : 'Add your allergies, active medications, or chronic conditions to build a longitudinal health record.'}
          </p>
          <button
            onClick={openAddModal}
            className="py-2 px-4 text-xs font-medium text-white rounded-lg shadow-xs"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Add First Health Record
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="card-theme p-4 transition-all hover:border-emerald-300 dark:hover:border-emerald-800 flex flex-col sm:flex-row items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className="p-2.5 rounded-xl shrink-0 mt-0.5"
                  style={{ backgroundColor: 'var(--surface-card-subtle)' }}
                >
                  {getTypeIcon(rec.type)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {rec.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        rec.severity === 'critical' || rec.severity === 'severe'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : rec.severity === 'moderate'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {rec.severity || 'mild'}
                    </span>
                    <span className="text-[10px] text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded-sm capitalize">
                      {rec.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {rec.details}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {rec.date}
                    </span>
                    {rec.tags && rec.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {rec.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                <button
                  onClick={() => openEditModal(rec)}
                  className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Edit record"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rec.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Record Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg card-theme p-6 shadow-2xl relative"
            style={{ backgroundColor: 'var(--surface-card)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {editingRecord ? 'Edit Health Memory Record' : 'Add Health Memory Record'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Record Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="condition">Medical Condition / Diagnosis</option>
                    <option value="allergy">Allergy / Reaction</option>
                    <option value="medication">Current Medication / Prescription</option>
                    <option value="report">Laboratory / Diagnostic Summary</option>
                    <option value="instruction">Doctor Instruction / Protocol</option>
                    <option value="note">Clinical Health Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Record Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Title / Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Budecort Inhaler 200mcg or Penicillin Allergy"
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Details & Clinical Instructions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Dosage, frequency, diagnostic context, doctor advice..."
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Severity / Clinical Alert
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="mild">Mild / Informational</option>
                    <option value="moderate">Moderate / Monitoring</option>
                    <option value="severe">Severe / Critical Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="resolved">Resolved</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Respiratory, Inhaler, Prescription"
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2 px-3 text-xs border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 text-xs font-semibold text-white rounded-lg shadow-xs"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {editingRecord ? 'Save Changes' : 'Add to Health Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
