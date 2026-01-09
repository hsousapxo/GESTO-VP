import React from 'react';
import { 
    Search, 
    Bell, 
    Wind, 
    Eye, 
    PlaneLanding, 
    PlaneTakeoff, 
    ExternalLink, 
    Waves, 
    FileText, 
    Globe, 
    Shield, 
    CloudSun, 
    ArrowLeft,
    Calendar,
    Thermometer,
    CloudRain,
    Sun,
    Droplets
} from 'lucide-react';

interface WeatherViewProps {
    airportCode?: 'PXO' | 'FNC';
}

const WeatherView: React.FC<WeatherViewProps> = ({ airportCode }) => {
    
    // If an airport is selected, show the Detailed 3-Day Forecast View
    if (airportCode) {
        return <DetailedForecast airportCode={airportCode} />;
    }

    // Default "Hub" View
    return (
        <div className="h-full bg-[#0a0e17] text-gray-100 p-6 overflow-y-auto">
            <div className="max-w-md mx-auto flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button className="text-blue-500">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-white">Clima</h1>
                    </div>
                    <div className="relative">
                         <Bell className="w-6 h-6 text-gray-400" />
                         <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0e17]"></span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar aeroporto..." 
                        className="w-full bg-[#131b2e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Weather Cards */}
                <div className="space-y-4">
                    
                    {/* FNC Card */}
                    <div className="bg-[#131b2e] rounded-3xl p-6 border border-white/5 relative overflow-hidden group cursor-pointer transition-colors hover:bg-[#1a2333]">
                        {/* Background Gradient Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-600/20 transition-all"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#1a2333] rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                                    <PlaneLanding className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white leading-none">FNC</h2>
                                    <p className="text-xs text-gray-400 mt-1">Madeira (Funchal)</p>
                                </div>
                            </div>
                            <div className="text-4xl font-light text-white">
                                15°
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Wind className="w-4 h-4 text-gray-500" />
                                    <span>12kt</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span>10km+</span>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white transition-colors">
                                <ExternalLink className="w-5 h-5 rotate-90" />
                            </button>
                        </div>
                    </div>

                    {/* PXO Card */}
                    <div className="bg-[#131b2e] rounded-3xl p-6 border border-white/5 relative overflow-hidden group cursor-pointer transition-colors hover:bg-[#1a2333]">
                         {/* Background Gradient Effect */}
                         <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-green-500/10 transition-all"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#1a2333] rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                                    <PlaneTakeoff className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white leading-none">PXO</h2>
                                    <p className="text-xs text-gray-400 mt-1">Porto Santo</p>
                                </div>
                            </div>
                            <div className="text-4xl font-light text-white">
                                17°
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Wind className="w-4 h-4 text-gray-500" />
                                    <span>15kt</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CloudSun className="w-4 h-4 text-gray-500" />
                                    <span>Limpo</span>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white transition-colors">
                                <ExternalLink className="w-5 h-5 rotate-90" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* External Links Section */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">LINKS EXTERNOS</h3>
                    <div className="bg-[#131b2e] rounded-3xl border border-white/5 overflow-hidden">
                        
                        <LinkItem 
                            icon={<Wind className="w-6 h-6 text-blue-400" />} 
                            title="Windy" 
                            subtitle="Previsão de vento" 
                            bg="bg-blue-500/10"
                        />
                         <LinkItem 
                            icon={<Waves className="w-6 h-6 text-teal-400" />} 
                            title="Windguru" 
                            subtitle="Previsão desportiva" 
                            bg="bg-teal-500/10"
                        />
                         <LinkItem 
                            icon={<PlaneLanding className="w-6 h-6 text-purple-400" />} 
                            title="METAR-TAF" 
                            subtitle="Boletins aeronáuticos" 
                            bg="bg-purple-500/10"
                        />
                         <LinkItem 
                            icon={<Globe className="w-6 h-6 text-orange-400" />} 
                            title="IPMA" 
                            subtitle="Instituto Português" 
                            bg="bg-orange-500/10"
                        />
                         <LinkItem 
                            icon={<Shield className="w-6 h-6 text-red-400" />} 
                            title="Proteção Civil da Madeira" 
                            subtitle="Alertas Madeira" 
                            bg="bg-red-500/10"
                            isLast
                        />

                    </div>
                </div>

                <div className="text-center mt-4 text-xs text-gray-600 font-medium">
                    Clima © 2025
                </div>

                {/* Bottom Spacer for scrolling comfortably */}
                <div className="h-4"></div>
            </div>
        </div>
    );
};

// --- Detailed Forecast Component ---

const DetailedForecast: React.FC<{ airportCode: 'PXO' | 'FNC' }> = ({ airportCode }) => {
    
    const airportName = airportCode === 'PXO' ? 'Porto Santo' : 'Madeira (FNC)';
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 2);
    const dayName = nextDay.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '').charAt(0).toUpperCase() + nextDay.toLocaleDateString('pt-PT', { weekday: 'short' }).slice(1);

    // Mock data based on airport
    const data = airportCode === 'PXO' ? [
        { label: 'Hoje', condition: 'PARCIALMENTE NUBLADO', icon: <CloudSun className="w-16 h-16 text-gray-400" />, max: '18°C', wind: '11 km/h', vis: '10km' },
        { label: 'Amanhã', condition: 'PARCIALMENTE NUBLADO', icon: <CloudSun className="w-16 h-16 text-gray-400" />, max: '17°C', wind: '7 km/h', vis: '9km' },
        { label: dayName, condition: 'CÉU LIMPO', icon: <Sun className="w-16 h-16 text-yellow-500" />, max: '18°C', wind: '9 km/h', vis: '>10km' },
    ] : [
        { label: 'Hoje', condition: 'CHUVA FRACA', icon: <CloudRain className="w-16 h-16 text-blue-400" />, max: '16°C', wind: '15 km/h', vis: '8km' },
        { label: 'Amanhã', condition: 'AGUACEIROS', icon: <CloudRain className="w-16 h-16 text-blue-300" />, max: '17°C', wind: '12 km/h', vis: '9km' },
        { label: dayName, condition: 'PARCIALMENTE NUBLADO', icon: <CloudSun className="w-16 h-16 text-gray-400" />, max: '19°C', wind: '8 km/h', vis: '>10km' },
    ];

    return (
        <div className="h-full bg-[#0a0e17] text-gray-100 p-8 overflow-y-auto">
             <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-bold uppercase tracking-wide">PREVISÃO METEOROLÓGICA (3 DIAS) - <span className="text-blue-500">{airportName}</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.map((day, idx) => (
                        <div key={idx} className="bg-[#131b2e] rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-between min-h-[400px] relative overflow-hidden group hover:bg-[#1a2333] transition-colors">
                             {/* Glow Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>

                            <div className="text-center z-10">
                                <h3 className="text-2xl font-bold text-white mb-2">{day.label}</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{day.condition}</p>
                            </div>

                            <div className="my-8 z-10 scale-125 transform transition-transform group-hover:scale-110">
                                {day.icon}
                            </div>

                            <div className="w-full space-y-4 z-10">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Thermometer className="w-4 h-4" />
                                        <span>Max</span>
                                    </div>
                                    <span className="font-bold text-white text-lg">{day.max}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Wind className="w-4 h-4" />
                                        <span>Vento</span>
                                    </div>
                                    <span className="font-bold text-white">{day.wind}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Eye className="w-4 h-4" />
                                        <span>Visibilidade</span>
                                    </div>
                                    <span className="font-bold text-white">{day.vis}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-blue-900/10 rounded-xl p-4 border border-blue-900/30 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-blue-400 text-sm mb-1">Nota Operacional</h4>
                        <p className="text-xs text-gray-400">
                            A previsão meteorológica é baseada em dados TAF/METAR. Para operações críticas, consulte sempre os boletins oficiais aeronáuticos atualizados no momento.
                        </p>
                    </div>
                </div>
             </div>
        </div>
    );
};

const LinkItem: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; bg: string; isLast?: boolean }> = ({ icon, title, subtitle, bg, isLast }) => (
    <div className={`p-4 flex items-center justify-between hover:bg-[#1a2333] transition-colors cursor-pointer group ${!isLast ? 'border-b border-white/5' : ''}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{title}</h4>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </div>
        <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
    </div>
);

export default WeatherView;