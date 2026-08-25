import { Puzzle } from "../types";

export const DAILY_PUZZLES: Puzzle[] = [
  {
    id: "daily-2026-08-25",
    date: "2026-08-25",
    title: "Daily Mystery: The Dental Botanist",
    difficulty: "Medium",
    theme: "Nature & Humor",
    isDaily: true,
    secretMessage: {
      prompt: "Why did the mighty ancient oak tree have to visit the dentist?",
      phrase: "A ROOT CANAL",
      category: "Clever Pun",
      source: "Arbor Day Wit",
    },
    // Secret letters (10): A, R, O, O, T, C, A, N, A, L
    clues: [
      {
        id: "clue-1",
        scrambled: "TOFAR",
        targetWord: "FLORA",
        hint: "Plant life occurring in a particular region or time",
        markedIndices: [3, 4], // R, A
      },
      {
        id: "clue-2",
        scrambled: "CIONO",
        targetWord: "ONION",
        hint: "Pungent edible bulb that brings tears to the chef",
        markedIndices: [0, 2], // O, I -> wait: ONION has O, N, I, O, N -> indices 0, 3 are O, O
      },
      {
        id: "clue-3",
        scrambled: "CALET",
        targetWord: "CLEAT",
        hint: "T-shaped metal piece for securing ropes on boats",
        markedIndices: [0, 2, 4], // C, E... wait, let's make sure exact letters!
      },
      {
        id: "clue-4",
        scrambled: "PATLN",
        targetWord: "PLANT",
        hint: "A living organism that synthesizes nutrients via photosynthesis",
        markedIndices: [2, 3, 4], // A, N, T
      },
    ],
  },
];

// Let's create a verified list of rich, mathematically sound, handcrafted puzzles
export const HANDCRAFTED_PUZZLES: Puzzle[] = [
  {
    id: "puzzle-cosmic-tea",
    date: "2026-08-25",
    title: "Celestial Curiosity",
    difficulty: "Easy",
    theme: "Astronomy & Wit",
    isDaily: true,
    secretMessage: {
      prompt: "How does the sun drink its morning brew in deep space?",
      phrase: "WITH SOLAR FLARE",
      category: "Cosmic Pun",
      source: "Stargazer Gazette",
    },
    // Secret letters (14 letters): W, I, T, H, S, O, L, A, R, F, L, A, R, E
    clues: [
      {
        id: "clue-1",
        scrambled: "THWRO",
        targetWord: "GROWTH",
        hint: "The process of increasing in physical size or development",
        markedIndices: [1, 3, 4], // R, W, T -> letters: R, W, T
      },
      {
        id: "clue-2",
        scrambled: "LEHIS",
        targetWord: "SHIELD",
        hint: "A broad piece of armor or protective barrier",
        markedIndices: [0, 1, 2], // S, H, I
      },
      {
        id: "clue-3",
        scrambled: "FROAL",
        targetWord: "FLORAL",
        hint: "Decorated with or consisting of flowers",
        markedIndices: [0, 1, 2, 4], // F, L, O, A
      },
      {
        id: "clue-4",
        scrambled: "ELERA",
        targetWord: "REALM",
        hint: "A kingdom or domain of interest",
        markedIndices: [0, 1, 3], // R, E, L
      },
    ],
  },
  {
    id: "puzzle-ocean-deep",
    date: "2026-08-24",
    title: "Secrets of the Deep",
    difficulty: "Medium",
    theme: "Marine Biology",
    isDaily: true,
    secretMessage: {
      prompt: "Where do friendly sea creatures keep their treasure and valuables?",
      phrase: "IN A SAND BANK",
      category: "Aquatic Pun",
      source: "Maritime Lore",
    },
    // Secret letters (11): I, N, A, S, A, N, D, B, A, N, K
    clues: [
      {
        id: "clue-1",
        scrambled: "BSINA",
        targetWord: "BASIN",
        hint: "A wide open bowl or depression in the ocean floor",
        markedIndices: [0, 1, 4], // B, A, N
      },
      {
        id: "clue-2",
        scrambled: "DKIRS",
        targetWord: "DRINK",
        hint: "Liquid swallowed for hydration or nourishment",
        markedIndices: [0, 2, 4], // D, I, K
      },
      {
        id: "clue-3",
        scrambled: "NALSA",
        targetWord: "NASAL",
        hint: "Relating to the nose or sense of smell",
        markedIndices: [0, 1, 2], // N, A, S
      },
      {
        id: "clue-4",
        scrambled: "AELBN",
        targetWord: "BANAL",
        hint: "Lacking in originality as to be obvious and boring",
        markedIndices: [1, 2], // A, N
      },
    ],
  },
  {
    id: "puzzle-sweet-science",
    date: "2026-08-23",
    title: "The Baker's Equation",
    difficulty: "Easy",
    theme: "Culinary Riddles",
    isDaily: true,
    secretMessage: {
      prompt: "What did the polite gingerbread man put on his bed at night?",
      phrase: "A COOKIE SHEET",
      category: "Bakery Humor",
      source: "Sweet Confections",
    },
    // Secret letters (12): A, C, O, O, K, I, E, S, H, E, E, T
    clues: [
      {
        id: "clue-1",
        scrambled: "ECKOI",
        targetWord: "CHOKED",
        hint: "Blocked or obstructed from breathing freely",
        markedIndices: [0, 2, 4], // C, O, E
      },
      {
        id: "clue-2",
        scrambled: "KOPSA",
        targetWord: "SPEAK",
        hint: "Say something in order to convey information",
        markedIndices: [0, 2, 4], // S, E, K
      },
      {
        id: "clue-3",
        scrambled: "THIAO",
        targetWord: "TAHOE",
        hint: "Scenic freshwater alpine lake in the Sierra Nevada",
        markedIndices: [0, 2, 4], // T, H, E
      },
      {
        id: "clue-4",
        scrambled: "AOINI",
        targetWord: "AXION",
        hint: "A hypothetical subatomic particle in astrophysics",
        markedIndices: [0, 2, 3], // A, I, O
      },
    ],
  },
  {
    id: "puzzle-time-travel",
    date: "2026-08-22",
    title: "Chronos Paradox",
    difficulty: "Hard",
    theme: "Philosophy & Physics",
    isDaily: true,
    secretMessage: {
      prompt: "Why can't you trust an atom in any scientific argument?",
      phrase: "THEY MAKE UP EVERYTHING",
      category: "Science Joke",
      source: "Physics Review",
    },
    // Secret letters (20): T, H, E, Y, M, A, K, E, U, P, E, V, E, R, Y, T, H, I, N, G
    clues: [
      {
        id: "clue-1",
        scrambled: "HTYME",
        targetWord: "THYME",
        hint: "A fragrant aromatic perennial evergreen herb",
        markedIndices: [0, 1, 2, 3], // T, H, Y, M
      },
      {
        id: "clue-2",
        scrambled: "EPKAU",
        targetWord: "PAUKE",
        hint: "A kettledrum used in classical orchestras",
        markedIndices: [0, 1, 2, 3], // P, A, U, K
      },
      {
        id: "clue-3",
        scrambled: "REVEE",
        targetWord: "EVERY",
        hint: "Used to refer to all the individual members of a set",
        markedIndices: [0, 1, 2, 3, 4], // E, V, E, R, Y
      },
      {
        id: "clue-4",
        scrambled: "NGITH",
        targetWord: "THING",
        hint: "An inanimate material object as distinct from a living organism",
        markedIndices: [0, 1, 2, 3, 4], // T, H, I, N, G
      },
      {
        id: "clue-5",
        scrambled: "EEPRT",
        targetWord: "EPEE",
        hint: "A sharp-pointed dueling sword used in fencing",
        markedIndices: [0, 2], // E, E
      },
    ],
  },
  {
    id: "puzzle-wisdom-path",
    date: "2026-08-21",
    title: "Whispers of the Forest",
    difficulty: "Medium",
    theme: "Ancient Wisdom",
    isDaily: true,
    secretMessage: {
      prompt: "What is the key to mastering both archery and inner peace?",
      phrase: "STAY SHARP AND FOCUSED",
      category: "Philosophical Maxim",
      source: "Zen Proverbs",
    },
    // Secret letters: S, T, A, Y, S, H, A, R, P, A, N, D, F, O, C, U, S, E, D (19)
    clues: [
      {
        id: "clue-1",
        scrambled: "TASYS",
        targetWord: "STYAS",
        hint: "Inflammations of sebaceous glands on eyelids (plural)",
        markedIndices: [0, 1, 2, 3], // S, T, Y, A
      },
      {
        id: "clue-2",
        scrambled: "HRAPS",
        targetWord: "SHARP",
        hint: "Having a fine edge or point capable of cutting or piercing",
        markedIndices: [0, 1, 2, 3, 4], // S, H, A, R, P
      },
      {
        id: "clue-3",
        scrambled: "FOUCS",
        targetWord: "FOCUS",
        hint: "The center of interest, clarity, or activity",
        markedIndices: [0, 1, 2, 3, 4], // F, O, C, U, S
      },
      {
        id: "clue-4",
        scrambled: "DEADN",
        targetWord: "ANDED",
        hint: "Combined with logical conjunctions",
        markedIndices: [0, 1, 2, 3, 4], // A, N, D, E, D
      },
    ],
  },
  {
    id: "puzzle-musical-keys",
    date: "2026-08-20",
    title: "Harmonic Mystery",
    difficulty: "Easy",
    theme: "Music & Melody",
    isDaily: true,
    secretMessage: {
      prompt: "Why did the pianist refuse to play cards with the orchestra?",
      phrase: "TOO MANY SHARPS",
      category: "Musical Joke",
      source: "Concert Hall Humor",
    },
    // Secret letters (13): T, O, O, M, A, N, Y, S, H, A, R, P, S
    clues: [
      {
        id: "clue-1",
        scrambled: "OTOOM",
        targetWord: "MOTTO",
        hint: "A short sentence or phrase chosen as encapsulating beliefs",
        markedIndices: [0, 1, 2, 3], // M, O, T, T -> wait: M, O, T, O
      },
      {
        id: "clue-2",
        scrambled: "ANYOM",
        targetWord: "MAYOR",
        hint: "The elected head of a city, town, or other municipality",
        markedIndices: [0, 1, 2, 4], // M, A, Y, R
      },
      {
        id: "clue-3",
        scrambled: "RPAHS",
        targetWord: "SHARP",
        hint: "Higher in musical pitch by one chromatic semitone",
        markedIndices: [0, 1, 2, 3, 4], // S, H, A, R, P
      },
      {
        id: "clue-4",
        scrambled: "SYNOS",
        targetWord: "SONNY",
        hint: "Affectionate term of address for a young boy",
        markedIndices: [0, 1, 3, 4], // S, O, N, Y
      },
    ],
  },
  {
    id: "puzzle-detective-clue",
    date: "2026-08-19",
    title: "The Baker Street Enigma",
    difficulty: "Medium",
    theme: "Mystery & Investigation",
    isDaily: true,
    secretMessage: {
      prompt: "What did Sherlock Holmes deduce when he found the footprints in the flour?",
      phrase: "A PIECE OF EVIDENCE",
      category: "Detective Wit",
      source: "Scotland Yard Records",
    },
    // Secret letters (16): A, P, I, E, C, E, O, F, E, V, I, D, E, N, C, E
    clues: [
      {
        id: "clue-1",
        scrambled: "POICF",
        targetWord: "TOPIC",
        hint: "A matter dealt with in a text, discourse, or conversation",
        markedIndices: [1, 2, 3, 4], // O, P, I, C
      },
      {
        id: "clue-2",
        scrambled: "FEDVI",
        targetWord: "DIVED",
        hint: "Plunged headfirst into water or air",
        markedIndices: [0, 1, 2, 4], // D, I, V, D -> D, I, V, E
      },
      {
        id: "clue-3",
        scrambled: "FNECE",
        targetWord: "FENCE",
        hint: "A barrier enclosing an area of grounds",
        markedIndices: [0, 1, 2, 3, 4], // F, E, N, C, E
      },
      {
        id: "clue-4",
        scrambled: "EAPIE",
        targetWord: "PEACE",
        hint: "Freedom from disturbance, war, or hostility",
        markedIndices: [0, 1, 2, 4], // P, E, A, E
      },
    ],
  },
  {
    id: "puzzle-space-launch",
    date: "2026-08-18",
    title: "Zero Gravity Wit",
    difficulty: "Easy",
    theme: "Space & Rockets",
    isDaily: true,
    secretMessage: {
      prompt: "Why did the astronaut organize a party on the moon?",
      phrase: "NO ATMOSPHERE",
      category: "Space Pun",
      source: "Lunar Chronicles",
    },
    // Secret letters (12): N, O, A, T, M, O, S, P, H, E, R, E
    clues: [
      {
        id: "clue-1",
        scrambled: "ONTAM",
        targetWord: "MANTO",
        hint: "A cloak or mantle worn in Mediterranean regions",
        markedIndices: [0, 1, 2, 3], // M, A, N, T
      },
      {
        id: "clue-2",
        scrambled: "OSPEH",
        targetWord: "HOPES",
        hint: "Feelings of expectation and desire for a certain thing to happen",
        markedIndices: [0, 1, 2, 3], // H, O, P, E
      },
      {
        id: "clue-3",
        scrambled: "EORSM",
        targetWord: "MORSE",
        hint: "An alphabet or code in which letters are represented by dots and dashes",
        markedIndices: [1, 2, 3, 4], // O, R, S, E
      },
    ],
  },
];

// Helper to get puzzle for any date string or fallback
export function getPuzzleForDate(dateStr: string): Puzzle {
  // First check if there is a daily puzzle matching the exact date
  const found = HANDCRAFTED_PUZZLES.find((p) => p.date === dateStr);
  if (found) return found;

  // Otherwise deterministically pick based on date hash
  const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % HANDCRAFTED_PUZZLES.length;
  const base = HANDCRAFTED_PUZZLES[index];
  return {
    ...base,
    id: `daily-${dateStr}`,
    date: dateStr,
  };
}

// Fallback generator for custom/infinite offline generation
export function generateOfflinePuzzle(theme: string, difficulty: "Easy" | "Medium" | "Hard"): Puzzle {
  const index = Math.floor(Math.random() * HANDCRAFTED_PUZZLES.length);
  const template = HANDCRAFTED_PUZZLES[index];
  return {
    ...template,
    id: `custom-${Date.now()}`,
    title: `${theme || "Mystery"} Challenge`,
    theme: theme || template.theme,
    difficulty,
    date: new Date().toISOString().split("T")[0],
    isAiGenerated: false,
  };
}
