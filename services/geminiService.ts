
import { GoogleGenAI } from "@google/genai";
import { MenuItem } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  // In a real app, we might handle missing keys differently. 
  // For this demo, if no key, we return null to signal usage of mock/fallback.
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getChefRecommendation = async (
  query: string,
  menuItems: MenuItem[]
): Promise<string> => {
  const client = getClient();
  
  // Fallback if no API key is present
  if (!client) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I'm sorry, I cannot connect to my brain right now (API Key missing). However, strictly between us, the Hot Chilly Beef Ghee Rice is excellent!");
      }, 1000);
    });
  }

  const menuContext = menuItems.map(item => 
    `- ${item.name} (${item.category}): ${item.description}, Price: ₹${item.price} [${item.available ? 'IN STOCK' : 'SOLD OUT'}]`
  ).join('\n');

  const prompt = `
    You are a friendly and sophisticated Chef at "Urban Spoon".
    Here is our menu (Pay attention to what is SOLD OUT):
    ${menuContext}

    The customer asks: "${query}"

    Provide a helpful, concise, and appetizing answer. 
    Recommend specific items from the menu if relevant.
    IMPORTANT: Do not recommend items marked as SOLD OUT. If they ask for a sold out item, politely suggest an alternative.
    Keep the tone modern and inviting.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "I'm having trouble thinking right now. Please ask again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm experiencing some technical difficulties in the kitchen. Please try again later.";
  }
};
