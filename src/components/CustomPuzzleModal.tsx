import React, { useState } from "react";
import { Puzzle, ClueWord } from "../types";
import { X, Plus, Trash2, Link as LinkIcon, Check, HelpCircle } from "lucide-react";
import { encodePuzzleToHash, shuffleString } from "../utils/puzzleHelper";

interface CustomPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPuzzleCreated: (puzzle: Puzzle) => void;
}

export const CustomPuzzleModal: React.FC<CustomPuzzleModalProps> = ({
  isOpen,
  onClose,
  onPuzzleCreated,
}) => {
  const [title, setTitle] = useState("The Midnight Enigma");
  const [prompt, setPrompt] = useState("What is the golden key to unlocking any labyrinth?");
  const [phrase, setPhrase] = useState("PERSISTENCE");
  const [clues, setClues] = useState<Array<{ word: string; hint: string }>>([
    { word: "PLANET", hint: "A celestial sphere wandering through stellar void" },
    { word: "SILVER", hint: "A luminous precious metal reflecting moonlight" },
    { word: "FOREST", hint: "A dense sanctuary of ancient whispering trees" },
  ]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddClue = () => {
    if (clues.length < 6) {
      setClues([...clues, { word: "", hint: "" }]);
    }
  };

  const handleRemoveClue = (idx: number) => {
    if (clues.length > 2) {
      setClues(clues.filter((_, i) => i !== idx));
    }
  };

  const handleClueChange = (idx: number, field: "word" | "hint", value: string) => {
    const next = [...clues];
    next[idx] = { ...next[idx], [field]: value };
    setClues(next);
  };

  const handleCreateAndPlay = () => {
    setValidationError(null);

    const cleanPhrase = phrase.toUpperCase().replace(/[^A-Z]/g, "");
    if (cleanPhrase.length < 3) {
      setValidationError("Secret message phrase must have at least 3 letters.");
      return;
    }

    const cleanClues = clues.map((c) => ({
      word: c.word.toUpperCase().replace(/[^A-Z]/g, ""),
      hint: c.hint.trim(),
    }));

    if (cleanClues.some((c) => c.word.length < 3 || !c.hint)) {
      setValidationError("Each clue must have a valid word (3+ letters) and a hint.");
      return;
    }

    // Distribute marked indices among clues
    const phraseLetters = cleanPhrase.split("");
    const phraseLetterPool = [...phraseLetters];

    const puzzleClues: ClueWord[] = cleanClues.map((clue, idx) => {
      const targetWord = clue.word;
      const scrambled = shuffleString(targetWord);
      
      // Pick marked indices in targetWord
      const markedIndices: number[] = [];
      targetWord.split("").forEach((char, charIdx) => {
        const poolIdx = phraseLetterPool.indexOf(char);
        if (poolIdx !== -1 && markedIndices.length < 3) {
          markedIndices.push(charIdx);
          phraseLetterPool.splice(poolIdx, 1);
        }
      });

      // If no marked indices matched, pick the first letter
      if (markedIndices.length === 0) {
        markedIndices.push(0);
      }

      return {
        id: `custom-clue-${idx + 1}`,
        scrambled: scrambled === targetWord ? targetWord.split("").reverse().join("") : scrambled,
        targetWord,
        hint: clue.hint,
        markedIndices,
      };
    });

    const newPuzzle: Puzzle = {
      id: `custom-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: title.trim() || "Custom Encrypted Cipher",
      difficulty: "Medium",
      theme: "Custom Challenge",
      secretMessage: {
        prompt: prompt.trim() || "Unravel the secret phrase!",
        phrase: cleanPhrase,
        category: "Custom Riddle",
      },
      clues: puzzleClues,
      isCustom: true,
    };

    const hash = encodePuzzleToHash(newPuzzle);
    const fullUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
    setShareUrl(fullUrl);

    onPuzzleCreated(newPuzzle);
  };

  const handleCopyLink = () => {
    if (shareUrl && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1116] border border-[#C5A059]/40 w-full max-w-lg p-6 sm:p-8 shadow-2xl relative text-[#E2E8F0] max-h-[90vh] flex flex-col gold-glow-subtle">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-serif uppercase tracking-[0.2em] text-[#C5A059] font-light mb-1">
          Encode Custom Cipher
        </h3>
        <p className="text-xs text-[#94A3B8] uppercase tracking-[0.2em] italic font-serif mb-5">
          Author secret cryptograms and transmit to allies
        </p>

        {validationError && (
          <div className="p-3 mb-4 border border-rose-500/50 bg-rose-950/40 text-rose-300 text-xs font-mono">
            {validationError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#94A3B8] mb-1.5 block">
              Cipher Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#C5A059]/30 text-sm text-[#E2E8F0] focus:border-[#C5A059] focus:outline-none font-serif"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#94A3B8] mb-1.5 block">
              Mystery Prompt / Riddle:
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#C5A059]/30 text-sm text-[#E2E8F0] focus:border-[#C5A059] focus:outline-none font-serif italic"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#94A3B8] mb-1.5 block">
              Hidden Secret Phrase:
            </label>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value.toUpperCase())}
              placeholder="e.g. PEACE OF MIND"
              className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#C5A059]/50 text-sm text-[#C5A059] font-serif uppercase tracking-widest focus:border-[#C5A059] focus:outline-none font-light"
            />
          </div>

          {/* Clues */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase tracking-widest font-mono text-[#94A3B8]">
                Word Fragments ({clues.length}/6):
              </label>
              {clues.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddClue}
                  className="text-xs text-[#C5A059] hover:text-[#D4AF37] flex items-center gap-1 font-serif uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Fragment</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {clues.map((clue, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#0A0B0E] border border-[#C5A059]/20 flex items-start gap-2"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={clue.word}
                      onChange={(e) =>
                        handleClueChange(idx, "word", e.target.value.toUpperCase())
                      }
                      placeholder={`Target Word #${idx + 1} (e.g. SILENCE)`}
                      className="w-full px-3 py-1.5 bg-[#12141A] border border-[#C5A059]/20 text-xs font-serif uppercase tracking-wider text-[#C5A059]"
                    />
                    <input
                      type="text"
                      value={clue.hint}
                      onChange={(e) => handleClueChange(idx, "hint", e.target.value)}
                      placeholder={`Fragment Hint #${idx + 1}`}
                      className="w-full px-3 py-1.5 bg-[#12141A] border border-[#C5A059]/20 text-xs font-serif italic text-[#E2E8F0]"
                    />
                  </div>
                  {clues.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClue(idx)}
                      className="p-2 text-[#64748B] hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {shareUrl && (
            <div className="p-4 bg-[#0A0B0E] border border-[#C5A059]/40 space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#C5A059] block">
                Shareable Cipher Link:
              </span>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  type="text"
                  value={shareUrl}
                  className="flex-1 px-3 py-2 bg-[#12141A] border border-[#C5A059]/20 text-xs font-mono text-[#94A3B8] truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0B0E] text-xs font-serif uppercase tracking-widest font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 mt-2 border-t border-[#C5A059]/20 flex gap-2">
          <button
            type="button"
            onClick={handleCreateAndPlay}
            className="flex-1 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0B0E] font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Encode & Decipher Now
          </button>
        </div>
      </div>
    </div>
  );
};
