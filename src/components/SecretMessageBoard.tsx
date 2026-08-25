import React from "react";
import { SecretMessage, ActiveFocus } from "../types";
import { Sparkles, Key, CheckCircle2, Shuffle, Trash2, Lightbulb } from "lucide-react";
import { sound } from "../utils/audio";

interface SecretMessageBoardProps {
  secretMessage: SecretMessage;
  secretInput: string[];
  isSolved: boolean;
  unlockedLetters: { char: string; isFromSolvedClue: boolean; clueId: string }[];
  activeFocus: ActiveFocus | null;
  onSelectSlot: (slotIndex: number) => void;
  onClearSecretMessage: () => void;
  onShuffleLetterBank: () => void;
  onRevealSecretLetter: () => void;
  onLetterBankClick: (char: string) => void;
}

export const SecretMessageBoard: React.FC<SecretMessageBoardProps> = ({
  secretMessage,
  secretInput,
  isSolved,
  unlockedLetters,
  activeFocus,
  onSelectSlot,
  onClearSecretMessage,
  onShuffleLetterBank,
  onRevealSecretLetter,
  onLetterBankClick,
}) => {
  const phrase = secretMessage.phrase.toUpperCase();
  const words = phrase.split(/\s+/);

  // Map each letter in the words to a global index in non-space letters
  let globalSlotCounter = 0;
  const wordSlots = words.map((word) => {
    return word.split("").map((char) => {
      const isLetter = /[A-Z]/.test(char);
      const slotIdx = isLetter ? globalSlotCounter++ : -1;
      return { char, isLetter, slotIdx };
    });
  });

  const totalSlots = globalSlotCounter;

  // Calculate letters in the letter bank and which are currently placed
  const placedLetters = secretInput.filter(Boolean);
  
  // Count frequency of available unlocked letters
  const availableLetterCounts: Record<string, number> = {};
  unlockedLetters.forEach((item) => {
    availableLetterCounts[item.char] = (availableLetterCounts[item.char] || 0) + 1;
  });

  // Subtract placed letters
  const remainingLetterCounts: Record<string, number> = { ...availableLetterCounts };
  placedLetters.forEach((char) => {
    if (remainingLetterCounts[char] && remainingLetterCounts[char] > 0) {
      remainingLetterCounts[char]--;
    }
  });

  // Prepare list of bank letters
  const bankPills: { char: string; count: number; total: number }[] = [];
  Object.keys(availableLetterCounts).sort().forEach((char) => {
    bankPills.push({
      char,
      count: remainingLetterCounts[char] || 0,
      total: availableLetterCounts[char],
    });
  });

  return (
    <div
      className={`w-full border transition-all duration-500 overflow-hidden relative ${
        isSolved
          ? "bg-[#0F1116] border-[#C5A059]/60 shadow-[0_20px_50px_-20px_rgba(197,160,89,0.2)]"
          : "bg-[#0F1116] border-[#C5A059]/20 shadow-2xl"
      }`}
    >
      {/* Background Dot Texture */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#C5A059 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Header Banner */}
      <div className="px-6 py-4 bg-[#0A0B0E]/85 border-b border-[#C5A059]/20 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#C5A059]/40 bg-[#12141A] flex items-center justify-center text-[#C5A059] font-serif text-sm">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif text-base sm:text-lg text-[#C5A059] uppercase tracking-[0.2em] font-light">
                The Hidden Message
              </h2>
              {secretMessage.category && (
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest font-mono bg-[#12141A] text-[#94A3B8] border border-[#C5A059]/20">
                  {secretMessage.category}
                </span>
              )}
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#94A3B8] italic mt-0.5">
              {isSolved
                ? "Cipher alignment complete • Dispatch deciphered"
                : `Extract marked fragments to uncover the hidden cipher`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        {!isSolved && (
          <div className="flex items-center gap-2">
            <button
              onClick={onRevealSecretLetter}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A059]/40 bg-[#12141A] hover:bg-[#C5A059]/10 text-[#C5A059] text-[10px] uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
              title="Reveal 1 letter of the secret message"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>
            <button
              onClick={onClearSecretMessage}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A059]/20 bg-[#12141A] hover:border-rose-500/40 hover:bg-rose-950/20 text-[#94A3B8] hover:text-rose-400 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
              title="Clear secret message input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-8 relative z-10">
        {/* Riddle / Mystery Prompt */}
        <div className="p-5 border border-[#C5A059]/20 bg-[#0A0B0E]/70 text-center relative overflow-hidden">
          <div className="absolute top-2 right-3 opacity-10">
            <Sparkles className="w-16 h-16 text-[#C5A059]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#94A3B8] mb-2 block font-mono">
            Riddle Fragment & Clue
          </span>
          <p className="text-base sm:text-xl font-serif italic text-[#E2E8F0] leading-relaxed font-normal px-2">
            "{secretMessage.prompt}"
          </p>
          {secretMessage.source && (
            <span className="text-[11px] text-[#C5A059]/80 font-mono tracking-wider mt-2 inline-block">
              — {secretMessage.source}
            </span>
          )}
        </div>

        {/* Secret Message Words & Sophisticated Underline Slots */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 py-4">
          {wordSlots.map((wordArray, wIdx) => (
            <div
              key={wIdx}
              className="flex items-center gap-2 p-2 border border-[#C5A059]/10 bg-[#0A0B0E]/60 shadow-inner"
            >
              {wordArray.map((slot, sIdx) => {
                if (!slot.isLetter) {
                  return (
                    <span
                      key={sIdx}
                      className="font-serif text-2xl font-light text-[#64748B] px-1"
                    >
                      {slot.char}
                    </span>
                  );
                }

                const slotIndex = slot.slotIdx;
                const value = secretInput[slotIndex] || "";
                const isFocused =
                  activeFocus?.type === "secret" &&
                  activeFocus.slotIndex === slotIndex;

                return (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => onSelectSlot(slotIndex)}
                    className={`w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center font-serif text-2xl sm:text-3xl font-light transition-all cursor-pointer ${
                      isSolved
                        ? "border-b-2 border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10 shadow-[0_10px_20px_-10px_#C5A059]"
                        : isFocused
                        ? "border-b-2 border-[#C5A059] text-[#C5A059] bg-[#1E232F] ring-2 ring-[#C5A059]/30 shadow-[0_10px_20px_-10px_#C5A059] scale-105"
                        : value
                        ? "border-b-2 border-[#C5A059] text-[#E2E8F0] bg-[#12141A]"
                        : "border-b-2 border-[#334155] text-[#475569] bg-[#0A0B0E] hover:border-[#C5A059]/50"
                    }`}
                  >
                    {value || (isSolved ? "" : "?")}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Unlocked Letter Bank / Anagram Pool */}
        {!isSolved && (
          <div className="pt-4 border-t border-[#C5A059]/15">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#94A3B8] font-mono">
                  Extracted Fragments ({unlockedLetters.length}/{totalSlots} collected):
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playShuffle();
                  onShuffleLetterBank();
                }}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#D4AF37] transition-colors cursor-pointer"
                title="Shuffle unplaced letter bank"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle Bank</span>
              </button>
            </div>

            {unlockedLetters.length === 0 ? (
              <p className="text-xs text-[#64748B] italic text-center py-4 bg-[#0A0B0E]/60 border border-[#C5A059]/10 font-serif">
                Decipher the daily word fragments above to release key cipher glyphs into this vault.
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5 p-4 bg-[#0A0B0E]/70 border border-[#C5A059]/15">
                {bankPills.map((pill, idx) => {
                  const isExhausted = pill.count === 0;
                  return (
                    <button
                      key={idx}
                      disabled={isExhausted}
                      onClick={() => {
                        sound.playKey();
                        onLetterBankClick(pill.char);
                      }}
                      className={`relative px-3.5 py-2 font-serif text-lg font-light flex items-center gap-2 transition-all cursor-pointer ${
                        isExhausted
                          ? "bg-[#0A0B0E] text-[#475569] border border-[#1E232F] cursor-default opacity-40"
                          : "bg-[#12141A] hover:bg-[#C5A059] hover:text-[#0A0B0E] text-[#C5A059] border border-[#C5A059]/40 active:scale-95 shadow-sm"
                      }`}
                      title={`Insert '${pill.char}' (${pill.count} remaining)`}
                    >
                      <span>{pill.char}</span>
                      {pill.total > 1 && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                            isExhausted
                              ? "bg-[#0A0B0E] text-[#475569] border-[#1E232F]"
                              : "bg-[#0A0B0E] text-[#C5A059] border-[#C5A059]/40"
                          }`}
                        >
                          {pill.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Victory Ribbon */}
        {isSolved && (
          <div className="p-6 border border-[#C5A059] bg-[#12141A] text-center relative gold-glow animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center gap-2 text-[#C5A059] font-serif text-lg sm:text-xl uppercase tracking-[0.2em] font-light mb-1.5">
              <CheckCircle2 className="w-6 h-6 text-[#C5A059]" />
              <span>Cipher Fully Decoded</span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] uppercase tracking-[0.2em] italic font-serif">
              "Fragments have aligned to reveal the path."
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
