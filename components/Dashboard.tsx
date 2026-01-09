
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
    Waves, 
    Droplets, 
    Thermometer,
    ChevronLeft,
    ChevronRight,
    Eye,
    Archive,
    Trash2,
    RotateCcw,
    Users,
    Navigation
} from 'lucide-react';
import { ViewState, FlightFormData, FlightType } from '../types';
import { getFlights } from '../services/db';

interface DashboardProps {
    onChangeView?: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
    const [flights, setFlights] = useState<FlightFormData[]>([]);
    
    useEffect(() => {
        getFlights().then(setFlights).catch(console.error);
    }, []);

    return (
        <div className="p-6 pt-2 h-full flex flex-col relative overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-[#0a0e17] transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <WeekCalendarWidget onChangeView={onChangeView} />
                    <NextEventsWidget flights={flights} />
                </div>
                
                {/* Coluna Lateral */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <WeatherClockWidget onClick={() => onChangeView?.('weather')} />
                    <QuickForecastWidget />
                </div>
            </div>
            <MonthlySummaryFooter flights={flights} />
        </div>
    );
};

// --- NOVOS WIDGETS ---

const QuickForecastWidget: React.FC = () => {
    const pxoForecast = [
        { day: 'HOJE', temp: '18°', icon: <Sun className="w-5 h-5 text-yellow-500" /> },
        { day: 'AMANHÃ', temp: '17°', icon: <CloudSun className="w-5 h-5 text-gray-400" /> },
        { day: 'QUA', temp: '19°', icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    ];

    const fncForecast = [
        { day: 'HOJE', temp: '16°', icon: <CloudRain className="w-5 h-5 text-blue-400" /> },
        { day: 'AMANHÃ', temp: '18°', icon: <CloudSun className="w-5 h-5 text-gray-400" /> },
        { day: 'QUA', temp: '20°', icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    ];

    return (
        <div className="bg-white dark:bg-[#131b2e] rounded-[32px] p-6 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Navigation className="w-3 h-3" /> Previsão 3 Dias (Aeroportos)
            </h3>
            
            <div className="space-y-6">
                {/* PXO Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-primary dark:text-blue-400">PXO - PORTO SANTO</span>
                        <div className="h-px flex-1 mx-3 bg-gray-100 dark:bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {pxoForecast.map((f, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-[#1a2333] p-2 rounded-2xl flex flex-col items-center gap-1 border border-gray-100 dark:border-white/5">
                                <span className="text-[8px] font-bold text-gray-500">{f.day}</span>
                                {f.icon}
                                <span className="text-xs font-black dark:text-white">{f.temp}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FNC Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-primary dark:text-blue-400">FNC - MADEIRA</span>
                        <div className="h-px flex-1 mx-3 bg-gray-100 dark:bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {fncForecast.map((f, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-[#1a2333] p-2 rounded-2xl flex flex-col items-center gap-1 border border-gray-100 dark:border-white/5">
                                <span className="text-[8px] font-bold text-gray-500">{f.day}</span>
                                {f.icon}
                                <span className="text-xs font-black dark:text-white">{f.temp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- WIDGETS EXISTENTES RE-ESTILIZADOS ---

const MonthlySummaryFooter: React.FC<{ flights: FlightFormData[] }> = ({ flights }) => {
    const today = new Date();
    const monthName = today.toLocaleDateString('pt-PT', { month: 'long' });

    return (
        <div className="bg-white dark:bg-[#131b2e] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 mb-20 shadow-sm transition-colors">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-primary dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CalendarIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Resumo Mensal</h3>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white capitalize leading-none">{monthName}</h2>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Voos Realizados', val: '24', icon: <Plane />, color: 'blue' },
                    { label: 'PAX UE', val: '412', icon: <Users />, color: 'emerald' },
                    { label: 'PAX Extra', val: '89', icon: <Users />, color: 'orange' },
                    { label: 'Tripulação', val: '124', icon: <Users />, color: 'gray' }
                ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-[#1a2333] border border-gray-100 dark:border-white/5 p-6 rounded-2xl transition-colors">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-3xl font-black dark:text-white">{stat.val}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WeekCalendarWidget: React.FC<{ onChangeView?: (view: ViewState) => void }> = ({ onChangeView }) => {
    const days = Array.from({ length: 7 }, (_, i) => ({
        w: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'][i],
        d: 12 + i,
        active: i === 1,
        alert: i === 4
    }));

    return (
        <div className="bg-white dark:bg-[#131b2e] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Agenda Semanal</h3>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 group cursor-pointer" onClick={() => onChangeView?.('calendar-monthly')}>
                        <span className="text-[10px] font-black text-gray-400 tracking-widest">{day.w}</span>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-black transition-all ${day.active ? 'bg-primary dark:bg-blue-600 text-white shadow-lg scale-110' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                            {day.d}
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${day.alert ? 'bg-red-500 shadow-md' : 'bg-transparent'}`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NextEventsWidget: React.FC<{ flights: FlightFormData[] }> = () => {
    const events = [
        { title: 'Voo TP1699', time: '14:30', desc: 'Lisboa - Porto Santo', type: 'flight' },
        { title: 'Verificar Selos', time: '16:00', desc: 'Sede PSP', type: 'alert' }
    ];

    return (
        <div className="bg-white dark:bg-[#131b2e] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm flex-1 transition-colors">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Próximos Eventos</h3>
            <div className="space-y-3">
                {events.map((e, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-[#1a2333] p-4 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${e.type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-primary dark:text-blue-400'}`}>
                                {e.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm dark:text-white">{e.title}</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">{e.time} • {e.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const WeatherClockWidget: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    return (
        <div onClick={onClick} className="bg-white dark:bg-[#131b2e] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm relative flex flex-col items-center justify-between cursor-pointer transition-all hover:shadow-md">
            <div className="text-center">
                <h1 className="text-6xl font-black text-primary dark:text-white transition-colors">22:45</h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Porto Santo, Madeira</p>
            </div>
            <Sun className="w-20 h-20 text-yellow-500 my-6 animate-pulse-slow" />
            <div className="text-center">
                <div className="text-4xl font-black dark:text-white">23°</div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Céu Limpo</p>
            </div>
            <div className="w-full pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-3 gap-2 text-center text-[8px] font-black text-gray-400 uppercase">
                <div>Hum: 81%</div>
                <div>Vis: 10km</div>
                <div>Pre: 1013</div>
            </div>
        </div>
    );
};

export default Dashboard;
