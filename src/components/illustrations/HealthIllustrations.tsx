import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number | string;
}

// 1. Hero Illustration: Doctor & Patient with Floating Health Metrics
export const HeroHealthIllustration: React.FC<IllustrationProps> = ({ className = '', size = '100%' }) => {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-lg mx-auto ${className}`}
      style={{ maxHeight: 380 }}
      aria-label="24CareAI Intelligent Healthcare Overview"
    >
      <defs>
        <linearGradient id="heroBgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#D1FAE5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F0FDF4" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id="doctorCoat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E6F4EA" />
        </linearGradient>

        <linearGradient id="mintAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="darkForestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>

        <filter id="floatCardShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#064E3B" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Background Soft Organic Glow */}
      <circle cx="270" cy="190" r="150" fill="url(#heroBgGlow)" />
      <path
        d="M80 180C80 110 160 70 270 70C380 70 460 120 460 190C460 270 370 310 270 310C170 310 80 260 80 180Z"
        fill="#A7F3D0"
        fillOpacity="0.18"
      />

      {/* Ambient Neural Grid Dots */}
      <g opacity="0.4">
        <circle cx="120" cy="90" r="2.5" fill="#059669" />
        <circle cx="160" cy="110" r="2" fill="#10B981" />
        <circle cx="390" cy="80" r="2.5" fill="#059669" />
        <circle cx="430" cy="120" r="2" fill="#10B981" />
        <circle cx="460" cy="240" r="2.5" fill="#059669" />
        <circle cx="90" cy="230" r="2" fill="#10B981" />
        <line x1="120" y1="90" x2="160" y2="110" stroke="#34D399" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="390" y1="80" x2="430" y2="120" stroke="#34D399" strokeWidth="0.8" strokeDasharray="2 2" />
      </g>

      {/* Healthcare Professional (Doctor Character - Left Center) */}
      <g transform="translate(145, 110)">
        {/* Shadow */}
        <ellipse cx="65" cy="210" rx="45" ry="8" fill="#064E3B" fillOpacity="0.08" />
        {/* Doctor Torso / Lab Coat */}
        <path
          d="M30 110C30 90 45 80 65 80C85 80 100 90 100 110V205H30V110Z"
          fill="url(#doctorCoat)"
          stroke="#D1D5DB"
          strokeWidth="1.2"
        />
        {/* Teal Inner Scrub */}
        <path d="M50 80H80V125L65 140L50 125V80Z" fill="#059669" />
        {/* Stethoscope */}
        <path
          d="M52 82C52 105 58 122 65 122C72 122 78 105 78 82"
          stroke="#064E3B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="65" cy="127" r="4.5" fill="#10B981" stroke="#064E3B" strokeWidth="1.5" />
        {/* Doctor Head */}
        <circle cx="65" cy="52" r="22" fill="#FCD34D" />
        {/* Professional Hair */}
        <path
          d="M43 48C43 32 52 24 65 24C78 24 87 32 87 48C84 39 76 34 65 34C54 34 46 39 43 48Z"
          fill="#1F2937"
        />
        {/* Gentle Face Details */}
        <circle cx="58" cy="52" r="2" fill="#4B5563" />
        <circle cx="72" cy="52" r="2" fill="#4B5563" />
        <path d="M62 61C63.5 63 66.5 63 68 61" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
        {/* Doctor Clipboard */}
        <rect x="78" y="125" width="30" height="42" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
        <line x1="84" y1="135" x2="102" y2="135" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="84" y1="142" x2="98" y2="142" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="84" y1="149" x2="94" y2="149" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Patient Character (Right Center) */}
      <g transform="translate(265, 125)">
        {/* Shadow */}
        <ellipse cx="65" cy="195" rx="42" ry="7" fill="#064E3B" fillOpacity="0.08" />
        {/* Patient Body */}
        <path
          d="M35 105C35 88 48 80 65 80C82 80 95 88 95 105V190H35V105Z"
          fill="#D1FAE5"
          stroke="#A7F3D0"
          strokeWidth="1.2"
        />
        {/* Casual Shirt Collar */}
        <path d="M54 80L65 96L76 80" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
        {/* Patient Head */}
        <circle cx="65" cy="52" r="21" fill="#FBBF24" />
        {/* Hair */}
        <path
          d="M44 46C44 30 54 26 65 26C76 26 86 30 86 46C83 38 74 34 65 34C56 34 47 38 44 46Z"
          fill="#374151"
        />
        {/* Patient Smile */}
        <circle cx="58" cy="52" r="1.8" fill="#374151" />
        <circle cx="72" cy="52" r="1.8" fill="#374151" />
        <path d="M60 61C62.5 64 67.5 64 70 61" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Floating Interactive Health Cards with drop shadows */}
      {/* 1. Heart Rate / Pulse Card (Top Left) */}
      <g transform="translate(48, 55)" filter="url(#floatCardShadow)">
        <rect x="0" y="0" width="135" height="66" rx="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="22" cy="22" r="12" fill="#ECFDF5" />
        <path
          d="M17 21C17 18.5 19 17 21 17C22 17 22.8 17.5 23 18C23.2 17.5 24 17 25 17C27 17 29 18.5 29 21C29 24.5 23 27 23 27C23 27 17 24.5 17 21Z"
          fill="#059669"
        />
        <text x="40" y="20" fill="#6B7280" fontSize="10" fontWeight="600" fontFamily="sans-serif">PULSE RATE</text>
        <text x="40" y="32" fill="#111827" fontSize="13" fontWeight="800" fontFamily="sans-serif">72 BPM</text>
        {/* Mini ECG Waveform */}
        <path
          d="M14 48H32L36 40L42 56L46 44L49 50L52 48H122"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* 2. SpO2 Oxygen Saturation Card (Top Right) */}
      <g transform="translate(365, 45)" filter="url(#floatCardShadow)">
        <rect x="0" y="0" width="128" height="64" rx="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="22" cy="22" r="12" fill="#EFF6FF" />
        <path
          d="M22 16L24.5 20.5C25.5 22.5 25 25 23 26C21 27 18.5 26 17.5 24C16.5 22 17 19.5 19 18.5L22 16Z"
          fill="#0284C7"
        />
        <text x="40" y="20" fill="#6B7280" fontSize="10" fontWeight="600" fontFamily="sans-serif">OXYGEN (SpO2)</text>
        <text x="40" y="34" fill="#111827" fontSize="14" fontWeight="800" fontFamily="sans-serif">99%</text>
        <text x="40" y="50" fill="#059669" fontSize="10" fontWeight="600" fontFamily="sans-serif">● Optimal Range</text>
      </g>

      {/* 3. AI Triage Status Badge (Bottom Right) */}
      <g transform="translate(350, 260)" filter="url(#floatCardShadow)">
        <rect x="0" y="0" width="155" height="58" rx="14" fill="#FFFFFF" stroke="#D1FAE5" strokeWidth="1.5" />
        <circle cx="22" cy="29" r="12" fill="#D1FAE5" />
        <path
          d="M17 29L20.5 32.5L27 26"
          stroke="#064E3B"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="42" y="24" fill="#064E3B" fontSize="11" fontWeight="700" fontFamily="sans-serif">Triage Status</text>
        <text x="42" y="38" fill="#4B5563" fontSize="10" fontWeight="500" fontFamily="sans-serif">Primary Care · Ready</text>
        <circle cx="140" cy="18" r="4" fill="#10B981" />
      </g>
    </svg>
  );
};

// 2. AI Triage Illustration: Abstract profile with neural heartbeat nodes
export const TriageIllustration: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-xs mx-auto ${className}`}
      aria-label="AI Clinical Triage Diagram"
    >
      <defs>
        <linearGradient id="triageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Subtle background glow */}
      <circle cx="140" cy="100" r="75" fill="#D1FAE5" fillOpacity="0.45" />

      {/* Abstract human head profile */}
      <path
        d="M110 50C135 50 155 68 155 92C155 104 150 114 142 122C140 126 142 135 148 145H85C90 135 92 126 90 122C82 114 77 104 77 92C77 68 97 50 110 50Z"
        fill="#FFFFFF"
        stroke="#A7F3D0"
        strokeWidth="2"
      />

      {/* Neural AI Thinking Nodes inside profile */}
      <circle cx="110" cy="78" r="3.5" fill="#059669" />
      <circle cx="125" cy="90" r="3" fill="#10B981" />
      <circle cx="102" cy="96" r="3" fill="#10B981" />
      <circle cx="122" cy="110" r="2.5" fill="#34D399" />
      <line x1="110" y1="78" x2="125" y2="90" stroke="#059669" strokeWidth="1.2" />
      <line x1="110" y1="78" x2="102" y2="96" stroke="#059669" strokeWidth="1.2" />
      <line x1="102" y1="96" x2="122" y2="110" stroke="#10B981" strokeWidth="1.2" />

      {/* Continuous ECG Pulse traversing across */}
      <path
        d="M25 100H85L95 82L105 125L118 72L128 112L135 95L142 100H255"
        stroke="url(#triageGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pulse beacon radar points */}
      <circle cx="118" cy="72" r="5" fill="#059669" />
      <circle cx="118" cy="72" r="9" stroke="#34D399" strokeWidth="1.2" opacity="0.6" />
      <circle cx="210" cy="100" r="3" fill="#059669" />
      <circle cx="240" cy="100" r="2" fill="#10B981" />
    </svg>
  );
};

// 3. Personal Health Memory Illustration: Dossier, Timeline & Stethoscope
export const HealthMemoryIllustration: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 260 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-xs mx-auto ${className}`}
      aria-label="Personal Health Memory Dossier"
    >
      {/* Background Soft Shield */}
      <path
        d="M130 15C175 15 210 28 210 65C210 120 165 158 130 172C95 158 50 120 50 65C50 28 85 15 130 15Z"
        fill="#F0FDF4"
        stroke="#D1FAE5"
        strokeWidth="1.5"
      />

      {/* Medical Dossier Folder */}
      <rect x="75" y="48" width="110" height="92" rx="10" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
      <path d="M75 58C75 52.5 79.5 48 85 48H120L130 58H175C180.5 58 185 62.5 185 68V72H75V58Z" fill="#D1FAE5" />

      {/* Timeline nodes inside */}
      <circle cx="95" cy="88" r="4" fill="#059669" />
      <line x1="95" y1="92" x2="95" y2="120" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="95" cy="120" r="4" fill="#10B981" />

      {/* Document Lines */}
      <line x1="108" y1="88" x2="162" y2="88" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      <line x1="108" y1="104" x2="152" y2="104" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="108" y1="120" x2="145" y2="120" stroke="#059669" strokeWidth="2" strokeLinecap="round" />

      {/* Floating pill capsule icon */}
      <g transform="translate(162, 115)">
        <rect x="0" y="0" width="28" height="12" rx="6" fill="#059669" />
        <rect x="14" y="0" width="14" height="12" rx="6" fill="#A7F3D0" />
      </g>
    </svg>
  );
};

// 4. Medical Report OCR Illustration: Lab Page with Magnifier & Scan Ray
export const MedicalReportIllustration: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 260 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-xs mx-auto ${className}`}
      aria-label="Medical Report Scanner"
    >
      {/* Document Sheet */}
      <rect x="65" y="25" width="130" height="142" rx="8" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
      {/* Top Header Strip */}
      <rect x="75" y="36" width="40" height="6" rx="3" fill="#059669" />
      <rect x="155" y="36" width="30" height="4" rx="2" fill="#9CA3AF" />

      {/* Lab Result Bars */}
      <line x1="75" y1="56" x2="175" y2="56" stroke="#E5E7EB" strokeWidth="1" />
      <rect x="75" y="65" width="45" height="5" rx="2" fill="#374151" />
      <rect x="145" y="65" width="35" height="5" rx="2" fill="#059669" />

      <rect x="75" y="80" width="55" height="5" rx="2" fill="#374151" />
      <rect x="145" y="80" width="30" height="5" rx="2" fill="#10B981" />

      <rect x="75" y="95" width="40" height="5" rx="2" fill="#374151" />
      <rect x="145" y="95" width="38" height="5" rx="2" fill="#059669" />

      <line x1="75" y1="110" x2="175" y2="110" stroke="#E5E7EB" strokeWidth="1" />
      <rect x="75" y="120" width="80" height="4" rx="2" fill="#9CA3AF" />
      <rect x="75" y="130" width="60" height="4" rx="2" fill="#9CA3AF" />

      {/* Laser Scanning Beam Across Report */}
      <line x1="60" y1="88" x2="200" y2="88" stroke="#34D399" strokeWidth="2.5" strokeOpacity="0.85" />
      <rect x="62" y="86" width="136" height="4" fill="#A7F3D0" fillOpacity="0.3" />

      {/* Magnifying Glass examining values */}
      <g transform="translate(130, 75)">
        <circle cx="28" cy="28" r="22" fill="#FFFFFF" fillOpacity="0.8" stroke="#064E3B" strokeWidth="2.5" />
        <circle cx="28" cy="28" r="16" fill="#D1FAE5" fillOpacity="0.3" />
        <line x1="44" y1="44" x2="62" y2="62" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" />
        {/* Checkmark inside glass */}
        <path d="M22 28L26 32L34 24" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// 5. Doctor Brief Illustration: Structured SBAR Clinical Summary
export const DoctorBriefIllustration: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 260 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-xs mx-auto ${className}`}
      aria-label="Clinical Consultation Brief"
    >
      {/* Background Clinical Glow */}
      <rect x="50" y="20" width="160" height="150" rx="14" fill="#F0FDF4" />

      {/* Main Clinical Clipboard */}
      <rect x="65" y="32" width="130" height="135" rx="8" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />

      {/* Top Clip */}
      <path d="M105 24H155V36H105V24Z" rx="4" fill="#064E3B" />
      <circle cx="130" cy="30" r="3" fill="#A7F3D0" />

      {/* SBAR Section 1: Situation */}
      <rect x="80" y="48" width="35" height="5" rx="2" fill="#059669" />
      <line x1="80" y1="60" x2="175" y2="60" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <line x1="80" y1="68" x2="155" y2="68" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

      {/* SBAR Section 2: Background / Allergies */}
      <rect x="80" y="80" width="45" height="5" rx="2" fill="#E11D48" />
      <line x1="80" y1="92" x2="165" y2="92" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" />

      {/* SBAR Section 3: Assessment & Questions */}
      <rect x="80" y="104" width="40" height="5" rx="2" fill="#059669" />
      <line x1="80" y1="116" x2="170" y2="116" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="80" y1="124" x2="140" y2="124" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Official Clinical Seal Stamp */}
      <g transform="translate(148, 122)">
        <circle cx="18" cy="18" r="14" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M14 18L17 21L23 15" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// 6. Doctor Discovery Illustration: Clinician & Hospital Map Pin
export const DoctorDiscoveryIllustration: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 260 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-xs mx-auto ${className}`}
      aria-label="Doctor Directory Map"
    >
      {/* Soft Map Radar Grid */}
      <circle cx="130" cy="95" r="70" fill="#F0FDF4" stroke="#D1FAE5" strokeWidth="1.2" />
      <circle cx="130" cy="95" r="45" stroke="#A7F3D0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="60" y1="95" x2="200" y2="95" stroke="#D1FAE5" strokeWidth="1" />
      <line x1="130" y1="25" x2="130" y2="165" stroke="#D1FAE5" strokeWidth="1" />

      {/* Hospital Building Silhouette */}
      <rect x="75" y="80" width="36" height="42" rx="4" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.2" />
      <path d="M93 88V96M89 92H97" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
      <rect x="83" y="102" width="6" height="8" fill="#D1D5DB" />
      <rect x="97" y="102" width="6" height="8" fill="#D1D5DB" />

      {/* Prominent Geolocation Map Pin */}
      <g transform="translate(125, 45)">
        <path
          d="M20 0C8.95 0 0 8.95 0 20C0 35 20 54 20 54C20 54 40 35 40 20C40 8.95 31.05 0 20 0Z"
          fill="#059669"
        />
        <circle cx="20" cy="18" r="8" fill="#FFFFFF" />
        {/* Stethoscope icon inside pin */}
        <path
          d="M17 15V19C17 20.6 18.3 22 20 22C21.7 22 23 20.6 23 19V15"
          stroke="#059669"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

// 7. Appointment Calendar Illustration: Confirmed Consultation
export const AppointmentIllustration: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 260 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-xs mx-auto ${className}`}
      aria-label="Appointment Calendar"
    >
      {/* Calendar Base */}
      <rect x="65" y="35" width="130" height="120" rx="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
      {/* Top Header Banner */}
      <path d="M65 49C65 41.3 71.3 35 79 35H181C188.7 35 195 41.3 195 49V62H65V49Z" fill="#059669" />

      {/* Spiral Binder Rings */}
      <rect x="90" y="27" width="6" height="14" rx="3" fill="#064E3B" />
      <rect x="130" y="27" width="6" height="14" rx="3" fill="#064E3B" />
      <rect x="165" y="27" width="6" height="14" rx="3" fill="#064E3B" />

      {/* Calendar Month & Day Grid */}
      <g fill="#9CA3AF" opacity="0.6">
        <circle cx="90" cy="82" r="5" />
        <circle cx="115" cy="82" r="5" />
        <circle cx="140" cy="82" r="5" />
        <circle cx="165" cy="82" r="5" />

        <circle cx="90" cy="105" r="5" />
        <circle cx="115" cy="105" r="5" />
        {/* Highlighted Appointment Date */}
        <circle cx="140" cy="105" r="10" fill="#059669" opacity="1" />
        <text x="136" y="109" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">18</text>
        <circle cx="165" cy="105" r="5" />

        <circle cx="90" cy="128" r="5" />
        <circle cx="115" cy="128" r="5" />
        <circle cx="140" cy="128" r="5" />
      </g>

      {/* Confirmation Badge Overlay */}
      <g transform="translate(160, 115)">
        <circle cx="18" cy="18" r="14" fill="#10B981" />
        <path d="M13 18L16.5 21.5L23 15" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// 8. Empty States (Coordinated clean vector artwork)
export const EmptyStateIllustration: React.FC<{
  type: 'history' | 'reports' | 'appointments' | 'search';
  className?: string;
}> = ({ type, className = '' }) => {
  if (type === 'reports') {
    return (
      <svg viewBox="0 0 160 120" fill="none" className={`w-32 h-24 mx-auto ${className}`}>
        <circle cx="80" cy="60" r="45" fill="#F0FDF4" />
        <rect x="55" y="32" width="50" height="60" rx="6" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.5" />
        <line x1="65" y1="48" x2="95" y2="48" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
        <line x1="65" y1="58" x2="85" y2="58" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
        <circle cx="95" cy="75" r="12" fill="#D1FAE5" />
        <path d="M95 70V80M90 75H100" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'appointments') {
    return (
      <svg viewBox="0 0 160 120" fill="none" className={`w-32 h-24 mx-auto ${className}`}>
        <circle cx="80" cy="60" r="45" fill="#F0FDF4" />
        <rect x="52" y="35" width="56" height="52" rx="8" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.5" />
        <path d="M52 45C52 39.5 56.5 35 62 35H98C103.5 35 108 39.5 108 45V48H52V45Z" fill="#059669" />
        <circle cx="70" cy="62" r="3" fill="#D1D5DB" />
        <circle cx="80" cy="62" r="3" fill="#D1D5DB" />
        <circle cx="90" cy="62" r="3" fill="#D1D5DB" />
        <circle cx="70" cy="74" r="3" fill="#D1D5DB" />
        <circle cx="80" cy="74" r="3" fill="#059669" />
      </svg>
    );
  }

  if (type === 'search') {
    return (
      <svg viewBox="0 0 160 120" fill="none" className={`w-32 h-24 mx-auto ${className}`}>
        <circle cx="80" cy="60" r="45" fill="#F0FDF4" />
        <circle cx="74" cy="54" r="18" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
        <line x1="88" y1="67" x2="102" y2="81" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="74" cy="54" r="7" fill="#A7F3D0" fillOpacity="0.5" />
      </svg>
    );
  }

  // Default: history
  return (
    <svg viewBox="0 0 160 120" fill="none" className={`w-32 h-24 mx-auto ${className}`}>
      <circle cx="80" cy="60" r="45" fill="#F0FDF4" />
      <path
        d="M80 82C80 82 55 67 55 51C55 42 62 35 71 35C76 35 78.5 37 80 39C81.5 37 84 35 89 35C98 35 105 42 105 51C105 67 80 82 80 82Z"
        fill="#FFFFFF"
        stroke="#A7F3D0"
        strokeWidth="1.8"
      />
      <circle cx="80" cy="53" r="5" fill="#D1FAE5" />
      <path d="M72 53H77L79 48L82 58L84 53H88" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
