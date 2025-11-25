import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Summarizes unread messages using Gemini 2.5 Flash.
 */
export const summarizeUnreadMessages = async (conversations: { senderName: string, messages: string[] }[]): Promise<string> => {
  if (conversations.length === 0) return "Nessun messaggio da riassumere.";

  const prompt = `
    Sei un assistente personale intelligente. Il tuo compito è riassumere i seguenti messaggi WhatsApp non letti.
    Raggruppa il riassunto per mittente. Usa uno stile conciso e informale, come se stessi parlando a un amico.
    Usa elenchi puntati per chiarezza.
    
    Ecco i messaggi:
    ${JSON.stringify(conversations, null, 2)}
    
    Output desiderato (in Italiano):
    **[Nome Mittente]**:
    - [Punto chiave 1]
    - [Punto chiave 2]
    
    ...e così via.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Impossibile generare il riassunto.";
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "Si è verificato un errore durante il riassunto dei messaggi.";
  }
};

/**
 * Transcribes audio using Gemini 2.5 Flash.
 */
export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          },
          {
            text: "Trascrivi questo audio esattamente come parlato, in italiano. Non aggiungere commenti o descrizioni, solo il testo parlato."
          }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    throw new Error("Impossibile trascrivere l'audio.");
  }
};