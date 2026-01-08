import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Calendar, ArrowRight, Clock, CloudRain, Cloud, Wind, ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ViewState, FlightFormData } from '../types';
import { getFlights } from '../services/db';

interface DashboardProps {
    onChangeView?: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <WeekCalendarWidget onChangeView={onChangeView} />
            <NextFlightsWidget />
            <WeatherWidget />
            <StatsWidget />
        </div>
    );
};

// --- Widgets ---

const WeekCalendarWidget: React.FC<{ onChangeView?: (view: ViewState) => void }> = ({ onChangeView }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Helper to get the Monday of the current week
    const getMonday = (d: Date) => {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    };

    const monday = getMonday(currentDate);
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDays.push(d);
    }

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() && 
               d1.getMonth() === d2.getMonth() && 
               d1.getFullYear() === d2.getFullYear();
    };

    const weekNumber = Math.ceil((((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / 86400000) + 1) / 7);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 transition-colors flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                    <button onClick={prevWeek} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-bold text-primary dark:text-blue-400 select-none">Semana {weekNumber}</h3>
                    <button onClick={nextWeek} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={() => onChangeView?.('calendar-monthly')}
                        className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors"
                        title="Ver Vista Mensal"
                    >
                        <CalendarDays className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onChangeView?.('reminders')}
                        className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors"
                        title="Adicionar Lembrete"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center mb-6">
                {weekDays.map((d, i) => {
                    const dayName = d.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '').toUpperCase();
                    const dayNum = d.getDate();
                    const isSelected = isSameDay(d, selectedDate);
                    const isToday = isSameDay(d, new Date());

                    return (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{dayName}</div>
                            <button 
                                onClick={() => setSelectedDate(d)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all
                                    ${isSelected ? 'bg-primary dark:bg-blue-600 text-white shadow-md scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                                    ${!isSelected && isToday ? 'border border-primary dark:border-blue-400 text-primary dark:text-blue-400' : ''}
                                `}
                            >
                                {dayNum}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                            {selectedDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {isSameDay(selectedDate, new Date()) ? 'Hoje: Turno A (08h-20h)' : 'Sem escalas definidas'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NextFlightsWidget: React.FC = () => {
    const [recentFlights, setRecentFlights] = useState<FlightFormData[]>([]);

    useEffect(() => {
        const loadFlights = async () => {
            const data = await getFlights();
            // Take top 3 for the widget
            setRecentFlights(data.slice(0, 3));
        };
        loadFlights();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Realizado': return 'text-blue-600 dark:text-blue-400';
            case 'Confirmado': return 'text-green-600 dark:text-green-400';
            case 'Cancelado': return 'text-red-600 dark:text-red-400';
            default: return 'text-yellow-600 dark:text-yellow-400';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-lg font-bold text-primary dark:text-blue-400">PRÓXIMOS EVENTOS</h3>
                <div className="flex gap-1">
                    <button className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">Voos</button>
                    <button className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">Alertas</button>
                </div>
            </div>
            <div className="flex-1 space-y-4">
                {recentFlights.length === 0 ? (
                    <div className="text-center text-gray-400 py-4 text-sm">Sem voos recentes registados</div>
                ) : (
                    recentFlights.map((flight, idx) => {
                        const time = flight.scheduleTimeArrival || flight.scheduleTimeDeparture || '--:--';
                        const route = flight.flightType === 'chegada' ? `${flight.origin} → LPPS` :
                                      flight.flightType === 'partida' ? `LPPS → ${flight.destination}` :
                                      `${flight.origin} ↔ ${flight.destination}`;
                        
                        return (
                            <div key={idx} className="flex justify-between items-start pb-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                                <div>
                                    <p className={`font-bold text-sm ${getStatusColor(flight.status)}`}>
                                        {flight.flightNumber} ({flight.status})
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        {time} <ArrowRight className="w-3 h-3" /> {route}
                                    </p>
                                </div>
                                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{time}</span>
                            </div>
                        );
                    })
                )}
                
                {/* Fallback Example Item just to fill space if empty */}
                {recentFlights.length < 3 && (
                     <div className="flex justify-between items-start pb-3 border-b border-gray-50 dark:border-gray-700 last:border-0 opacity-50">
                        <div>
                            <p className="font-bold text-primary dark:text-blue-300 text-sm">Renovar Cartão Aeroportuário</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10:00 - Tratar na secção de segurança</p>
                        </div>
                        <div className="text-accent dark:text-blue-400">
                             <Clock className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const WeatherWidget: React.FC = () => {
    const [location, setLocation] = useState<'pxo' | 'fnc'>('pxo');

    const data = {
        pxo: {
            temp: 25,
            condition: 'Ensolarado',
            icon: <Sun className="w-16 h-16 text-yellow-400" />,
            feelsLike: 25,
            max: 24,
            min: 19,
            pressure: 1013,
            sunrise: '07:45',
            sunset: '18:35',
            duration: 9.5,
            forecast: [
                { day: 'Sexta', icon: <Sun className="w-5 h-5 text-yellow-400" />, min: 19, max: 24 },
                { day: 'Sábado', icon: <CloudSun className="w-5 h-5 text-yellow-500" />, min: 18, max: 23 },
                { day: 'Domingo', icon: <Cloud className="w-5 h-5 text-gray-400" />, min: 18, max: 22 },
            ]
        },
        fnc: {
            temp: 22,
            condition: 'Parcialmente Nublado',
            icon: <CloudSun className="w-16 h-16 text-yellow-500" />,
            feelsLike: 21,
            max: 23,
            min: 18,
            pressure: 1015,
            sunrise: '08:02',
            sunset: '18:28',
            duration: 10.4,
             forecast: [
                { day: 'Sexta', icon: <CloudRain className="w-5 h-5 text-blue-400" />, min: 17, max: 21 },
                { day: 'Sábado', icon: <CloudSun className="w-5 h-5 text-yellow-500" />, min: 18, max: 22 },
                { day: 'Domingo', icon: <Wind className="w-5 h-5 text-gray-500" />, min: 16, max: 20 },
            ]
        }
    };

    const current = data[location];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 transition-colors flex flex-col h-full">
             <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-lg font-bold text-primary dark:text-blue-400">Previsão do Tempo</h3>
            </div>
            
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1 mb-4">
                <button 
                    onClick={() => setLocation('pxo')}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${location === 'pxo' ? 'bg-primary dark:bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'}`}
                >
                    PXO
                </button>
                <button 
                    onClick={() => setLocation('fnc')}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${location === 'fnc' ? 'bg-primary dark:bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'}`}
                >
                    FNC
                </button>
            </div>

            <div className="flex flex-col items-center mb-4">
                <div className="mb-2 animate-pulse">{current.icon}</div>
                <div className="text-4xl font-bold text-gray-800 dark:text-white">{current.temp}°</div>
                <div className="text-gray-500 dark:text-gray-400 font-medium">{current.condition}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 block uppercase">Sensação</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{current.feelsLike}°</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 block uppercase">Máx</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{current.max}°</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 block uppercase">Mín</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{current.min}°</span>
                </div>
            </div>

            {/* 3-Day Forecast */}
            <div className="mt-auto border-t border-gray-100 dark:border-gray-700 pt-4">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Próximos 3 Dias</h4>
                <div className="space-y-2">
                    {current.forecast.map((day, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">{day.day}</span>
                            <div className="flex-1 flex justify-center">
                                {day.icon}
                            </div>
                            <div className="flex gap-3 text-sm">
                                <span className="font-bold text-gray-800 dark:text-white">{day.max}°</span>
                                <span className="text-gray-400 dark:text-gray-500">{day.min}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

const StatsWidget: React.FC = () => {
    const data = [
      { name: 'Seg', uv: 40 },
      { name: 'Ter', uv: 30 },
      { name: 'Qua', uv: 20 },
      { name: 'Qui', uv: 27 },
      { name: 'Sex', uv: 18 },
      { name: 'Sab', uv: 23 },
      { name: 'Dom', uv: 34 },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 lg:col-span-2 xl:col-span-3 transition-colors">
             <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-lg font-bold text-primary dark:text-blue-400">Fluxo de Passageiros (Semanal)</h3>
            </div>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1a365d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#1a365d" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.3} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)'}} />
                        <Area type="monotone" dataKey="uv" stroke="#1a365d" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;