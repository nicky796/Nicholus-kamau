import React from "react";
import { Delete, CornerDownLeft, ArrowRight, ArrowLeft } from "lucide-react";
import { sound } from "../utils/audio";

interface OnScreenKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export const OnScreenKeyboard: React.FC<OnScreenKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const handleKey = (char: string) => {
    sound.playKey();
    onKeyPress(char);
  };

  const handleDelete = () => {
    sound.playDelete();
    onBackspace();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-2 sm:p-2.5 bg-[#0F1116]/95 backdrop-blur-md border border-[#C5A059]/20 shadow-2xl select-none">
      {/* Row 1 */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mb-1.5">
        {row1.map((char) => (
          <button
            key={char}
            onClick={() => handleKey(char)}
            className="flex-1 max-w-[42px] h-11 sm:h-12 bg-[#12141A] hover:bg-[#1E232F] active:bg-[#C5A059] active:text-[#0A0B0E] text-[#E2E8F0] font-serif text-sm sm:text-base font-light border border-[#C5A059]/20 hover:border-[#C5A059]/50 flex items-center justify-center transition-transform active:scale-95 shadow-sm cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mb-1.5">
        {row2.map((char) => (
          <button
            key={char}
            onClick={() => handleKey(char)}
            className="flex-1 max-w-[42px] h-11 sm:h-12 bg-[#12141A] hover:bg-[#1E232F] active:bg-[#C5A059] active:text-[#0A0B0E] text-[#E2E8F0] font-serif text-sm sm:text-base font-light border border-[#C5A059]/20 hover:border-[#C5A059]/50 flex items-center justify-center transition-transform active:scale-95 shadow-sm cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        {/* Prev Arrow */}
        <button
          onClick={onNavigatePrev}
          className="px-2.5 h-11 sm:h-12 bg-[#0A0B0E] hover:bg-[#12141A] text-[#94A3B8] hover:text-[#C5A059] border border-[#C5A059]/20 flex items-center justify-center transition-transform active:scale-95 text-xs cursor-pointer"
          title="Previous Slot"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {row3.map((char) => (
          <button
            key={char}
            onClick={() => handleKey(char)}
            className="flex-1 max-w-[42px] h-11 sm:h-12 bg-[#12141A] hover:bg-[#1E232F] active:bg-[#C5A059] active:text-[#0A0B0E] text-[#E2E8F0] font-serif text-sm sm:text-base font-light border border-[#C5A059]/20 hover:border-[#C5A059]/50 flex items-center justify-center transition-transform active:scale-95 shadow-sm cursor-pointer"
          >
            {char}
          </button>
        ))}

        {/* Backspace */}
        <button
          onClick={handleDelete}
          className="px-3 h-11 sm:h-12 bg-[#12141A] hover:bg-rose-950/40 text-[#94A3B8] hover:text-rose-300 border border-[#C5A059]/20 hover:border-rose-500/40 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          title="Delete"
        >
          <Delete className="w-4 h-4" />
        </button>

        {/* Next Arrow */}
        <button
          onClick={onNavigateNext}
          className="px-3 h-11 sm:h-12 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0B0E] border border-[#C5A059] flex items-center justify-center transition-transform active:scale-95 font-serif font-bold cursor-pointer"
          title="Next Slot"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
