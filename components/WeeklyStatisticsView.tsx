import React from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    Users, 
    Calendar, 
    Download, 
    Plane, 
    FileText, 
    FileDown, 
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
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

    const handleDownloadTemplate = (name: string) => {
        // Simulação de download
        alert(`A iniciar download do ficheiro: ${name}`);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-7xl mx-auto w-full space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <BarChart3 className="w-7 h-7 text-blue-500" />
                            Relatório Semanal
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Análise de tráfego dos últimos 7 dias</p>
                    </div>
                    <button className="flex items-center gap-2 bg-primary dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-secondary dark:hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                        <Download className="w-4 h-4" />
                        Exportar Estatísticas Semanais
                    </button>
                </div>

                {/* KPI Cards for the Week */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 45, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
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
                                        contentStyle={{backgroundColor: 'rgba(31, 41, 45, 0.9)', borderRadius: '8px', border: 'none', color: '#fff'}}
                                        itemStyle={{color: '#fff'}}
                                    />
                                    <Area type="monotone" dataKey="pax" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPax)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* MODAL / DOWNLOAD SECTION: Modelo Relatório de Turno */}
                <div className="pt-4">
                    <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">Modelos e Recursos Semanais</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* THE REQUESTED TEMPLATE CARD */}
                        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[24px] p-6 border border-blue-500/20 shadow-xl group relative overflow-hidden">
                            {/* Abstract background shape */}
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                            
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                                        <FileText className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Modelo Relatório de Turno</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 uppercase">PDF / XLSX</span>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">v2.4 • Jan 2025</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                Documento oficial para o registo detalhado de ocorrências, tráfego aéreo e passageiros durante o turno.
                            </p>

                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Atualizado
                                </div>
                                <button 
                                    onClick={() => handleDownloadTemplate('Modelo_Relatorio_Turno_v2.4.pdf')}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                                >
                                    <FileDown className="w-4 h-4" />
                                    DESCARREGAR MODELO
                                </button>
                            </div>
                        </div>

                        {/* Optional Second Resource Card for Balance */}
                        <div className="bg-[#131b2e] rounded-[24px] p-6 border border-white/5 shadow-lg flex flex-col justify-between">
                            <div>
                                <h4 className="text-gray-300 font-bold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                                    Instruções de Preenchimento
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Consulte o guia rápido de preenchimento para garantir a conformidade com as normas DSAM/PF008.
                                </p>
                            </div>
                            <button className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white transition-colors py-2 border border-dashed border-gray-700 rounded-xl hover:border-gray-500">
                                VER GUIA ONLINE
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WeeklyStatisticsView;