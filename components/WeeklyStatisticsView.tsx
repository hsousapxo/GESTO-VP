import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Calendar, Download, Plane } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

const WeeklyStatisticsView: React.FC = () => {
    // Mock Data for the current week
    const weeklyData = [
        { name: 'Segunda', voos: 4, pax: 12 },
        { name: 'Terça', voos: 2, pax: 8 },
        { name: 'Quarta', voos: 5, pax: 25 },
        { name: 'Quinta', voos: 3, pax: 10 },
        { name: 'Sexta', voos: 6, pax: 45 },
        { name: 'Sábado', voos: 8, pax: 60 },
        { name: 'Domingo', voos: 5, pax: 30 },
    ];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <BarChart3 className="w-7 h-7 text-blue-500" />
                            Relatório Semanal
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Análise de tráfego dos últimos 7 dias</p>
                    </div>
                    <button className="flex items-center gap-2 bg-primary dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-secondary dark:hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                        <Download className="w-4 h-4" />
                        Exportar Relatório Semanal
                    </button>
                </div>

                {/* KPI Cards for the Week */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                <Plane className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                +15% vs Semana ant.
                            </span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Total Voos (Semana)</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">33</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                +8% vs Semana ant.
                            </span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Total Pax (Semana)</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">190</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                         <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                Média
                            </span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Voos / Dia</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">4.7</p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Flights per Day */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Voos por Dia</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 55, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
                                        itemStyle={{color: '#fff'}}
                                    />
                                    <Bar name="Voos" dataKey="voos" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pax Flow Trend */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Fluxo de Passageiros</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorPax" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 55, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
                                        itemStyle={{color: '#fff'}}
                                    />
                                    <Area type="monotone" dataKey="pax" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPax)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyStatisticsView;