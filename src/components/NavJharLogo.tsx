import React from 'react';

interface NavJharLogoProps {
  variant?: 'icon' | 'full' | 'compact';
  className?: string;
}

export const NavJharLogo: React.FC<NavJharLogoProps> = ({ 
  variant = 'full', 
  className = '' 
}) => {
  
  // Base SVG Icon Component (Dark Mode Optimized)
  const LogoIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 240 160" 
      className="w-full h-full"
      fill="none"
    >
      {/* N Background Path (Navy in Light Mode, White in Dark Mode) */}
      <path 
        d="M 60 85 C 80 40 100 35 120 60 L 145 95 C 165 125 185 110 195 80" 
        className="stroke-[#123B63] dark:stroke-white transition-colors"
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Forest Green Network Line */}
      <path 
        d="M 100 65 L 150 120" 
        className="stroke-[#2E6B4E] dark:stroke-[#4ade80] transition-colors"
        strokeWidth="12" 
        strokeLinecap="round" 
      />
      
      {/* Left Leaf (Fills adapt to background) */}
      <path 
        d="M 60 140 C 40 110 60 70 100 65 C 80 90 70 120 60 140 Z" 
        className="stroke-[#2E6B4E] dark:stroke-[#4ade80] fill-white dark:fill-slate-900 transition-colors"
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 65 130 L 90 85" 
        className="stroke-[#2E6B4E] dark:stroke-[#4ade80] transition-colors"
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      
      {/* Right Leaf */}
      <path 
        d="M 190 40 C 210 70 190 110 150 120 C 170 95 180 65 190 40 Z" 
        className="stroke-[#2E6B4E] dark:stroke-[#4ade80] fill-white dark:fill-slate-900 transition-colors"
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 185 50 L 160 100" 
        className="stroke-[#2E6B4E] dark:stroke-[#4ade80] transition-colors"
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      
      {/* Amber Connection Nodes */}
      <circle 
        cx="100" cy="65" r="8" 
        className="fill-[#2E6B4E] dark:fill-[#4ade80] stroke-[#F2B84B] transition-colors" 
        strokeWidth="4" 
      />
      <circle 
        cx="150" cy="120" r="8" 
        className="fill-[#2E6B4E] dark:fill-[#4ade80] stroke-[#F2B84B] transition-colors" 
        strokeWidth="4" 
      />
    </svg>
  );

  // 1. Icon Only Variant
  if (variant === 'icon') {
    return (
      <div className={`w-10 h-10 ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  // 2. Compact Variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 shrink-0">
          <LogoIcon />
        </div>
        <span className="text-xl font-bold tracking-wide text-[#123B63] dark:text-white transition-colors">
          NavJhar
        </span>
      </div>
    );
  }

  // 3. Full Variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-16 h-16 shrink-0">
        <LogoIcon />
      </div>
      <div className="flex flex-col justify-center mt-1">
        <span className="text-3xl font-bold leading-none tracking-wide text-[#123B63] dark:text-white transition-colors">
          NavJhar
        </span>
        <span className="text-[11px] font-semibold mt-1 text-[#2E6B4E] dark:text-[#4ade80] transition-colors">
          हर समस्या का नया समाधान
        </span>
      </div>
    </div>
  );
};

export default NavJharLogo;
