import React from 'react';

/**
 * RainbowGlassesBackground
 *
 * Lightweight, high-performance pure SVG + CSS background.
 * Completely eliminates heavy 3D WebGL runtimes while providing
 * an elegant, fixed diagonal eyeglasses design with vibrant, smooth
 * rainbow gradient glows.
 */
export const RainbowGlassesBackground = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Ambient Rainbow Aura Underlays */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-400/25 via-sky-500/20 to-purple-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/3 -right-36 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-pink-500/20 via-orange-400/20 to-amber-300/15 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-emerald-400/15 via-cyan-400/20 to-indigo-500/20 blur-[110px] animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Main Diagonal SVG Canvas */}
      <svg
        className="w-full h-full object-cover rainbow-bg-animated"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Smooth Multi-stop Rainbow Linear Gradients */}
          <linearGradient id="rainbow-grad-diagonal-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF007A" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#7928CA" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#0070F3" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#00DFD8" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#00E775" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFBE0B" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="rainbow-grad-diagonal-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#7000FF" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FF007A" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#FF7A00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFEB3B" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="rainbow-grad-diagonal-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.75" />
            <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#EC4899" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.75" />
          </linearGradient>

          {/* Lens Glass Subtle Rainbow Shimmer */}
          <linearGradient id="lens-rainbow-tint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.08" />
            <stop offset="35%" stopColor="#A855F7" stopOpacity="0.06" />
            <stop offset="70%" stopColor="#EC4899" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.05" />
          </linearGradient>

          {/* Diagonal Stream Track Gradient */}
          <linearGradient id="diagonal-stream-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.0" />
            <stop offset="25%" stopColor="#0070F3" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FF007A" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#FFBE0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00E775" stopOpacity="0.0" />
          </linearGradient>

          {/* Intense Rainbow Glow Filter */}
          <filter id="rainbow-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft Ambient Outer Glow */}
          <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Reusable Eyeglasses Master Symbol 1: Classic Architectural Aviator */}
          <g id="aviator-glasses">
            {/* Left Lens Glass Fill with Rainbow Tint */}
            <path
              d="M 38,32 C 38,18 56,12 86,13 C 114,14 124,30 120,48 C 115,66 90,72 62,70 C 42,68 38,48 38,32 Z"
              fill="url(#lens-rainbow-tint)"
            />
            {/* Right Lens Glass Fill with Rainbow Tint */}
            <path
              d="M 160,13 C 190,12 208,18 208,32 C 208,48 204,68 184,70 C 156,72 131,66 126,48 C 122,30 132,14 160,13 Z"
              fill="url(#lens-rainbow-tint)"
            />
            
            {/* Outer Rims */}
            <path
              d="M 38,32 C 38,18 56,12 86,13 C 114,14 124,30 120,48 C 115,66 90,72 62,70 C 42,68 38,48 38,32 Z"
              fill="none"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 160,13 C 190,12 208,18 208,32 C 208,48 204,68 184,70 C 156,72 131,66 126,48 C 122,30 132,14 160,13 Z"
              fill="none"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Double Brow & Nose Bridge */}
            <path d="M 119,30 C 126,24 139,24 146,30" fill="none" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 84,14 C 115,8 150,8 181,14" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

            {/* Hinges & Temple Arms */}
            <path d="M 38,26 L 14,21 L -6,27" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 208,26 L 232,21 L 252,27" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

            {/* Nose Pads */}
            <ellipse cx="116" cy="42" rx="2.5" ry="5.5" transform="rotate(20 116 42)" fill="currentColor" opacity="0.7" />
            <ellipse cx="130" cy="42" rx="2.5" ry="5.5" transform="rotate(-20 130 42)" fill="currentColor" opacity="0.7" />

            {/* Diagonal Lens Highlights / Prismatic Gleams */}
            <path d="M 52,28 L 74,24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <path d="M 50,37 L 62,35" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
            <path d="M 172,28 L 194,24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <path d="M 170,37 L 182,35" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
          </g>

          {/* Reusable Eyeglasses Master Symbol 2: Modern Round / Geometric Studio Frame */}
          <g id="round-studio-glasses">
            {/* Lenses */}
            <circle cx="70" cy="45" r="32" fill="url(#lens-rainbow-tint)" />
            <circle cx="176" cy="45" r="32" fill="url(#lens-rainbow-tint)" />
            {/* Rims */}
            <circle cx="70" cy="45" r="32" fill="none" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="176" cy="45" r="32" fill="none" strokeWidth="3.2" strokeLinecap="round" />
            {/* Keyhole Bridge */}
            <path d="M 102,42 C 108,34 138,34 144,42 C 141,48 135,50 133,54 C 131,58 135,62 136,62 L 110,62 C 111,62 115,58 113,54 C 111,50 105,48 102,42 Z" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Temple Endpieces */}
            <path d="M 38,42 L 12,38 L -4,44" fill="none" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 208,42 L 234,38 L 250,44" fill="none" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Lens Glare */}
            <path d="M 52,30 C 58,22 75,20 86,24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M 158,30 C 164,22 181,20 192,24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        </defs>

        {/* ── DIAGONAL LIGHT STREAM GUIDES ── */}
        <g opacity="0.45">
          <line x1="-200" y1="200" x2="1800" y2="1200" stroke="url(#diagonal-stream-grad)" strokeWidth="1.5" strokeDasharray="16 24" />
          <line x1="-100" y1="-50" x2="1900" y2="950" stroke="url(#diagonal-stream-grad)" strokeWidth="2" strokeDasharray="12 18" />
          <line x1="200" y1="-250" x2="2000" y2="650" stroke="url(#diagonal-stream-grad)" strokeWidth="1" strokeDasharray="8 14" />
          <line x1="-400" y1="450" x2="1600" y2="1450" stroke="url(#diagonal-stream-grad)" strokeWidth="1.2" strokeDasharray="20 30" />
        </g>

        {/* ── DIAGONAL CASCADE OF RAINBOW EYEGLASSES ── */}

        {/* 1. Upper Left Diagonal Stream - Medium Studio Frame */}
        <g
          transform="translate(180, 80) rotate(-26) scale(1.15)"
          stroke="url(#rainbow-grad-diagonal-1)"
          filter="url(#rainbow-glow)"
          className="opacity-90 transition-transform duration-1000 hover:scale-125"
        >
          <use href="#aviator-glasses" />
        </g>

        {/* 2. Top-Center Diagonal Accent - Round Frame with Smooth Rainbow Glow */}
        <g
          transform="translate(680, 40) rotate(-24) scale(0.95)"
          stroke="url(#rainbow-grad-diagonal-2)"
          filter="url(#rainbow-glow)"
          className="opacity-80"
        >
          <use href="#round-studio-glasses" />
        </g>

        {/* 3. Top Right Floating Accent - Micro Aviator */}
        <g
          transform="translate(1250, 90) rotate(-28) scale(0.75)"
          stroke="url(#rainbow-grad-diagonal-3)"
          filter="url(#soft-glow)"
          className="opacity-75"
        >
          <use href="#aviator-glasses" />
        </g>

        {/* 4. HERO DIAGONAL GLASSES: Center-Right Majestic Statement Frame */}
        <g
          transform="translate(980, 360) rotate(-27) scale(1.65)"
          stroke="url(#rainbow-grad-diagonal-1)"
          filter="url(#rainbow-glow)"
          className="opacity-95"
        >
          <use href="#aviator-glasses" />
          {/* Subtle Halo Aura around Hero Glasses */}
          <circle cx="123" cy="40" r="110" fill="url(#rainbow-grad-diagonal-1)" opacity="0.04" />
        </g>

        {/* 5. Center-Left Diagonal Counterpart - Elegant Round Studio Frame */}
        <g
          transform="translate(260, 430) rotate(-25) scale(1.3)"
          stroke="url(#rainbow-grad-diagonal-2)"
          filter="url(#rainbow-glow)"
          className="opacity-85"
        >
          <use href="#round-studio-glasses" />
        </g>

        {/* 6. Midfield Center Diagonal Accent */}
        <g
          transform="translate(620, 520) rotate(-28) scale(0.85)"
          stroke="url(#rainbow-grad-diagonal-3)"
          filter="url(#soft-glow)"
          className="opacity-70"
        >
          <use href="#aviator-glasses" />
        </g>

        {/* 7. Lower Left Diagonal Accent */}
        <g
          transform="translate(80, 780) rotate(-23) scale(1.2)"
          stroke="url(#rainbow-grad-diagonal-1)"
          filter="url(#rainbow-glow)"
          className="opacity-85"
        >
          <use href="#aviator-glasses" />
        </g>

        {/* 8. Lower Center-Right Stream - Statement Studio Frame */}
        <g
          transform="translate(740, 790) rotate(-26) scale(1.4)"
          stroke="url(#rainbow-grad-diagonal-2)"
          filter="url(#rainbow-glow)"
          className="opacity-90"
        >
          <use href="#round-studio-glasses" />
        </g>

        {/* 9. Bottom Right Outflow Stream - Diagonal Aviator Frame */}
        <g
          transform="translate(1320, 720) rotate(-25) scale(1.25)"
          stroke="url(#rainbow-grad-diagonal-3)"
          filter="url(#rainbow-glow)"
          className="opacity-80"
        >
          <use href="#aviator-glasses" />
        </g>

        {/* 10. Far Edge Floating Prismatic Sparkles along Diagonal Rays */}
        <g fill="url(#rainbow-grad-diagonal-1)" opacity="0.6">
          <polygon points="450,220 454,230 464,234 454,238 450,248 446,238 436,234 446,230" />
          <polygon points="890,160 893,168 901,171 893,174 890,182 887,174 879,171 887,168" />
          <polygon points="1220,440 1224,450 1234,454 1224,458 1220,468 1216,458 1206,454 1216,450" />
          <polygon points="340,680 343,688 351,691 343,694 340,702 337,694 329,691 337,688" />
          <polygon points="1100,820 1104,830 1114,834 1104,838 1100,848 1096,838 1086,834 1096,830" />
        </g>
      </svg>
    </div>
  );
};
