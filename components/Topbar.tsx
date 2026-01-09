import React, { useState, useEffect } from 'react';
import { Menu, Sun, Search, Plus, Bell, MessageCircle, ChevronDown, Moon } from 'lucide-react';
import { ViewState, UserProfile } from '../types';

interface TopbarProps {
    onToggleSidebar: () => void;
    darkMode?: boolean;
    toggleDarkMode?: () => void;
    onChangeView?: (view: ViewState) => void;
    user: UserProfile | null;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, darkMode, toggleDarkMode, onChangeView, user }) => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Bom dia');
        else if (hour >= 12 && hour < 20) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);

    return (
        <div className="px-8 pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-40 bg-[#0a0e17]">
            {/* Left Section: Giant Typography */}
            <div className="flex flex-col">
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
            <div className="bg-[#131b2e] p-1.5 pr-6 rounded-full border border-white/5 shadow-2xl flex items-center gap-5 self-start md:self-end">
                
                {/* Novo Button */}
                <button 
                    onClick={() => onChangeView?.('flight-form')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white pl-5 pr-4 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-900/40 group"
                >
                    <Plus className="w-5 h-5 stroke-[3]" />
                    Novo
                    <ChevronDown className="w-4 h-4 ml-1 opacity-70 group-hover:translate-y-0.5 transition-transform" />
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gray-700"></div>

                {/* Icons */}
                <div className="flex items-center gap-3">
                    {toggleDarkMode && (
                        <button 
                            onClick={toggleDarkMode}
                            className="text-gray-400 hover:text-white transition-colors"
                            title={darkMode ? "Modo Claro" : "Modo Escuro"}
                        >
                            {darkMode ? <Sun className="w-6 h-6 stroke-[1.5]" /> : <Moon className="w-6 h-6 stroke-[1.5]" />}
                        </button>
                    )}
                    
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <MessageCircle className="w-6 h-6 stroke-[1.5]" />
                    </button>

                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Search className="w-6 h-6 stroke-[1.5]" />
                    </button>

                    <button 
                        onClick={() => onChangeView?.('reminders')}
                        className="text-gray-400 hover:text-white transition-colors relative"
                    >
                        <Bell className="w-6 h-6 stroke-[1.5]" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#131b2e]"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Topbar;