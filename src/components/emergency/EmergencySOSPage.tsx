import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EmergencyContact, Facility } from '../../types/health';
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  ShieldAlert,
  Users,
  Plus,
  Trash2,
  Navigation,
  Clock,
  CheckCircle2,
  Activity,
  HeartHandshake,
  Ambulance,
  Building,
  Info,
} from 'lucide-react';

export const EmergencySOSPage: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // SOS activation state
  const [sosActive, setSosActive] = useState(false);
  const [sosResult, setSosResult] = useState<any | null>(null);
  const [countdown, setCountdown] = useState(480); // 8 minutes demo timer

  // Location
  const [locationText, setLocationText] = useState('Indiranagar, Bengaluru, KA (Auto-Detected)');
  const [manualLocation, setManualLocation] = useState('');
  const [locating, setLocating] = useState(false);

  // New contact modal
  const [newContactModal, setNewContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState('Spouse');
  const [contactPhone, setContactPhone] = useState('');
  const [notifyOnSos, setNotifyOnSos] = useState(true);

  const fetchEmergencyData = async () => {
    setLoading(true);
    try {
      const [contactsRes, facRes] = await Promise.all([
        api.getEmergencyContacts(),
        api.getFacilities({ emergencyOnly: true }),
      ]);
      setContacts(contactsRes.contacts || []);
      setFacilities(facRes.facilities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  // Timer countdown for demo ambulance ETA
  useEffect(() => {
    let interval: any;
    if (sosActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sosActive, countdown]);

  const handleTriggerSOS = async () => {
    try {
      const res = await api.triggerEmergencySos({
        manualAddress: manualLocation || locationText,
        emergencyType: 'Acute Distress Emergency SOS',
      });
      setSosResult(res);
      setSosActive(true);
      setCountdown(480);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setSosResult(null);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;

    await api.addEmergencyContact({
      name: contactName,
      relation: contactRelation,
      phone: contactPhone,
      notifyOnSos,
    });
    setNewContactModal(false);
    setContactName('');
    setContactPhone('');
    fetchEmergencyData();
  };

  const handleDeleteContact = async (id: string) => {
    await api.deleteEmergencyContact(id);
    fetchEmergencyData();
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setLocationText(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => {
        setLocating(false);
        setLocationText('Bengaluru Central, Karnataka');
      }
    );
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Emergency Response SOS
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">Immediate Helpline Access & Trauma Centers</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Assistance & Trauma Dispatch</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Instant connection to national emergency services, automatic emergency contact alerts, and nearby ICUs.
          </p>
        </div>
      </div>

      {/* Primary Emergency Dialing Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
              National Emergency Services
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <PhoneCall className="w-8 h-8 animate-bounce" />
              <span>DIAL 112</span>
            </div>
            <p className="text-xs text-rose-100 max-w-lg leading-relaxed">
              India's Single Emergency Response Number (Police, Fire, Ambulance). Also accessible globally via <strong>911</strong> (US) or <strong>999</strong> (UK).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="py-3 px-6 rounded-xl bg-white text-rose-700 font-bold text-sm shadow-md hover:bg-rose-50 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Call 112 Directly</span>
            </a>

            {!sosActive ? (
              <button
                onClick={handleTriggerSOS}
                className="py-3 px-6 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-sm shadow-md transition-all border border-rose-400/40 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Trigger In-App SOS</span>
              </button>
            ) : (
              <button
                onClick={handleCancelSOS}
                className="py-3 px-5 rounded-xl bg-gray-900 text-white font-semibold text-xs border border-gray-700 hover:bg-black"
              >
                Cancel Simulated SOS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active SOS Simulation Banner */}
      {sosActive && (
        <div className="card-theme p-6 border-2 border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-rose-600 animate-ping" />
              <h2 className="text-lg font-bold text-rose-900 dark:text-rose-100">
                Simulated Emergency SOS Activated
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-2.5 py-1 rounded-md">
              ETA: {formatCountdown(countdown)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Ambulance Unit</span>
              <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Ambulance className="w-4 h-4 text-rose-600" />
                KA-01-AMB-8842 (ACLS Unit)
              </p>
              <p className="text-[11px] text-gray-500">Driver Contact: +91 99887 76655</p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Dispatched Coordinates</span>
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {manualLocation || locationText}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">GPS Signal Locked</p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Contacts Notified</span>
              <p className="font-bold text-gray-900 dark:text-white">
                {sosResult?.notifiedContacts?.join(', ') || 'Aarav Sharma (Spouse)'}
              </p>
              <p className="text-[11px] text-gray-500">Automated SMS & location ping dispatched</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-100/70 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200 text-xs">
            <strong>Demonstration Simulation:</strong> In an actual acute medical crisis, dial 112 immediately from any phone. Do not rely solely on web applications for emergency rescue dispatch.
          </div>
        </div>
      )}

      {/* Grid: Location & Emergency Contacts & Immediate Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Location & Contacts */}
        <div className="lg:col-span-6 space-y-5">
          {/* Location details */}
          <div className="card-theme p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Current Location for First Responders
              </h3>
              <button
                onClick={handleDetectLocation}
                disabled={locating}
                className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Navigation className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                <span>Refresh GPS</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-800 dark:text-gray-200">
              {locationText}
            </div>

            <div>
              <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                Manual Address / Landmark Override (if GPS inaccurate):
              </label>
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="e.g. Apartment 402, Green Glen Layout, Bellandur, Bengaluru"
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="card-theme p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Designated Emergency Contacts ({contacts.length})
              </h3>
              <button
                onClick={() => setNewContactModal(true)}
                className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Contact
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-gray-400">Loading emergency contacts...</p>
            ) : contacts.length === 0 ? (
              <p className="text-xs text-gray-500">No emergency contacts configured yet.</p>
            ) : (
              <div className="space-y-2">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 bg-white dark:bg-gray-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{c.name}</span>
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.2 rounded-sm">
                          {c.relation}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{c.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100"
                        title="Call contact"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
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

        {/* Right Column: Nearest Emergency Trauma Units & Immediate First Aid Rules */}
        <div className="lg:col-span-6 space-y-5">
          {/* Nearby Emergency Centers */}
          <div className="card-theme p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-rose-600" />
              Nearest 24/7 Trauma Centers & ICUs
            </h3>

            <div className="space-y-2.5">
              {facilities.slice(0, 3).map((fac) => (
                <div
                  key={fac.id}
                  className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {fac.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 block">
                      {fac.area} · <strong className="text-emerald-600">{fac.distanceKm} km</strong>
                    </span>
                  </div>

                  <a
                    href={`tel:${fac.phone}`}
                    className="py-1.5 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Unit</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Critical Life-Saving Guidance */}
          <div className="card-theme p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Critical First-Response Clinical Checklist
            </h3>

            <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                <strong className="text-gray-900 dark:text-white block mb-0.5">Chest Pain / Cardiac Symptoms</strong>
                Have the person sit down, rest comfortably, loosen clothing. If not allergic and advised by emergency dispatch, chew standard adult aspirin (325mg).
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                <strong className="text-gray-900 dark:text-white block mb-0.5">Suspected Stroke (FAST)</strong>
                <strong>F</strong>ace drooping? <strong>A</strong>rm weakness? <strong>S</strong>peech slurred? <strong>T</strong>ime to call 112! Note exact time symptoms began.
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                <strong className="text-gray-900 dark:text-white block mb-0.5">Severe Allergic Reaction (Anaphylaxis)</strong>
                Administer auto-injector epinephrine (EpiPen) into outer mid-thigh if available. Keep person lying flat unless struggling to breathe.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {newContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-sm card-theme p-6 shadow-2xl relative"
            style={{ backgroundColor: 'var(--surface-card)' }}
          >
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Add Emergency Contact
            </h2>
            <form onSubmit={handleAddContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Relationship
                </label>
                <select
                  value={contactRelation}
                  onChange={(e) => setContactRelation(e.target.value)}
                  className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend / Colleague</option>
                  <option value="Physician">Primary Physician</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notify-on-sos-check"
                  checked={notifyOnSos}
                  onChange={(e) => setNotifyOnSos(e.target.checked)}
                  className="rounded-sm border-gray-300 text-emerald-600"
                />
                <label htmlFor="notify-on-sos-check" className="text-gray-700 dark:text-gray-300">
                  Notify this contact when SOS is activated
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setNewContactModal(false)}
                  className="py-1.5 px-3 border border-gray-300 dark:border-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-3 bg-emerald-600 text-white rounded-lg font-semibold"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
