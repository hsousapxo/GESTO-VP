import React, { useEffect, useState } from 'react';
import { Plane, Calendar, Users, Trash2, ArrowRight, ArrowLeftRight, CheckCircle, Clock, XCircle, Info, Printer, Eye, Edit } from 'lucide-react';
import { getFlights, deleteFlight } from '../services/db';
import { FlightFormData, FlightType } from '../types';

interface FlightListProps {
    onEdit?: (flight: FlightFormData) => void;
}

const FlightList: React.FC<FlightListProps> = ({ onEdit }) => {
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
        if (window.confirm("Tem certeza que deseja apagar este registo?")) {
            await deleteFlight(id);
            loadData();
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Realizado': return <CheckCircle className="w-4 h-4 text-blue-500" />; // Changed to Blue for Realizado
            case 'Confirmado': return <CheckCircle className="w-4 h-4 text-green-500" />; // Added Green for Confirmado
            case 'Cancelado': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-yellow-500" />; // Agendado
        }
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Realizado': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'Confirmado': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'Cancelado': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default: return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        }
    };

    const getRouteDisplay = (flight: FlightFormData) => {
        if (flight.flightType === FlightType.TURNAROUND) {
            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs">
                        <span className="font-bold text-blue-600">CHE:</span> {flight.origin} ({flight.scheduleTimeArrival})
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="font-bold text-orange-600">PAR:</span> {flight.destination} ({flight.scheduleTimeDeparture})
                    </div>
                </div>
            );
        } else if (flight.flightType === FlightType.ARRIVAL) {
             return (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>{flight.origin}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span>LPPS ({flight.scheduleTimeArrival})</span>
                </div>
            );
        } else {
             return (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>LPPS ({flight.scheduleTimeDeparture})</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span>{flight.destination}</span>
                </div>
            );
        }
    };

    const getPaxSummary = (flight: FlightFormData) => {
        let ue = 0, nonSchengen = 0, crew = 0;
        
        // Sum based on available legs
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

    // Statistics Calculation (Only 'Realizado' counts)
    const realizedFlights = flights.filter(f => f.status === 'Realizado');
    const totalFlights = realizedFlights.length;
    
    // Calculate totals summing both legs where applicable
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

    return (
        <div className="p-6 relative">
            {/* VIEW MODAL */}
            {viewFlight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="bg-primary dark:bg-blue-900 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg">Detalhes do Voo {viewFlight.flightNumber}</h3>
                            <button onClick={() => setViewFlight(null)} className="hover:bg-white/20 p-1 rounded transition-colors"><XCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Natureza</span>
                                    <span className="block text-gray-800 dark:text-gray-200 font-bold">{viewFlight.flightNature}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Status</span>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getStatusClass(viewFlight.status)}`}>
                                        {viewFlight.status}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Rota</span>
                                    {getRouteDisplay(viewFlight)}
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Aeronave</span>
                                    <span className="block text-gray-800 dark:text-gray-200">{viewFlight.aircraftType}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Total POB</span>
                                    <span className="block text-gray-800 dark:text-gray-200 font-bold text-lg">{getPaxSummary(viewFlight).total}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button onClick={() => setViewFlight(null)} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium text-sm">Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-primary dark:text-blue-400">Aplicações de Fronteira</h2>
                    
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

                {/* Info Note */}
                <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/10 p-2 rounded border border-blue-100 dark:border-blue-900/30">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span>Apenas voos com estado <b>"Realizado"</b> contabilizam para as estatísticas de passageiros.</span>
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
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Voo / Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Natureza / Rota</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registos VP</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Passageiros</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {flights.map((flight) => {
                                        const stats = getPaxSummary(flight);
                                        return (
                                        <tr key={flight.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-primary dark:text-blue-400">
                                                        {flight.flightType === FlightType.TURNAROUND ? <ArrowLeftRight className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                                            {flight.flightNumber}
                                                        </div>
                                                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1 border ${getStatusClass(flight.status)}`}>
                                                            {getStatusIcon(flight.status)}
                                                            {flight.status}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(flight.createdAt || '').toLocaleDateString('pt-PT')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                                        {flight.flightNature || 'N/A'}
                                                    </span>
                                                </div>
                                                {getRouteDisplay(flight)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                    {flight.regVPArrival && (
                                                        <span className="bg-blue-50 dark:bg-blue-900/20 px-1 rounded text-blue-700 dark:text-blue-300">
                                                            VP Che: {flight.regVPArrival}
                                                        </span>
                                                    )}
                                                    {flight.regVPDeparture && (
                                                        <span className="bg-orange-50 dark:bg-orange-900/20 px-1 rounded text-orange-700 dark:text-orange-300">
                                                            VP Par: {flight.regVPDeparture}
                                                        </span>
                                                    )}
                                                    {!flight.regVPArrival && !flight.regVPDeparture && (
                                                        <span className="text-gray-400 italic">Sem registo</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full mb-1">
                                                    <Users className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                                    <span className="text-sm font-bold text-primary dark:text-blue-400">
                                                        {stats.total}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400 flex justify-center gap-2">
                                                    <span>UE: <b>{stats.ue}</b></span>
                                                    <span>CE: <b>{stats.nonSchengen}</b></span>
                                                </div>
                                                {flight.status !== 'Realizado' && (
                                                    <span className="text-[9px] text-gray-400 italic block mt-1">(Não contabilizado)</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button 
                                                        onClick={() => window.print()}
                                                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-all"
                                                        title="Imprimir"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setViewFlight(flight)}
                                                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-all"
                                                        title="Ver Detalhes"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => onEdit && onEdit(flight)}
                                                        className="text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 p-2 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => flight.id && handleDelete(flight.id)}
                                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
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