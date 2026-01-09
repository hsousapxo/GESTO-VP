import React, { useEffect, useState } from 'react';
import { Plane, Calendar, Users, Trash2, ArrowRight, ArrowLeftRight, CheckCircle, Clock, XCircle, Info, Printer, Eye, Edit, PlaneLanding, PlaneTakeoff, Hash, Archive, Globe, Ban, MapPin, Tag, UserCheck, File } from 'lucide-react';
import { getFlights, deleteFlight, saveFlight } from '../services/db';
import { FlightFormData, FlightType } from '../types';

interface FlightListProps {
    onEdit?: (flight: FlightFormData) => void;
    title?: string;
}

const FlightList: React.FC<FlightListProps> = ({ onEdit, title = "Voos Agendados" }) => {
    const [flights, setFlights] = useState<FlightFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewFlight, setViewFlight] = useState<FlightFormData | null>(null);

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

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja apagar este registo permanentemente?")) {
            await deleteFlight(id);
            if (viewFlight && viewFlight.id === id) setViewFlight(null); // Close modal if open
            loadData();
        }
    };

    const handleArchive = async (flight: FlightFormData) => {
        if (window.confirm(`Deseja arquivar o voo ${flight.flightNumber}?`)) {
            try {
                // Update status to 'Arquivado'
                await saveFlight({ ...flight, status: 'Arquivado' });
                if (viewFlight && viewFlight.id === flight.id) setViewFlight(null); // Close modal
                loadData(); // Refresh list
            } catch (error) {
                console.error("Error archiving flight", error);
                alert("Erro ao arquivar o voo.");
            }
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Realizado': return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
            case 'Confirmado': return <CheckCircle className="w-3.5 h-3.5 text-blue-500" />;
            case 'Cancelado': return <XCircle className="w-3.5 h-3.5 text-red-500" />;
            case 'Arquivado': return <Archive className="w-3.5 h-3.5 text-purple-500" />;
            default: return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Realizado': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'Confirmado': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'Cancelado': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'Arquivado': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
            default: return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        }
    };

    const getRouteDisplay = (flight: FlightFormData) => {
        const isArr = flight.flightType === FlightType.ARRIVAL || flight.flightType === FlightType.TURNAROUND;
        const isDep = flight.flightType === FlightType.DEPARTURE || flight.flightType === FlightType.TURNAROUND;

        return (
            <div className="flex flex-col gap-2 min-w-[200px]">
                {/* Line 1: Arrival (Chegada) */}
                {isArr && (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                             <PlaneLanding className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{flight.origin}</span>
                        <ArrowRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                            LPPS <span className="text-gray-400 dark:text-gray-500 font-mono">({flight.scheduleTimeArrival})</span>
                        </span>
                    </div>
                )}

                {/* Line 2: Departure (Partida) */}
                {isDep && (
                    <div className="flex items-center gap-2 text-sm">
                         <div className="p-1 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                             <PlaneTakeoff className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">
                            LPPS <span className="text-gray-400 dark:text-gray-500 font-mono">({flight.scheduleTimeDeparture})</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                        <span className="font-bold text-gray-900 dark:text-gray-100">{flight.destination}</span>
                    </div>
                )}
            </div>
        );
    };

    const getPaxDisplay = (flight: FlightFormData) => {
        const isArr = flight.flightType === FlightType.ARRIVAL || flight.flightType === FlightType.TURNAROUND;
        const isDep = flight.flightType === FlightType.DEPARTURE || flight.flightType === FlightType.TURNAROUND;

        const renderLegPax = (type: 'Arr' | 'Dep') => {
            const total = type === 'Arr' 
                ? (flight.arrivalUeCount || 0) + (flight.arrivalNonSchengenCount || 0) + (flight.arrivalCrewCount || 0)
                : (flight.departureUeCount || 0) + (flight.departureNonSchengenCount || 0) + (flight.departureCrewCount || 0);
            
            const ue = type === 'Arr' ? flight.arrivalUeCount : flight.departureUeCount;
            const ce = type === 'Arr' ? flight.arrivalNonSchengenCount : flight.departureNonSchengenCount;

            return (
                <div className="flex items-center gap-2 text-xs">
                     <span className={`font-bold w-8 ${type === 'Arr' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {type === 'Arr' ? 'Che:' : 'Par:'}
                     </span>
                     <div className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300 font-bold min-w-[24px] text-center">
                        {total}
                     </div>
                     <div className="flex gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 ml-1">
                        <span className="flex items-center gap-0.5"><Globe className="w-2.5 h-2.5" /> {ue || 0}</span>
                        <span className="flex items-center gap-0.5"><Ban className="w-2.5 h-2.5" /> {ce || 0}</span>
                     </div>
                </div>
            );
        };

        return (
            <div className="flex flex-col gap-1.5">
                {isArr && renderLegPax('Arr')}
                {isDep && renderLegPax('Dep')}
            </div>
        );
    };

    const getPaxSummary = (flight: FlightFormData) => {
        let ue = 0, nonSchengen = 0, crew = 0;
        if (flight.flightType === FlightType.ARRIVAL || flight.flightType === FlightType.TURNAROUND) {
            ue += flight.arrivalUeCount || 0;
            nonSchengen += flight.arrivalNonSchengenCount || 0;
            crew += flight.arrivalCrewCount || 0;
        }
        if (flight.flightType === FlightType.DEPARTURE || flight.flightType === FlightType.TURNAROUND) {
            ue += flight.departureUeCount || 0;
            nonSchengen += flight.departureNonSchengenCount || 0;
            crew += flight.departureCrewCount || 0;
        }
        return { ue, nonSchengen, crew, total: ue + nonSchengen + crew };
    };

    const realizedFlights = flights.filter(f => f.status === 'Realizado');
    
    // Count Movements (Flights): Escala = 2, Others = 1
    const totalFlights = realizedFlights.reduce((acc, f) => {
        return acc + (f.flightType === FlightType.TURNAROUND ? 2 : 1);
    }, 0);
    
    const totalPaxUE = realizedFlights.reduce((acc, f) => {
        const stats = getPaxSummary(f);
        return acc + stats.ue;
    }, 0);

    const totalPaxExtra = realizedFlights.reduce((acc, f) => {
        const stats = getPaxSummary(f);
        return acc + stats.nonSchengen;
    }, 0);

    const totalCrew = realizedFlights.reduce((acc, f) => {
         const stats = getPaxSummary(f);
         return acc + stats.crew;
    }, 0);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Carregando registos...</div>;
    }

    const isArrival = viewFlight?.flightType === FlightType.ARRIVAL;
    const isDeparture = viewFlight?.flightType === FlightType.DEPARTURE;
    const isTurnaround = viewFlight?.flightType === FlightType.TURNAROUND;

    return (
        <div className="p-6 relative">
            {/* VIEW MODAL (Detail View) */}
            {viewFlight && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-700 relative">
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setViewFlight(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors z-20"
                            title="Fechar Janela"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                        
                        <div className="flex gap-5">
                            {/* Blue Icon */}
                            <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <File className="w-7 h-7 text-blue-500" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                                {/* Header: Number + Status */}
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl font-bold text-white leading-tight truncate">
                                        {viewFlight.flightNumber}
                                    </h2>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        viewFlight.status === 'Confirmado' ? 'bg-blue-500/20 text-blue-400' :
                                        viewFlight.status === 'Realizado' ? 'bg-green-500/20 text-green-400' :
                                        viewFlight.status === 'Cancelado' ? 'bg-red-500/20 text-red-400' :
                                        viewFlight.status === 'Arquivado' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {viewFlight.status}
                                    </span>
                                </div>

                                {/* Timings */}
                                <div className="text-gray-300 text-sm space-y-1">
                                    {(isArrival || isTurnaround) && (
                                        <div className="flex items-center gap-2">
                                            <PlaneLanding className="w-3.5 h-3.5 text-blue-400" /> 
                                            <span className="truncate"><span className="font-bold text-gray-400">Che:</span> {viewFlight.scheduleTimeArrival || '--:--'} <span className="text-xs text-gray-500">({viewFlight.dateArrival ? new Date(viewFlight.dateArrival).toLocaleDateString('pt-PT') : '--/--'})</span></span>
                                        </div>
                                    )}
                                    {(isDeparture || isTurnaround) && (
                                        <div className="flex items-center gap-2">
                                            <PlaneTakeoff className="w-3.5 h-3.5 text-orange-400" /> 
                                            <span className="truncate"><span className="font-bold text-gray-400">Par:</span> {viewFlight.scheduleTimeDeparture || '--:--'} <span className="text-xs text-gray-500">({viewFlight.dateDeparture ? new Date(viewFlight.dateDeparture).toLocaleDateString('pt-PT') : '--/--'})</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Route */}
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                    <span>
                                        {isTurnaround ? (
                                            <span className="flex items-center gap-1">
                                                {viewFlight.origin} <ArrowRight className="w-3 h-3" /> LPPS <ArrowRight className="w-3 h-3" /> {viewFlight.destination}
                                            </span>
                                        ) : isArrival ? (
                                            `${viewFlight.origin} → LPPS`
                                        ) : (
                                            `LPPS → ${viewFlight.destination}`
                                        )}
                                    </span>
                                </div>

                                {/* Internal Numbers & Gesdoc */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {viewFlight.gesdocNumber && (
                                        <div className="bg-white/10 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/10 flex items-center gap-1" title="Número Gesdoc">
                                            <Hash className="w-3 h-3 text-white" />
                                            <span className="font-bold text-white">GESDOC:</span> {viewFlight.gesdocNumber}/{viewFlight.gesdocYear}
                                        </div>
                                    )}

                                    {(isArrival || isTurnaround) && viewFlight.regVPArrival && (
                                        <div className="bg-blue-900/40 px-2 py-1 rounded text-[10px] text-blue-200 border border-blue-800/50 flex items-center gap-1" title="Registo VP Chegada">
                                            <Tag className="w-3 h-3" />
                                            <span className="font-bold">VP Che:</span> {viewFlight.regVPArrival}
                                        </div>
                                    )}

                                    {(isDeparture || isTurnaround) && viewFlight.regVPDeparture && (
                                        <div className="bg-orange-900/40 px-2 py-1 rounded text-[10px] text-orange-200 border border-orange-800/50 flex items-center gap-1" title="Registo VP Partida">
                                            <Tag className="w-3 h-3" />
                                            <span className="font-bold">VP Par:</span> {viewFlight.regVPDeparture}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Pax/Crew */}
                                <div className="flex items-center gap-4 text-sm text-gray-400 pt-1">
                                    <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>Pax: <span className="text-white font-bold">{getPaxSummary(viewFlight).total}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded">
                                        <span className="font-bold text-[10px] border border-gray-600 px-1 rounded-sm">CRW</span>
                                        <span>Trip: <span className="text-white font-bold">{getPaxSummary(viewFlight).crew}</span></span>
                                    </div>
                                </div>

                                {/* Observations */}
                                {viewFlight.observations && (
                                    <div className="mt-2 bg-gray-800/30 p-2 rounded border-l-2 border-yellow-500/50">
                                        <p className="text-xs text-gray-400 line-clamp-2 italic">"{viewFlight.observations}"</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mt-3 pt-3 border-t border-gray-700/50">
                                    <div className="text-xs">
                                        <span className="text-gray-400 font-bold block mb-0.5">Comp. Aérea / Operadora:</span>
                                        <span className="text-gray-300 font-medium">{viewFlight.operator || '---'}</span>
                                    </div>
                                    <div className="text-xs text-right">
                                        <span className="text-gray-400 font-bold block mb-0.5">Agente:</span>
                                        <div className="text-gray-300 font-medium flex flex-col items-end">
                                            <span className="flex items-center gap-1">
                                                {viewFlight.createdBy || '---'}
                                                <UserCheck className="w-3 h-3 text-blue-400" />
                                            </span>
                                            {viewFlight.createdByCategory && (
                                                <span className="text-[9px] text-gray-500">{viewFlight.createdByCategory}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Icons Grid */}
                        <div className="grid grid-cols-4 gap-4 mt-8 border-t border-gray-700/30 pt-4">
                            <button 
                                onClick={() => window.print()} 
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-white/5 group"
                                title="Imprimir Ficha"
                            >
                                <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px]">Imprimir</span>
                            </button>
                            <button 
                                onClick={() => { setViewFlight(null); if(onEdit) onEdit(viewFlight); }} 
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors p-2 rounded hover:bg-white/5 group"
                                title="Editar Registo"
                            >
                                <Edit className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px]">Editar</span>
                            </button>
                            <button 
                                onClick={() => handleArchive(viewFlight)} 
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors p-2 rounded hover:bg-white/5 group"
                                title="Arquivar"
                            >
                                <Archive className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px]">Arquivar</span>
                            </button>
                            <button 
                                onClick={() => handleDelete(viewFlight.id!)}
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-400 transition-colors p-2 rounded hover:bg-white/5 group"
                                title="Apagar Registo"
                            >
                                <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px]">Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-primary dark:text-blue-400">{title}</h2>
                    
                    {/* Stats Summary */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[100px]">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Realizados</span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">{totalFlights}</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Pax UE</span>
                            <span className="text-lg font-bold text-primary dark:text-blue-400">{totalPaxUE}</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Pax CE</span>
                            <span className="text-lg font-bold text-orange-500 dark:text-orange-400">{totalPaxExtra}</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[80px]">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Trip</span>
                            <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{totalCrew}</span>
                        </div>
                    </div>
                </div>

                {flights.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700 transition-colors">
                        <Plane className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sem registos</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Utilize o formulário "Novo Voo" para adicionar registos.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">VOO / STATUS</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">NATUREZA / ROTA</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">REGISTOS VP</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PASSAGEIROS</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {flights.map((flight) => {
                                        // Determine relevant date to show
                                        const dateTime = flight.flightType === FlightType.DEPARTURE ? 
                                            flight.dateDeparture : flight.dateArrival;
                                        
                                        const dateObj = new Date(dateTime || flight.createdAt || Date.now());

                                        return (
                                        <tr key={flight.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            {/* Col 1: VOO / STATUS */}
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Plane className="w-4 h-4 text-gray-400" />
                                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{flight.flightNumber}</span>
                                                    </div>
                                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-fit border ${getStatusClass(flight.status)}`}>
                                                        {getStatusIcon(flight.status)}
                                                        {flight.status}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{dateObj.toLocaleDateString('pt-PT')}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Col 2: NATUREZA / ROTA */}
                                            <td className="px-4 py-3 align-top">
                                                <div className="mb-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                        {flight.flightNature || 'N/A'}
                                                    </span>
                                                </div>
                                                {getRouteDisplay(flight)}
                                            </td>

                                            {/* Col 3: REGISTOS VP */}
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex flex-col gap-2">
                                                    {/* Gesdoc */}
                                                    <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded border border-yellow-100 dark:border-yellow-800/30 w-fit">
                                                        <Hash className="w-3 h-3 text-yellow-600 dark:text-yellow-500" />
                                                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                                            {flight.gesdocNumber ? `${flight.gesdocNumber}/${flight.gesdocYear}` : '---'}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Internal Registries */}
                                                    <div className="flex flex-col gap-1">
                                                        {flight.regVPArrival && (
                                                            <div className="text-[10px] text-blue-700 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 w-fit">
                                                                VP Che: <b>{flight.regVPArrival}</b>
                                                            </div>
                                                        )}
                                                        {flight.regVPDeparture && (
                                                             <div className="text-[10px] text-orange-700 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800 w-fit">
                                                                VP Par: <b>{flight.regVPDeparture}</b>
                                                            </div>
                                                        )}
                                                        {!flight.regVPArrival && !flight.regVPDeparture && (
                                                            <span className="text-[10px] text-gray-400 italic">Sem registo interno</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Col 4: PASSAGEIROS */}
                                            <td className="px-4 py-3 align-top">
                                                {getPaxDisplay(flight)}
                                            </td>

                                            {/* Col 5: AÇÕES */}
                                            <td className="px-4 py-3 align-middle text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); window.print(); }}
                                                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded-lg transition-all"
                                                        title="Imprimir"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setViewFlight(flight); }}
                                                        className="text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 p-1.5 rounded-lg transition-all"
                                                        title="Ver Detalhes"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); if(onEdit) onEdit(flight); }}
                                                        className="text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 p-1.5 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                     <button 
                                                        onClick={(e) => { e.stopPropagation(); handleArchive(flight); }}
                                                        className="text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-1.5 rounded-lg transition-all"
                                                        title="Arquivar"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); if(flight.id) handleDelete(flight.id); }}
                                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-all"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightList;