import React from 'react';
import { FileText, Download, Search, File } from 'lucide-react';

const TemplatesView: React.FC = () => {
    const templates = [
        { id: 1, name: 'Modelo de Auto de Notícia', type: 'DOCX', size: '245 KB', date: '2025-12-10' },
        { id: 2, name: 'Ficha de Passageiro (Manual)', type: 'PDF', size: '1.2 MB', date: '2025-11-05' },
        { id: 3, name: 'Termo de Responsabilidade - Piloto', type: 'PDF', size: '890 KB', date: '2026-01-02' },
        { id: 4, name: 'Relatório de Ocorrência Padrão', type: 'DOCX', size: '150 KB', date: '2025-10-20' },
        { id: 5, name: 'Requisição de Material', type: 'XLSX', size: '45 KB', date: '2025-09-15' },
        { id: 6, name: 'Declaração de Entrada/Saída', type: 'PDF', size: '560 KB', date: '2026-01-08' },
    ];

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <FileText className="w-6 h-6" />
                            Modelos e Formulários
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Repositório de documentos oficiais para uso diário</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Pesquisar modelos..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${item.type === 'PDF' ? 'bg-red-50 text-red-600' : item.type === 'DOCX' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                    <File className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.type}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                            <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                                <span className="text-xs text-gray-400">{item.size} • {item.date}</span>
                                <button className="text-primary hover:bg-blue-50 p-2 rounded-full transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplatesView;