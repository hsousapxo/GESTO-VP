
import React, { useEffect, useState } from 'react';
import { 
    Plane, 
    Search, 
    ChevronRight, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Archive, 
    Plus, 
    ChevronLeft,
    Filter,
    MoreHorizontal,
    PlaneLanding,
    PlaneTakeoff,
    Hash,
    File
} from 'lucide-react';
import { getFlights, deleteFlight, saveFlight } from '../services/db';
import { FlightFormData, FlightType } from '../types';

interface FlightListProps {
    onEdit?: (flight: FlightFormData) => void;
    title?: string;
}

const FlightList: React.FC<FlightListProps> = ({ onEdit, title = "VOOS" }) => {
    const [flights, setFlights] = useState<FlightFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = async () => {
        try {
            const data = await getFlights();
            setFlights(data);
        } catch (error) {
            console.error("Error loading flights", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredFlights = flights.filter(f => 
        f.status !== 'Arquivado' && (
            f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.origin && f.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (f.destination && f.destination.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    // Business Logic: Turnaround (Escala) counts as 2 flights (Arrival + Departure)
    const countMovements = (list: FlightFormData[]) => {
        return list.reduce((acc, f) => {
            return acc + (f.flightType === FlightType.TURNAROUND ? 2 : 1);
        }, 0);
    };

    const archivedCount = countMovements(flights.filter(f => f.status === 'Arquivado'));
    const inProgressCount = countMovements(flights.filter(f => f.status === 'Confirmado' || f.status === 'Agendado'));

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Realizado': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Confirmado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Agendado': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">A carregar voos...</div>;

    return (
        <div className="flex flex-col h-full bg-[#0a0e17] text-white">
            {/* Header Breadcrumb */}
            <div className="px-8 pt-4 pb-2 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pasta / PF008 / GS PF008</p>
                <h1 className="text-xl font-black uppercase tracking-tight">{title}</h1>
            </div>

            {/* Search Bar Area */}
            <div className="px-8 py-4">
                <div className="relative max-w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar voos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#161e2e] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* KPI Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 mb-8">
                <div className="bg-[#131b2e] border-2 border-green-500/40 rounded-[24px] p-6 flex flex-col justify-between h-32 relative overflow-hidden group hover:bg-[#1a2333] transition-all cursor-default shadow-lg shadow-green-900/5">
                    <div className="bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center">
                        <Plane className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-black">{inProgressCount}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Movimentos em curso</div>
                    </div>
                    <Plane className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 text-green-500/5 rotate-45" />
                </div>

                <div className="bg-[#131b2e] border border-white/5 rounded-[24px] p-6 flex flex-col justify-between h-32 relative overflow-hidden group hover:bg-[#1a2333] transition-all cursor-default shadow-lg">
                    <div className="bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center">
                        <Archive className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-black">{archivedCount}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Arquivo Movimentos</div>
                    </div>
                    <File className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 text-white/5" />
                </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between px-8 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Próximos Registos</span>
                </div>
                <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase">
                    {filteredFlights.length} Formulários
                </div>
            </div>

            {/* Flight Cards List */}
            <div className="px-8 space-y-3 pb-24 flex-1 overflow-y-auto custom-scrollbar">
                {filteredFlights.length === 0 ? (
                    <div className="py-12 text-center text-gray-600 border border-dashed border-white/5 rounded-3xl">
                        Nenhum voo agendado ou encontrado.
                    </div>
                ) : (
                    filteredFlights.map((flight) => {
                        const timeDisplay = flight.flightType === FlightType.DEPARTURE ? flight.scheduleTimeDeparture : flight.scheduleTimeArrival;
                        const routeDisplay = flight.flightType === FlightType.DEPARTURE 
                            ? `LPPS - ${flight.destination}` 
                            : flight.flightType === FlightType.TURNAROUND
                                ? `${flight.origin} - LPPS - ${flight.destination}`
                                : `${flight.origin} - LPPS`;
                        
                        return (
                            <div 
                                key={flight.id} 
                                onClick={() => onEdit?.(flight)}
                                className="bg-[#131b2e] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:bg-[#1a2333] transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Time Block */}
                                    <div className="text-sm font-bold text-gray-400 border-r border-white/5 pr-6 w-16">
                                        {timeDisplay || '--:--'}
                                    </div>

                                    {/* Main Info */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-base font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                                {flight.flightNumber}
                                            </span>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${getStatusBadge(flight.status)}`}>
                                                {flight.status}
                                            </span>
                                            {flight.flightType === FlightType.TURNAROUND && (
                                                <span className="text-[8px] font-black bg-blue-500/20 text-blue-400 px-1.5 rounded uppercase">2 Movimentos</span>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                                            {flight.operator} • {routeDisplay}
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* Legend for context */}
            <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex gap-6 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Agendado</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Confirmado</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Realizado</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Cancelado</div>
            </div>
        </div>
    );
};

export default FlightList;
