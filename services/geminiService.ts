
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResponse } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVideoFrame = async (base64Image: string, prompt: string): Promise<GeminiAnalysisResponse> => {
  // Create a new instance right before making an API call
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedTitle: { type: Type.STRING }
          },
          required: ["summary", "tags", "suggestedTitle"]
        }
      }
    });

    // Directly access the .text property (not a method)
    const resultText = response.text || "{}";
    return JSON.parse(resultText) as GeminiAnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateVideo = async (prompt: string, onProgress: (msg: string) => void): Promise<string> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    onProgress("Initializing NovaDream Engine...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    onProgress("Synthesizing neural temporal layers...");
    
    while (!operation.done) {
      // Use 10s delay as recommended for video operations
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      
      const progressMsgs = [
        "Rendering lighting and shadows...",
        "Applying cinematic filters...",
        "Finalizing pixel consistency...",
        "NovaStream is manifesting your dream..."
      ];
      onProgress(progressMsgs[Math.floor(Math.random() * progressMsgs.length)]);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed");

    // Fetch the MP4 bytes using the API key appended to the download URL
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
};
