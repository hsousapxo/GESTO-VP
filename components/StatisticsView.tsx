import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download, PieChart, LineChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart } from 'recharts';

const StatisticsView: React.FC = () => {
    // Mock Data for charts
    const paxData = [
        { name: 'Seg', chegada: 120, partida: 110 },
        { name: 'Ter', chegada: 98, partida: 105 },
        { name: 'Qua', chegada: 145, partida: 130 },
        { name: 'Qui', chegada: 110, partida: 115 },
        { name: 'Sex', chegada: 170, partida: 160 },
        { name: 'Sáb', chegada: 190, partida: 185 },
        { name: 'Dom', chegada: 160, partida: 150 },
    ];

    const nationalityData = [
        { name: 'PT', value: 450 },
        { name: 'UK', value: 230 },
        { name: 'DE', value: 180 },
        { name: 'FR', value: 120 },
        { name: 'US', value: 80 },
    ];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <PieChart className="w-7 h-7 text-green-500" />
                            Relatório de Turno
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Análise detalhada de tráfego e fronteira</p>
                    </div>
                    <div className="flex gap-2">
                         <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                            Este Mês
                        </button>
                        <button className="flex items-center gap-2 bg-primary dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-secondary dark:hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                            <Download className="w-4 h-4" />
                            Exportar PDF
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard 
                        title="Total Passageiros" 
                        value="1,245" 
                        trend="+12%" 
                        icon={<Users className="w-6 h-6 text-blue-500" />} 
                        color="blue"
                    />
                    <KpiCard 
                        title="Voos Controlados" 
                        value="84" 
                        trend="+5%" 
                        icon={<TrendingUp className="w-6 h-6 text-green-500" />} 
                        color="green"
                    />
                    <KpiCard 
                        title="Recusas Entrada" 
                        value="2" 
                        trend="-50%" 
                        icon={<BarChart3 className="w-6 h-6 text-red-500" />} 
                        color="red"
                    />
                     <KpiCard 
                        title="Tempo Médio Proc." 
                        value="45s" 
                        trend="-10%" 
                        icon={<LineChart className="w-6 h-6 text-purple-500" />} 
                        color="purple"
                    />
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Traffic */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Tráfego Semanal (Entradas vs Saídas)</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={paxData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 55, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
                                        itemStyle={{color: '#fff'}}
                                    />
                                    <Legend />
                                    <Bar name="Chegada" dataKey="chegada" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar name="Partida" dataKey="partida" fill="#f97316" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Nationalities */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Top 5 Nacionalidades (Non-Schengen)</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart layout="vertical" data={nationalityData}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} width={40} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 55, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
                                        itemStyle={{color: '#fff'}}
                                    />
                                    <Bar dataKey="value" name="Passageiros" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Reports List */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                         <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Relatórios Recentes</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-red-600 dark:text-red-400">
                                        <Download className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">Relatório de Turno - Equipa A</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Gerado em: 12/01/2025 às 08:30</p>
                                    </div>
                                </div>
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const KpiCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => {
    const isPositive = trend.startsWith('+');
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}>
                    {icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {trend}
                </span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
    );
};

export default StatisticsView;