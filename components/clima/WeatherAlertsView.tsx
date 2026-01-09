
import React from 'react';
import { 
    AlertTriangle, 
    Bell, 
    Wind, 
    CloudRain, 
    Thermometer, 
    Shield, 
    Navigation, 
    Clock, 
    Share2, 
    FileWarning, 
    MapPin,
    ArrowRight
} from 'lucide-react';

const WeatherAlertsView: React.FC = () => {
    
    const activeAlerts = [
        {
            id: 1,
            location: 'LPPS (Porto Santo)',
            severity: 'Yellow', // Amarelo
            type: 'Vento',
            title: 'Vento Forte de Norte',
            description: 'Rajadas previstas até 35kt. Possível impacto em aeronaves de pequeno porte (Aeronaves Classe A/B).',
            validity: 'Até 12/01 - 18:00',
            instructions: 'Reforçar amarrações no placa. Monitorizar aproximações de voos privados.',
            color: 'border-yellow-500 text-yellow-500 bg-yellow-500/5'
        },
        {
            id: 2,
            location: 'LPMA (Madeira)',
            severity: 'Orange', // Laranja
            type: 'Chuva',
            title: 'Precipitação Intensa',
            description: 'Chuva persistente com visibilidade horizontal reduzida (abaixo de 2000m). Risco de voos divergidos para PXO.',
            validity: 'Hoje - 23:30',
            instructions: 'Preparar piquete para possível receção de voos divergidos. Manter comunicação com SOA FNC.',
            color: 'border-orange-500 text-orange-500 bg-orange-500/5'
        },
    ];

    return (
        <div className="h-full bg-[#0a0e17] text-gray-100 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            Alertas Meteorológicos
                        </h2>
                        <p className="text-gray-400 mt-1 uppercase tracking-widest text-xs font-bold">Monitorização Operacional Posto de Fronteira</p>
                    </div>
                    <div className="flex gap-2">
                         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
                            <Share2 className="w-4 h-4" />
                            Notificar Equipa
                        </button>
                    </div>
                </div>

                {/* Primary Alert Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Active Alerts List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                             <Bell className="w-4 h-4" />
                             <span className="text-xs font-black uppercase tracking-widest">Alertas Ativos ({activeAlerts.length})</span>
                        </div>
                        
                        {activeAlerts.map(alert => (
                            <div key={alert.id} className={`border-l-4 rounded-2xl p-6 transition-all hover:scale-[1.01] ${alert.color}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-current/10`}>
                                            {alert.type === 'Vento' ? <Wind className="w-6 h-6" /> : <CloudRain className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{alert.title}</h3>
                                            <p className="text-sm font-medium flex items-center gap-1 opacity-80">
                                                <MapPin className="w-3 h-3" /> {alert.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Validade</span>
                                        <span className="text-xs font-bold text-white flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {alert.validity}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    {alert.description}
                                </p>
                                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                    <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">Instruções Operacionais (PF008)</span>
                                    <div className="flex items-start gap-3">
                                        <Navigation className="w-4 h-4 text-blue-400 mt-0.5" />
                                        <p className="text-xs text-blue-200 font-medium italic">"{alert.instructions}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeAlerts.length === 0 && (
                            <div className="bg-[#131b2e] rounded-3xl p-12 text-center border border-white/5 border-dashed">
                                <Shield className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-400">Céu Limpo</h3>
                                <p className="text-sm text-gray-600">Sem alertas ativos no momento para a região autónoma.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Risks & Information */}
                    <div className="space-y-6">
                        {/* Risk Indicator Sidebar Card */}
                        <div className="bg-[#131b2e] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                             
                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Matriz de Risco Regional</h4>
                             
                             <div className="space-y-6">
                                <RiskBar label="Visibilidade" level={80} color="bg-red-500" />
                                <RiskBar label="Vento de Través" level={40} color="bg-yellow-500" />
                                <RiskBar label="Gelo / Baixa Temp" level={10} color="bg-blue-400" />
                                <RiskBar label="Risco Divergidos" level={95} color="bg-orange-600" />
                             </div>

                             <div className="mt-8 pt-6 border-t border-white/5">
                                <button className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-white transition-colors group">
                                    Consultar Manual de Crise
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                             </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-600/10 rounded-3xl p-6 border border-blue-600/20">
                            <FileWarning className="w-8 h-8 text-blue-500 mb-4" />
                            <h4 className="text-sm font-bold text-white mb-2">Procedimento em Alerta Laranja/Vermelho</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Em situações de severidade elevada, o Chefe de Turno deve manter o canal rádio <b>PSP-AIR-01</b> em escuta ativa e atualizar a lista de <b>Contatos PXO</b> para emergências externas imediatas.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Legend Section */}
                <div className="bg-[#131b2e]/50 rounded-2xl p-6 flex flex-wrap gap-8 items-center border border-white/5">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Legenda IPMA:</span>
                    <LegendItem color="bg-green-500" label="Verde: Sem Risco" />
                    <LegendItem color="bg-yellow-500" label="Amarelo: Risco Moderado" />
                    <LegendItem color="bg-orange-500" label="Laranja: Risco Elevado" />
                    <LegendItem color="bg-red-500" label="Vermelho: Risco Extremo" />
                </div>

            </div>
        </div>
    );
};

const RiskBar: React.FC<{ label: string; level: number; color: string }> = ({ label, level, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">{label}</span>
            <span className="text-white">{level}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.5)]`} style={{ width: `${level}%` }}></div>
        </div>
    </div>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
    </div>
);

export default WeatherAlertsView;
