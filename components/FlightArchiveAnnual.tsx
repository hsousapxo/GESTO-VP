
import React, { useState } from 'react';
import { Search, Folder, Archive, FileText, Download, X } from 'lucide-react';

const FlightArchiveAnnual: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const year = 2026;

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const filteredMonths = months.filter(m => 
        m.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 h-full flex flex-col gap-6 bg-[#0a0e17]">
            {/* Search Bar */}
            <div className="relative max-w-4xl mx-auto w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar no arquivo anual..."
                    className="w-full bg-[#1a2333] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Folder Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full flex-1 overflow-y-auto custom-scrollbar pb-4">
                {filteredMonths.map((month) => (
                    <div 
                        key={month}
                        className="bg-[#131b2e] aspect-[4/3] rounded-[32px] border border-white/5 p-6 flex flex-col justify-center gap-4 hover:bg-[#1a2333] transition-all cursor-pointer group shadow-lg"
                    >
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/10 group-hover:scale-110 transition-transform">
                            <Folder className="w-6 h-6 fill-current opacity-20" />
                            <Folder className="w-6 h-6 absolute" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-none">{month}</h3>
                            <span className="text-xs text-gray-500 font-bold mt-1 block">{year}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Annual Report Card Footer */}
            <div className="max-w-4xl mx-auto w-full">
                <div className="bg-[#131b2e] rounded-[28px] border border-white/5 p-5 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 border border-white/5">
                            <Archive className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">Relatório Anual</h4>
                            <p className="text-sm text-gray-500 font-medium">Estatísticas consolidada {year}</p>
                        </div>
                    </div>
                    <button className="bg-[#0088a9] hover:bg-[#00a8cc] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                        Gerar PDF
                    </button>
                </div>
            </div>
            
            <div className="h-10"></div>
        </div>
    );
};

export default FlightArchiveAnnual;
