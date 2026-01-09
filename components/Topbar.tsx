
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Search, Plus, Bell, ChevronDown, Moon, X, Plane, Shield, Command, Archive } from 'lucide-react';
import { ViewState, UserProfile, FlightFormData } from '../types';
import { getFlights } from '../services/db';

interface TopbarProps {
    onToggleSidebar: () => void;
    darkMode?: boolean;
    toggleDarkMode?: () => void;
    onChangeView?: (view: ViewState) => void;
    user: UserProfile | null;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, darkMode, toggleDarkMode, onChangeView, user }) => {
    const [greeting, setGreeting] = useState('');
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
    
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Bom dia');
        else if (hour >= 12 && hour < 20) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);

    return (
        <div className="px-8 pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-40 bg-gray-50 dark:bg-[#0a0e17] transition-colors duration-300">
            <div className="flex flex-col relative z-0">
                <div className="lg:hidden mb-4">
                     <button 
                        onClick={onToggleSidebar}
                        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                    >
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
                
                <div className="flex flex-col leading-[0.9]">
                    <h1 className="text-5xl md:text-6xl font-black text-primary dark:text-white tracking-tighter">
                        {greeting},
                    </h1>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-300 dark:text-gray-500 opacity-60 tracking-tighter">
                        {user ? user.firstName : 'Agente'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">{user ? user.category : 'Operacional'}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-[#131b2e] p-1.5 pr-6 rounded-full border border-gray-200 dark:border-white/5 shadow-lg dark:shadow-2xl flex items-center gap-5 self-start md:self-end transition-colors">
                <div className="relative">
                    <button 
                        onClick={() => onChangeView?.('flight-form')}
                        className="flex items-center gap-2 bg-primary dark:bg-blue-600 hover:bg-secondary dark:hover:bg-blue-500 text-white pl-5 pr-4 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 group"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        Novo Voo
                    </button>
                </div>

                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

                <div className="flex items-center gap-3">
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
                </div>
            </div>
        </div>
    );
};

export default Topbar;
