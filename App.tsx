
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';
import FlightForm from './components/FlightForm';
import FlightList from './components/FlightList';
import FlightArchiveAnnual from './components/FlightArchiveAnnual';
import AiAssistant from './components/AiAssistant';
import AiImageEditor from './components/AiImageEditor';
import TemplatesView from './components/TemplatesView';
import LegislationView from './components/LegislationView';
import ProceduresView from './components/ProceduresView';
import CalendarMonthlyView from './components/CalendarMonthlyView';
import CalendarAnnualView from './components/CalendarAnnualView';
import RemindersView from './components/RemindersView';
import FlightTracker from './components/FlightTracker';
import StatisticsView from './components/StatisticsView';
import WeeklyStatisticsView from './components/WeeklyStatisticsView';
import MonthlyStatisticsView from './components/MonthlyStatisticsView';
import WeatherView from './components/clima/WeatherView';
import WeatherAlertsView from './components/clima/WeatherAlertsView';
import ContactsView from './components/ContactsView';
import EmailReportView from './components/EmailReportView';
import { ViewState, UserProfile, FlightFormData } from './types';
import { 
    FileText, 
    Download, 
    Activity, 
    Globe, 
    FileSpreadsheet, 
    Library, 
    BookOpen, 
    ChevronRight, 
    Flag, 
    Lock, 
    Search as SearchIcon,
    Stamp,
    ClipboardCheck,
    Hand,
    FileWarning,
    Baby,
    Mail,
    ShieldAlert,
    UserX,
    ClipboardEdit,
    PieChart,
    Hash
} from 'lucide-react';

const GenericReportPlaceholder: React.FC<{ title: string, icon: React.ReactNode }> = ({ title, icon }) => (
    <div className="p-12 flex flex-col items-center justify-center h-full text-center">
        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
            {icon}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-500 max-w-md mb-8">Esta secção permite a gestão e consulta do documento {title.toLowerCase()}.</p>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-50 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/40">
            <Download className="w-5 h-5" />
            DESCARREGAR MODELO
        </button>
    </div>
);

const LegalLibraryView: React.FC = () => {
    const categories = [
        {
            id: 'europeia',
            title: 'Europeia',
            docsCount: 5,
            description: 'Legislação e tratados da União Europeia, incluindo regulamentos, diretivas e decisões que regulam o funcionamento da UE e os direitos dos cidadãos europeus.',
            icon: <Globe className="w-6 h-6" />
        },
        {
            id: 'nacional',
            title: 'Nacional',
            docsCount: 5,
            description: 'Legislação portuguesa fundamental, incluindo a Constituição, códigos civis, penais e processuais que regulam o funcionamento da ordem jurídica nacional.',
            icon: <Flag className="w-6 h-6" />
        },
        {
            id: 'rgpd',
            title: 'RGPD',
            docsCount: 5,
            description: 'Regulamento Geral de Proteção de Dados e legislação relacionada sobre privacidade, tratamento de dados pessoais e direitos dos titulares de dados.',
            icon: <Lock className="w-6 h-6" />
        },
        {
            id: 'aima',
            title: 'AIMA',
            docsCount: 5,
            description: 'Agência para a Integração, Migrações e Asilo - Legislação sobre entrada, permanência e saída de estrangeiros, asilo e direitos dos migrantes.',
            icon: <SearchIcon className="w-6 h-6" />
        }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Legislação</h1>
                <p className="text-gray-400 font-bold text-sm tracking-wide">Selecione uma categoria</p>
            </div>

            <div className="flex flex-col gap-5">
                {categories.map((cat) => (
                    <div 
                        key={cat.id} 
                        className="bg-[#131b2e] p-6 rounded-[24px] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col gap-4 shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white leading-none">{cat.title}</h3>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">
                                        {cat.docsCount} documentos
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            {cat.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="h-20"></div>
        </div>
    );
};

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [editingFlight, setEditingFlight] = useState<FlightFormData | null>(null);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('pf008_user');
        if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch (e) { console.error("Failed to parse user", e); } }
    }, []);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const handleLogin = (newUser: UserProfile) => { setUser(newUser); localStorage.setItem('pf008_user', JSON.stringify(newUser)); };
    const handleLogout = () => { if (window.confirm("Tem a certeza que deseja terminar a sessão?")) { setUser(null); localStorage.removeItem('pf008_user'); setCurrentView('dashboard'); } };
    const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    
    const handleEditFlight = (flight: FlightFormData) => { setEditingFlight(flight); setCurrentView('flight-form'); };
    const handleClearEdit = () => { setEditingFlight(null); };
    const handleFlightSaved = () => { setEditingFlight(null); setCurrentView('flight-list'); };
    
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard onChangeView={setCurrentView} />;
            case 'flight-form': return <FlightForm initialData={editingFlight} onClear={handleClearEdit} onSaved={handleFlightSaved} currentUser={user} />;
            case 'flight-list': return <FlightList onEdit={handleEditFlight} title="Voos Agendados" />;
            case 'flight-archive': return <FlightArchiveAnnual />;
            case 'flight-tracker': return <FlightTracker />;
            case 'statistics': return <StatisticsView />;
            case 'statistics-weekly': return <WeeklyStatisticsView />;
            case 'statistics-monthly': return <MonthlyStatisticsView />;
            case 'statistics-annual': return <GenericReportPlaceholder title="Comparativo Anual" icon={<PieChart className="w-10 h-10" />} />;
            case 'report-pulsar': return <GenericReportPlaceholder title="Relatório Pulsar" icon={<Activity className="w-10 h-10" />} />;
            case 'report-eurosur': return <GenericReportPlaceholder title="Relatório Eurosur" icon={<Globe className="w-10 h-10" />} />;
            case 'report-ramfa': return <GenericReportPlaceholder title="Relatório RAMFA" icon={<FileSpreadsheet className="w-10 h-10" />} />;
            
            // Novos Modelos e Formulários
            case 'template-infocest': return <GenericReportPlaceholder title="Modelos Infocest" icon={<FileText className="w-10 h-10" />} />;
            case 'template-carimbos': return <GenericReportPlaceholder title="Modelo Carimbos" icon={<Stamp className="w-10 h-10" />} />;
            case 'template-decl-entrada': return <GenericReportPlaceholder title="Modelo Declaração de Entrada" icon={<ClipboardCheck className="w-10 h-10" />} />;
            case 'template-intercecoes': return <GenericReportPlaceholder title="Modelo Interceções" icon={<Hand className="w-10 h-10" />} />;
            case 'template-notif-abandono': return <GenericReportPlaceholder title="Modelo Abandono Voluntário" icon={<FileWarning className="w-10 h-10" />} />;
            
            // Novos Procedimentos Operacionais
            case 'proc-menores': return <GenericReportPlaceholder title="Controlo de Menores" icon={<Baby className="w-10 h-10" />} />;
            case 'proc-emails': return <GenericReportPlaceholder title="Envio de Emails" icon={<Mail className="w-10 h-10" />} />;
            case 'email-pulsar': return <EmailReportView type="pulsar" />;
            case 'email-ramfa': return <EmailReportView type="ramfa" />;
            case 'email-turno': return <EmailReportView type="turno" />;
            case 'proc-intercecoes': return <GenericReportPlaceholder title="Interceções" icon={<ShieldAlert className="w-10 h-10" />} />;
            case 'proc-cod-intercecao': return <GenericReportPlaceholder title="Códigos de Interceção" icon={<Hash className="w-10 h-10" />} />;
            case 'proc-extravio': return <GenericReportPlaceholder title="Extravio Passaporte" icon={<FileWarning className="w-10 h-10" />} />;
            case 'proc-recusa': return <GenericReportPlaceholder title="Recusa de Entrada" icon={<UserX className="w-10 h-10" />} />;
            case 'proc-decl-entrada': return <GenericReportPlaceholder title="Declaração de Entrada" icon={<ClipboardEdit className="w-10 h-10" />} />;

            case 'ai-assistant': return <AiAssistant />;
            case 'ai-image-editor': return <AiImageEditor />;
            case 'weather': return <WeatherView />;
            case 'weather-alerts': return <WeatherAlertsView />;
            // Fixed: removed duplicate airportCode attribute
            case 'weather-pxo': return <WeatherView airportCode="PXO" />;
            // Fixed: removed duplicate airportCode attribute
            case 'weather-fnc': return <WeatherView airportCode="FNC" />;
            case 'templates': return <TemplatesView />;
            case 'legislation': return <LegislationView />;
            case 'legal-library': return <LegalLibraryView />;
            case 'procedures': return <ProceduresView />;
            case 'calendar-monthly': return <CalendarMonthlyView />;
            case 'calendar-annual': return <CalendarAnnualView />;
            case 'reminders': return <RemindersView />;
            case 'contacts': return <ContactsView onChangeView={setCurrentView} />;
            default: return <Dashboard onChangeView={setCurrentView} />;
        }
    };

    if (!user) return <AuthView onLogin={handleLogin} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0e17] text-white font-sans transition-all">
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <Sidebar isOpen={sidebarOpen} currentView={currentView} onChangeView={(view) => { setCurrentView(view); setSidebarOpen(false); if (view !== 'flight-form') setEditingFlight(null); }} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0a0e17]">
                <Topbar onToggleSidebar={handleToggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} onChangeView={setCurrentView} user={user} />
                <main className="flex-1 overflow-y-auto custom-scrollbar">{renderContent()}</main>
            </div>
        </div>
    );
}

export default App;
