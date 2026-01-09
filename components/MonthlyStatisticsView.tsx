import React from 'react';
import { PieChart, TrendingUp, TrendingDown, Users, Calendar, Download, Plane, Globe } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const MonthlyStatisticsView: React.FC = () => {
    // Mock Data for the current month broken by weeks
    const monthlyData = [
        { name: 'Semana 1', voos: 25, pax: 150 },
        { name: 'Semana 2', voos: 30, pax: 180 },
        { name: 'Semana 3', voos: 28, pax: 165 },
        { name: 'Semana 4', voos: 35, pax: 210 },
    ];

    const prevMonthData = [
        { name: 'Semana 1', voos: 20 },
        { name: 'Semana 2', voos: 28 },
        { name: 'Semana 3', voos: 25 },
        { name: 'Semana 4', voos: 30 },
    ];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <PieChart className="w-7 h-7 text-purple-500" />
                            Relatório Mensal
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Visão consolidada do mês atual</p>
                    </div>
                    <button className="flex items-center gap-2 bg-primary dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-secondary dark:hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                        <Download className="w-4 h-4" />
                        Exportar Relatório Mensal
                    </button>
                </div>

                {/* KPI Cards for the Month */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Total Voos</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">118</p>
                        <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+5% vs Mês anterior</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Total Passageiros</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">705</p>
                         <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+12% vs Mês anterior</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                         <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Extra-Schengen</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">124</p>
                         <div className="flex items-center gap-1 mt-2 text-red-600 dark:text-red-400 text-xs font-bold">
                            <TrendingDown className="w-3 h-3" />
                            <span>-2% vs Mês anterior</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                         <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Aeronaves Únicas</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">42</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs">
                           <span>Operadores distintos</span>
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Monthly Trend vs Previous Month */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Evolução Mensal de Voos</h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 55, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
                                        itemStyle={{color: '#fff'}}
                                    />
                                    <Legend />
                                    <Line type="monotone" name="Mês Atual" dataKey="voos" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                                    <Line type="monotone" name="Mês Anterior (Simulado)" data={prevMonthData} dataKey="voos" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Weekly Breakdown within Month */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Distribuição de Passageiros por Semana</h3>
                         <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 55, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
                                        itemStyle={{color: '#fff'}}
                                    />
                                    <Bar name="Passageiros" dataKey="pax" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyStatisticsView;