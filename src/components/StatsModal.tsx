import React, { useState } from "react";
import { UserStats } from "../types";
import { X, Trophy, Flame, Clock, Share2, Check, Sparkles } from "lucide-react";
import { formatTime } from "../utils/puzzleHelper";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  currentPuzzleDate?: string;
  isCurrentPuzzleSolved?: boolean;
  currentSolveTime?: number;
  currentHintsUsed?: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  currentPuzzleDate,
  isCurrentPuzzleSolved,
  currentSolveTime,
  currentHintsUsed,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const handleShare = () => {
    const timeStr = currentSolveTime ? formatTime(currentSolveTime) : "--:--";
    const hints = currentHintsUsed || 0;
    const shareText = `Ψ The Cipher Syndicate (${currentPuzzleDate || "Daily"})\n` +
      `⏱️ Time: ${timeStr} | 💡 Hints: ${hints}\n` +
      `🔥 Streak: ${stats.currentStreak} days\n` +
      `⚜️ All fragments aligned and secret cipher deciphered!\n` +
      `Play: ${window.location.origin}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1116] border border-[#C5A059]/40 w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-[#E2E8F0] gold-glow-subtle">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto border border-[#C5A059]/50 bg-[#12141A] flex items-center justify-center text-[#C5A059] mb-3 gold-glow-subtle font-serif">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif uppercase tracking-[0.2em] text-[#C5A059] font-light">
            Player Dossier
          </h3>
          <p className="text-xs text-[#94A3B8] uppercase tracking-[0.2em] italic mt-1 font-serif">
            Decryption records & consistency streak
          </p>
        </div>

        {/* 4 Key Stat Metrics */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-[#0A0B0E] border border-[#C5A059]/20 p-3 text-center">
            <span className="text-2xl font-light font-serif text-[#E2E8F0] block">
              {stats.gamesPlayed}
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-[#94A3B8]">
              Played
            </span>
          </div>

          <div className="bg-[#0A0B0E] border border-[#C5A059]/20 p-3 text-center">
            <span className="text-2xl font-light font-serif text-[#C5A059] block">
              {winRate}%
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-[#94A3B8]">
              Win %
            </span>
          </div>

          <div className="bg-[#0A0B0E] border border-[#C5A059]/20 p-3 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <span className="text-2xl font-light font-serif text-[#C5A059] block">
                {stats.currentStreak}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest font-mono text-[#94A3B8]">
              Streak
            </span>
          </div>

          <div className="bg-[#0A0B0E] border border-[#C5A059]/20 p-3 text-center">
            <span className="text-2xl font-light font-serif text-[#C5A059] block">
              {stats.maxStreak}
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-[#94A3B8]">
              Max
            </span>
          </div>
        </div>

        {/* Time Stats */}
        <div className="bg-[#0A0B0E]/80 border border-[#C5A059]/15 p-4 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-serif uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              Fastest Decipher:
            </span>
            <span className="font-mono text-[#C5A059]">
              {stats.fastestSolveSeconds > 0
                ? formatTime(stats.fastestSolveSeconds)
                : "--:--"}
            </span>
          </div>
          {currentSolveTime !== undefined && isCurrentPuzzleSolved && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] font-serif uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                This Dispatch:
              </span>
              <span className="font-mono text-[#C5A059]">
                {formatTime(currentSolveTime)}
              </span>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full py-3.5 px-4 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0B0E] font-serif font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#0A0B0E]" />
              <span>Dossier Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#0A0B0E]" />
              <span>Transmit / Share Result</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
