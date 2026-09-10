import React from 'react';

interface NavJharLogoProps {
  variant?: 'icon' | 'full' | 'compact';
  className?: string;
}

export const NavJharLogo: React.FC<NavJharLogoProps> = ({ 
  variant = 'full', 
  className = '' 
}) => {
  // 1. Icon Only Variant (The circular emblem from Image 1)
  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className || 'w-10 h-10'}`}>
        <img 
          src="/navjhar-emblem.png" 
          alt="NavJhar Logo" 
          className="w-full h-full object-contain select-none pointer-events-none"
        />
      </div>
    );
  }

  // 2. Compact Variant (Emblem + NavJhar text)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img 
          src="/navjhar-emblem.png" 
          alt="NavJhar Emblem" 
          className="w-8 h-8 object-contain shrink-0 pointer-events-none" 
        />
        <div className="h-6 w-[1.5px] bg-[#94a3b8] dark:bg-slate-600 shrink-0" />
        <span className="text-xl font-black tracking-tight leading-none flex items-center">
          <span className="text-[#F59E0B]">Nav</span>
          <span className="text-[#207244] dark:text-[#4ade80]">Jhar</span>
        </span>
      </div>
    );
  }

  // 3. Full Variant (Emblem + Divider + NavJhar + Tagline) - Matches Image 1 Exactly!
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem: 3 People + Leaves Sprout + Hands */}
      <img 
        src="/navjhar-emblem.png" 
        alt="NavJhar Official Logo" 
        className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 pointer-events-none" 
      />

      {/* Vertical separator line from Image 1 */}
      <div className="h-8 sm:h-9 w-[1.5px] bg-[#94a3b8] dark:bg-slate-600 shrink-0 self-center" />

      {/* Typography: NavJhar (Two-tone) + Tagline */}
      <div className="flex flex-col justify-center text-left">
        <div className="text-xl sm:text-2xl font-black tracking-tight leading-none flex items-center">
          <span className="text-[#F59E0B] transition-colors">Nav</span>
          <span className="text-[#207244] dark:text-[#4ade80] transition-colors">Jhar</span>
        </div>
        <div className="text-[10px] sm:text-[11px] font-bold mt-1 text-[#1e293b] dark:text-slate-200 tracking-normal transition-colors whitespace-nowrap">
          हर समस्या का नया समाधान
        </div>
      </div>
    </div>
  );
};

export default NavJharLogo;
