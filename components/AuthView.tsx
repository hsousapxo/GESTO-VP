import React, { useState } from 'react';
import { Shield, User, Briefcase, ArrowRight, Lock, Sun, Moon } from 'lucide-react';
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
            onLogin({
                firstName,
                lastName,
                category
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0 opacity-10">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center"></div>
                 <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
            </div>

            {/* Dark Mode Toggle */}
            {toggleDarkMode && (
                <button 
                    onClick={toggleDarkMode}
                    className="absolute top-6 right-6 z-50 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg backdrop-blur-sm hover:scale-105 transition-transform text-primary dark:text-blue-400"
                    title="Alternar Tema"
                >
                    {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-300 transition-colors">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-primary dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 transform rotate-3 transition-colors">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary dark:text-blue-400 text-center transition-colors">GESTO VP</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">ESACFPS / DSAM - PF008</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Nome</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Primeiro Nome"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-primary outline-none transition-all dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Apelido</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Último Nome"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-primary outline-none transition-all dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Categoria / Posto</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-primary outline-none transition-all appearance-none dark:text-white"
                                >
                                    <option value="Agente Estagiário">Agente Estagiário</option>
                                    <option value="Agente">Agente</option>
                                    <option value="Agente Principal">Agente Principal</option>
                                    <option value="Agente Coordenador">Agente Coordenador</option>
                                    <option value="Chefe de Equipa">Chefe de Equipa</option>
                                    <option value="Comissário">Comissário</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-primary dark:bg-blue-600 hover:bg-secondary dark:hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-6"
                    >
                        <Lock className="w-4 h-4" />
                        <span>Iniciar Turno</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Sistema Seguro de Controlo de Fronteira Aérea v1.2
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthView;