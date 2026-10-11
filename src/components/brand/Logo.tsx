import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'compact' | 'symbol';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  theme = 'auto',
  showSubtitle = true,
}) => {
  // Sizing definitions
  const sizeMap = {
    xs: { iconSize: 22, textClass: 'text-sm', subTextClass: 'text-[9px]' },
    sm: { iconSize: 28, textClass: 'text-base', subTextClass: 'text-[10px]' },
    md: { iconSize: 36, textClass: 'text-lg', subTextClass: 'text-[10px]' },
    lg: { iconSize: 44, textClass: 'text-2xl', subTextClass: 'text-xs' },
    xl: { iconSize: 56, textClass: 'text-3xl', subTextClass: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Standalone Brand Icon SVG
  const IconSymbol = () => (
    <svg
      width={currentSize.iconSize}
      height={currentSize.iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="24CareAI Emblem"
    >
      <defs>
        {/* Mint gradient */}
        <linearGradient id="careMintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Pulse glow */}
        <linearGradient id="pulseGlowGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.4" />
        </linearGradient>

        {/* Deep emerald shadow */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#064E3B" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Rounded squircle emblem container */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill="url(#careMintGrad)"
        filter="url(#softGlow)"
      />

      {/* Subtle outer tech-ring accent */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        stroke="#A7F3D0"
        strokeWidth="1.2"
        strokeOpacity="0.4"
      />

      {/* Medical Cross + Heart Vector Fusion */}
      {/* Heart Contour Path */}
      <path
        d="M32 50.5C32 50.5 13 38.5 13 25.5C13 18.5 18.5 13 25.5 13C29 13 31.2 14.8 32 16.2C32.8 14.8 35 13 38.5 13C45.5 13 51 18.5 51 25.5C51 38.5 32 50.5 32 50.5Z"
        fill="#064E3B"
        fillOpacity="0.22"
      />

      {/* Active ECG Pulse & Neural Node Line */}
      {/* Path starting from left, forming ECG heartbeat pulse with connected AI nodes */}
      <path
        d="M14 30.5H23L27 21L33 41L38 27L41.5 33L44 30.5H50"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle secondary wave shadow */}
      <path
        d="M14 30.5H23L27 21L33 41L38 27L41.5 33L44 30.5H50"
        stroke="#A7F3D0"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Neural AI Nodes on the pulse */}
      {/* Node 1: Top Peak */}
      <circle cx="27" cy="21" r="2.4" fill="#FFFFFF" />
      <circle cx="27" cy="21" r="4.2" stroke="#A7F3D0" strokeWidth="1" opacity="0.8" />

      {/* Node 2: Bottom V-node */}
      <circle cx="33" cy="41" r="2.2" fill="#FFFFFF" />

      {/* Node 3: AI Core Node */}
      <circle cx="38" cy="27" r="2.6" fill="#F0FDF4" />
      <circle cx="38" cy="27" r="5" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

      {/* Sub-node connector dot at 24h clock marker */}
      <circle cx="49" cy="18" r="2.2" fill="#A7F3D0" />
      <circle cx="49" cy="18" r="1.2" fill="#064E3B" />
    </svg>
  );

  if (variant === 'icon' || variant === 'symbol') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <IconSymbol />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <IconSymbol />

      <div className="flex flex-col justify-center leading-none">
        <div className={`font-extrabold tracking-tight flex items-center ${currentSize.textClass}`}>
          <span className="text-gray-900 dark:text-white">24Care</span>
          <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-black">AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 inline-block animate-pulse" />
        </div>

        {showSubtitle && variant === 'horizontal' && (
          <span
            className={`font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mt-1 ${currentSize.subTextClass}`}
          >
            Intelligent Health Platform
          </span>
        )}
      </div>
    </div>
  );
};
