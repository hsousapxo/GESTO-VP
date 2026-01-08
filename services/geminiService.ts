import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const MODEL_CHAT = 'gemini-3-pro-preview';
const MODEL_IMAGE_EDIT = 'gemini-2.5-flash-image';

/**
 * Sends a message to the Gemini Chat model with thinking enabled and grounding tools.
 */
export const sendMessageToGemini = async (
    history: ChatMessage[],
    newMessage: string,
    location?: { latitude: number; longitude: number }
): Promise<{ text: string; groundingChunks?: any[] }> => {
    try {
        const tools: any[] = [{ googleSearch: {} }];
        
        // Add maps tool if location is available (Gemini 2.5 series mainly, but let's try combining or stick to search for pro)
        // Note: The prompt asks for gemini-3-pro-preview for thinking. 
        // Google Maps grounding is for gemini-2.5-flash according to docs.
        // Google Search is for gemini-3-pro-preview.
        // We will prioritize gemini-3-pro-preview with Search as per "Think more" requirement.
        
        const chat = ai.chats.create({
            model: MODEL_CHAT,
            config: {
                systemInstruction: `És um assistente especializado e perito para o Controlo de Fronteira Aérea do Porto Santo (PSP/SEF).
                A tua função é apoiar os agentes com regulamentos, procedimentos e análise de dados.

                REGRAS ESTRITAS DE RESPOSTA:
                1. **CONCISÃO**: Sê direto. Evita introduções longas ou conversa fiada.
                2. **FORMATAÇÃO**: Usa SEMPRE bullet points para listar passos, requisitos ou dados.
                3. **BASE LEGAL**: É OBRIGATÓRIO citar a legislação específica que suporta a tua resposta (ex: Lei n.º 23/2007, Código das Fronteiras Schengen, Decreto-Lei n.º 29/2025, etc.).

                Estrutura a resposta assim:
                * Resposta Direta
                * Pontos Chave (Bullet points)
                * ⚖️ Base Legal: [Artigo/Lei]`,
                thinkingConfig: {
                    thinkingBudget: 32768, 
                },
                tools: tools,
            },
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }))
        });

        const response = await chat.sendMessage({ message: newMessage });
        
        return {
            text: response.text || "Não foi possível gerar uma resposta.",
            groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        };
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return { text: "Erro ao comunicar com o serviço de IA." };
    }
};

/**
 * Edits an image using Gemini 2.5 Flash Image.
 */
export const editImageWithGemini = async (
    imageBase64: string,
    prompt: string
): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_IMAGE_EDIT,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: imageBase64
                        }
                    },
                    {
                        text: prompt
                    }
                ]
            }
        });

        // Check for image in response
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
};

/**
 * Helper to convert Blob to Base64
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data:image/jpeg;base64, prefix if needed by API, but SDK usually handles it or needs raw base64
            // The SDK expects raw base64 string usually.
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};