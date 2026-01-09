
import React, { useEffect, useState } from 'react';
import { 
    Plane, 
    Search, 
    Archive, 
    Printer,
    Pencil,
    Trash2,
    MapPin,
    Calendar,
    X,
    FileText,
    Hash,
    Clock,
    Tag
} from 'lucide-react';
import { getFlights, deleteFlight, saveFlight } from '../services/db';
import { FlightFormData, FlightType, FlightStatus } from '../types';

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
            (f.destination && f.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (f.gesdocNumber && f.gesdocNumber.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    const handleArchive = async (e: React.MouseEvent, flight: FlightFormData) => {
        e.stopPropagation();
        if (window.confirm(`Deseja arquivar o voo ${flight.flightNumber}?`)) {
            await saveFlight({ ...flight, status: 'Arquivado' });
            loadData();
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Tem a certeza que deseja eliminar este registo permanentemente?')) {
            await deleteFlight(id);
            loadData();
        }
    };

    const handlePrint = (e: React.MouseEvent, flight: FlightFormData) => {
        e.stopPropagation();
        // Para imprimir, abrimos o modo de edição temporariamente e disparamos o print
        onEdit?.(flight);
        setTimeout(() => {
            window.print();
        }, 300);
    };

    const getStatusStyles = (status: FlightStatus) => {
        switch (status) {
            case 'Agendado': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Confirmado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Realizado': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">A carregar registos...</div>;

    return (
        <div className="flex flex-col h-full bg-[#0a0e17] text-white font-sans">
            {/* Header / Breadcrumb */}
            <div className="px-8 pt-8 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">
                    <span>Pasta</span>
                    <span className="opacity-30">/</span>
                    <span>PF008</span>
                    <span className="opacity-30">/</span>
                    <span className="text-blue-500">GS PF008</span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight">{title}</h1>
            </div>

            {/* Barra de Pesquisa */}
            <div className="px-8 mb-8">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por n.º voo, GESDOC ou rota..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111827] border border-white/5 rounded-[24px] py-4 pl-14 pr-6 text-sm outline-none focus:border-blue-500/30 transition-all shadow-2xl placeholder:text-gray-700"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Listagem de Cards (Estilo Imagem) */}
            <div className="px-8 space-y-5 pb-32 flex-1 overflow-y-auto custom-scrollbar">
                {filteredFlights.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center gap-4 opacity-20">
                        <FileText className="w-16 h-16" />
                        <p className="font-black uppercase tracking-widest text-sm">Sem voos agendados</p>
                    </div>
                ) : (
                    filteredFlights.map((flight) => {
                        const routeDisplay = flight.flightType === FlightType.DEPARTURE 
                            ? `LPPS - ${flight.destination || '???'}` 
                            : `${flight.origin || '???'} - LPPS`;
                        
                        const dateDisplay = flight.flightType === FlightType.DEPARTURE 
                            ? `${flight.dateDeparture} ${flight.scheduleTimeDeparture}` 
                            : `${flight.dateArrival} ${flight.scheduleTimeArrival}`;

                        return (
                            <div 
                                key={flight.id} 
                                className="bg-[#111827] border border-white/5 rounded-[32px] p-6 flex flex-col gap-6 shadow-2xl hover:bg-[#151c2c] transition-all group"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Icon Box Blue */}
                                    <div className="w-16 h-16 bg-[#1e293b] rounded-[20px] flex items-center justify-center text-blue-400 shadow-lg border border-blue-500/10 shrink-0">
                                        <Plane className="w-8 h-8 fill-current opacity-20" />
                                        <Plane className="w-8 h-8 absolute" />
                                    </div>

                                    {/* Flight Info Section */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
                                                {flight.flightNumber || 'SEM NÚMERO'}
                                            </h3>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(flight.status)}`}>
                                                {flight.status}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                {routeDisplay}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                {dateDisplay}
                                            </div>
                                            {flight.gesdocNumber && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                    <Hash className="w-3 h-3 text-blue-400" />
                                                    GESDOC: {flight.gesdocNumber}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-1">
                                            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]">
                                                RESP: <span className="text-gray-400">{flight.createdBy?.toUpperCase() || 'SISTEMA'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Bar - Mapped to Image Icons */}
                                <div className="flex justify-end items-center gap-4 pt-2">
                                    <button 
                                        onClick={(e) => handlePrint(e, flight)}
                                        className="p-3 text-gray-500 hover:text-white transition-colors"
                                        title="Imprimir Registo"
                                    >
                                        <Printer className="w-6 h-6 stroke-[1.5]" />
                                    </button>
                                    <button 
                                        onClick={() => onEdit?.(flight)}
                                        className="p-3 text-gray-500 hover:text-blue-400 transition-colors"
                                        title="Editar Registo"
                                    >
                                        <Pencil className="w-6 h-6 stroke-[1.5]" />
                                    </button>
                                    <button 
                                        onClick={(e) => handleArchive(e, flight)}
                                        className="p-3 text-gray-500 hover:text-yellow-500 transition-colors"
                                        title="Arquivar Voo"
                                    >
                                        <Archive className="w-6 h-6 stroke-[1.5]" />
                                    </button>
                                    <button 
                                        onClick={(e) => flight.id && handleDelete(e, flight.id)}
                                        className="p-3 text-gray-500 hover:text-red-500 transition-colors"
                                        title="Eliminar Registo"
                                    >
                                        <Trash2 className="w-6 h-6 stroke-[1.5]" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Rodapé Resumo */}
            <div className="fixed bottom-0 left-0 lg:left-[260px] right-0 bg-[#0a0e17]/90 backdrop-blur-xl border-t border-white/5 p-4 flex justify-between items-center px-12 z-40">
                <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Ativos: {filteredFlights.length}</span>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-gray-700 tracking-widest">
                    {new Date().toLocaleDateString('pt-PT')} • GESTO VP v1.2
                </div>
            </div>
        </div>
    );
};

export default FlightList;
