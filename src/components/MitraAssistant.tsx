import React from "react";
import { CheckCircle2 } from "lucide-react";

export type MitraSize = "full" | "medium" | "compact";
export type MitraVariant = "welcome" | "guide" | "listening" | "location" | "review" | "success" | "compact" | "dashboard";

interface MitraAssistantProps {
  size?: MitraSize;
  variant?: MitraVariant;
  message?: string;
  subMessage?: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  speechTail?: "left" | "bottom" | "right" | "top";
  mitraHeight?: string; // e.g. "h-56", "h-64", "h-72"
}

export const MitraAssistant: React.FC<MitraAssistantProps> = ({
  size = "full",
  variant = "guide",
  message,
  subMessage,
  hint,
  action,
  className = "",
  orientation = "horizontal",
  speechTail,
  mitraHeight,
}) => {
  // 1. COMPACT AVATAR VARIANT (For citizen dashboard header)
  if (size === "compact" || variant === "compact") {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        {/* Compact Mitra Avatar */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#207244] shadow-md bg-[#e8f5e9] dark:bg-slate-800 flex items-center justify-center">
            <img
              src="/mitra.png"
              alt="Mitra"
              className="w-full h-full object-cover object-top scale-125 translate-y-1 pointer-events-none"
              loading="lazy"
            />
          </div>
          <span className="mt-0.5 px-1.5 py-0.2 text-[8px] font-black bg-[#207244] text-white rounded-full whitespace-nowrap shadow-xs">
            Mitra-Digital Sahayak
          </span>
        </div>

        {/* Compact Speech Bubble Popup */}
        {message && (
          <div className="relative flex-1 bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-600 rounded-2xl px-4 py-2.5 shadow-md" aria-live="polite">
            {/* Pointer to avatar */}
            <div className="absolute top-4 -left-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-slate-800 dark:border-r-slate-600" />
            <div className="absolute top-4 -left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-white dark:border-r-slate-900" />
            
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {message}
            </p>
            {subMessage && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                {subMessage}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Determine effective height for full body Mitra
  const heightClass = mitraHeight || (size === "full" ? "h-64 sm:h-72 md:h-80" : "h-52 sm:h-60");

  // 2. SUCCESS VARIANT (For submission success screen)
  if (variant === "success") {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Speech Bubble Popup above Mitra */}
        {message && (
          <div className="relative bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-400 rounded-3xl p-5 sm:p-6 shadow-xl max-w-sm mb-5 animate-fadeIn" aria-live="polite">
            <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {message}
            </p>
            {subMessage && (
              <p className="text-xs sm:text-sm font-semibold text-[#207244] dark:text-[#4ade80] mt-1.5">
                {subMessage}
              </p>
            )}
            {/* Comic Speech Tail pointing DOWN to Mitra */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-slate-900 dark:border-t-slate-400" />
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white dark:border-t-slate-900" />
          </div>
        )}

        {/* Full-Body Mitra Cutout - Zero boundary */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative">
            <img
              src="/mitra.png"
              alt="Mitra-Digital Sahayak"
              className="w-auto h-52 sm:h-60 object-contain drop-shadow-xl pointer-events-none"
            />
            <div className="absolute bottom-6 -right-1 bg-[#207244] text-white p-1 rounded-full shadow-lg">
              <CheckCircle2 size={22} />
            </div>
          </div>
          {/* Green Option Bar */}
          <div className="mt-1 px-3.5 py-1 rounded-full bg-[#207244] text-white text-[11px] sm:text-xs font-black tracking-wide shadow-md whitespace-nowrap">
            Mitra-Digital Sahayak
          </div>
        </div>

        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  // 3. FULL BODY GUIDANCE WITH COMIC SPEECH BUBBLE POPUP (Used across forms, welcome, role select, report steps)
  // NO outer card boundary, NO image boundary!
  const isVertical = orientation === "vertical";

  return (
    <div className={`flex ${isVertical ? "flex-col" : "flex-col sm:flex-row"} items-center justify-center gap-4 sm:gap-6 select-none ${className}`}>
      {/* Full-Body Cutout Mitra - Zero image border, Zero box */}
      <div className="flex flex-col items-center shrink-0">
        <img
          src="/mitra.png"
          alt="Mitra-Digital Sahayak"
          className={`w-auto ${heightClass} object-contain drop-shadow-xl pointer-events-none transition-transform duration-300 hover:scale-[1.02]`}
        />
        {/* Required Green Option Label: "Mitra-Digital Sahayak" */}
        <div className="mt-1 px-3.5 py-1 rounded-full bg-[#207244] text-white text-[11px] sm:text-xs font-black tracking-wide shadow-md whitespace-nowrap">
          Mitra-Digital Sahayak
        </div>
      </div>

      {/* Comic Speech Bubble Popup (Exactly matching Image 2 reference) */}
      {(message || subMessage) && (
        <div
          className="relative bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-400 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-w-sm sm:max-w-md w-full animate-fadeIn"
          aria-live="polite"
        >
          {/* Comic Tail: On desktop, points left towards Mitra. On mobile, points top towards Mitra */}
          {!isVertical ? (
            <>
              {/* Desktop Left-pointing callout tail */}
              <div className="hidden sm:block absolute top-10 -left-3.5 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-slate-900 dark:border-r-slate-400" />
              <div className="hidden sm:block absolute top-10 -left-2.5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-white dark:border-r-slate-900" />

              {/* Mobile Top-pointing callout tail */}
              <div className="sm:hidden absolute -top-3 left-10 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-slate-900 dark:border-b-slate-400" />
              <div className="sm:hidden absolute -top-2 left-10 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-white dark:border-b-slate-900" />
            </>
          ) : (
            <>
              {/* Vertical Bottom-pointing callout tail */}
              <div className="absolute -bottom-3.5 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-slate-900 dark:border-t-slate-400" />
              <div className="absolute -bottom-2.5 left-10 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white dark:border-t-slate-900" />
            </>
          )}

          {/* Speech Words inside Popup */}
          {message && (
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {message}
            </h3>
          )}

          {subMessage && (
            <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
              {subMessage}
            </p>
          )}

          {hint && (
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
              {hint}
            </p>
          )}

          {action && <div className="mt-4">{action}</div>}
        </div>
      )}
    </div>
  );
};

export default MitraAssistant;
