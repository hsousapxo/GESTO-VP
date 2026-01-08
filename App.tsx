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
import { ViewState, UserProfile, FlightFormData } from './types';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [editingFlight, setEditingFlight] = useState<FlightFormData | null>(null);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // Load user from local storage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('pf008_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const handleLogin = (newUser: UserProfile) => {
        setUser(newUser);
        localStorage.setItem('pf008_user', JSON.stringify(newUser));
    };

    const handleLogout = () => {
        if (window.confirm("Tem a certeza que deseja terminar a sessão?")) {
            setUser(null);
            localStorage.removeItem('pf008_user');
            setCurrentView('dashboard'); // Reset view
        }
    };

    const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    
    // Handler to switch to edit mode
    const handleEditFlight = (flight: FlightFormData) => {
        setEditingFlight(flight);
        setCurrentView('flight-form');
    };

    const handleClearEdit = () => {
        setEditingFlight(null);
    };
    
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard onChangeView={setCurrentView} />;
            case 'flight-form':
                return <FlightForm initialData={editingFlight} onClear={handleClearEdit} />;
            case 'flight-list':
                return <FlightList onEdit={handleEditFlight} />;
            case 'flight-tracker':
                return <FlightTracker />;
            case 'ai-assistant':
                return <AiAssistant />;
            case 'ai-image-editor':
                return <AiImageEditor />;
            case 'templates':
                return <TemplatesView />;
            case 'legislation':
                return <LegislationView />;
            case 'procedures':
                return <ProceduresView />;
            case 'calendar-monthly':
                return <CalendarMonthlyView />;
            case 'calendar-annual':
                return <CalendarAnnualView />;
            case 'reminders':
                return <RemindersView />;
            default:
                return <Dashboard onChangeView={setCurrentView} />;
        }
    };

    // If no user is logged in, show AuthView
    if (!user) {
        return (
            <div className={darkMode ? 'dark' : ''}>
                <AuthView onLogin={handleLogin} />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            <Sidebar 
                isOpen={sidebarOpen} 
                currentView={currentView}
                onChangeView={(view) => {
                    setCurrentView(view);
                    setSidebarOpen(false); // Close on mobile after selection
                    if (view !== 'flight-form') setEditingFlight(null);
                }}
                onLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar 
                    onToggleSidebar={handleToggleSidebar} 
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    onChangeView={setCurrentView}
                    user={user}
                />
                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default App;