import { ClueWord, Puzzle, UserStats } from "../types";

export const STATS_STORAGE_KEY = "scramble_puzzle_user_stats";
export const PROGRESS_STORAGE_KEY = "scramble_puzzle_progress_";

export function getCleanLetters(phrase: string): string[] {
  return phrase.toUpperCase().replace(/[^A-Z]/g, "").split("");
}

export function getPhraseWords(phrase: string): string[][] {
  const words = phrase.toUpperCase().trim().split(/\s+/);
  return words.map((w) => w.replace(/[^A-Z]/g, "").split(""));
}

export function shuffleString(str: string): string {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure we don't accidentally return the exact target word
  return arr.join("");
}

export function getMarkedLettersForClue(clue: ClueWord, currentInput: string[]): { char: string; index: number; isFilled: boolean }[] {
  return clue.markedIndices.map((idx) => {
    const char = currentInput[idx] || "";
    return {
      char: char.toUpperCase(),
      index: idx,
      isFilled: !!char,
    };
  });
}

// Get all marked target letters that will feed into the secret message
export function getAllTargetMarkedLetters(puzzle: Puzzle): { char: string; clueId: string; markedIndex: number }[] {
  const letters: { char: string; clueId: string; markedIndex: number }[] = [];
  puzzle.clues.forEach((clue) => {
    clue.markedIndices.forEach((idx) => {
      if (idx < clue.targetWord.length) {
        letters.push({
          char: clue.targetWord[idx].toUpperCase(),
          clueId: clue.id,
          markedIndex: idx,
        });
      }
    });
  });
  return letters;
}

// Load stats from localStorage
export function loadUserStats(): UserStats {
  try {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load stats", e);
  }
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: "",
    totalTimeSeconds: 0,
    fastestSolveSeconds: 0,
    completedPuzzleIds: [],
  };
}

// Save stats to localStorage
export function saveUserStats(stats: UserStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save stats", e);
  }
}

// Format seconds into MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Base64 puzzle share encode / decode
export function encodePuzzleToHash(puzzle: Puzzle): string {
  try {
    const json = JSON.stringify(puzzle);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    return "";
  }
}

export function decodePuzzleFromHash(hash: string): Puzzle | null {
  try {
    const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!cleanHash) return null;
    const json = decodeURIComponent(atob(cleanHash));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
