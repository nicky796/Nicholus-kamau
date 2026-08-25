import React, { useState } from "react";
import { ClueWord, ClueState, ActiveFocus } from "../types";
import { CheckCircle, Shuffle, Lightbulb, Trash2, KeyRound } from "lucide-react";
import { sound } from "../utils/audio";

interface ClueCardProps {
  clue: ClueWord;
  clueIndex: number;
  clueState: ClueState;
  activeFocus: ActiveFocus | null;
  onSelectSlot: (clueId: string, slotIndex: number) => void;
  onShuffleScramble: (clueId: string) => void;
  onClearClue: (clueId: string) => void;
  onRevealClueLetter: (clueId: string) => void;
  onRequestAiHint: (clue: ClueWord, currentInput: string[]) => void;
  onTileClick: (clueId: string, letter: string) => void;
}

export const ClueCard: React.FC<ClueCardProps> = ({
  clue,
  clueIndex,
  clueState,
  activeFocus,
  onSelectSlot,
  onShuffleScramble,
  onClearClue,
  onRevealClueLetter,
  onRequestAiHint,
  onTileClick,
}) => {
  const isSolved = clueState.isSolved;
  const scrambledDisplay = clueState.isShuffledScramble || clue.scrambled;
  const targetLen = clue.targetWord.length;

  // Track which scrambled letters have been used in input
  const inputLetters = clueState.currentInput.filter(Boolean);
  const scrambledChars = scrambledDisplay.split("");

  // Determine available scrambled tiles for quick clicking
  const usedScrambleIndices: number[] = [];
  const tempInput = [...inputLetters];
  scrambledChars.forEach((char, sIdx) => {
    const foundIdx = tempInput.indexOf(char);
    if (foundIdx !== -1) {
      usedScrambleIndices.push(sIdx);
      tempInput.splice(foundIdx, 1);
    }
  });

  return (
    <div
      className={`border transition-all duration-300 relative overflow-hidden ${
        isSolved
          ? "bg-[#0F1116] border-[#C5A059]/40 shadow-sm"
          : "bg-[#12141A] border-[#C5A059]/15 hover:border-[#C5A059]/30 shadow-md"
      }`}
    >
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-[#0A0B0E]/80 border-b border-[#C5A059]/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#475569] font-mono tracking-widest">
            {String(clueIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-medium font-serif">
            Fragment #{clueIndex + 1}
          </span>
        </div>

        {isSolved ? (
          <div className="flex items-center gap-1.5 text-[#C5A059] text-[10px] uppercase tracking-[0.2em] font-medium px-2.5 py-0.5 border border-[#C5A059]/30 bg-[#C5A059]/10 animate-in fade-in">
            <CheckCircle className="w-3 h-3 text-[#C5A059]" />
            <span>DECODED</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {/* Shuffle button */}
            <button
              onClick={() => {
                sound.playShuffle();
                onShuffleScramble(clue.id);
              }}
              className="p-1.5 text-[#94A3B8] hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition-colors cursor-pointer"
              title="Shuffle scrambled letters"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {/* Hint Button */}
            <button
              onClick={() => onRevealClueLetter(clue.id)}
              className="p-1.5 text-[#94A3B8] hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition-colors cursor-pointer"
              title="Reveal one letter hint"
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>

            {/* Clear Button */}
            <button
              onClick={() => onClearClue(clue.id)}
              className="p-1.5 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
              title="Clear word input"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Definition / Clue Text */}
        <div>
          <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed font-serif italic">
            "{clue.hint}"
          </p>
        </div>

        {/* Scrambled Letter Tiles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-mono mr-1">
            Scramble:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {scrambledChars.map((char, sIdx) => {
              const isUsed = usedScrambleIndices.includes(sIdx);
              return (
                <button
                  key={sIdx}
                  disabled={isSolved || isUsed}
                  onClick={() => {
                    sound.playKey();
                    onTileClick(clue.id, char);
                  }}
                  className={`w-8 h-8 font-serif text-sm font-light flex items-center justify-center transition-all cursor-pointer ${
                    isSolved
                      ? "bg-[#0A0B0E] text-[#475569] border border-[#1E232F] cursor-default"
                      : isUsed
                      ? "bg-[#0A0B0E]/60 text-[#475569] border border-[#1E232F] scale-95 opacity-40"
                      : "bg-[#0F1116] hover:bg-[#C5A059] hover:text-[#0A0B0E] text-[#C5A059] border border-[#C5A059]/30 active:scale-95 shadow-sm"
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        </div>

        {/* Player Input Letter Boxes / Underline slots */}
        <div className="pt-2">
          <div className="h-[1px] w-full bg-gradient-to-r from-[#C5A059]/30 via-[#C5A059]/15 to-transparent mb-3.5"></div>
          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({ length: targetLen }).map((_, slotIdx) => {
              const isMarked = clue.markedIndices.includes(slotIdx);
              const letter = clueState.currentInput[slotIdx] || "";
              const isFocused =
                activeFocus?.type === "clue" &&
                activeFocus.clueId === clue.id &&
                activeFocus.slotIndex === slotIdx;

              return (
                <div key={slotIdx} className="relative">
                  <button
                    type="button"
                    onClick={() => onSelectSlot(clue.id, slotIdx)}
                    className={`w-10 h-13 sm:w-11 sm:h-14 font-serif text-xl sm:text-2xl font-light flex items-center justify-center transition-all cursor-pointer ${
                      isSolved
                        ? isMarked
                          ? "bg-[#C5A059]/15 text-[#C5A059] border-b-2 border-[#C5A059] shadow-[0_10px_20px_-10px_#C5A059]"
                          : "bg-[#0A0B0E] text-[#E2E8F0] border-b-2 border-[#C5A059]/40"
                        : isFocused
                        ? "bg-[#1E232F] text-[#C5A059] border-b-2 border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-[0_10px_20px_-10px_#C5A059] scale-105"
                        : isMarked
                        ? letter
                          ? "bg-[#12141A] text-[#C5A059] border-b-2 border-[#C5A059]/80 border-t border-x border-[#C5A059]/20"
                          : "bg-[#0F1116] text-[#94A3B8] border-b-2 border-[#C5A059]/60 border-dashed border-t-0 border-x-0"
                        : letter
                        ? "bg-[#12141A] text-[#E2E8F0] border-b-2 border-[#64748B]"
                        : "bg-[#0A0B0E] text-[#475569] border-b-2 border-[#334155] hover:border-[#C5A059]/40"
                    }`}
                  >
                    {letter || (isSolved ? "" : "")}
                  </button>

                  {/* Marked Key Letter Indicator Badge */}
                  {isMarked && (
                    <div
                      className={`absolute -top-2 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-serif ${
                        isSolved
                          ? "bg-[#C5A059] text-[#0A0B0E]"
                          : "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]"
                      }`}
                      title="Marked key cipher letter for the secret message"
                    >
                      ★
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
