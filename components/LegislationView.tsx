import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, FileWarning, Search } from 'lucide-react';

const LegislationView: React.FC = () => {
    const laws = [
        { id: 1, title: 'Lei n.º 23/2007', subtitle: 'Regime Jurídico de Entrada, Permanência, Saída e Afastamento de Estrangeiros', category: 'Fronteiras', important: true },
        { id: 2, title: 'Código das Fronteiras Schengen', subtitle: 'Regulamento (UE) 2016/399', category: 'UE / Schengen', important: true },
        { id: 3, title: 'Lei da Segurança Interna', subtitle: 'Lei n.º 53/2008', category: 'Segurança', important: false },
        { id: 4, title: 'Decreto-Lei n.º 29/2025', subtitle: 'Orgânica das Forças de Segurança (Atualizado)', category: 'Orgânica', important: false },
        { id: 5, title: 'Manual Prático da Guarda de Fronteiras', subtitle: 'Anexo à Recomendação C(2006) 5186', category: 'Operacional', important: true },
    ];

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <BookOpen className="w-6 h-6" />
                            Legislação PF008
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Base legal e regulamentar aplicável ao Posto de Fronteira</p>
                    </div>
                     <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Pesquisar diplomas..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {laws.map((law) => (
                        <div key={law.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full flex-shrink-0 ${law.important ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {law.important ? <ShieldCheck className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{law.title}</h3>
                                        {law.important && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Principal</span>}
                                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{law.category}</span>
                                    </div>
                                    <p className="text-gray-600">{law.subtitle}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline whitespace-nowrap">
                                Consultar
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
                    <FileWarning className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-800 text-lg mb-1">Nota Informativa</h4>
                        <p className="text-blue-700 text-sm">
                            A base de dados de legislação é atualizada semanalmente. Para consultar as versões consolidadas mais recentes, utilize sempre o Diário da República Eletrónico através dos links disponibilizados. O assistente IA (PF008 IA) também tem acesso a estes regulamentos para esclarecimento de dúvidas rápidas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegislationView;