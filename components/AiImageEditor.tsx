import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Camera, Loader2, Download, RefreshCw, Wand2 } from 'lucide-react';
import { editImageWithGemini, blobToBase64 } from '../services/geminiService';

const AiImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await blobToBase64(file);
                // Ensure we have the data prefix for display
                const dataUrl = `data:${file.type};base64,${base64}`;
                setOriginalImage(dataUrl);
                setGeneratedImage(null);
            } catch (err) {
                console.error("Error reading file", err);
            }
        }
    };

    const handleGenerate = async () => {
        if (!originalImage || !prompt.trim() || isProcessing) return;

        setIsProcessing(true);
        try {
            // Extract raw base64 for API
            const base64Data = originalImage.split(',')[1];
            const result = await editImageWithGemini(base64Data, prompt);
            if (result) {
                setGeneratedImage(result);
            } else {
                alert("Não foi possível gerar a imagem. Tente novamente.");
            }
        } catch (error) {
            console.error("Generation failed", error);
            alert("Erro na geração da imagem.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-primary text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Camera className="w-6 h-6" />
                        Captura / Upload de Imagem
                    </h2>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Gemini 2.5 Flash</span>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div 
                            className={`border-2 border-dashed rounded-xl h-64 md:h-80 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${originalImage ? 'border-primary/50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {originalImage ? (
                                <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center p-6">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">Clique para capturar ou carregar imagem</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG suportados</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Instrução de Edição IA</label>
                            <textarea 
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                rows={3}
                                placeholder="Ex: Identifique o texto da imagem, Melhore a nitidez, etc..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <button 
                                onClick={handleGenerate}
                                disabled={!originalImage || !prompt.trim() || isProcessing}
                                className="w-full mt-3 bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        Processar com IA
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-6">
                        <div className="border-2 border-gray-200 rounded-xl h-64 md:h-80 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
                            {generatedImage ? (
                                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center p-6 opacity-50">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600">O resultado aparecerá aqui</p>
                                </div>
                            )}
                        </div>

                        {generatedImage && (
                            <div className="flex gap-3">
                                <a 
                                    href={generatedImage} 
                                    download="edited-image.png"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Baixar Imagem
                                </a>
                                <button 
                                    onClick={() => {
                                        setOriginalImage(generatedImage);
                                        setGeneratedImage(null);
                                        setPrompt('');
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Usar como Base
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiImageEditor;