
import React, { useEffect, useState } from 'react';
import { 
    Plane, 
    Search, 
    CalendarDays, 
    X, 
    Info, 
    Clock, 
    User, 
    PenTool, 
    Printer, 
    Eye, 
    Pencil, 
    Archive, 
    FileSpreadsheet, 
    FileText, 
    Trash2,
    MapPin,
    FileType,
    PlusCircle,
    Calendar,
    Users,
    RefreshCw,
    Check
} from 'lucide-react';
import { getFlights, deleteFlight } from '../services/db';
import { FlightFormData, FlightStatus, FlightType } from '../types';
import FlightDocument from './FlightDocument';

interface FlightListProps {
    onEdit?: (flight: FlightFormData) => void;
    title?: string;
    onNewFlight?: () => void;
}

const getStatusColorClass = (status?: FlightStatus) => {
    switch (status) {
        case 'Agendado': return 'bg-yellow-900/40 text-yellow-500';
        case 'Confirmado': return 'bg-blue-900/40 text-blue-400';
        case 'Realizado': return 'bg-green-900/40 text-green-500';
        case 'Cancelado': return 'bg-red-900/40 text-red-500';
        default: return 'bg-gray-700/40 text-gray-400';
    }
};

const getStatusLabel = (status?: FlightStatus) => {
    return status?.toUpperCase() || 'DESCONHECIDO';
};

const FlightCard: React.FC<{
    flight: FlightFormData;
    type: 'arrival' | 'departure';
    onEdit?: (flight: FlightFormData) => void;
    onDelete: (id: string) => void;
    onSelect: (flight: FlightFormData) => void;
    isSelected: boolean;
}> = ({ flight, type, onEdit, onDelete, onSelect, isSelected }) => {
    const isArrival = type === 'arrival';
    const themeColor = isArrival ? 'text-emerald-500' : 'text-red-500';
    const bgTheme = isArrival ? 'bg-emerald-500/10' : 'bg-red-500/10';
    const iconRotation = isArrival ? 'rotate-[135deg]' : 'rotate-45';

    const routeFrom = isArrival ? flight.origin : 'PXO';
    const routeTo = isArrival ? 'PXO' : flight.destination;
    const date = isArrival ? flight.dateArrival : flight.dateDeparture;
    const time = isArrival ? flight.scheduleTimeArrival : flight.scheduleTimeDeparture;
    const regVP = isArrival ? flight.regVPArrival : flight.regVPDeparture;
    const movementStatus = isArrival ? flight.arrivalStatus : flight.departureStatus;

    // Passenger Counts
    const paxUE = isArrival ? (flight.arrivalUeCount || 0) : (flight.departureUeCount || 0);
    const paxCE = isArrival ? (flight.arrivalNonSchengenCount || 0) : (flight.departureNonSchengenCount || 0);
    const paxCrew = isArrival ? (flight.arrivalCrewCount || 0) : (flight.departureCrewCount || 0);
    const totalPax = paxUE + paxCE + paxCrew;

    return (
        <div 
            className={`group relative bg-[#1e1e1e] border ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-500/5' : 'border-white/5 hover:border-[#444]'} p-8 rounded-[32px] shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden`}
            onClick={() => onSelect(flight)}
            onDoubleClick={() => onEdit?.(flight)}
        >
            {isSelected && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full shadow-lg z-20">
                    <Check className="w-4 h-4" />
                </div>
            )}

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 ${bgTheme} rounded-3xl flex items-center justify-center ${themeColor} shrink-0`}>
                        <Plane className={`w-12 h-12 stroke-[1.5] ${iconRotation}`} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-white leading-tight tracking-tight">
                            {flight.flightNumber}
                        </h3>
                        <div className={`${getStatusColorClass(flight.status)} text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-2 uppercase`}>
                            {getStatusLabel(flight.status)}
                        </div>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Status Movimento</span>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${bgTheme} ${themeColor} font-bold text-sm uppercase`}>
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isArrival ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isArrival ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        </span>
                        {movementStatus || '---'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 mt-10 text-base font-medium text-gray-400">
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-300 truncate font-mono">
                        {routeFrom} <span className="mx-1 text-gray-600">→</span> {routeTo}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <FileType className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-300 font-mono">{regVP || '---'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-300 font-mono">{date || '---'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-white font-bold font-mono">{time || '--:--'}</span>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase mb-1">UE</span>
                        <span className="text-lg font-bold text-white">{paxUE}</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase mb-1">CE</span>
                        <span className="text-lg font-bold text-white">{paxCE}</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase mb-1">TRIP</span>
                        <span className="text-lg font-bold text-white">{paxCrew}</span>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between px-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total POB</span>
                    <span className={`text-xl font-bold ${themeColor}`}>{totalPax}</span>
                </div>
            </div>
        </div>
    );
};

const FlightList: React.FC<FlightListProps> = ({ onEdit, title = "VOOS AGENDADOS", onNewFlight }) => {
    const [flights, setFlights] = useState<FlightFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const data = await getFlights();
            setFlights(data);
            if (data.length > 0 && !selectedFlightId) {
                setSelectedFlightId(data[0].id || null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDelete = (id: string) => {
        if(window.confirm('Eliminar voo permanentemente?')) {
            deleteFlight(id).then(() => {
                loadData();
                if (selectedFlightId === id) setSelectedFlightId(null);
            });
        }
    };

    const handlePrint = () => {
        if (selectedFlightId) {
            // Timeout to allow DOM updates/animations to finish before browser print dialog freezes execution
            setTimeout(() => {
                window.print();
            }, 100);
        } else {
            alert("Selecione um voo para imprimir.");
        }
    };

    // Filter Logic
    const filteredFlights = flights.filter(f => 
        f.status !== 'Arquivado' && (
            f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.destination.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const arrivals = filteredFlights.filter(f => f.flightType === FlightType.ARRIVAL || f.flightType === FlightType.TURNAROUND);
    const departures = filteredFlights.filter(f => f.flightType === FlightType.DEPARTURE || f.flightType === FlightType.TURNAROUND);

    if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center"><div className="text-gray-500 font-black animate-pulse tracking-widest">A CARREGAR...</div></div>;

    const selectedFlight = flights.find(f => f.id === selectedFlightId);

    return (
        <div className="flex flex-col min-h-full bg-[#121212] text-slate-100 font-sans">
            {/* Hidden Document for Printing Selected Flight */}
            {/* The 'hidden' class hides it on screen. 'print:block' shows it on print. 
                CSS in index.html ensures main content is hidden during print. */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999]">
                {selectedFlight && <FlightDocument flight={selectedFlight} />}
            </div>

            <div className="flex-grow max-w-7xl mx-auto p-6 md:p-10 w-full print:hidden">
                {/* Header */}
                <header className="mb-12 flex flex-col gap-8">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                        <h1 className="text-4xl font-bold text-white uppercase tracking-tight font-sans">
                            {title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative w-full sm:w-64 lg:w-80">
                                <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                                    <Search className="w-5 h-5" />
                                </span>
                                <input 
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500" 
                                    placeholder="Procurar voo..." 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 w-full sm:w-auto">
                                <CalendarDays className="text-blue-500 w-5 h-5" />
                                <div className="flex items-center gap-2">
                                    <input 
                                        className="bg-transparent border-none text-gray-200 text-sm focus:ring-0 p-0 w-32 cursor-pointer outline-none font-mono" 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                    <span className="text-gray-600">|</span>
                                    <div className="text-xs font-medium text-gray-400 whitespace-nowrap">Período</div>
                                </div>
                            </div>
                            <button 
                                onClick={loadData}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all text-sm font-semibold whitespace-nowrap group"
                            >
                                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                Atualizar
                            </button>
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedDate(new Date().toISOString().split('T')[0]); }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all text-sm font-medium whitespace-nowrap group"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Limpar
                            </button>
                        </div>
                    </div>
                    {selectedFlight && (
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-mono">Último Registo: {selectedFlight.createdAt ? new Date(selectedFlight.createdAt).toLocaleString() : '---'}</span>
                        </div>
                    )}
                </header>

                {/* Main Content */}
                <main className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12">
                    
                    {/* Arrivals Column */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-emerald-500 flex items-center gap-2">
                                    <Plane className="w-6 h-6 rotate-[135deg]" />
                                    CHEGADAS
                                </h2>
                                <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-sm font-bold border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                                    Total: {arrivals.length}
                                </span>
                            </div>
                            <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                {arrivals.filter(f => f.status === 'Agendado' || f.status === 'Confirmado').length} Ativos
                            </span>
                        </div>
                        <div className="space-y-5">
                            {arrivals.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-gray-800 rounded-[32px] text-center text-gray-600 flex flex-col items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest">Sem Chegadas</span>
                                </div>
                            ) : (
                                arrivals.map(flight => (
                                    <FlightCard 
                                        key={flight.id} 
                                        flight={flight} 
                                        type="arrival" 
                                        onEdit={onEdit} 
                                        onDelete={handleDelete}
                                        onSelect={(f) => setSelectedFlightId(prev => prev === f.id ? null : f.id!)}
                                        isSelected={selectedFlightId === flight.id}
                                    />
                                ))
                            )}
                        </div>
                    </section>

                    {/* Departures Column */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
                                    <Plane className="w-6 h-6 rotate-45" />
                                    PARTIDAS
                                </h2>
                                <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-bold border border-red-500/30 shadow-lg shadow-red-500/5">
                                    Total: {departures.length}
                                </span>
                            </div>
                            <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                {departures.filter(f => f.status === 'Agendado' || f.status === 'Confirmado').length} Ativos
                            </span>
                        </div>
                        <div className="space-y-5">
                            {departures.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-gray-800 rounded-[32px] text-center text-gray-600 flex flex-col items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest">Sem Partidas</span>
                                </div>
                            ) : (
                                departures.map(flight => (
                                    <FlightCard 
                                        key={flight.id} 
                                        flight={flight} 
                                        type="departure" 
                                        onEdit={onEdit} 
                                        onDelete={handleDelete}
                                        onSelect={(f) => setSelectedFlightId(prev => prev === f.id ? null : f.id!)}
                                        isSelected={selectedFlightId === flight.id}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                </main>
            </div>

            {/* Sticky Footer */}
            <footer className="sticky bottom-0 w-full bg-[#1e1e1e]/95 backdrop-blur-md border-t border-white/5 py-4 px-6 md:px-10 flex flex-col xl:flex-row items-center justify-between z-30 gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] print:hidden">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center xl:justify-start">
                    <div className="flex items-center gap-2 text-gray-400 border-r border-white/10 pr-6 last:border-0">
                        <Info className="w-5 h-5" />
                        <span className="text-sm font-medium">GESDOC: <span className="text-white font-bold ml-1">{selectedFlight ? selectedFlight.gesdocNumber || 'PENDENTE' : `#${new Date().getFullYear()}-${flights.length}`}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 border-r border-white/10 pr-6 last:border-0">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm font-medium">Data: <span className="text-white font-bold ml-1">{selectedFlight ? new Date(selectedFlight.createdAt || Date.now()).toLocaleDateString() : new Date().toLocaleDateString()}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 border-r border-white/10 pr-6 last:border-0 hidden md:flex">
                        <User className="w-5 h-5" />
                        <span className="text-sm font-medium">Resp: <span className="text-white font-bold ml-1">{selectedFlight?.createdBy || '---'}</span></span>
                    </div>
                     <div className="flex items-center gap-2 text-gray-400 hidden lg:flex">
                        <PenTool className="w-5 h-5" />
                        <span className="text-sm font-medium">Ultima Edição: <span className="text-white font-bold ml-1">{selectedFlight?.createdAt ? new Date(selectedFlight.createdAt).toLocaleTimeString() : '--:--'}</span></span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 w-full xl:w-auto justify-center xl:justify-end custom-scrollbar">
                    <button 
                        onClick={handlePrint}
                        disabled={!selectedFlightId}
                        className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-lg transition-all ${selectedFlightId ? 'bg-white/10 text-blue-400 hover:text-white hover:bg-blue-600' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                        title="Imprimir Auto"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                    <button 
                        disabled={!selectedFlightId}
                        onClick={() => selectedFlight && onEdit?.(selectedFlight)}
                        className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-lg transition-all ${selectedFlightId ? 'bg-white/10 text-blue-400 hover:text-white hover:bg-blue-600' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                        title="Editar"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                        disabled={!selectedFlightId}
                        onClick={handlePrint}
                        className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-lg transition-all ${selectedFlightId ? 'bg-white/10 text-red-400 hover:text-white hover:bg-red-600' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                        title="Exportar PDF"
                    >
                        <FileText className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1 flex-shrink-0"></div>
                    <button 
                        disabled={!selectedFlightId}
                        onClick={() => selectedFlightId && handleDelete(selectedFlightId)}
                        className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-lg transition-all ${selectedFlightId ? 'bg-white/10 text-red-500 hover:text-white hover:bg-red-600' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                        title="Eliminar Seleção"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default FlightList;
