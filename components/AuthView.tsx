
import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthViewProps {
    onLogin: (user: UserProfile) => void;
    darkMode?: boolean;
    toggleDarkMode?: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, darkMode, toggleDarkMode }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [category, setCategory] = useState('Agente');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (firstName.trim() && lastName.trim()) {
            onLogin({ firstName, lastName, category });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e17] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 font-sans">
            <button 
                onClick={toggleDarkMode}
                className="absolute top-6 right-6 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-primary dark:text-blue-400 transition-all hover:scale-110"
            >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <div className="bg-white dark:bg-[#111827] rounded-[32px] shadow-2xl w-full max-w-md p-8 relative z-10 border border-gray-200 dark:border-white/5 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-primary dark:bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 transform rotate-3">
                        <Shield className="w-10 h-10 text-white -rotate-3" />
                    </div>
                    <h1 className="text-3xl font-black text-primary dark:text-white tracking-tighter">GESTO VP</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Porto Santo • PF008</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Nome</label>
                                <input 
                                    type="text" 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Ex: Pedro"
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Apelido</label>
                                <input 
                                    type="text" 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Ex: Santos"
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Categoria / Posto</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white font-bold appearance-none cursor-pointer"
                            >
                                <option value="Agente">Agente</option>
                                <option value="Agente Principal">Agente Principal</option>
                                <option value="Agente Coordenador">Agente Coordenador</option>
                                <option value="Chefe de Equipa">Chefe de Equipa</option>
                                <option value="Comissário">Comissário</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-secondary dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-sm tracking-[0.2em]"
                    >
                        <Lock className="w-5 h-5" />
                        Aceder ao Sistema
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        v1.2.0 • Border Control Infrastructure
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthView;
