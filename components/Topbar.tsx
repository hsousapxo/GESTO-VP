import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Search, Plus, BellRing, UserCircle } from 'lucide-react';
import { ViewState, UserProfile } from '../types';

interface TopbarProps {
    onToggleSidebar: () => void;
    darkMode?: boolean;
    toggleDarkMode?: () => void;
    onChangeView?: (view: ViewState) => void;
    user: UserProfile | null;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, darkMode, toggleDarkMode, onChangeView, user }) => {
    const [time, setTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        
        // Calculate greeting
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Bom dia');
        else if (hour >= 12 && hour < 20) setGreeting('Boa tarde');
        else setGreeting('Boa noite');

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center shadow-sm z-40 sticky top-0 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700">
            {/* Left Section: Toggle & User Info */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onToggleSidebar}
                        className="lg:hidden text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex w-10 h-10 bg-primary/10 dark:bg-blue-900/30 rounded-full items-center justify-center text-primary dark:text-blue-400">
                            <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-xl font-bold text-primary dark:text-blue-400 flex items-center gap-1">
                                {greeting}! <span className="text-gray-800 dark:text-gray-100">{user ? `${user.firstName} ${user.lastName}` : 'Utilizador'}</span>
                            </h1>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                {user ? user.category : 'Não autenticado'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions & Stats */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-500 focus:border-primary dark:focus:border-blue-500 sm:text-sm transition-colors"
                        placeholder="Pesquisar..."
                    />
                </div>

                {/* Quick Actions Buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button 
                        onClick={() => onChangeView?.('flight-form')}
                        className="flex items-center gap-1 bg-primary dark:bg-blue-600 hover:bg-secondary dark:hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        title="Novo Voo"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Voo</span>
                    </button>
                    
                    <button 
                        onClick={() => onChangeView?.('reminders')}
                        className="flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        title="Novo Lembrete"
                    >
                        <BellRing className="w-4 h-4" />
                        <span className="hidden sm:inline">Lembrete</span>
                    </button>
                </div>

                {/* System Info */}
                <div className="hidden md:flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-600">
                     {toggleDarkMode && (
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                            title={darkMode ? "Modo Claro" : "Modo Escuro"}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}
                    
                    <div className="text-xl font-bold text-primary dark:text-blue-400">
                        {time.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;