export interface ClueWord {
  id: string;
  scrambled: string;
  targetWord: string;
  hint: string;
  markedIndices: number[]; // 0-based indices in targetWord that feed the secret message
}

export interface SecretMessage {
  prompt: string; // The riddle, question, or clue
  phrase: string; // The final answer (UPPERCASE letters and spaces)
  category?: string; // e.g. "Pun", "Riddle", "Quote", "Fact"
  source?: string; // e.g. "Author", "Punchline", "Origin"
}

export interface Puzzle {
  id: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  theme: string;
  clues: ClueWord[];
  secretMessage: SecretMessage;
  isDaily?: boolean;
  isCustom?: boolean;
  isAiGenerated?: boolean;
}

export interface ClueState {
  currentInput: string[]; // character for each letter slot
  isSolved: boolean;
  isShuffledScramble?: string;
  revealedIndices?: number[]; // indices revealed via hints
}

export interface SecretMessageState {
  currentInput: string[]; // character for each letter slot in phrase (excluding spaces)
  isSolved: boolean;
  revealedIndices?: number[];
}

export interface GameProgress {
  puzzleId: string;
  date: string;
  clueStates: Record<string, ClueState>;
  secretInput: string[];
  isCompleted: boolean;
  elapsedSeconds: number;
  hintsUsed: number;
  startTime: number;
  completedTime?: number;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string;
  totalTimeSeconds: number;
  fastestSolveSeconds: number;
  completedPuzzleIds: string[];
}

export type ActiveFocus = {
  type: "clue";
  clueId: string;
  slotIndex: number;
} | {
  type: "secret";
  slotIndex: number;
};
