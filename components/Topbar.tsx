
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Search, Plus, Bell, ChevronDown, Moon, X, Plane, Shield, Command, Archive, FileText, LayoutGrid, Calendar, LogOut } from 'lucide-react';
import { ViewState, UserProfile, FlightFormData, Reminder } from '../types';
import { getFlights, getReminders } from '../services/db';

interface TopbarProps {
    onToggleSidebar: () => void;
    darkMode?: boolean;
    toggleDarkMode?: () => void;
    onChangeView?: (view: ViewState) => void;
    user: UserProfile | null;
    onLogout?: () => void;
}

interface SearchResult {
    id: string;
    type: 'nav' | 'flight' | 'reminder' | 'doc';
    title: string;
    subtitle: string;
    view?: ViewState;
    data?: any;
}

const NAV_ITEMS: { label: string; view: ViewState; keywords: string }[] = [
    { label: 'Dashboard', view: 'dashboard', keywords: 'home inicio resumo' },
    { label: 'Novo Voo', view: 'flight-form', keywords: 'criar adicionar registo' },
    { label: 'Lista de Voos', view: 'flight-list', keywords: 'consultar ver lista' },
    { label: 'Assistente IA', view: 'ai-assistant', keywords: 'gemini chat ajuda' },
    { label: 'Editor Imagem', view: 'ai-image-editor', keywords: 'foto ocr editar' },
    { label: 'Meteorologia', view: 'weather', keywords: 'tempo clima vento chuva' },
    { label: 'Lembretes', view: 'reminders', keywords: 'tarefas avisos' },
    { label: 'Contactos', view: 'contacts', keywords: 'lista telefones emails' },
    { label: 'Arquivo Anual', view: 'flight-archive', keywords: 'historico antigo' },
    { label: 'Relatório Semanal', view: 'statistics-weekly', keywords: 'stats estatisticas' },
    { label: 'Radar', view: 'flight-tracker', keywords: 'mapa localizacao' },
];

const DOC_ITEMS = [
    { name: 'Modelo Auto Notícia', view: 'templates' },
    { name: 'Declaração Entrada', view: 'template-decl-entrada' },
    { name: 'Relatório Turno', view: 'email-turno' },
    { name: 'Lei 23/2007', view: 'legislation' },
    { name: 'Código Schengen', view: 'legislation' },
];

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, darkMode, toggleDarkMode, onChangeView, user, onLogout }) => {
    const [greeting, setGreeting] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Bom dia');
        else if (hour >= 12 && hour < 20) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Search Logic
    useEffect(() => {
        const performSearch = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            const term = searchQuery.toLowerCase();
            const results: SearchResult[] = [];

            // 1. Navigation
            NAV_ITEMS.forEach(item => {
                if (item.label.toLowerCase().includes(term) || item.keywords.includes(term)) {
                    results.push({
                        id: `nav-${item.view}`,
                        type: 'nav',
                        title: item.label,
                        subtitle: 'Ir para secção',
                        view: item.view
                    });
                }
            });

            // 2. Documents (Static)
            DOC_ITEMS.forEach((doc, idx) => {
                if (doc.name.toLowerCase().includes(term)) {
                    results.push({
                        id: `doc-${idx}`,
                        type: 'doc',
                        title: doc.name,
                        subtitle: 'Documento / Modelo',
                        view: doc.view as ViewState
                    });
                }
            });

            try {
                // 3. Flights (DB)
                const flights = await getFlights();
                const matchedFlights = flights.filter(f => 
                    f.flightNumber.toLowerCase().includes(term) || 
                    f.operator.toLowerCase().includes(term) ||
                    f.origin.toLowerCase().includes(term) ||
                    f.destination.toLowerCase().includes(term)
                ).slice(0, 3);

                matchedFlights.forEach(f => {
                    results.push({
                        id: f.id!,
                        type: 'flight',
                        title: `Voo ${f.flightNumber}`,
                        subtitle: `${f.origin} -> ${f.destination} (${f.dateArrival || f.dateDeparture})`,
                        view: 'flight-list', // Ideally direct to detail, but list filters
                        data: f
                    });
                });

                // 4. Reminders (DB)
                const reminders = await getReminders();
                const matchedReminders = reminders.filter(r => 
                    r.subject.toLowerCase().includes(term) && !r.completed
                ).slice(0, 3);

                matchedReminders.forEach(r => {
                    results.push({
                        id: r.id,
                        type: 'reminder',
                        title: r.subject,
                        subtitle: `Lembrete: ${new Date(r.date).toLocaleDateString()}`,
                        view: 'reminders'
                    });
                });

            } catch (error) {
                console.error("Search error", error);
            }

            setSearchResults(results);
        };

        const timeoutId = setTimeout(performSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleResultClick = (result: SearchResult) => {
        if (onChangeView && result.view) {
            onChangeView(result.view);
        }
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'nav': return <LayoutGrid className="w-4 h-4 text-blue-500" />;
            case 'flight': return <Plane className="w-4 h-4 text-emerald-500" />;
            case 'reminder': return <Bell className="w-4 h-4 text-red-500" />;
            case 'doc': return <FileText className="w-4 h-4 text-orange-500" />;
            default: return <Search className="w-4 h-4" />;
        }
    };

    return (
        <div className="px-8 pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-40 bg-gray-50 dark:bg-[#0a0e17] transition-colors duration-300 relative">
            <div className="flex flex-col relative z-0 flex-1 w-full max-w-2xl">
                <div className="lg:hidden mb-4">
                     <button 
                        onClick={onToggleSidebar}
                        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                    >
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
                
                {isSearchOpen ? (
                    <div className="relative w-full animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="relative">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary dark:text-blue-400" />
                            <input 
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                                placeholder="Pesquisar voos, funções ou documentos..."
                                className="w-full bg-transparent border-b-2 border-primary dark:border-blue-400 text-3xl md:text-4xl font-black text-primary dark:text-white placeholder-gray-300 dark:placeholder-gray-700 outline-none py-2 pl-12 pr-12"
                            />
                            <button 
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {searchQuery && (
                            <div className="absolute top-full left-0 w-full mt-4 bg-white dark:bg-[#131b2e] rounded-[24px] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-50">
                                {searchResults.length > 0 ? (
                                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleResultClick(result)}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0 text-left group"
                                            >
                                                <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                                                    {getTypeIcon(result.type)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{result.title}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                                                </div>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Command className="w-4 h-4 text-gray-300" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <p className="text-sm font-bold">Sem resultados encontrados</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col leading-[0.9] animate-in fade-in duration-300">
                        <h1 className="text-5xl md:text-6xl font-black text-primary dark:text-white tracking-tighter">
                            {greeting},
                        </h1>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-300 dark:text-gray-500 opacity-60 tracking-tighter">
                            {user ? user.firstName : 'Agente'}
                        </h1>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                            <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">{user ? user.category : 'Operacional'}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-[#131b2e] p-1.5 pr-6 rounded-full border border-gray-200 dark:border-white/5 shadow-lg dark:shadow-2xl flex items-center gap-5 self-start md:self-end transition-colors flex-shrink-0">
                <div className="relative">
                    <button 
                        onClick={() => onChangeView?.('flight-form')}
                        className="flex items-center gap-2 bg-primary dark:bg-blue-600 hover:bg-secondary dark:hover:bg-blue-500 text-white pl-5 pr-4 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 group whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        Novo Voo
                    </button>
                </div>

                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={`text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 ${isSearchOpen ? 'bg-gray-100 dark:bg-white/10 text-primary dark:text-white' : ''}`}
                        title="Pesquisar"
                    >
                        <Search className="w-6 h-6 stroke-[1.5]" />
                    </button>

                    <button 
                        onClick={toggleDarkMode}
                        className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                        title={darkMode ? "Modo Claro" : "Modo Escuro"}
                    >
                        {darkMode ? <Sun className="w-6 h-6 stroke-[1.5]" /> : <Moon className="w-6 h-6 stroke-[1.5]" />}
                    </button>
                    
                    <button 
                        onClick={() => onChangeView?.('reminders')}
                        className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 relative"
                    >
                        <Bell className="w-6 h-6 stroke-[1.5]" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#131b2e]"></span>
                    </button>

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                    <button 
                        onClick={onLogout}
                        className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Sair / Terminar Sessão"
                    >
                        <LogOut className="w-6 h-6 stroke-[1.5]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
