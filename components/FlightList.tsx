
import React, { useEffect, useState } from 'react';
import { Plane, Search, Printer, Pencil, Trash2, MapPin, Calendar, FileText } from 'lucide-react';
import { getFlights, deleteFlight } from '../services/db';
import { FlightFormData, FlightStatus } from '../types';

interface FlightListProps {
    onEdit?: (flight: FlightFormData) => void;
    title?: string;
}

const FlightList: React.FC<FlightListProps> = ({ onEdit, title = "VOOS AGENDADOS" }) => {
    const [flights, setFlights] = useState<FlightFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = async () => {
        try {
            const data = await getFlights();
            setFlights(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const filteredFlights = flights.filter(f => 
        f.status !== 'Arquivado' && (
            f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.operator.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const getStatusStyles = (status: FlightStatus) => {
        switch (status) {
            case 'Agendado': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/30';
            case 'Confirmado': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
            case 'Realizado': return 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/30';
            case 'Cancelado': return 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/30';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-[0.4em] animate-pulse">A carregar registos...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0a0e17] text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-primary dark:text-white">{title}</h1>
            </div>

            <div className="px-8 mb-8">
                <div className="relative group max-w-4xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por n.º voo, operadora..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 rounded-[24px] py-5 pl-16 pr-8 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="px-8 space-y-5 pb-32 flex-1 overflow-y-auto custom-scrollbar">
                {filteredFlights.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6 opacity-30 border-4 border-dashed border-gray-200 dark:border-white/5 rounded-[40px]">
                        <FileText className="w-16 h-16" />
                        <p className="font-black uppercase text-sm tracking-widest">Sem registos ativos</p>
                    </div>
                ) : (
                    filteredFlights.map((flight) => (
                        <div key={flight.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 rounded-[32px] p-6 flex flex-col gap-6 shadow-sm hover:border-primary/30 transition-all group">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-[#1e293b] rounded-[20px] flex items-center justify-center text-primary dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform">
                                    <Plane className="w-8 h-8" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{flight.flightNumber}</h3>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(flight.status)}`}>
                                            {flight.status}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary dark:text-blue-500" /> {flight.origin} ➔ {flight.destination}</div>
                                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary dark:text-blue-500" /> {flight.dateArrival || flight.dateDeparture}</div>
                                        <div className="flex items-center gap-2 text-gray-400"><FileText className="w-4 h-4" /> {flight.operator}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 border-t border-gray-50 dark:border-white/5 pt-5">
                                <button onClick={() => onEdit?.(flight)} className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors"><Pencil className="w-5 h-5" /></button>
                                <button onClick={() => window.print()} className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-blue-500 transition-colors"><Printer className="w-5 h-5" /></button>
                                <button onClick={() => deleteFlight(flight.id!).then(loadData)} className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FlightList;
