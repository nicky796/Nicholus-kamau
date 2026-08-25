import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { 
  Puzzle, 
  ClueState, 
  ActiveFocus, 
  UserStats, 
  ClueWord 
} from "./types";
import { getPuzzleForDate, HANDCRAFTED_PUZZLES } from "./data/puzzles";
import { 
  loadUserStats, 
  saveUserStats, 
  formatTime, 
  shuffleString, 
  decodePuzzleFromHash 
} from "./utils/puzzleHelper";
import { sound } from "./utils/audio";
import { Header } from "./components/Header";
import { ClueCard } from "./components/ClueCard";
import { SecretMessageBoard } from "./components/SecretMessageBoard";
import { OnScreenKeyboard } from "./components/OnScreenKeyboard";
import { StatsModal } from "./components/StatsModal";
import { DailyArchiveModal } from "./components/DailyArchiveModal";
import { AiGeneratorModal } from "./components/AiGeneratorModal";
import { CustomPuzzleModal } from "./components/CustomPuzzleModal";
import { HowToPlayModal } from "./components/HowToPlayModal";
import { 
  Trophy, 
  Sparkles, 
  Clock, 
  RotateCcw, 
  CheckCircle, 
  HelpCircle, 
  Share2,
  Calendar,
  Flame,
  Wand2
} from "lucide-react";

export default function App() {
  // Get current date
  const todayDateStr = new Date().toISOString().split("T")[0];

  // Active Puzzle State
  const [puzzle, setPuzzle] = useState<Puzzle>(() => {
    // Check if custom puzzle in hash
    if (typeof window !== "undefined" && window.location.hash) {
      const decoded = decodePuzzleFromHash(window.location.hash);
      if (decoded) return decoded;
    }
    return getPuzzleForDate(todayDateStr);
  });

  // Clue Input States
  const [clueStates, setClueStates] = useState<Record<string, ClueState>>({});
  
  // Secret Message Input State
  const [secretInput, setSecretInput] = useState<string[]>([]);
  const [isGameSolved, setIsGameSolved] = useState(false);

  // Active Focus Slot
  const [activeFocus, setActiveFocus] = useState<ActiveFocus | null>(null);

  // Gameplay Timer & Hints
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Stats
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());

  // Modals
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isCustomCreatorOpen, setIsCustomCreatorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Initialize Puzzle State
  const initPuzzle = useCallback((targetPuzzle: Puzzle) => {
    const initialClueStates: Record<string, ClueState> = {};
    targetPuzzle.clues.forEach((clue) => {
      initialClueStates[clue.id] = {
        currentInput: Array(clue.targetWord.length).fill(""),
        isSolved: false,
        isShuffledScramble: clue.scrambled,
        revealedIndices: [],
      };
    });

    const cleanPhrase = targetPuzzle.secretMessage.phrase.replace(/[^A-Z]/g, "");
    setSecretInput(Array(cleanPhrase.length).fill(""));
    setClueStates(initialClueStates);
    setIsGameSolved(false);
    setElapsedSeconds(0);
    setHintsUsed(0);
    setIsTimerRunning(true);

    // Set initial focus on first slot of first clue
    if (targetPuzzle.clues.length > 0) {
      setActiveFocus({
        type: "clue",
        clueId: targetPuzzle.clues[0].id,
        slotIndex: 0,
      });
    }
  }, []);

  // Run init on mount and when puzzle changes
  useEffect(() => {
    initPuzzle(puzzle);
  }, [puzzle, initPuzzle]);

  // Listen to hash changes for shared custom puzzles
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const decoded = decodePuzzleFromHash(window.location.hash);
        if (decoded) {
          setPuzzle(decoded);
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isGameSolved) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isGameSolved]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Celebrate solve victory
  const triggerVictory = useCallback((currentElapsed: number, currentHints: number) => {
    setIsGameSolved(true);
    setIsTimerRunning(false);
    sound.playVictory();

    // Trigger confetti cannon
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);
    } catch (e) {
      // Ignored if confetti blocked
    }

    // Update Player Stats
    setStats((prevStats) => {
      const alreadyCompleted = prevStats.completedPuzzleIds.includes(puzzle.id);
      const newGamesPlayed = alreadyCompleted ? prevStats.gamesPlayed : prevStats.gamesPlayed + 1;
      const newGamesWon = alreadyCompleted ? prevStats.gamesWon : prevStats.gamesWon + 1;
      const newStreak = alreadyCompleted ? prevStats.currentStreak : prevStats.currentStreak + 1;
      const newMaxStreak = Math.max(prevStats.maxStreak, newStreak);
      const fastest =
        prevStats.fastestSolveSeconds === 0
          ? currentElapsed
          : Math.min(prevStats.fastestSolveSeconds, currentElapsed);

      const updated: UserStats = {
        ...prevStats,
        gamesPlayed: newGamesPlayed,
        gamesWon: newGamesWon,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        lastPlayedDate: todayDateStr,
        totalTimeSeconds: prevStats.totalTimeSeconds + currentElapsed,
        fastestSolveSeconds: fastest,
        completedPuzzleIds: alreadyCompleted
          ? prevStats.completedPuzzleIds
          : [...prevStats.completedPuzzleIds, puzzle.id],
      };
      saveUserStats(updated);
      return updated;
    });

    // Auto-open stats summary after brief delay
    setTimeout(() => {
      setIsStatsOpen(true);
    }, 1200);
  }, [puzzle.id, todayDateStr]);

  // Check if clue word is solved
  const checkClueSolved = (clue: ClueWord, input: string[]) => {
    return input.join("").toUpperCase() === clue.targetWord.toUpperCase();
  };

  // Check if secret message is solved
  const checkSecretSolved = (input: string[]) => {
    const cleanPhrase = puzzle.secretMessage.phrase.replace(/[^A-Z]/g, "").toUpperCase();
    return input.join("").toUpperCase() === cleanPhrase;
  };

  // Find next empty or sequential slot
  const advanceCursor = useCallback(
    (currentFocus: ActiveFocus) => {
      if (currentFocus.type === "clue") {
        const currentClue = puzzle.clues.find((c) => c.id === currentFocus.clueId);
        if (!currentClue) return;

        const nextSlot = currentFocus.slotIndex + 1;
        if (nextSlot < currentClue.targetWord.length) {
          setActiveFocus({
            type: "clue",
            clueId: currentClue.id,
            slotIndex: nextSlot,
          });
        } else {
          // Advance to next unsolved clue or secret message
          const currentClueIdx = puzzle.clues.findIndex((c) => c.id === currentClue.id);
          const nextClue = puzzle.clues[currentClueIdx + 1];
          if (nextClue) {
            setActiveFocus({
              type: "clue",
              clueId: nextClue.id,
              slotIndex: 0,
            });
          } else {
            // Move to secret message
            setActiveFocus({
              type: "secret",
              slotIndex: 0,
            });
          }
        }
      } else if (currentFocus.type === "secret") {
        const cleanPhrase = puzzle.secretMessage.phrase.replace(/[^A-Z]/g, "");
        const nextSlot = currentFocus.slotIndex + 1;
        if (nextSlot < cleanPhrase.length) {
          setActiveFocus({
            type: "secret",
            slotIndex: nextSlot,
          });
        }
      }
    },
    [puzzle]
  );

  // Navigate backwards
  const retreatCursor = useCallback(
    (currentFocus: ActiveFocus) => {
      if (currentFocus.type === "clue") {
        if (currentFocus.slotIndex > 0) {
          setActiveFocus({
            type: "clue",
            clueId: currentFocus.clueId,
            slotIndex: currentFocus.slotIndex - 1,
          });
        } else {
          const currentIdx = puzzle.clues.findIndex((c) => c.id === currentFocus.clueId);
          if (currentIdx > 0) {
            const prevClue = puzzle.clues[currentIdx - 1];
            setActiveFocus({
              type: "clue",
              clueId: prevClue.id,
              slotIndex: prevClue.targetWord.length - 1,
            });
          }
        }
      } else if (currentFocus.type === "secret") {
        if (currentFocus.slotIndex > 0) {
          setActiveFocus({
            type: "secret",
            slotIndex: currentFocus.slotIndex - 1,
          });
        } else if (puzzle.clues.length > 0) {
          const lastClue = puzzle.clues[puzzle.clues.length - 1];
          setActiveFocus({
            type: "clue",
            clueId: lastClue.id,
            slotIndex: lastClue.targetWord.length - 1,
          });
        }
      }
    },
    [puzzle]
  );

  // Handle Letter Input
  const handleCharInput = useCallback(
    (char: string) => {
      if (isGameSolved || !activeFocus) return;
      const upper = char.toUpperCase();

      if (activeFocus.type === "clue") {
        const clue = puzzle.clues.find((c) => c.id === activeFocus.clueId);
        if (!clue) return;

        const currentClueState = clueStates[clue.id];
        if (currentClueState.isSolved) {
          advanceCursor(activeFocus);
          return;
        }

        const nextInput = [...currentClueState.currentInput];
        nextInput[activeFocus.slotIndex] = upper;

        const isSolvedNow = checkClueSolved(clue, nextInput);

        setClueStates((prev) => ({
          ...prev,
          [clue.id]: {
            ...prev[clue.id],
            currentInput: nextInput,
            isSolved: isSolvedNow,
          },
        }));

        if (isSolvedNow) {
          sound.playClueSolved();
        }

        advanceCursor(activeFocus);
      } else if (activeFocus.type === "secret") {
        const nextSecret = [...secretInput];
        nextSecret[activeFocus.slotIndex] = upper;
        setSecretInput(nextSecret);

        if (checkSecretSolved(nextSecret)) {
          // Solved the secret message!
          // Mark all clues as solved as well
          setClueStates((prev) => {
            const allSolved: Record<string, ClueState> = {};
            puzzle.clues.forEach((c) => {
              allSolved[c.id] = {
                currentInput: c.targetWord.split(""),
                isSolved: true,
              };
            });
            return allSolved;
          });
          triggerVictory(elapsedSeconds, hintsUsed);
        } else {
          advanceCursor(activeFocus);
        }
      }
    },
    [
      isGameSolved,
      activeFocus,
      puzzle,
      clueStates,
      secretInput,
      advanceCursor,
      triggerVictory,
      elapsedSeconds,
      hintsUsed,
    ]
  );

  // Handle Backspace / Delete
  const handleBackspace = useCallback(() => {
    if (isGameSolved || !activeFocus) return;

    if (activeFocus.type === "clue") {
      const clue = puzzle.clues.find((c) => c.id === activeFocus.clueId);
      if (!clue) return;

      const currentClueState = clueStates[clue.id];
      if (currentClueState.isSolved) {
        retreatCursor(activeFocus);
        return;
      }

      const nextInput = [...currentClueState.currentInput];
      if (nextInput[activeFocus.slotIndex]) {
        // Clear current slot
        nextInput[activeFocus.slotIndex] = "";
        setClueStates((prev) => ({
          ...prev,
          [clue.id]: { ...prev[clue.id], currentInput: nextInput },
        }));
      } else {
        // Retreat and clear previous
        retreatCursor(activeFocus);
        if (activeFocus.slotIndex > 0) {
          nextInput[activeFocus.slotIndex - 1] = "";
          setClueStates((prev) => ({
            ...prev,
            [clue.id]: { ...prev[clue.id], currentInput: nextInput },
          }));
        }
      }
    } else if (activeFocus.type === "secret") {
      const nextSecret = [...secretInput];
      if (nextSecret[activeFocus.slotIndex]) {
        nextSecret[activeFocus.slotIndex] = "";
        setSecretInput(nextSecret);
      } else {
        retreatCursor(activeFocus);
        if (activeFocus.slotIndex > 0) {
          nextSecret[activeFocus.slotIndex - 1] = "";
          setSecretInput(nextSecret);
        }
      }
    }
  }, [isGameSolved, activeFocus, puzzle, clueStates, secretInput, retreatCursor]);

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in a modal input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        sound.playDelete();
        handleBackspace();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (activeFocus) retreatCursor(activeFocus);
      } else if (e.key === "ArrowRight" || e.key === "Tab") {
        e.preventDefault();
        if (activeFocus) advanceCursor(activeFocus);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        sound.playKey();
        handleCharInput(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBackspace, handleCharInput, activeFocus, retreatCursor, advanceCursor]);

  // Shuffle Scrambled letters for a single clue
  const handleShuffleScramble = (clueId: string) => {
    const clue = puzzle.clues.find((c) => c.id === clueId);
    if (!clue) return;
    const shuffled = shuffleString(clue.scrambled);
    setClueStates((prev) => ({
      ...prev,
      [clueId]: { ...prev[clueId], isShuffledScramble: shuffled },
    }));
  };

  // Clear clue input
  const handleClearClue = (clueId: string) => {
    const clue = puzzle.clues.find((c) => c.id === clueId);
    if (!clue) return;
    sound.playDelete();
    setClueStates((prev) => ({
      ...prev,
      [clueId]: {
        ...prev[clueId],
        currentInput: Array(clue.targetWord.length).fill(""),
        isSolved: false,
      },
    }));
    setActiveFocus({ type: "clue", clueId, slotIndex: 0 });
  };

  // Reveal 1 letter hint for clue
  const handleRevealClueLetter = (clueId: string) => {
    const clue = puzzle.clues.find((c) => c.id === clueId);
    if (!clue) return;
    const state = clueStates[clueId];
    if (state.isSolved) return;

    // Find first unsolved letter
    const unsolvedIndices: number[] = [];
    clue.targetWord.split("").forEach((char, idx) => {
      if (state.currentInput[idx] !== char) {
        unsolvedIndices.push(idx);
      }
    });

    if (unsolvedIndices.length === 0) return;
    const targetIdx = unsolvedIndices[0];

    sound.playHint();
    setHintsUsed((prev) => prev + 1);

    const nextInput = [...state.currentInput];
    nextInput[targetIdx] = clue.targetWord[targetIdx];
    const isSolvedNow = checkClueSolved(clue, nextInput);

    setClueStates((prev) => ({
      ...prev,
      [clueId]: {
        ...prev[clueId],
        currentInput: nextInput,
        isSolved: isSolvedNow,
        revealedIndices: [...(prev[clueId].revealedIndices || []), targetIdx],
      },
    }));

    if (isSolvedNow) sound.playClueSolved();
  };

  // Reveal 1 letter hint for Secret Message
  const handleRevealSecretLetter = () => {
    if (isGameSolved) return;
    const cleanPhrase = puzzle.secretMessage.phrase.replace(/[^A-Z]/g, "");
    const unsolvedIndices: number[] = [];
    cleanPhrase.split("").forEach((char, idx) => {
      if (secretInput[idx] !== char) {
        unsolvedIndices.push(idx);
      }
    });

    if (unsolvedIndices.length === 0) return;
    const targetIdx = unsolvedIndices[0];

    sound.playHint();
    setHintsUsed((prev) => prev + 1);

    const nextSecret = [...secretInput];
    nextSecret[targetIdx] = cleanPhrase[targetIdx];
    setSecretInput(nextSecret);

    if (checkSecretSolved(nextSecret)) {
      triggerVictory(elapsedSeconds, hintsUsed + 1);
    }
  };

  // Clear entire Secret Message
  const handleClearSecretMessage = () => {
    sound.playDelete();
    const cleanPhrase = puzzle.secretMessage.phrase.replace(/[^A-Z]/g, "");
    setSecretInput(Array(cleanPhrase.length).fill(""));
    setActiveFocus({ type: "secret", slotIndex: 0 });
  };

  // Letter bank click: place letter into active secret slot or first empty secret slot
  const handleLetterBankClick = (char: string) => {
    if (isGameSolved) return;
    let targetSlot = -1;

    if (activeFocus?.type === "secret") {
      targetSlot = activeFocus.slotIndex;
    } else {
      // Find first empty slot in secretInput
      targetSlot = secretInput.findIndex((val) => !val);
      if (targetSlot === -1) targetSlot = 0;
    }

    const nextSecret = [...secretInput];
    nextSecret[targetSlot] = char;
    setSecretInput(nextSecret);

    if (checkSecretSolved(nextSecret)) {
      triggerVictory(elapsedSeconds, hintsUsed);
    } else {
      const cleanPhrase = puzzle.secretMessage.phrase.replace(/[^A-Z]/g, "");
      const nextSlot = (targetSlot + 1) % cleanPhrase.length;
      setActiveFocus({ type: "secret", slotIndex: nextSlot });
    }
  };

  // Calculate unlocked key letters from all marked indices in clues
  const unlockedLetters: { char: string; isFromSolvedClue: boolean; clueId: string }[] = [];
  puzzle.clues.forEach((clue) => {
    const state = clueStates[clue.id];
    clue.markedIndices.forEach((idx) => {
      if (idx < clue.targetWord.length) {
        if (state?.isSolved) {
          unlockedLetters.push({
            char: clue.targetWord[idx].toUpperCase(),
            isFromSolvedClue: true,
            clueId: clue.id,
          });
        } else if (state?.currentInput[idx]) {
          unlockedLetters.push({
            char: state.currentInput[idx].toUpperCase(),
            isFromSolvedClue: false,
            clueId: clue.id,
          });
        }
      }
    });
  });

  const solvedCluesCount = (Object.values(clueStates) as ClueState[]).filter((s) => s.isSolved).length;

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E2E8F0] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#0A0B0E] bg-dot-pattern">
      {/* Top Header */}
      <Header
        currentDate={puzzle.date || todayDateStr}
        isDaily={!!puzzle.isDaily}
        streak={stats.currentStreak}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onOpenCustomCreator={() => setIsCustomCreatorOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onResetToday={() => {
          window.location.hash = "";
          setPuzzle(getPuzzleForDate(todayDateStr));
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Puzzle Metadata & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#0F1116] border border-[#C5A059]/30 gold-glow-subtle">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-serif uppercase tracking-[0.2em] text-[#E2E8F0] font-light">
                {puzzle.title}
              </h2>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest font-mono font-bold bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                {puzzle.difficulty}
              </span>
              <span className="text-xs text-[#94A3B8] uppercase tracking-widest font-mono">
                {puzzle.theme}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1 font-serif italic">
              Fragments Decoded: <span className="font-mono text-[#C5A059] font-bold">{solvedCluesCount}/{puzzle.clues.length}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0A0B0E] border border-[#C5A059]/30 font-mono text-xs font-bold text-[#C5A059]">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            {/* Restart Button */}
            <button
              onClick={() => initPuzzle(puzzle)}
              className="p-2 bg-[#12141A] hover:bg-[#1C1F28] text-[#94A3B8] hover:text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-colors cursor-pointer"
              title="Reset this cipher"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 1: The Secret Message Board (The Ultimate Goal) */}
        <SecretMessageBoard
          secretMessage={puzzle.secretMessage}
          secretInput={secretInput}
          isSolved={isGameSolved}
          unlockedLetters={unlockedLetters}
          activeFocus={activeFocus}
          onSelectSlot={(slotIndex) => {
            setActiveFocus({ type: "secret", slotIndex });
          }}
          onClearSecretMessage={handleClearSecretMessage}
          onShuffleLetterBank={() => {
            // Re-render
          }}
          onRevealSecretLetter={handleRevealSecretLetter}
          onLetterBankClick={handleLetterBankClick}
        />

        {/* Section 2: The Daily Scrambled Clues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#C5A059] animate-pulse" />
              <h3 className="text-xs font-serif uppercase tracking-[0.25em] text-[#C5A059] font-light">
                Cipher Fragments ({solvedCluesCount}/{puzzle.clues.length} Decoded)
              </h3>
            </div>
            <span className="text-[11px] text-[#94A3B8] italic font-serif">
              Marked (★) glyphs populate the Vault
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {puzzle.clues.map((clue, idx) => (
              <ClueCard
                key={clue.id}
                clue={clue}
                clueIndex={idx}
                clueState={
                  clueStates[clue.id] || {
                    currentInput: Array(clue.targetWord.length).fill(""),
                    isSolved: false,
                  }
                }
                activeFocus={activeFocus}
                onSelectSlot={(clueId, slotIndex) => {
                  setActiveFocus({ type: "clue", clueId, slotIndex });
                }}
                onShuffleScramble={handleShuffleScramble}
                onClearClue={handleClearClue}
                onRevealClueLetter={handleRevealClueLetter}
                onRequestAiHint={() => {}}
                onTileClick={(clueId, letter) => {
                  if (activeFocus?.type === "clue" && activeFocus.clueId === clueId) {
                    handleCharInput(letter);
                  } else {
                    const state = clueStates[clueId];
                    const firstEmpty = state.currentInput.findIndex((val) => !val);
                    const slot = firstEmpty !== -1 ? firstEmpty : 0;
                    setActiveFocus({ type: "clue", clueId, slotIndex: slot });
                    setTimeout(() => handleCharInput(letter), 10);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* On-Screen Keyboard */}
        <div className="pt-4 sticky bottom-2 z-20">
          <OnScreenKeyboard
            onKeyPress={handleCharInput}
            onBackspace={handleBackspace}
            onNavigatePrev={() => {
              if (activeFocus) retreatCursor(activeFocus);
            }}
            onNavigateNext={() => {
              if (activeFocus) advanceCursor(activeFocus);
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[10px] font-serif uppercase tracking-[0.3em] text-[#64748B] border-t border-[#C5A059]/10 mt-auto">
        <p>The Royal Cipher Dispatch • An Enigmatic Daily Lexicon</p>
      </footer>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        currentPuzzleDate={puzzle.date}
        isCurrentPuzzleSolved={isGameSolved}
        currentSolveTime={elapsedSeconds}
        currentHintsUsed={hintsUsed}
      />

      <DailyArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        currentPuzzleId={puzzle.id}
        completedPuzzleIds={stats.completedPuzzleIds}
        onSelectPuzzle={(selectedPuzzle) => {
          setPuzzle(selectedPuzzle);
        }}
      />

      <AiGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onPuzzleGenerated={(newPuzzle) => {
          setPuzzle(newPuzzle);
        }}
      />

      <CustomPuzzleModal
        isOpen={isCustomCreatorOpen}
        onClose={() => setIsCustomCreatorOpen(false)}
        onPuzzleCreated={(newPuzzle) => {
          setPuzzle(newPuzzle);
        }}
      />

      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
