import React, { useState } from 'react';
import { 
    Search, 
    MessageSquare, 
    Contact, 
    Eye, 
    Award, 
    Briefcase, 
    Headphones, 
    ShoppingBag, 
    UserCog, 
    Users, 
    Shield, 
    Contact as IdCard, 
    PlusCircle, 
    Flame, 
    UserCheck,
    ChevronLeft,
    X
} from 'lucide-react';
import { ViewState } from '../types';

interface ContactCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

interface ContactEntry {
    name: string;
    role: string;
    phone: string;
    ext?: string;
    category: string;
}

const CATEGORIES: ContactCategory[] = [
    { id: 'fap', label: 'FAP', icon: <Award className="w-6 h-6" />, color: 'text-blue-400 bg-blue-500/10' },
    { id: 'ata', label: 'ATA', icon: <Briefcase className="w-6 h-6" />, color: 'text-purple-400 bg-purple-500/10' },
    { id: 'scli', label: 'SCLI', icon: <Headphones className="w-6 h-6" />, color: 'text-blue-300 bg-blue-400/10' },
    { id: 'menzies', label: 'MENZIES', icon: <ShoppingBag className="w-6 h-6" />, color: 'text-red-400 bg-red-500/10' },
    { id: 'tme', label: 'TME', icon: <UserCog className="w-6 h-6" />, color: 'text-cyan-400 bg-cyan-500/10' },
    { id: 'sp', label: 'SP', icon: <Users className="w-6 h-6" />, color: 'text-teal-400 bg-teal-500/10' },
    { id: 'esacfps', label: 'ESACFPS', icon: <Shield className="w-6 h-6" />, color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'pf004', label: 'PF004/DSAM', icon: <IdCard className="w-6 h-6" />, color: 'text-gray-300 bg-gray-500/10' },
    { id: 'csps', label: 'CSPS', icon: <PlusCircle className="w-6 h-6" />, color: 'text-green-400 bg-green-500/10' },
    { id: 'bvps', label: 'BVPS', icon: <Flame className="w-6 h-6" />, color: 'text-orange-400 bg-orange-500/10' },
    { id: 'dir', label: 'Dir. Aeroporto', icon: <UserCheck className="w-6 h-6" />, color: 'text-yellow-400 bg-yellow-500/10' },
];

const ContactsView: React.FC<{ onChangeView: (view: ViewState) => void }> = ({ onChangeView }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredCategories = CATEGORIES.filter(cat => 
        cat.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full bg-[#0a0e17] text-white flex flex-col relative overflow-hidden font-sans">
            {/* Header / Search */}
            <div className="p-6 pt-8 pb-4">
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pesquisar..." 
                        className="w-full bg-[#161e2e] border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar">
                {selectedCategory ? (
                    <div className="max-w-2xl mx-auto mt-4">
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className="flex items-center gap-2 text-blue-400 font-bold mb-6 hover:underline"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Voltar
                        </button>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-400 mb-6">
                                {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                            </h2>
                            {/* Mock Contacts for demonstration */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-[#131b2e] p-5 rounded-3xl border border-white/5 flex justify-between items-center group hover:bg-[#1a2333] transition-colors">
                                    <div>
                                        <p className="font-bold text-lg text-white">Contacto Exemplo {i}</p>
                                        <p className="text-sm text-gray-400">Responsável de Turno</p>
                                        <p className="text-xs text-blue-400 mt-1 font-mono">EXT: 1234</p>
                                    </div>
                                    <button className="bg-blue-600/20 text-blue-400 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                        <Contact className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4">
                        {filteredCategories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="bg-[#131b2e] aspect-[4/3] rounded-[32px] border border-white/5 flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#1a2333] hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
                            >
                                {/* Subtle Background Glow */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none bg-gradient-to-br from-white/10 to-transparent`}></div>
                                
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${cat.color}`}>
                                    {cat.icon}
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-100 opacity-90 group-hover:opacity-100">
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Floating Navigation (Cloned from image) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
                <div className="bg-[#1a2333]/90 backdrop-blur-md border border-white/10 rounded-3xl p-1.5 flex items-center justify-between shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                    
                    <button 
                        onClick={() => onChangeView('ai-assistant')}
                        className="flex flex-col items-center justify-center flex-1 py-2 gap-1 text-gray-500 hover:text-blue-400 transition-colors"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Chat</span>
                    </button>

                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`flex flex-col items-center justify-center flex-1 py-2 gap-1 rounded-2xl transition-all ${!selectedCategory ? 'bg-[#212b3e] text-blue-400 shadow-inner' : 'text-gray-500'}`}
                    >
                        <Contact className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Contactos</span>
                    </button>

                    <button 
                        className="flex flex-col items-center justify-center flex-1 py-2 gap-1 text-gray-500 hover:text-blue-400 transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Preview</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ContactsView;