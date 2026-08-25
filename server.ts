import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Puzzle Generator Endpoint
app.post("/api/generate-puzzle", async (req: Request, res: Response) => {
  try {
    const { theme = "General Knowledge", difficulty = "Medium", customTopic } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on server.",
        fallback: true,
      });
    }

    const clueCount = difficulty === "Easy" ? 3 : difficulty === "Hard" ? 5 : 4;
    const prompt = `Create a classic Jumble / Word Scramble secret message puzzle.
Theme: "${customTopic || theme}".
Difficulty: ${difficulty}.
The puzzle must contain:
1. A Secret Message riddle/prompt and the answer phrase (UPPERCASE letters and spaces only, 10-25 letters total, no punctuation except spaces).
   The secret answer should be witty, clever, punny, or a memorable fact/quote related to the theme.
2. Exactly ${clueCount} Clue Words (each 4-7 letters long) that players must unscramble.
   - For each clue word: provide the scrambled anagram, the target uppercase word, and a clear helpful clue definition.
   - For each clue word, pick 1 to 3 marked letter indices (0-indexed position within targetWord).
   - CRITICAL REQUIREMENT: The letters from all the marked indices across all clue words MUST EXACTLY MATCH (multiset anagram of) the letters in the secret message answer phrase (ignoring spaces)! 
   For example, if the secret message phrase is "CAT AND DOG", the marked indices across all clue words must together contain exactly the letters C, A, T, A, N, D, D, O, G in some order.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master crossword, Jumble, and word puzzle designer. Always produce valid anagrams with accurate marked letter mappings where the marked letters perfectly combine to spell the secret message answer phrase.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy puzzle title" },
            theme: { type: Type.STRING, description: "Theme name" },
            difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
            secretMessage: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING, description: "The riddle, question, or clue for the secret message" },
                phrase: { type: Type.STRING, description: "The final answer phrase in ALL CAPS" },
                category: { type: Type.STRING, description: "Category like Pun, Quote, Riddle, or Mystery Fact" },
                source: { type: Type.STRING, description: "Attribution or fun note" },
              },
              required: ["prompt", "phrase", "category"],
            },
            clues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  scrambled: { type: Type.STRING, description: "Scrambled letters in ALL CAPS" },
                  targetWord: { type: Type.STRING, description: "The solved word in ALL CAPS" },
                  hint: { type: Type.STRING, description: "Definition or synonym clue" },
                  markedIndices: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                    description: "Indices (0-based) in targetWord whose letters feed into secret message",
                  },
                },
                required: ["scrambled", "targetWord", "hint", "markedIndices"],
              },
            },
          },
          required: ["title", "theme", "secretMessage", "clues"],
        },
      },
    });

    const puzzleData = JSON.parse(response.text || "{}");
    
    // Assign IDs if missing
    if (puzzleData.clues) {
      puzzleData.clues = puzzleData.clues.map((clue: any, idx: number) => ({
        ...clue,
        id: clue.id || `clue-${idx + 1}`,
        scrambled: clue.scrambled.toUpperCase(),
        targetWord: clue.targetWord.toUpperCase(),
      }));
    }
    if (puzzleData.secretMessage) {
      puzzleData.secretMessage.phrase = puzzleData.secretMessage.phrase.toUpperCase();
    }
    puzzleData.id = `ai-${Date.now()}`;
    puzzleData.date = new Date().toISOString().split("T")[0];
    puzzleData.isAiGenerated = true;

    res.json({ puzzle: puzzleData });
  } catch (error: any) {
    console.error("Gemini puzzle generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate puzzle" });
  }
});

// Smart Hint endpoint
app.post("/api/ai-hint", async (req: Request, res: Response) => {
  try {
    const { word, hint, currentInput, context } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini client not initialized" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Provide a subtle, clever, non-spoiling hint for someone trying to unscramble a word in a word puzzle.
Target word: "${word}"
Existing clue definition: "${hint}"
Player's current guess: "${currentInput || 'none'}"
Context: ${context || 'Word puzzle clue'}
Keep the hint under 20 words, witty and encouraging without directly stating the word.`,
    });

    res.json({ hint: response.text?.trim() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware / static serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Word Scramble Puzzle Server running on http://localhost:${PORT}`);
  });
}

startServer();
