import { GoogleGenAI } from "@google/genai";
import systemPrompt from "../prompts/systemPrompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateResponse = async (history) => {
  try {

    const conversation = history
      .map((item) => `${item.role}: ${item.message}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `
${systemPrompt}

Conversation History:
${conversation}

Assistant:
`,
    });

    return response.text;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};