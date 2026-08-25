import React from "react";
import { X, HelpCircle, Key, CheckCircle, Lightbulb, Sparkles } from "lucide-react";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1116] border border-[#C5A059]/40 w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-[#E2E8F0] max-h-[85vh] flex flex-col gold-glow-subtle">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto border border-[#C5A059]/40 bg-[#12141A] flex items-center justify-center text-[#C5A059] mb-3 font-serif">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif uppercase tracking-[0.2em] text-[#C5A059] font-light">
            Decryption Protocols
          </h3>
          <p className="text-xs text-[#94A3B8] uppercase tracking-[0.2em] italic font-serif mt-1">
            Rules of engagement & cipher mechanics
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed text-[#94A3B8]">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-4 bg-[#0A0B0E] border border-[#C5A059]/20">
            <div className="w-6 h-6 border border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-serif font-bold flex items-center justify-center shrink-0 text-xs">
              I
            </div>
            <div>
              <h4 className="font-serif uppercase tracking-wider text-[#E2E8F0] text-sm mb-1 font-medium">
                1. Decipher Word Fragments
              </h4>
              <p className="text-[#94A3B8] font-serif italic text-xs leading-relaxed">
                Inspect each scrambled word tile and definition clue. Arrange the characters using keyboard or click tiles to form the target word.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-4 bg-[#0A0B0E] border border-[#C5A059]/20">
            <div className="w-6 h-6 border border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-serif font-bold flex items-center justify-center shrink-0 text-xs">
              II
            </div>
            <div>
              <h4 className="font-serif uppercase tracking-wider text-[#E2E8F0] text-sm mb-1 font-medium flex items-center gap-1.5">
                <span>2. Extract Key Glyphs</span>
                <span className="w-4 h-4 border border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059] text-[9px] inline-flex items-center justify-center font-serif">
                  ★
                </span>
              </h4>
              <p className="text-[#94A3B8] font-serif italic text-xs leading-relaxed">
                Marked positions contain secret letters. Solving word clues feeds these letters into your Key Letter Vault to crack the secret phrase.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-4 bg-[#0A0B0E] border border-[#C5A059]/20">
            <div className="w-6 h-6 border border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-serif font-bold flex items-center justify-center shrink-0 text-xs">
              III
            </div>
            <div>
              <h4 className="font-serif uppercase tracking-wider text-[#E2E8F0] text-sm mb-1 font-medium">
                3. Unmask the Hidden Secret
              </h4>
              <p className="text-[#94A3B8] font-serif italic text-xs leading-relaxed">
                Deduce the final mystery quote, proverb, or riddle answer. Early decipherment of the secret message grants immediate victory!
              </p>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="p-4 bg-[#0A0B0E]/90 border border-[#C5A059]/30 space-y-1.5">
            <span className="font-serif uppercase tracking-widest text-[#C5A059] text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tactical Suggestions:
            </span>
            <ul className="list-disc list-inside space-y-1 text-[#94A3B8] text-[11px] font-mono">
              <li>Use physical keyboard or on-screen keys seamlessly.</li>
              <li>Arrow keys navigate between character slots.</li>
              <li>Use Shuffle to perceive new anagram patterns.</li>
              <li>Deploy Hints whenever fragment clues prove elusive.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-[#C5A059]/20">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0B0E] font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Enter The Vault
          </button>
        </div>
      </div>
    </div>
  );
};
