
import { GoogleGenAI } from "@google/genai";

export const fetchDailyMotivation = async (prayerCount: number, duaCount: number) => {
  // Fix: Directly use process.env.API_KEY in the constructor as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `با توجه به اینکه کاربر امروز ${prayerCount} وعده نماز و ${duaCount} دعا خوانده است، یک جمله کوتاه، زیبا و انگیزشی مذهبی به زبان فارسی برای او بنویس که او را به بندگی بیشتر تشویق کند. حداکثر ۱۰ کلمه باشد.`,
      config: {
        systemInstruction: "You are a spiritual mentor focusing on Islamic ethics and encouragement."
      }
    });
    return response.text || "خداوند پشتیبان شماست.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "در مسیر بندگی مستدام باشید.";
  }
};
