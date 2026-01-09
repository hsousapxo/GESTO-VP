import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Search, Plus, Bell, ChevronDown, Moon, X, Plane, Calendar, FileText, BarChart, Map, Shield, Command, Archive, File } from 'lucide-react';
import { ViewState, UserProfile, FlightFormData } from '../types';
import { getFlights } from '../services/db';

interface TopbarProps {
    onToggleSidebar: () => void;
    darkMode?: boolean;
    toggleDarkMode?: () => void;
    onChangeView?: (view: ViewState) => void;
    user: UserProfile | null;
}

// Searchable items mapping (Navigation)
const NAV_ITEMS = [
    { label: 'Dashboard', view: 'dashboard' as ViewState, icon: <Shield className="w-4 h-4" />, keywords: ['home', 'inicio', 'geral'] },
    { label: 'Novo Voo', view: 'flight-form' as ViewState, icon: <Plus className="w-4 h-4" />, keywords: ['criar', 'registar', 'adicionar'] },
    { label: 'Voos Agendados', view: 'flight-list' as ViewState, icon: <Plane className="w-4 h-4" />, keywords: ['pesquisar', 'ver', 'tabela', 'lista'] },
    { label: 'Arquivo Voos', view: 'flight-archive' as ViewState, icon: <Archive className="w-4 h-4" />, keywords: ['antigos', 'passados', 'historico'] },
    { label: 'Radar de Voos', view: 'flight-tracker' as ViewState, icon: <Map className="w-4 h-4" />, keywords: ['mapa', 'live', 'rastreio'] },
    { label: 'Lembretes', view: 'reminders' as ViewState, icon: <Bell className="w-4 h-4" />, keywords: ['tarefas', 'avisos', 'agenda'] },
    { label: 'Estatísticas', view: 'statistics' as ViewState, icon: <BarChart className="w-4 h-4" />, keywords: ['graficos', 'analise', 'relatorios'] },
    { label: 'Modelos', view: 'templates' as ViewState, icon: <FileText className="w-4 h-4" />, keywords: ['docs', 'formularios', 'impressos'] },
    { label: 'Meteorologia', view: 'weather' as ViewState, icon: <Sun className="w-4 h-4" />, keywords: ['tempo', 'clima', 'previsao'] },
    { label: 'Calendário', view: 'calendar-monthly' as ViewState, icon: <Calendar className="w-4 h-4" />, keywords: ['mensal', 'agenda'] },
];

// Mock Data for Global Search (simulating data that exists in other components)
const MOCK_TEMPLATES = [
    { name: 'Modelo de Auto de Notícia', view: 'templates' },
    { name: 'Ficha de Passageiro (Manual)', view: 'templates' },
    { name: 'Termo de Responsabilidade', view: 'templates' },
    { name: 'Relatório de Ocorrência', view: 'templates' },
    { name: 'Requisição de Material', view: 'templates' },
    { name: 'Declaração de Entrada/Saída', view: 'templates' },
];

const MOCK_REMINDERS = [
    { subject: 'Verificar validade dos selos', view: 'reminders' },
    { subject: 'Chegada Cessna Citation', view: 'reminders' },
    { subject: 'Coordenação com a GNR', view: 'reminders' },
];

interface SearchResultItem {
    label: string;
    subLabel?: string;
    view: ViewState;
    icon: React.ReactNode;
    type: 'nav' | 'flight' | 'template' | 'reminder';
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, darkMode, toggleDarkMode, onChangeView, user }) => {
    const [greeting, setGreeting] = useState('');
    
    // UI States
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    
    // Data States
    const [flights, setFlights] = useState<FlightFormData[]>([]);

    // Refs for click outside
    const newMenuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Bom dia');
        else if (hour >= 12 && hour < 20) setGreeting('Boa tarde');
        else setGreeting('Boa noite');

        // Load Flights for search context
        getFlights().then(setFlights).catch(console.error);

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (newMenuRef.current && !newMenuRef.current.contains(event.target as Node)) {
                setIsNewMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            // Default to showing navigation items as "Quick Links" when empty but focused
            setSearchResults(NAV_ITEMS.map(item => ({
                ...item,
                subLabel: 'Menu',
                type: 'nav'
            })));
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        
        // 1. Filter Navigation
        const navResults: SearchResultItem[] = NAV_ITEMS.filter(item => 
            item.label.toLowerCase().includes(lowerQuery) || 
            item.keywords.some(k => k.includes(lowerQuery))
        ).map(item => ({ ...item, subLabel: 'Menu', type: 'nav' }));

        // 2. Filter Flights
        const flightResults: SearchResultItem[] = flights.filter(f => 
            f.flightNumber.toLowerCase().includes(lowerQuery) ||
            f.operator.toLowerCase().includes(lowerQuery) ||
            (f.origin && f.origin.toLowerCase().includes(lowerQuery)) ||
            (f.destination && f.destination.toLowerCase().includes(lowerQuery))
        ).map(f => ({
            label: f.flightNumber,
            subLabel: `${f.origin || '?'} ➔ ${f.destination || '?'} (${f.status})`,
            view: 'flight-list',
            icon: <Plane className="w-4 h-4" />,
            type: 'flight'
        }));

        // 3. Filter Templates
        const templateResults: SearchResultItem[] = MOCK_TEMPLATES.filter(t => 
            t.name.toLowerCase().includes(lowerQuery)
        ).map(t => ({
            label: t.name,
            subLabel: 'Documento',
            view: 'templates',
            icon: <File className="w-4 h-4" />,
            type: 'template'
        }));

        // 4. Filter Reminders
        const reminderResults: SearchResultItem[] = MOCK_REMINDERS.filter(r => 
            r.subject.toLowerCase().includes(lowerQuery)
        ).map(r => ({
            label: r.subject,
            subLabel: 'Lembrete',
            view: 'reminders',
            icon: <Bell className="w-4 h-4" />,
            type: 'reminder'
        }));

        setSearchResults([...navResults, ...flightResults, ...templateResults, ...reminderResults]);
    }, [searchQuery, flights]);

    const handleNavigate = (view: ViewState) => {
        onChangeView?.(view);
        setShowSearchResults(false);
        setSearchQuery('');
        setIsNewMenuOpen(false);
        setIsNotifOpen(false);
    };

    const getResultColor = (type: string) => {
        switch (type) {
            case 'flight': return 'text-blue-500';
            case 'template': return 'text-green-500';
            case 'reminder': return 'text-orange-500';
            default: return 'text-gray-400 dark:text-gray-500';
        }
    };

    return (
        <div className="px-8 pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-40 bg-[#0a0e17]">
            {/* Left Section: Giant Typography */}
            <div className="flex flex-col relative z-0">
                <div className="lg:hidden mb-4">
                     <button 
                        onClick={onToggleSidebar}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
                
                <div className="flex flex-col leading-[0.9]">
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                        {greeting}!
                    </h1>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-500 opacity-60 tracking-tight">
                        {user ? user.firstName : 'Utilizador'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-gray-400 font-medium tracking-wide">{user ? user.category : 'Agente'}</span>
                </div>
            </div>

            {/* Right Section: Floating Pill Action Bar */}
            <div className="bg-[#131b2e] p-1.5 pr-6 rounded-full border border-white/5 shadow-2xl flex items-center gap-5 self-start md:self-end relative z-50">
                
                {/* NOVO Button with Dropdown */}
                <div className="relative" ref={newMenuRef}>
                    <button 
                        onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white pl-5 pr-4 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-900/40 group"
                    >
                        <Plus className="w-5 h-5 stroke-[3]" />
                        Novo
                        <ChevronDown className={`w-4 h-4 ml-1 opacity-70 transition-transform duration-200 ${isNewMenuOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                    </button>

                    {isNewMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1a2333] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                            <button 
                                onClick={() => handleNavigate('flight-form')}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                            >
                                <Plane className="w-4 h-4 text-blue-500" />
                                Novo Voo
                            </button>
                            <button 
                                onClick={() => handleNavigate('reminders')}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700"
                            >
                                <Bell className="w-4 h-4 text-orange-500" />
                                Novo Lembrete
                            </button>
                        </div>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gray-700"></div>

                {/* Icons */}
                <div className="flex items-center gap-3">
                    
                    {/* Dark Mode Toggle */}
                    {toggleDarkMode && (
                        <button 
                            onClick={toggleDarkMode}
                            className="text-gray-400 hover:text-white transition-colors"
                            title={darkMode ? "Modo Claro" : "Modo Escuro"}
                        >
                            {darkMode ? <Sun className="w-6 h-6 stroke-[1.5]" /> : <Moon className="w-6 h-6 stroke-[1.5]" />}
                        </button>
                    )}
                    
                    {/* GLOBAL SEARCH BAR */}
                    <div className="relative" ref={searchRef}>
                        <div className={`flex items-center transition-all duration-300 ${showSearchResults || searchQuery ? 'w-56 md:w-80 bg-[#0a0e17] px-3 py-1.5 rounded-lg border border-gray-700 shadow-inner' : 'w-8'}`}>
                            <button 
                                onClick={() => {
                                    setShowSearchResults(!showSearchResults);
                                    if(!showSearchResults) setTimeout(() => document.getElementById('global-search')?.focus(), 100);
                                }}
                                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                title="Pesquisar..."
                            >
                                <Search className="w-6 h-6 stroke-[1.5]" />
                            </button>
                            {(showSearchResults || searchQuery) && (
                                <input
                                    id="global-search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Pesquisar voos, docs..."
                                    className="w-full bg-transparent border-none outline-none text-white text-sm ml-2 placeholder-gray-600"
                                    autoComplete="off"
                                />
                            )}
                            {(searchQuery && showSearchResults) && (
                                <button onClick={() => { setSearchQuery(''); document.getElementById('global-search')?.focus(); }} className="text-gray-500 hover:text-white ml-1">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchResults && (
                            <div className="absolute top-full right-0 mt-4 w-72 md:w-96 bg-white dark:bg-[#1a2333] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right z-[60]">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Command className="w-3 h-3" /> 
                                    {searchQuery ? 'Resultados' : 'Sugestões'}
                                </div>
                                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => handleNavigate(item.view)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-blue-500/10 flex items-start gap-3 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 group"
                                            >
                                                <div className={`mt-0.5 ${getResultColor(item.type)}`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400">
                                                        {item.label}
                                                    </p>
                                                    {item.subLabel && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {item.subLabel}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-sm text-gray-500">
                                            <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            Nenhum resultado encontrado para "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notifications (Bell) */}
                    <div className="relative" ref={notifRef}>
                        <button 
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="text-gray-400 hover:text-white transition-colors relative block"
                        >
                            <Bell className="w-6 h-6 stroke-[1.5]" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#131b2e]"></span>
                        </button>

                        {isNotifOpen && (
                            <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-[#1a2333] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-black/20 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700 dark:text-white">Próximos Eventos</span>
                                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">3 Novos</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {/* Mock Notification Items */}
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleNavigate('reminders')}>
                                        <div className="flex gap-3">
                                            <div className="w-2 h-2 mt-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Verificar Validade Selos</p>
                                                <p className="text-xs text-gray-500 mt-1">Lembrete - Hoje, 14:30</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleNavigate('flight-tracker')}>
                                        <div className="flex gap-3">
                                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Chegada TP1699</p>
                                                <p className="text-xs text-gray-500 mt-1">Voo - Estimado 15:45</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleNavigate('statistics')}>
                                        <div className="flex gap-3">
                                            <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Relatório Turno Pendente</p>
                                                <p className="text-xs text-gray-500 mt-1">Sistema - Ação necessária</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleNavigate('reminders')}
                                    className="w-full py-3 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Ver Todos os Lembretes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;