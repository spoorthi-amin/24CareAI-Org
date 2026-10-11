import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Heart, Shield, Stethoscope, AlertCircle } from 'lucide-react';
import { Logo } from '../brand/Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, switchRoleQuick } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consent, setConsent] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to sign in');
      }
    } else {
      if (!consent) {
        setLoading(false);
        setError('Please agree to health data storage and privacy terms');
        return;
      }
      const res = await register({
        name,
        email,
        password,
        role,
        phone,
        age: age ? Number(age) : undefined,
        gender,
        bloodGroup,
        allergies: allergies ? allergies.split(',').map((s) => s.trim()) : [],
        chronicConditions: chronicConditions ? chronicConditions.split(',').map((s) => s.trim()) : [],
        specialty: role === 'doctor' ? specialty : undefined,
      });
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to create account');
      }
    }
  };

  const handleQuickDemo = async (targetRole: 'patient' | 'doctor' | 'admin') => {
    setLoading(true);
    await switchRoleQuick(targetRole);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto card-theme p-6 shadow-2xl relative"
        style={{ backgroundColor: 'var(--surface-card)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <Logo variant="icon" size="lg" className="mx-auto mb-2.5" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back to 24CareAI' : 'Create Your 24CareAI Account'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {mode === 'login'
              ? 'Access your Personal Health Memory and AI Triage'
              : 'Secure, private, and personalized health management'}
          </p>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="mb-5 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/20">
          <span className="block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 text-center">
            Instant Exploration (1-Click Demo)
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleQuickDemo('patient')}
              disabled={loading}
              className="py-1.5 px-2 bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 rounded-lg text-[11px] font-medium text-gray-800 dark:text-gray-200 hover:bg-emerald-50 text-center transition-colors"
            >
              Patient (Priya)
            </button>
            <button
              onClick={() => handleQuickDemo('doctor')}
              disabled={loading}
              className="py-1.5 px-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded-lg text-[11px] font-medium text-gray-800 dark:text-gray-200 hover:bg-blue-50 text-center transition-colors"
            >
              Doctor (Rajesh)
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              disabled={loading}
              className="py-1.5 px-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 rounded-lg text-[11px] font-medium text-gray-800 dark:text-gray-200 hover:bg-purple-50 text-center transition-colors"
            >
              System Admin
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800/50 mb-4">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'register'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rohan Mehta or Anita Roy"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {role === 'patient' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="30"
                        className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full py-2 px-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full py-2 px-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Known Allergies (optional)</label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, Shellfish, Peanuts"
                      className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              {role === 'doctor' && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Specialty & Qualifications</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology, MBBS MD"
                    className="w-full py-2 px-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="consent-check"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="consent-check" className="text-[11px] text-gray-600 dark:text-gray-400 leading-tight">
                I understand 24CareAI stores health memory for personal clinical organization and triage assistance. I consent to secure encrypted data processing.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
            style={{
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-btn)',
            }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
