import React from "react";
import { HANDCRAFTED_PUZZLES } from "../data/puzzles";
import { Puzzle } from "../types";
import { X, Calendar, CheckCircle2, Play, Sparkles } from "lucide-react";

interface DailyArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPuzzleId: string;
  completedPuzzleIds: string[];
  onSelectPuzzle: (puzzle: Puzzle) => void;
}

export const DailyArchiveModal: React.FC<DailyArchiveModalProps> = ({
  isOpen,
  onClose,
  currentPuzzleId,
  completedPuzzleIds,
  onSelectPuzzle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1116] border border-[#C5A059]/40 w-full max-w-lg p-6 sm:p-8 shadow-2xl relative text-[#E2E8F0] max-h-[85vh] flex flex-col gold-glow-subtle">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 border border-[#C5A059]/40 bg-[#12141A] flex items-center justify-center text-[#C5A059] font-serif">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif uppercase tracking-[0.2em] text-[#C5A059] font-light">
              Cipher Dispatch Archive
            </h3>
            <p className="text-xs text-[#94A3B8] uppercase tracking-[0.2em] italic font-serif">
              Revisit past encrypted dispatches
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {HANDCRAFTED_PUZZLES.map((puzzle) => {
            const isCompleted = completedPuzzleIds.includes(puzzle.id);
            const isSelected = currentPuzzleId === puzzle.id;

            return (
              <div
                key={puzzle.id}
                className={`p-4 border transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-[#161922] border-[#C5A059] shadow-[0_4px_20px_-5px_rgba(197,160,89,0.2)]"
                    : isCompleted
                    ? "bg-[#0A0B0E]/80 border-[#C5A059]/30 hover:border-[#C5A059]/60"
                    : "bg-[#0A0B0E]/60 border-[#C5A059]/15 hover:border-[#C5A059]/40"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-mono text-[#C5A059]">
                      {puzzle.date}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-mono px-2 py-0.5 border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059]">
                      {puzzle.difficulty}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono">
                      {puzzle.theme}
                    </span>
                  </div>
                  <h4 className="text-sm font-serif text-[#E2E8F0] uppercase tracking-wide truncate">
                    {puzzle.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] truncate italic font-serif mt-0.5">
                    "{puzzle.secretMessage.prompt}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span
                      className="p-1 text-[#C5A059]"
                      title="Decoded & Completed"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                    </span>
                  )}

                  <button
                    onClick={() => {
                      onSelectPuzzle(puzzle);
                      onClose();
                    }}
                    className={`px-3 py-1.5 text-xs font-serif uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#C5A059] text-[#0A0B0E] font-bold"
                        : "bg-[#12141A] hover:bg-[#C5A059] hover:text-[#0A0B0E] text-[#C5A059] border border-[#C5A059]/30"
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isSelected ? "Active" : "Open"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
