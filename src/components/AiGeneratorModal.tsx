import React, { useState } from "react";
import { Puzzle } from "../types";
import { X, Sparkles, Loader2, Wand2, BookOpen, Atom, Coffee, Laugh, Rocket, Compass } from "lucide-react";
import { generateOfflinePuzzle } from "../data/puzzles";

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPuzzleGenerated: (puzzle: Puzzle) => void;
}

const PRESET_THEMES = [
  { name: "Dad Jokes & Puns", icon: Laugh },
  { name: "Astronomy & Deep Space", icon: Rocket },
  { name: "Science & Nature", icon: Atom },
  { name: "Literature & Quotes", icon: BookOpen },
  { name: "Coffee & Foodie", icon: Coffee },
  { name: "History & Legends", icon: Compass },
];

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPuzzleGenerated,
}) => {
  const [theme, setTheme] = useState("Science & Nature");
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const selectedTheme = customTopic.trim() || theme;

    try {
      const response = await fetch("/api/generate-puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          difficulty,
          customTopic: customTopic.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.puzzle) {
        onPuzzleGenerated(data.puzzle);
        onClose();
        return;
      }
      throw new Error("No puzzle data received");
    } catch (err: any) {
      console.warn("AI generation failed, generating instant fallback:", err);
      // Fallback offline generator
      const fallback = generateOfflinePuzzle(selectedTheme, difficulty);
      onPuzzleGenerated(fallback);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1116] border border-[#C5A059]/40 w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-[#E2E8F0] gold-glow-subtle">
        <button
          disabled={isLoading}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto border border-[#C5A059]/40 bg-[#12141A] flex items-center justify-center text-[#C5A059] mb-3 font-serif">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="text-xl font-serif uppercase tracking-[0.2em] text-[#C5A059] font-light">
            AI Cipher Oracle
          </h3>
          <p className="text-xs text-[#94A3B8] uppercase tracking-[0.2em] italic font-serif mt-1">
            Synthesize unique thematic mystery ciphers with Gemini
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Preset Theme Selection */}
          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#94A3B8] mb-2 block">
              Cipher Classification / Theme:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.name && !customTopic;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setTheme(item.name);
                      setCustomTopic("");
                    }}
                    className={`p-2.5 border text-xs font-serif tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#C5A059] text-[#0A0B0E] border-[#C5A059] font-bold shadow-md"
                        : "bg-[#0A0B0E] text-[#94A3B8] border-[#C5A059]/20 hover:border-[#C5A059]/50 hover:text-[#E2E8F0]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#94A3B8] mb-1.5 block">
              Or Custom Topic / Cryptographic Style:
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g., Cyberpunk, Renaissance, Sherlock Holmes..."
              className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#C5A059]/30 text-sm text-[#E2E8F0] placeholder-[#475569] focus:outline-none focus:border-[#C5A059] font-serif italic"
            />
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#94A3B8] mb-1.5 block">
              Cipher Complexity:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 text-xs font-serif uppercase tracking-widest border transition-all cursor-pointer ${
                    difficulty === diff
                      ? "bg-[#C5A059] text-[#0A0B0E] border-[#C5A059] font-bold"
                      : "bg-[#0A0B0E] text-[#94A3B8] border-[#C5A059]/20 hover:border-[#C5A059]/50"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          disabled={isLoading}
          onClick={handleGenerate}
          className="w-full py-3.5 px-4 bg-[#C5A059] hover:bg-[#D4AF37] disabled:bg-[#161922] disabled:text-[#475569] text-[#0A0B0E] font-serif font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0A0B0E]" />
              <span>Synthesizing Mystery Cipher...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate Cipher Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
