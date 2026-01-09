import React, { useState, useEffect } from 'react';
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
    X,
    UserPlus,
    Camera,
    User,
    Phone,
    Mail,
    Save,
    Trash2
} from 'lucide-react';
import { ViewState } from '../types';
import { saveContact, getContacts } from '../services/db';

interface ContactCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
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

const NewContactModal: React.FC<{ onClose: () => void; onSave: () => void }> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        category: '',
        institution: '',
        phone: '',
        email: '',
        note: '',
        photo: null as string | null
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveContact(formData);
        onSave();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
            <div className="bg-[#111827] rounded-[32px] shadow-2xl w-full max-w-md border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="text-blue-500">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Novo Contacto</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {/* Photo Area */}
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500/50 hover:text-blue-400 transition-all cursor-pointer group">
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Foto</span>
                        </div>
                    </div>

                    {/* Nome e Sobrenome */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome e Sobrenome</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Ex: Agente Silva"
                                className="w-full bg-[#1f2937]/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    {/* Cargo e Categoria */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cargo</label>
                            <select 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                                className="w-full bg-[#1f2937]/50 border border-white/10 rounded-2xl py-3 px-4 text-sm text-gray-400 outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Selecionar</option>
                                <option value="Agente">Agente</option>
                                <option value="Chefe">Chefe</option>
                                <option value="Comissário">Comissário</option>
                                <option value="Civil">Civil</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full bg-[#1f2937]/50 border border-white/10 rounded-2xl py-3 px-4 text-sm text-gray-400 outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Selecionar</option>
                                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Instituição */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Instituição</label>
                        <input 
                            type="text"
                            value={formData.institution}
                            onChange={e => setFormData({...formData, institution: e.target.value})}
                            placeholder="Ex: PSP"
                            className="w-full bg-[#1f2937]/50 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                        />
                    </div>

                    {/* Contacto */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contacto</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                placeholder="Número de telefone"
                                className="w-full bg-[#1f2937]/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                placeholder="email@exemplo.com"
                                className="w-full bg-[#1f2937]/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Nota */}
                    <div className="space-y-1.5 pb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nota</label>
                        <textarea 
                            value={formData.note}
                            onChange={e => setFormData({...formData, note: e.target.value})}
                            placeholder="Observações adicionais..."
                            rows={3}
                            className="w-full bg-[#1f2937]/50 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner resize-none"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex gap-4 items-center">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

const ContactsView: React.FC<{ onChangeView: (view: ViewState) => void }> = ({ onChangeView }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [categoryContacts, setCategoryContacts] = useState<any[]>([]);

    const loadCategoryContacts = async (catId: string) => {
        const data = await getContacts(catId);
        setCategoryContacts(data);
    };

    useEffect(() => {
        if (selectedCategory) {
            loadCategoryContacts(selectedCategory);
        }
    }, [selectedCategory]);

    const filteredCategories = CATEGORIES.filter(cat => 
        cat.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full bg-[#0a0e17] text-white flex flex-col relative overflow-hidden font-sans transition-colors">
            
            {showNewModal && <NewContactModal onClose={() => setShowNewModal(false)} onSave={() => { setShowNewModal(false); if(selectedCategory) loadCategoryContacts(selectedCategory); }} />}

            {/* Header / Search */}
            <div className="p-6 pt-8 pb-4">
                <div className="flex items-center gap-4 max-w-md mx-auto mb-4">
                    <div className="relative flex-1">
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
                    {!selectedCategory && (
                        <button 
                            onClick={() => setShowNewModal(true)}
                            className="bg-blue-600 p-3.5 rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all active:scale-90"
                            title="Novo Contacto"
                        >
                            <UserPlus className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar">
                {selectedCategory ? (
                    <div className="max-w-2xl mx-auto mt-4">
                        <div className="flex justify-between items-center mb-6">
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className="flex items-center gap-2 text-blue-400 font-bold hover:underline transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Voltar
                            </button>
                            <button 
                                onClick={() => setShowNewModal(true)}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" /> Adicionar
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-4">
                                {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                                <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-mono">{categoryContacts.length}</span>
                            </h2>
                            
                            {categoryContacts.length === 0 ? (
                                <div className="p-12 text-center text-gray-600 border border-white/5 rounded-3xl border-dashed">
                                    Nenhum contacto nesta categoria.
                                </div>
                            ) : (
                                categoryContacts.map(contact => (
                                    <div key={contact.id} className="bg-[#131b2e] p-5 rounded-3xl border border-white/5 flex justify-between items-center group hover:bg-[#1a2333] transition-colors shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 border border-white/5 group-hover:border-blue-500/30 transition-all">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{contact.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{contact.role} {contact.institution ? `• ${contact.institution}` : ''}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    {contact.phone && <span className="text-[10px] text-blue-400 font-mono flex items-center gap-1 bg-blue-500/5 px-2 py-0.5 rounded-full"><Phone className="w-2.5 h-2.5" /> {contact.phone}</span>}
                                                    {contact.email && <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {contact.email}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                             <button className="bg-white/5 text-gray-400 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                                <Phone className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4 pb-12">
                        {filteredCategories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="bg-[#131b2e] aspect-[4/3] rounded-[32px] border border-white/5 flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#1a2333] hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden shadow-sm"
                            >
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