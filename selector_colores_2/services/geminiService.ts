import { GoogleGenAI, Type } from "@google/genai";
import { HarmonyType } from '../types';

export const generateAiPalette = async (mood: string): Promise<{ baseHex: string; harmony: HarmonyType; description: string } | null> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a base color (hex) and suggest a color harmony rule based on this mood/description: "${mood}". Explain briefly why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            baseHex: { type: Type.STRING, description: "The base color in hexadecimal format (e.g. #FF5500)" },
            harmony: { 
              type: Type.STRING, 
              enum: Object.values(HarmonyType),
              description: "The type of color harmony to apply."
            },
            description: { type: Type.STRING, description: "A very short explanation (max 100 chars) in Spanish." }
          },
          required: ["baseHex", "harmony", "description"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};