import { GoogleGenAI, Type } from "@google/genai";
import { PeriodLog, AnalysisResult } from "../types";

export const analyzeHealthRisks = async (logs: PeriodLog[], age: number, location?: string): Promise<AnalysisResult> => {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (process.env as any).API_KEY;

  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API Key is missing in Render Environment.");
  }

  // ১. সরাসরি apiKey দাও (অবজেক্ট {} দেবে না)
  const genAI = new GoogleGenAI(apiKey); 

  const historyString = logs.map(l => 
    `Cycle: ${l.cycleLength}d, Duration: ${l.duration}d, Flow: ${l.flowIntensity}, Pain: ${l.painLevel}, Symptoms: ${l.symptoms.join(', ')}`
  ).join('\n');

  const locationContext = location ? `User location: ${location}.` : "";

  try {
    // ২. একদম স্টেবল মডেলের নাম ব্যবহার করো
   // এভাবে লিখে দেখো লাল দাগ যায় কি না
const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze menstrual health for a ${age}-year-old female. ${locationContext} Data:\n${historyString}`;

    // ৩. নতুন পদ্ধতিতে জেনারেট করো যা 404 এরর দেবে না
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallHealthScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  riskLevel: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["condition", "riskLevel", "reasoning", "recommendations"]
              }
            },
            wellnessPlan: {
              type: Type.OBJECT,
              properties: {
                dietChart: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      meal: { type: Type.STRING },
                      recommendation: { type: Type.STRING }
                    },
                    required: ["meal", "recommendation"]
                  }
                },
                yogaPoses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      benefit: { type: Type.STRING }
                    },
                    required: ["name", "benefit"]
                  }
                },
                foodHabits: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["dietChart", "yogaPoses", "foodHabits"]
            },
            disclaimer: { type: Type.STRING }
          },
          required: ["overallHealthScore", "summary", "risks", "wellnessPlan", "disclaimer"]
        },
      }
    });

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.trim());
    
  } catch (err: any) {
    console.error("Gemini API Error details:", err);
    throw new Error(`API Error: ${err?.message || "Something went wrong"}`);
  }
};