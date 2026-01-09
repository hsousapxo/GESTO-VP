
import React, { useEffect, useRef, useState } from 'react';
import { 
    AlertTriangle, 
    Bell, 
    Wind, 
    CloudRain, 
    Shield, 
    Navigation, 
    Clock, 
    Share2, 
    MapPin,
    ArrowRight,
    Waves,
    Eye,
    Activity,
    Info,
    RefreshCcw
} from 'lucide-react';

// Access Leaflet from global scope
declare global {
    interface Window {
        L: any;
    }
}

const WeatherAlertsView: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        if (mapRef.current && !mapInstance.current && window.L) {
            // Foco em Porto Santo LPPS
            mapInstance.current = window.L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([33.07, -16.34], 10);
            
            window.L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                maxZoom: 19
            }).addTo(mapInstance.current);

            // Simulação de camada de radar (círculo de chuva/vento)
            window.L.circle([33.15, -16.20], {
                color: 'orange',
                fillColor: '#f03',
                fillOpacity: 0.2,
                radius: 15000
            }).addTo(mapInstance.current).bindPopup("Área de Turbulência / Vento Forte");

            // Marcador Aeroporto
            const airportIcon = window.L.divIcon({
                html: '<div class="bg-blue-600 p-1.5 rounded-full border-2 border-white shadow-lg animate-pulse"><div class="w-2 h-2 bg-white rounded-full"></div></div>',
                className: 'custom-div-icon',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            window.L.marker([33.0709, -16.3481], { icon: airportIcon }).addTo(mapInstance.current).bindPopup("<b>LPPS - Porto Santo</b><br>Operacional com Restrições");
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const activeAlerts = [
        {
            id: 1,
            location: 'LPPS / PXO',
            severity: 'Yellow',
            type: 'Vento',
            title: 'Vento Forte (Norte)',
            description: 'Rajadas previstas até 40kt. Direção 010º. Possível impacto em aeronaves ATR72 e Beechcraft.',
            validity: 'Hoje às 21:00',
            instructions: 'Reforçar vigilância na placa. Monitorizar aproximações visuais.',
            color: 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
        },
        {
            id: 2,
            location: 'Madeira / FNC',
            severity: 'Orange',
            type: 'Mar',
            title: 'Agitação Marítima',
            description: 'Ondas de Noroeste com 5 a 6 metros. Impacto direto na operação do Lobo Marinho (Porto Santo Line).',
            validity: 'Amanhã - Todo o dia',
            instructions: 'Prever aumento de fluxo no aeroporto caso o navio seja cancelado.',
            color: 'border-orange-500 text-orange-500 bg-orange-500/10'
        }
    ];

    return (
        <div className="h-full bg-[#0a0e17] text-gray-100 p-6 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Operacional */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#131b2e] p-6 rounded-[24px] border border-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Monitoring</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            Alerta Tempo
                        </h2>
                        <p className="text-gray-400 mt-1 text-sm">Posto de Fronteira DSAM-PF008 • Porto Santo</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                             <button onClick={() => setLastUpdate(new Date().toLocaleTimeString())} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400" title="Atualizar">
                                <RefreshCcw className="w-5 h-5" />
                            </button>
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
                                <Share2 className="w-4 h-4" />
                                Notificar Equipa
                            </button>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Última atualização: {lastUpdate}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Coluna 1 e 2: Mapa e Alertas */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Mapa Live */}
                        <div className="bg-[#131b2e] rounded-[32px] border border-white/5 overflow-hidden h-[400px] relative shadow-2xl">
                             <div ref={mapRef} className="w-full h-full grayscale-[0.5] contrast-[1.1]" />
                             <div className="absolute top-4 left-4 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Radar de Precipitação (Simulado)</span>
                             </div>
                             <div className="absolute bottom-4 left-4 z-[400] bg-[#0a0e17]/80 p-3 rounded-xl border border-white/10 text-xs">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div> <span className="text-gray-400">Risco Extremo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div> <span className="text-gray-400">Risco Elevado</span>
                                </div>
                             </div>
                        </div>

                        {/* Lista de Alertas Ativos */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                <Bell className="w-4 h-4" /> Alertas em Vigor
                            </h3>
                            {activeAlerts.map(alert => (
                                <div key={alert.id} className={`border-l-4 rounded-3xl p-6 transition-all hover:bg-white/5 border-white/5 ${alert.color}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-current/10 flex items-center justify-center">
                                                {alert.type === 'Vento' ? <Wind className="w-6 h-6" /> : <Waves className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{alert.title}</h3>
                                                <div className="flex items-center gap-2 text-xs opacity-70">
                                                    <MapPin className="w-3.5 h-3.5" /> {alert.location}
                                                    <span className="mx-1">•</span>
                                                    <Clock className="w-3.5 h-3.5" /> Validade: {alert.validity}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="bg-current/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Nível {alert.severity === 'Yellow' ? 'Amarelo' : 'Laranja'}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                        {alert.description}
                                    </p>
                                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                        <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2 flex items-center gap-2">
                                            <Info className="w-3 h-3" /> Diretrizes Operacionais (PF008)
                                        </span>
                                        <p className="text-xs text-blue-300 font-medium italic">"{alert.instructions}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coluna 3: Métricas e Legenda */}
                    <div className="space-y-6">
                        
                        {/* Matriz de Risco Operacional */}
                        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[32px] p-6 border border-white/5 relative overflow-hidden shadow-xl">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                             
                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Status Aeroportuário (LPPS)</h4>
                             
                             <div className="space-y-6">
                                <RiskIndicator label="Vento Cruzado (Rwy 18/36)" level={65} color="bg-orange-500" />
                                <RiskIndicator label="Visibilidade Horizontal" level={90} color="bg-green-500" />
                                <RiskIndicator label="Estado da Pista (Aderência)" level={40} color="bg-yellow-500" />
                                <RiskIndicator label="Prob. Divergidos (FNC)" level={85} color="bg-red-500" />
                             </div>

                             <div className="mt-8 pt-6 border-t border-white/5">
                                <button className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-white transition-all group p-2 hover:bg-white/5 rounded-xl">
                                    Consultar Manual de Crise
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                             </div>
                        </div>

                        {/* Card Estado do Mar */}
                        <div className="bg-[#131b2e] rounded-[32px] p-6 border border-white/5 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                                    <Waves className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Agitação Marítima</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Canal Madeira-PXO</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-3xl font-bold text-white">5.2m</span>
                                    <span className="text-xs text-gray-500 ml-2">Altura Máx</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-red-400 block">RISCO ALTO</span>
                                    <span className="text-[10px] text-gray-500 italic">Previsão: NW</span>
                                </div>
                            </div>
                        </div>

                         {/* Legenda IPMA */}
                        <div className="bg-[#131b2e]/50 rounded-[24px] p-6 border border-white/5 space-y-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Legenda Avisos IPMA</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <LegendItem color="bg-green-500" label="Verde: Situação Normal" />
                                <LegendItem color="bg-yellow-500" label="Amarelo: Risco Operacional" />
                                <LegendItem color="bg-orange-500" label="Laranja: Risco Elevado" />
                                <LegendItem color="bg-red-500" label="Vermelho: Risco Extremo" />
                            </div>
                        </div>

                    </div>

                </div>

                <div className="h-10"></div>
            </div>
        </div>
    );
};

const RiskIndicator: React.FC<{ label: string; level: number; color: string }> = ({ label, level, color }) => (
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
    <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</span>
    </div>
);

export default WeatherAlertsView;
