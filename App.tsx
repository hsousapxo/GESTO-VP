
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';
import FlightForm from './components/FlightForm';
import FlightList from './components/FlightList';
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
import { ViewState, UserProfile, FlightFormData } from './types';
import { FileText, Download, Activity, Globe, FileSpreadsheet, Library, BookOpen } from 'lucide-react';

const GenericReportPlaceholder: React.FC<{ title: string, icon: React.ReactNode }> = ({ title, icon }) => (
    <div className="p-12 flex flex-col items-center justify-center h-full text-center">
        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
            {icon}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-500 max-w-md mb-8">Esta secção permite a gestão e descarga dos modelos oficiais do relatório {title.toLowerCase()}.</p>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-50 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/40">
            <Download className="w-5 h-5" />
            DESCARREGAR MODELO
        </button>
    </div>
);

const LegalLibraryView: React.FC = () => (
    <div className="p-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Library className="w-8 h-8" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">Livraria Jurídica</h2>
                <p className="text-gray-500">Doutrina, Jurisprudência e Manuais de Apoio à Decisão</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#131b2e] p-6 rounded-[24px] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                <BookOpen className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-2">Manual de Direito de Fronteiras</h3>
                <p className="text-sm text-gray-500 mb-6">Guia completo sobre a aplicação do Código de Fronteiras Schengen e legislação nacional.</p>
                <button className="text-xs font-bold text-blue-400 flex items-center gap-2">LER DOCUMENTO <Download className="w-3 h-3" /></button>
            </div>
            
            <div className="bg-[#131b2e] p-6 rounded-[24px] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                <FileText className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-2">Pareceres Jurídicos (DSAM)</h3>
                <p className="text-sm text-gray-500 mb-6">Compilação de pareceres técnicos sobre casos complexos de inadmissibilidade e vistos.</p>
                <button className="text-xs font-bold text-purple-400 flex items-center gap-2">ACEDER ARQUIVO <Download className="w-3 h-3" /></button>
            </div>
        </div>
    </div>
);

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
    
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard onChangeView={setCurrentView} />;
            case 'flight-form': return <FlightForm initialData={editingFlight} onClear={handleClearEdit} currentUser={user} />;
            case 'flight-list': return <FlightList onEdit={handleEditFlight} title="Voos Agendados" />;
            case 'flight-archive': return <FlightList onEdit={handleEditFlight} title="Arquivo de Voos" />;
            case 'flight-tracker': return <FlightTracker />;
            case 'statistics': return <StatisticsView />;
            case 'statistics-weekly': return <WeeklyStatisticsView />;
            case 'statistics-monthly': return <MonthlyStatisticsView />;
            case 'report-pulsar': return <GenericReportPlaceholder title="Relatório Pulsar" icon={<Activity className="w-10 h-10" />} />;
            case 'report-eurosur': return <GenericReportPlaceholder title="Relatório Eurosur" icon={<Globe className="w-10 h-10" />} />;
            case 'report-ramfa': return <GenericReportPlaceholder title="Relatório RAMFA" icon={<FileSpreadsheet className="w-10 h-10" />} />;
            case 'ai-assistant': return <AiAssistant />;
            case 'ai-image-editor': return <AiImageEditor />;
            case 'weather': return <WeatherView />;
            case 'weather-alerts': return <WeatherAlertsView />;
            case 'weather-pxo': return <WeatherView airportCode="PXO" />;
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
