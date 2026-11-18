import React from 'react';

export type BrandLogoVariant = 'icon' | 'emblem' | 'horizontal' | 'vertical';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: number;
  className?: string;
  showSubtitle?: boolean;
}

/**
 * BrandLogo — Official Vector Branding Component for V-Taper Athlete / V-Taping
 * Extracted and engineered from high-precision athletic kinesiology design references.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'icon',
  size = 40,
  className = '',
  showSubtitle = true
}) => {
  // Reusable SVG defs for gradients and glow
  const renderDefs = (prefix: string) => (
    <defs>
      <linearGradient id={`${prefix}vtLeft`} x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0" stopColor="#D91B3A" />
        <stop offset="0.55" stopColor="#C8102E" />
        <stop offset="1" stopColor="#8B0A1F" />
      </linearGradient>
      <linearGradient id={`${prefix}vtRight`} x1="0.85" y1="0" x2="0.15" y2="1">
        <stop offset="0" stopColor="#C8102E" />
        <stop offset="0.6" stopColor="#A50D26" />
        <stop offset="1" stopColor="#6E0818" />
      </linearGradient>
      <linearGradient id={`${prefix}vtFold`} x1="0.15" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8B0A1F" />
        <stop offset="1" stopColor="#4A0510" />
      </linearGradient>
      <radialGradient id={`${prefix}vtGlow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#C8102E" stopOpacity="0.22" />
        <stop offset="1" stopColor="#C8102E" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${prefix}vtShadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#C8102E" stopOpacity="0.45" />
        <stop offset="1" stopColor="#C8102E" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  // Core V-Tape Emblem Vectors (viewBox 0 0 600 600)
  const renderEmblemVectors = (prefix: string, isSmall = false) => (
    <>
      {/* Ambient Red Glow */}
      <circle cx="300" cy="300" r="240" fill={`url(#${prefix}vtGlow)`} />

      {/* Reticle Rings */}
      <circle cx="300" cy="300" r="250" fill="none" stroke="#8B0A1F" strokeWidth={isSmall ? '2.5' : '1.8'} />
      <circle cx="300" cy="300" r="238" fill="none" stroke="#C8102E" strokeWidth={isSmall ? '1.2' : '0.8'} strokeOpacity="0.45" />

      {/* Crosshair Marks */}
      <g stroke="#C8102E" strokeWidth={isSmall ? '3' : '2'} strokeLinecap="round">
        <line x1="300" y1="50" x2="300" y2="30" />
        <line x1="300" y1="50" x2="300" y2="30" transform="rotate(90 300 300)" />
        <line x1="300" y1="50" x2="300" y2="30" transform="rotate(180 300 300)" />
        <line x1="300" y1="50" x2="300" y2="30" transform="rotate(270 300 300)" />
      </g>

      {!isSmall && (
        /* Sub-tick Marks (30 deg intervals) for larger displays */
        <g stroke="#8B0A1F" strokeWidth="1.2" strokeLinecap="round">
          {[30, 60, 120, 150, 210, 240, 300, 330].map(deg => (
            <line key={deg} x1="300" y1="50" x2="300" y2="42" transform={`rotate(${deg} 300 300)`} />
          ))}
        </g>
      )}

      {/* Ground Shadow */}
      <ellipse cx="300" cy="466" rx="86" ry="9" fill={`url(#${prefix}vtShadow)`} />

      {/* Overlapping V-Tape Ribbons */}
      <polygon points="186,160 222,160 300,296.5 300,440 162.8,199.9" fill={`url(#${prefix}vtLeft)`} />
      <polygon points="414,160 378,160 300,296.5 300,440 437.2,199.9" fill={`url(#${prefix}vtRight)`} />

      {/* Bevel Corner Folds */}
      <polygon points="186,160 162.8,199.9 208.8,199.9" fill={`url(#${prefix}vtFold)`} />
      <polygon points="414,160 437.2,199.9 391.2,199.9" fill={`url(#${prefix}vtFold)`} />

      {/* Specular White Highlights */}
      <line x1="186" y1="160" x2="162.8" y2="199.9" stroke="#E8E8E8" strokeWidth={isSmall ? '1.8' : '1.4'} strokeOpacity="0.8" strokeLinecap="round" />
      <line x1="414" y1="160" x2="437.2" y2="199.9" stroke="#E8E8E8" strokeWidth={isSmall ? '1.8' : '0.8'} strokeOpacity="0.8" strokeLinecap="round" />
      <line x1="162.8" y1="199.9" x2="300" y2="440" stroke="#E8E8E8" strokeWidth={isSmall ? '1.8' : '1.4'} strokeOpacity="0.85" strokeLinecap="round" />
      <line x1="437.2" y1="199.9" x2="300" y2="440" stroke="#E8E8E8" strokeWidth={isSmall ? '1.8' : '1.4'} strokeOpacity="0.55" strokeLinecap="round" />
      <line x1="300" y1="296.5" x2="300" y2="440" stroke="#E8E8E8" strokeWidth="1.2" strokeOpacity="0.45" />

      {/* Perforated Athletic Tape Stitches */}
      <line x1="212.4" y1="215" x2="300" y2="368.3" stroke="#0A0A0A" strokeWidth={isSmall ? '2.0' : '1.6'} strokeOpacity="0.6" strokeDasharray="2 6" strokeLinecap="round" />
      <line x1="387.6" y1="215" x2="300" y2="368.3" stroke="#0A0A0A" strokeWidth={isSmall ? '2.0' : '1.6'} strokeOpacity="0.6" strokeDasharray="2 6" strokeLinecap="round" />
    </>
  );

  // Variant 1: App Icon (Dark Rounded Squircle)
  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        className={`shrink-0 select-none ${className}`}
        role="img"
        aria-label="V-Taping App Icon"
      >
        {renderDefs('ico_')}
        <rect width="512" height="512" rx="112" fill="#0A0A0A" />
        <g transform="translate(40, 40) scale(0.72)">
          {renderEmblemVectors('ico_', true)}
        </g>
      </svg>
    );
  }

  // Variant 2: Transparent Emblem Only
  if (variant === 'emblem') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 600 600"
        className={`shrink-0 select-none ${className}`}
        role="img"
        aria-label="V-Taper Emblem"
      >
        {renderDefs('emb_')}
        {renderEmblemVectors('emb_', size < 80)}
      </svg>
    );
  }

  // Variant 3: Horizontal Lockup (Emblem + Typography)
  if (variant === 'horizontal') {
    const emblemSize = Math.max(28, Math.round(size * 0.9));
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <svg
          width={emblemSize}
          height={emblemSize}
          viewBox="0 0 512 512"
          className="shrink-0"
          role="img"
          aria-label="V-Taping Logo"
        >
          {renderDefs('hzi_')}
          <rect width="512" height="512" rx="112" fill="#0A0A0A" />
          <g transform="translate(40, 40) scale(0.72)">
            {renderEmblemVectors('hzi_', true)}
          </g>
        </svg>
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1 font-['Montserrat',sans-serif] tracking-wider leading-none">
            <span className="font-extrabold text-red-600">V</span>
            <span className="font-light text-zinc-400">-</span>
            <span className="font-semibold text-zinc-900 tracking-widest">TAPING</span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] font-bold text-zinc-600 tracking-wider uppercase font-mono mt-0.5">
              Protocol Pro
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variant 4: Vertical Full Logo (Emblem + Divider + Typography)
  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-6 bg-[#0A0A0A] rounded-3xl select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 600 600"
        className="shrink-0"
        role="img"
        aria-label="V-Taping Emblem"
      >
        {renderDefs('vert_')}
        {renderEmblemVectors('vert_', false)}
      </svg>

      <div className="w-24 h-[1px] bg-red-600/70" />

      <div className="flex items-baseline justify-center gap-1.5 font-['Montserrat',sans-serif] text-2xl tracking-[0.2em] leading-none">
        <span className="font-semibold text-red-600">V</span>
        <span className="font-light text-zinc-400">-</span>
        <span className="font-light text-zinc-100">Taping</span>
      </div>
    </div>
  );
};
