import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST Copilot AI Endpoint
app.post("/api/copilot", async (req, res) => {
  try {
    const { message, history, context } = req.body;

    let gemini;
    try {
      gemini = getGeminiClient();
    } catch (e: any) {
      return res.status(500).json({
        error: "Configuration Error",
        message: e.message || "Gemini API Key is missing. Please set it in Settings > Secrets.",
      });
    }

    // Build rich, business-specific prompt
    const systemInstruction = `You are the Elite AI Business Copilot for "Wood World Enterprise", a premium, high-end high-fidelity furniture manufacturer and retailer in Pakistan with major branches in Karachi, Lahore, and Islamabad.
Your communication style is highly professional, intelligent, respectful, and crystal-clear. Always speak as an elite Operations Director & Strategic Advisor.
Avoid complex database representations or cyberpunk tech-heavy jargon. Use simple professional business terms in English.
You have real-time access to the ERP local database context provided below. Refer to it to make precise, actionable suggestions, explain reports, detect operational risks, inventory shortages, low stock, due payments, or delivery delays.

ERP DATABASE CONTEXT:
${JSON.stringify(context || {}, null, 2)}

DIRECTIONS:
1. Always analyze the current state first (e.g. branch revenue, Karachi sales, Lahore warehouse stock transfer, pending approvals, installment collections, or delivery delays).
2. Proactively warn if any inventory item has low stock (e.g., Sofa Sets under 5 units, Walnut Dining Tables low) or if a delivery is overdue.
3. Suggest clear, high-priority actions (e.g., "Recommend transferring 5 Oak Bed Sets from Lahore Central Warehouse to Karachi Showroom to fulfill pending orders").
4. Keep replies concise, highly readable, structured, and focused on helping the showroom manager or CEO make quick decisions. Use markdown bullets and bold key terms.
`;

    // Construct the API call
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...(history || []).map((h: any) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.text }],
        })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to analyze that data. Please refine your query.";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Copilot Error:", error);
    res.status(500).json({
      error: "AI Generation Failed",
      message: error.message || "An error occurred while communicating with the Gemini AI engine.",
    });
  }
});

// Configure Vite integration or static file serving
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wood World ERP server running on http://0.0.0.0:${PORT}`);
  });
}

configureServer();
