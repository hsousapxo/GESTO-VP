import React, { useState, useEffect } from 'react';
import { 
    Calendar as CalendarIcon, 
    Plus, 
    Bell, 
    AlertTriangle, 
    Plane, 
    Clock, 
    MapPin, 
    Sun, 
    CloudSun, 
    CloudRain, 
    Wind, 
    Droplets, 
    Thermometer,
    ChevronLeft,
    ChevronRight,
    Eye,
    Archive,
    Trash2,
    MoreHorizontal,
    Users,
    RotateCcw
} from 'lucide-react';
import { ViewState, FlightFormData, FlightType } from '../types';
import { getFlights } from '../services/db';

interface DashboardProps {
    onChangeView?: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
    const [flights, setFlights] = useState<FlightFormData[]>([]);
    
    useEffect(() => {
        // Mock loading or real loading
        getFlights().then(setFlights).catch(console.error);
    }, []);

    return (
        <div className="p-6 pt-2 h-full flex flex-col relative overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                
                {/* Left Column (Span 2) - Calendar & Events */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <WeekCalendarWidget />
                    <NextEventsWidget flights={flights} />
                </div>

                {/* Right Column (Span 1) - Weather/Clock Card */}
                <div className="lg:col-span-1 h-full">
                    <WeatherClockWidget onClick={() => onChangeView?.('weather')} />
                </div>
            </div>

            {/* Footer: Monthly Summary (Cloned Design) */}
            <MonthlySummaryFooter flights={flights} />

            {/* O botão flutuante (+) foi removido daqui */}
        </div>
    );
};

// --- Widget: Monthly Summary (Cloned Footer) ---

const MonthlySummaryFooter: React.FC<{ flights: FlightFormData[] }> = ({ flights }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthName = today.toLocaleDateString('pt-PT', { month: 'long' });

    // Filter realized flights for the current month
    const monthlyFlights = flights.filter(f => {
        if (f.status !== 'Realizado') return false;
        const fDateStr = f.dateArrival || f.dateDeparture;
        if (!fDateStr) return false;
        const fDate = new Date(fDateStr);
        return fDate.getMonth() === currentMonth && fDate.getFullYear() === currentYear;
    });

    let totalFlights = 0;
    let totalPaxUE = 0;
    let totalPaxExtra = 0;
    let totalCrew = 0;

    monthlyFlights.forEach(f => {
        // Calculate Movements (Flights)
        // Escala counts as 2 flights (Arrival + Departure), others count as 1
        if (f.flightType === FlightType.TURNAROUND) {
            totalFlights += 2;
        } else {
            totalFlights += 1;
        }

        // Arrival Logic
        if (f.flightType === FlightType.ARRIVAL || f.flightType === FlightType.TURNAROUND) {
            totalPaxUE += f.arrivalUeCount || 0;
            totalPaxExtra += f.arrivalNonSchengenCount || 0;
            totalCrew += f.arrivalCrewCount || 0;
        }
        // Departure Logic
        if (f.flightType === FlightType.DEPARTURE || f.flightType === FlightType.TURNAROUND) {
            totalPaxUE += f.departureUeCount || 0;
            totalPaxExtra += f.departureNonSchengenCount || 0;
            totalCrew += f.departureCrewCount || 0;
        }
    });

    return (
        <div className="bg-[#131b2e] rounded-[32px] p-8 border border-white/5 mb-20">
            <div className="flex items-center gap-6 mb-8 justify-center md:justify-start">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <CalendarIcon className="w-8 h-8 text-white stroke-[2.5]" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">RESUMO MENSAL</h3>
                    <h2 className="text-3xl font-bold text-white capitalize leading-none">{monthName} {currentYear}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Voos Realizados */}
                <div className="bg-[#1a2333] border border-white/5 p-6 rounded-2xl flex flex-col gap-3 group hover:bg-[#1f2a3d] transition-colors">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300">VOOS REALIZADOS</span>
                    <div className="flex items-center gap-3">
                        <Plane className="w-6 h-6 text-blue-500 fill-blue-500/20" />
                        <span className="text-3xl font-bold text-white">{totalFlights}</span>
                    </div>
                </div>

                {/* Card 2: Pax UE */}
                <div className="bg-[#1a2333] border border-white/5 p-6 rounded-2xl flex flex-col gap-3 group hover:bg-[#1f2a3d] transition-colors">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300">PAX UE</span>
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-blue-500" />
                        <span className="text-3xl font-bold text-white">{totalPaxUE}</span>
                    </div>
                </div>

                {/* Card 3: Pax CE */}
                <div className="bg-[#1a2333] border border-white/5 p-6 rounded-2xl flex flex-col gap-3 group hover:bg-[#1f2a3d] transition-colors">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300">PAX CE</span>
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-orange-500" />
                        <span className="text-3xl font-bold text-white">{totalPaxExtra}</span>
                    </div>
                </div>

                {/* Card 4: Tripulação */}
                <div className="bg-[#1a2333] border border-white/5 p-6 rounded-2xl flex flex-col gap-3 group hover:bg-[#1f2a3d] transition-colors">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300">TRIPULAÇÃO</span>
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-gray-400" />
                        <span className="text-3xl font-bold text-white">{totalCrew}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Widget: Week Calendar (Functional Logic) ---

const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
};

const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const WeekCalendarWidget: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfWeek = getStartOfWeek(currentDate);
    const weekNumber = getWeekNumber(startOfWeek);
    const today = new Date();

    const changeWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };

    const resetToToday = () => {
        setCurrentDate(new Date());
    };

    // Generate 7 days for current view
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        
        const isToday = d.getDate() === today.getDate() && 
                        d.getMonth() === today.getMonth() && 
                        d.getFullYear() === today.getFullYear();
        
        // Mock alert logic: Randomly show alert if it's not today (just for visuals)
        // Using date number to keep it consistent without re-rendering randoms
        const hasAlert = !isToday && (d.getDate() % 5 === 0);

        return {
            w: d.toLocaleDateString('pt-PT', { weekday: 'short' }).toUpperCase().replace('.', ''),
            d: d.getDate(),
            active: isToday,
            alert: hasAlert,
            isWeekend: i >= 5 // 5=Sat, 6=Sun in this 0-based index from Monday
        };
    });

    const monthLabel = startOfWeek.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-[#131b2e] rounded-[32px] p-8 border border-white/5 relative overflow-hidden transition-all">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Semana N.º {weekNumber}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{monthLabel}</p>
                </div>
                
                <div className="flex gap-2 items-center">
                    <button 
                        onClick={resetToToday}
                        className="p-1.5 hover:bg-white/10 rounded-full text-blue-400 hover:text-white transition-colors mr-1"
                        title="Voltar a Hoje"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => changeWeek('prev')}
                        className="p-1 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => changeWeek('next')}
                        className="p-1 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                    return (
                        <div key={idx} className="flex flex-col items-center gap-3 group cursor-pointer">
                            <span className={`text-[10px] font-bold tracking-wider ${day.isWeekend ? 'text-yellow-500' : 'text-gray-400'}`}>
                                {day.w}
                            </span>
                            
                            <div className={`
                                w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all relative
                                ${day.active 
                                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110' 
                                    : 'text-white hover:bg-white/5'}
                            `}>
                                {day.d}
                                {day.active && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full opacity-50"></div>
                                )}
                            </div>

                            {/* Alert Dot */}
                            <div className={`w-1.5 h-1.5 rounded-full ${day.alert ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-transparent'}`}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Widget: Next Events (Cloned Style) ---

const NextEventsWidget: React.FC<{ flights: FlightFormData[] }> = ({ flights }) => {
    const [activeTab, setActiveTab] = useState<'Todos' | 'Voos' | 'Alertas'>('Todos');

    // Mock Data to match the image exatamente
    const events = [
        {
            id: 1,
            type: 'alert',
            title: 'Renovar Cartão Aeroporto',
            time: '10:00',
            desc: 'Tratar na secção de segurança',
            color: 'red'
        },
        {
            id: 2,
            type: 'flight',
            title: 'Voo TP1699',
            time: '14:30',
            desc: 'LPPT - LPPS',
            color: 'blue'
        },
        {
            id: 3,
            type: 'flight',
            title: 'Voo EZY451',
            time: '16:15',
            desc: 'LGW - LPPS',
            color: 'blue'
        },
        {
            id: 4,
            type: 'alert',
            title: 'Relatório Pendente',
            time: 'Agora',
            desc: 'O relatório de turno da noite (05/01) requer atenção',
            color: 'red'
        }
    ];

    const filteredEvents = activeTab === 'Todos' 
        ? events 
        : activeTab === 'Voos' 
            ? events.filter(e => e.type === 'flight') 
            : events.filter(e => e.type === 'alert');

    return (
        <div className="bg-[#131b2e] rounded-[32px] p-6 border border-white/5 flex flex-col flex-1 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">PRÓXIMOS EVENTOS</span>
                {/* O botão (+) foi removido daqui */}
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0b0f1a] p-1 rounded-xl mb-6">
                {['Todos', 'Voos', 'Alertas'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === tab 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {filteredEvents.map((item) => (
                    <div key={item.id} className="bg-[#1a2333] hover:bg-[#1f2a3d] p-4 rounded-2xl border border-white/5 transition-colors group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Icon Box */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                item.type === 'alert' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                            }`}>
                                {item.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                            </div>
                            
                            <div className="overflow-hidden">
                                <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span className={item.time === 'Agora' ? 'text-red-400 font-bold' : ''}>{item.time}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span className="truncate max-w-[150px]">{item.desc}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hover Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"><Eye className="w-4 h-4" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg"><Archive className="w-4 h-4" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Widget: Weather & Clock (Cloned Vertical Card) ---

const WeatherClockWidget: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    const [location, setLocation] = useState<'PXO' | 'FNC'>('PXO');

    const handleToggle = (e: React.MouseEvent, loc: 'PXO' | 'FNC') => {
        e.stopPropagation();
        setLocation(loc);
    };

    // Forecast Data
    const forecast = [
        { d: 'SEX', icon: <Sun className="w-5 h-5 text-yellow-400" />, temp: '23°/19°' },
        { d: 'SÁB', icon: <CloudSun className="w-5 h-5 text-gray-300" />, temp: '21°/18°' },
        { d: 'DOM', icon: <CloudRain className="w-5 h-5 text-blue-400" />, temp: '19°/17°' },
        { d: 'SEG', icon: <CloudSun className="w-5 h-5 text-gray-300" />, temp: '20°/18°' },
    ];

    return (
        <div 
            onClick={onClick}
            className="h-full bg-gradient-to-b from-[#131b2e] to-[#0a0f1d] rounded-[32px] p-8 border border-white/5 relative flex flex-col justify-between overflow-hidden cursor-pointer hover:border-white/20 transition-all group"
        >
             {/* Background Effects */}
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-yellow-500/20"></div>

            {/* Header */}
            <div>
                <div className="flex justify-end items-start">
                    {/* Toggle */}
                    <div className="flex bg-black/30 p-1 rounded-lg border border-white/5 z-10">
                        <button 
                            onClick={(e) => handleToggle(e, 'PXO')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${location === 'PXO' ? 'bg-white text-black' : 'text-gray-500'}`}
                        >
                            PXO
                        </button>
                        <button 
                            onClick={(e) => handleToggle(e, 'FNC')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${location === 'FNC' ? 'bg-white text-black' : 'text-gray-500'}`}
                        >
                            FNC
                        </button>
                    </div>
                </div>

                {/* Big Clock */}
                <div className="text-center mt-12 mb-4">
                    <h1 className="text-7xl font-extralight text-white tracking-wide">22:45</h1>
                </div>

                {/* Micro Stats */}
                <div className="flex justify-center gap-6 text-xs text-gray-400 mb-8">
                    <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" /> 81%
                    </div>
                    <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3" /> 1013 hPa
                    </div>
                    <div>
                        <span className="opacity-70">☀ 07:45</span> <span className="mx-1"></span> <span className="opacity-70">🌙 18:35</span>
                    </div>
                </div>
                <div className="text-center text-[10px] text-gray-500 -mt-6 mb-10">Duração do dia: 9.5Hr</div>
            </div>

            {/* Main Weather Icon */}
            <div className="flex flex-col items-center">
                <Sun className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.4)] animate-pulse-slow group-hover:scale-110 transition-transform duration-500" />
                <div className="text-8xl font-bold text-white mt-4 relative">
                    23°
                    <span className="absolute top-2 -right-6 w-3 h-3 border-2 border-white rounded-full"></span>
                </div>
                <div className="text-xl font-bold text-white mt-1">Ensolarado</div>
                <div className="text-sm text-gray-400 mb-2">Sensação: 25°</div>
                <div className="flex gap-4 text-sm font-medium">
                    <span className="text-red-400">🌡 H: 24°</span>
                    <span className="text-blue-400">🌡 L: 19°</span>
                </div>
            </div>

            {/* Bottom Forecast */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-4 gap-2">
                {forecast.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider">{item.d}</span>
                        {item.icon}
                        <span className="text-[10px] font-bold text-white">{item.temp}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;