import React from "react";
import { 
  Sparkles, 
  Calendar, 
  BarChart2, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  Flame,
  Shuffle
} from "lucide-react";
import { sound } from "../utils/audio";

interface HeaderProps {
  currentDate: string;
  isDaily: boolean;
  streak: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStats: () => void;
  onOpenArchive: () => void;
  onOpenAiGenerator: () => void;
  onOpenCustomCreator: () => void;
  onOpenHelp: () => void;
  onResetToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  isDaily,
  streak,
  isMuted,
  onToggleMute,
  onOpenStats,
  onOpenArchive,
  onOpenAiGenerator,
  onOpenCustomCreator,
  onOpenHelp,
  onResetToday,
}) => {
  return (
    <header className="w-full bg-[#0A0B0E]/95 backdrop-blur-md text-[#E2E8F0] border-b border-[#C5A059]/20 sticky top-0 z-30 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo & Cipher Title */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={onResetToday}
            className="flex items-center gap-3 text-left group transition-all cursor-pointer"
            title="Return to Today's Cipher"
          >
            <div className="w-10 h-10 border border-[#C5A059]/50 bg-[#12141A] text-[#C5A059] flex items-center justify-center font-serif text-xl gold-glow-subtle group-hover:border-[#C5A059] transition-all">
              <span className="font-light">Ψ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl tracking-[0.18em] text-[#C5A059] uppercase font-light">
                  The Cipher <span className="text-[#94A3B8] text-sm font-sans tracking-normal lowercase italic font-normal">mystery</span>
                </h1>
                {isDaily && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] font-semibold bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                    DISPATCH
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#94A3B8] mt-0.5 italic">
                {currentDate} • Fragments & Cryptograms
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Streak badge */}
          {streak > 0 && (
            <button
              onClick={onOpenStats}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A059]/40 bg-[#12141A] text-[#C5A059] text-[11px] uppercase tracking-widest hover:bg-[#C5A059]/10 transition-colors"
              title={`${streak} Day Streak`}
            >
              <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-mono">{streak}d</span>
            </button>
          )}

          {/* AI Generator Button */}
          <button
            onClick={onOpenAiGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A059]/40 bg-[#12141A] hover:bg-[#C5A059] hover:text-[#0A0B0E] text-[#C5A059] text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-medium transition-all shadow-sm cursor-pointer"
            title="Generate custom AI themed mystery puzzle"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden md:inline">AI Oracle</span>
          </button>

          {/* Daily Calendar / Archive */}
          <button
            onClick={onOpenArchive}
            className="p-2 border border-[#C5A059]/20 bg-[#12141A] hover:border-[#C5A059]/60 hover:bg-[#C5A059]/10 text-[#94A3B8] hover:text-[#C5A059] transition-colors cursor-pointer"
            title="Archive & Past Dispatches"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Stats */}
          <button
            onClick={onOpenStats}
            className="p-2 border border-[#C5A059]/20 bg-[#12141A] hover:border-[#C5A059]/60 hover:bg-[#C5A059]/10 text-[#94A3B8] hover:text-[#C5A059] transition-colors cursor-pointer"
            title="Player Statistics & Streaks"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Custom Puzzle Creator */}
          <button
            onClick={onOpenCustomCreator}
            className="hidden sm:flex p-2 border border-[#C5A059]/20 bg-[#12141A] hover:border-[#C5A059]/60 hover:bg-[#C5A059]/10 text-[#94A3B8] hover:text-[#C5A059] transition-colors cursor-pointer"
            title="Encode Custom Cipher"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 border border-[#C5A059]/20 bg-[#12141A] hover:border-[#C5A059]/60 hover:bg-[#C5A059]/10 text-[#94A3B8] hover:text-[#C5A059] transition-colors cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#64748B]" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
          </button>

          {/* Help / Instructions */}
          <button
            onClick={onOpenHelp}
            className="p-2 border border-[#C5A059]/20 bg-[#12141A] hover:border-[#C5A059]/60 hover:bg-[#C5A059]/10 text-[#94A3B8] hover:text-[#C5A059] transition-colors cursor-pointer"
            title="How to Decipher"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
