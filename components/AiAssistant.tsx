import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MapPin, Search } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const AiAssistant: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'model',
            text: 'Olá! Sou o assistente de IA do Controle de Fronteira. Como posso ajudar com os regulamentos, dados de voo ou informações gerais hoje?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Get location if possible for better context
            let location = undefined;
            // Note: In a real app we would request permission properly. 
            // Mocking latitude/longitude for Porto Santo if we wanted to be specific.
            
            const response = await sendMessageToGemini(messages.concat(userMsg), userMsg.text, location);
            
            const modelMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: response.text,
                timestamp: new Date(),
                groundingMetadata: response.groundingChunks
            };

            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: "Desculpe, encontrei um erro ao processar seu pedido.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full transition-colors">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-primary dark:bg-blue-900 text-white">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <h2 className="font-bold">PF008 IA</h2>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/90">Gemini 3 Pro</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary dark:bg-blue-600 text-white' : 'bg-green-600 dark:bg-green-700 text-white'}`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-lg shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary dark:bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                    
                                    {/* Grounding Sources Display */}
                                    {msg.groundingMetadata && msg.groundingMetadata.length > 0 && (
                                        <div className="mt-2 text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 w-full max-w-md">
                                            <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><Search className="w-3 h-3" /> Fontes:</p>
                                            <ul className="space-y-1">
                                                {msg.groundingMetadata.map((chunk: any, idx: number) => {
                                                    if (chunk.web) {
                                                        return (
                                                            <li key={idx}>
                                                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate">
                                                                    {chunk.web.title}
                                                                </a>
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </ul>
                                        </div>
                                    )}

                                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="flex max-w-[80%] flex-row gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-600 dark:bg-green-700 text-white flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 rounded-tl-none flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary dark:text-blue-400" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">A pensar...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Faça uma pergunta sobre voos, leis ou meteorologia..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-primary dark:focus:border-blue-500 outline-none transition-all"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-primary dark:bg-blue-600 hover:bg-secondary dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;