import React from 'react';
import { FileText, ChevronRight, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

const ProceduresView: React.FC = () => {
    const procedures = [
        { 
            id: 1, 
            title: 'Controlo de Passageiros Non-Schengen', 
            description: 'Procedimento padrão para verificação documental e biometria na chegada de voos internacionais.',
            category: 'Fronteira',
            icon: <Users className="w-5 h-5" />
        },
        { 
            id: 2, 
            title: 'Gestão de Recusas de Entrada', 
            description: 'Passos a seguir em caso de inadmissibilidade, preenchimento de autos e contacto com transportadora.',
            category: 'Segurança',
            icon: <AlertTriangle className="w-5 h-5" />
        },
        { 
            id: 3, 
            title: 'Vistoria a Aeronaves Privadas', 
            description: 'Protocolo de segurança e fiscalização alfandegária para aviação executiva e geral.',
            category: 'Fiscalização',
            icon: <CheckCircle2 className="w-5 h-5" />
        },
        { 
            id: 4, 
            title: 'Acionamento de Piquete de Emergência', 
            description: 'Matriz de comunicação e tempos de resposta para situações críticas no aeroporto.',
            category: 'Emergência',
            icon: <AlertTriangle className="w-5 h-5" />
        },
    ];

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <FileText className="w-6 h-6" />
                            Procedimentos Operacionais
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Procedimentos Operacionais Padrão (SOPs)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {procedures.map((proc) => (
                        <div key={proc.id} className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        {proc.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{proc.category}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{proc.title}</h3>
                                        <p className="text-gray-600 mt-1 max-w-2xl">{proc.description}</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProceduresView;