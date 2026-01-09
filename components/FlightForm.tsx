
import React, { useState, useRef, useEffect } from 'react';
import { 
    Save, 
    Trash2, 
    Plus, 
    Minus, 
    CheckCircle, 
    PlaneLanding, 
    PlaneTakeoff, 
    MessageSquare, 
    Paperclip, 
    Upload, 
    X, 
    Hash, 
    Users, 
    Calendar, 
    Clock, 
    Plane,
    Globe,
    Shield,
    FileText,
    Printer
} from 'lucide-react';
import { FlightFormData, FlightType, UserProfile, FlightStatus } from '../types';
import { saveFlight, deleteFlight } from '../services/db';

interface FlightFormProps {
    initialData?: FlightFormData | null;
    onClear?: () => void;
    onSaved?: () => void;
    currentUser?: UserProfile | null;
}

const FlightForm: React.FC<FlightFormProps> = ({ initialData, onClear, onSaved, currentUser }) => {
    const currentYear = new Date().getFullYear();
    const defaultForm: FlightFormData = {
        flightNumber: '',
        flightType: FlightType.TURNAROUND,
        flightNature: 'Voo Privado',
        status: 'Agendado',
        arrivalStatus: 'Agendado',
        departureStatus: 'Agendado',
        aircraftType: '',
        gesdocNumber: '',
        gesdocYear: currentYear >= 2026 ? currentYear : 2026,
        createdBy: '',
        createdByCategory: '',
        
        regVPArrival: '',
        origin: '',
        scheduleTimeArrival: '',
        dateArrival: new Date().toISOString().split('T')[0],
        
        arrivalUeCount: 0,
        arrivalNonSchengenCount: 0,
        arrivalCrewCount: 0,

        regVPDeparture: '',
        destination: '',
        scheduleTimeDeparture: '',
        dateDeparture: new Date().toISOString().split('T')[0],

        departureUeCount: 0,
        departureNonSchengenCount: 0,
        departureCrewCount: 0,
        
        operator: '',
        
        observations: '',
        attachmentName: '',
        checklist: {}
    };

    const [formData, setFormData] = useState<FlightFormData>(defaultForm);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setSavedId(initialData.id || null);
        } else {
            setFormData({
                ...defaultForm,
                createdBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Utilizador',
                createdByCategory: currentUser ? currentUser.category : 'Agente'
            });
            setSavedId(null);
        }
    }, [initialData, currentUser]);

    const updateField = (field: keyof FlightFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleChecklist = (key: string) => {
        setFormData(prev => ({
            ...prev,
            checklist: { ...prev.checklist, [key]: !prev.checklist?.[key] }
        }));
    };

    const getStatusColor = (status?: FlightStatus) => {
        switch (status) {
            case 'Agendado': return 'text-yellow-500 font-bold';
            case 'Confirmado': return 'text-blue-500 font-bold';
            case 'Realizado': return 'text-green-500 font-bold';
            case 'Cancelado': return 'text-red-500 font-black';
            default: return 'text-gray-400';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const id = await saveFlight(formData);
            setSavedId(id);
            setFormData(prev => ({ ...prev, id }));
            setStatusMsg({ type: 'success', text: 'Voo registado com sucesso!' });
            
            setTimeout(() => {
                setStatusMsg(null);
                if (onSaved) onSaved();
            }, 800);
            
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Erro ao guardar voo.' });
        }
    };

    const handleDelete = async () => {
        if (!savedId) return;
        if (window.confirm('Tem a certeza que deseja eliminar este registo?')) {
            await deleteFlight(savedId);
            if (onClear) onClear();
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const checklistItemsArrival = [
        "DGVP - GEN DEC", "Consulta SIS II", "Enviar Email (SOA/OPA/Groundforce)", 
        "Controlo Documental Obrigatório", "Dispensa de Controlo Documental", 
        "Registar Voo na Capa de Registos", "Registar: Lista de Voos / Lista Paxs", 
        "Elaborar Relatório de Turno", "Enviar Relatório por Email", "Imprimir Relatório de Tráfego Aéreo"
    ];

    const checklistItemsDeparture = [
        "DGVP - GEN DEC", "Consulta SIS II", "Enviar Email (SOA/OPA/Groundforce)", 
        "Controlo Documental Obrigatório", "Dispensa de Controlo Documental", 
        "Registar Voo na Capa de Registos", "Registar: Lista de Voos / Lista Paxs", 
        "Elaborar Relatório de Turno", "Enviar Relatório por Email", 
        "Imprimir Relatório de Tráfego Aéreo", "Arquivar na Capa de Voos Privados"
    ];

    return (
        <div className="p-6 bg-[#0a0e17] min-h-full font-sans text-white">
            
            {/* PRINT TEMPLATE (Hidden on screen) */}
            <div className="hidden print:block bg-white text-black p-10 font-sans min-h-screen">
                <div className="border-b-2 border-primary pb-4 mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-primary uppercase tracking-tight">POLÍCIA SEGURANÇA PÚBLICA</h1>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">DIVISÃO DE SEGURANÇA AEROPORTUÁRIA</p>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">COMANDO REGIONAL DA MADEIRA</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black mb-1">{formData.flightNumber || '---'}</p>
                        <p className="text-xs font-bold text-gray-500 mb-2">{new Date().toISOString().split('T')[0]}</p>
                        <div className="bg-gray-100 px-4 py-2 rounded border border-gray-200">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">GESDOC n.º</p>
                             <p className="text-sm font-bold">{formData.gesdocNumber || 'Pendente'}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-sm font-black text-primary border-b border-gray-200 pb-1 mb-4 uppercase tracking-widest">INFORMAÇÃO GERAL</h2>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                        <div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase">Operadora</p>
                            <p className="text-sm font-bold border-b border-gray-100 py-1">{formData.operator || '---'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase">Rota</p>
                            <p className="text-sm font-bold border-b border-gray-100 py-1">{formData.origin || '---'} - {formData.destination || '---'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase">Tipo de Voo</p>
                            <p className="text-sm font-bold border-b border-gray-100 py-1">{formData.flightNature || '---'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase">Registo GESDOC</p>
                            <p className="text-sm font-bold border-b border-gray-100 py-1">{formData.gesdocNumber || '---'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xs font-black text-primary mb-4 uppercase tracking-widest border-b border-gray-100 pb-2">CHEGADA</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Origem</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.origin || '---'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Hora</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.scheduleTimeArrival || '---'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Status</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.arrivalStatus || '---'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">PAX UE / NON-UE</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.arrivalUeCount || 0} / {formData.arrivalNonSchengenCount || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xs font-black text-primary mb-4 uppercase tracking-widest border-b border-gray-100 pb-2">PARTIDA</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Destino</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.destination || '---'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Hora</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.scheduleTimeDeparture || '---'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Status</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.departureStatus || '---'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">PAX UE / NON-UE</p>
                                <p className="text-sm font-bold border-b border-gray-50">{formData.departureUeCount || 0} / {formData.departureNonSchengenCount || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-sm font-black text-primary border-b border-gray-200 pb-1 mb-4 uppercase tracking-widest">OBSERVAÇÕES</h2>
                    <div className="border border-gray-200 rounded-xl p-6 min-h-[150px] text-sm italic text-gray-700">
                        {formData.observations || 'Sem observações registadas.'}
                    </div>
                </div>

                <div className="mt-auto border-t pt-4 flex justify-between items-end">
                    <div className="text-[9px] text-gray-400 leading-tight">
                        <p className="font-bold uppercase tracking-wider mb-1 text-gray-500">Rodapé de Segurança</p>
                        <p>Documento gerado automaticamente pelo Sistema GESTO VP.</p>
                        <p>Impresso em: {new Date().toLocaleString('pt-PT')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">REGISTADO POR</p>
                        <p className="text-sm font-bold text-primary">{formData.createdBy || 'Sistema'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{formData.createdByCategory || 'Agente'}</p>
                    </div>
                </div>
            </div>

            {/* SCREEN VIEW (Original Form) */}
            <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-6 pb-24 print:hidden">
                
                {/* 1. IDENTIFICAÇÃO DO VOO (Header) */}
                <div className="bg-[#111827] rounded-[24px] p-6 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 text-blue-400">
                            <Plane className="w-5 h-5" />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Identificação do Voo</h2>
                        </div>
                        {savedId && (
                            <button 
                                type="button" 
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-all border border-white/5 text-xs font-bold uppercase tracking-widest"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimir
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">N.º DE VOO *</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={formData.flightNumber}
                                    onChange={e => updateField('flightNumber', e.target.value.toUpperCase())}
                                    placeholder="Ex: TP1699"
                                    className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                />
                                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">OPERADORA *</label>
                            <input 
                                type="text"
                                value={formData.operator}
                                onChange={e => updateField('operator', e.target.value)}
                                placeholder="Ex: TAP Air Portugal"
                                className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">TIPO DE VOO *</label>
                            <select 
                                value={formData.flightNature}
                                onChange={e => updateField('flightNature', e.target.value)}
                                className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Voo Privado">Voo Privado</option>
                                <option value="Voo Comercial">Voo Comercial</option>
                                <option value="Voo Diplomático">Voo Diplomático</option>
                                <option value="Voo Carga">Voo Carga</option>
                                <option value="Voo Militar">Voo Militar</option>
                                <option value="Voo de Instrução">Voo de Instrução</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">REGISTO GESDOC</label>
                            <input 
                                type="text"
                                value={formData.gesdocNumber}
                                onChange={e => updateField('gesdocNumber', e.target.value)}
                                placeholder="GESDOC N.º"
                                className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. VOO CHEGADA & VOO PARTIDA (Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* COLUNA VOO CHEGADA */}
                    <div className="bg-[#111827] rounded-[32px] border-l-4 border-emerald-500/50 p-6 shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <PlaneLanding className="w-6 h-6" />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Voo Chegada</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">REGISTO PF008 (CHEGADA)</label>
                                <input type="text" value={formData.regVPArrival} onChange={e => updateField('regVPArrival', e.target.value)} placeholder="N.º Registo" className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-emerald-500/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">STATUS CHEGADA</label>
                                <select 
                                    value={formData.arrivalStatus}
                                    onChange={e => updateField('arrivalStatus', e.target.value as FlightStatus)}
                                    className={`w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none appearance-none cursor-pointer transition-colors ${getStatusColor(formData.arrivalStatus)}`}
                                >
                                    <option value="Agendado">Agendado</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Realizado">Realizado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">ORIGEM (AEROPORTO)</label>
                                <input type="text" value={formData.origin} onChange={e => updateField('origin', e.target.value)} placeholder="Ex: LPPT" className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-emerald-500/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">DESTINO (LOCAL)</label>
                                <input type="text" defaultValue="LPPS" readOnly className="w-full bg-[#0a0e17] border border-white/5 rounded-xl py-3 px-4 text-sm text-gray-600 outline-none cursor-default" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">DATA CHEGADA</label>
                                <div className="relative">
                                    <input type="date" value={formData.dateArrival} onChange={e => updateField('dateArrival', e.target.value)} className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">HORA CHEGADA</label>
                                <div className="relative">
                                    <input type="time" value={formData.scheduleTimeArrival} onChange={e => updateField('scheduleTimeArrival', e.target.value)} className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
                                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">SCHENGEN / NÃO SCH</label>
                            <div className="flex bg-[#0a0e17] p-1.5 rounded-2xl gap-2 border border-white/5">
                                <button type="button" onClick={() => toggleChecklist('arrival_sch')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${formData.checklist?.arrival_sch ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-600 hover:text-gray-400'}`}>SCHENGEN</button>
                                <button type="button" onClick={() => toggleChecklist('arrival_sch')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${!formData.checklist?.arrival_sch ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-600 hover:text-gray-400'}`}>NÃO SCH</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">CONTAGEM (CHEGADA)</label>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-[#1c2636] p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-bold text-gray-500 mb-1">PAX UE</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => updateField('arrivalUeCount', Math.max(0, (formData.arrivalUeCount||0)-1))} className="text-gray-600 hover:text-white"><Minus className="w-4 h-4" /></button>
                                        <span className="text-lg font-black">{formData.arrivalUeCount || 0}</span>
                                        <button type="button" onClick={() => updateField('arrivalUeCount', (formData.arrivalUeCount||0)+1)} className="text-emerald-500 hover:text-emerald-400"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="bg-[#1c2636] p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-bold text-gray-500 mb-1">PAX CE</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => updateField('arrivalNonSchengenCount', Math.max(0, (formData.arrivalNonSchengenCount||0)-1))} className="text-gray-600 hover:text-white"><Minus className="w-4 h-4" /></button>
                                        <span className="text-lg font-black text-red-500">{formData.arrivalNonSchengenCount || 0}</span>
                                        <button type="button" onClick={() => updateField('arrivalNonSchengenCount', (formData.arrivalNonSchengenCount||0)+1)} className="text-red-400 hover:text-red-300"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="bg-[#1c2636] p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-bold text-gray-500 mb-1">TRIPULAÇÃO</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => updateField('arrivalCrewCount', Math.max(0, (formData.arrivalCrewCount||0)-1))} className="text-gray-600 hover:text-white"><Minus className="w-4 h-4" /></button>
                                        <span className="text-lg font-black text-green-500">{formData.arrivalCrewCount || 0}</span>
                                        <button type="button" onClick={() => updateField('arrivalCrewCount', (formData.arrivalCrewCount||0)+1)} className="text-green-400 hover:text-green-300"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-emerald-400 mb-4">
                                <CheckCircle className="w-4 h-4" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Checklist Voo Chegada</h3>
                            </div>
                            <div className="space-y-2">
                                {checklistItemsArrival.map(item => (
                                    <div 
                                        key={item} 
                                        onClick={() => toggleChecklist(`arr_${item}`)}
                                        className="flex items-center justify-between p-3 bg-[#1c2636] rounded-xl border border-white/5 cursor-pointer hover:bg-emerald-500/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-500 transition-colors" />
                                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase tracking-tight">{item}</span>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.checklist?.[`arr_${item}`] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-700'}`}>
                                            {formData.checklist?.[`arr_${item}`] && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* COLUNA VOO PARTIDA */}
                    <div className="bg-[#111827] rounded-[32px] border-l-4 border-rose-500/50 p-6 shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 text-rose-400">
                            <PlaneTakeoff className="w-6 h-6" />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Voo Partida</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">REGISTO PF008 (PARTIDA)</label>
                                <input type="text" value={formData.regVPDeparture} onChange={e => updateField('regVPDeparture', e.target.value)} placeholder="N.º Registo" className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-rose-500/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">STATUS PARTIDA</label>
                                <select 
                                    value={formData.departureStatus}
                                    onChange={e => updateField('departureStatus', e.target.value as FlightStatus)}
                                    className={`w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none appearance-none cursor-pointer transition-colors ${getStatusColor(formData.departureStatus)}`}
                                >
                                    <option value="Agendado">Agendado</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Realizado">Realizado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">ORIGEM (LOCAL)</label>
                                <input type="text" defaultValue="LPPS" readOnly className="w-full bg-[#0a0e17] border border-white/5 rounded-xl py-3 px-4 text-sm text-gray-600 outline-none cursor-default" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">DESTINO (AEROPORTO)</label>
                                <input type="text" value={formData.destination} onChange={e => updateField('destination', e.target.value)} placeholder="Ex: LPPT" className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-rose-500/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">DATA PARTIDA</label>
                                <div className="relative">
                                    <input type="date" value={formData.dateDeparture} onChange={e => updateField('dateDeparture', e.target.value)} className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">HORA PARTIDA</label>
                                <div className="relative">
                                    <input type="time" value={formData.scheduleTimeDeparture} onChange={e => updateField('scheduleTimeDeparture', e.target.value)} className="w-full bg-[#1c2636] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
                                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">SCHENGEN / NÃO SCH</label>
                            <div className="flex bg-[#0a0e17] p-1.5 rounded-2xl gap-2 border border-white/5">
                                <button type="button" onClick={() => toggleChecklist('departure_sch')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${formData.checklist?.departure_sch ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-gray-600 hover:text-gray-400'}`}>SCHENGEN</button>
                                <button type="button" onClick={() => toggleChecklist('departure_sch')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${!formData.checklist?.departure_sch ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-gray-600 hover:text-gray-400'}`}>NÃO SCH</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">CONTAGEM (PARTIDA)</label>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-[#1c2636] p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-bold text-gray-500 mb-1">PAX UE</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => updateField('departureUeCount', Math.max(0, (formData.departureUeCount||0)-1))} className="text-gray-600 hover:text-white"><Minus className="w-4 h-4" /></button>
                                        <span className="text-lg font-black">{formData.departureUeCount || 0}</span>
                                        <button type="button" onClick={() => updateField('departureUeCount', (formData.departureUeCount||0)+1)} className="text-rose-500 hover:text-rose-400"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="bg-[#1c2636] p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-bold text-gray-500 mb-1">PAX CE</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => updateField('departureNonSchengenCount', Math.max(0, (formData.departureNonSchengenCount||0)-1))} className="text-gray-600 hover:text-white"><Minus className="w-4 h-4" /></button>
                                        <span className="text-lg font-black text-rose-500">{formData.departureNonSchengenCount || 0}</span>
                                        <button type="button" onClick={() => updateField('departureNonSchengenCount', (formData.departureNonSchengenCount||0)+1)} className="text-red-400 hover:text-red-300"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="bg-[#1c2636] p-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-bold text-gray-500 mb-1">TRIPULAÇÃO</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => updateField('departureCrewCount', Math.max(0, (formData.departureCrewCount||0)-1))} className="text-gray-600 hover:text-white"><Minus className="w-4 h-4" /></button>
                                        <span className="text-lg font-black text-green-500">{formData.departureCrewCount || 0}</span>
                                        <button type="button" onClick={() => updateField('departureCrewCount', (formData.departureCrewCount||0)+1)} className="text-green-400 hover:text-green-300"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-rose-400 mb-4">
                                <CheckCircle className="w-4 h-4" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Checklist Voo Partida</h3>
                            </div>
                            <div className="space-y-2">
                                {checklistItemsDeparture.map(item => (
                                    <div 
                                        key={item} 
                                        onClick={() => toggleChecklist(`dep_${item}`)}
                                        className="flex items-center justify-between p-3 bg-[#1c2636] rounded-xl border border-white/5 cursor-pointer hover:bg-rose-500/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-3.5 h-3.5 text-gray-600 group-hover:text-rose-500 transition-colors" />
                                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase tracking-tight">{item}</span>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.checklist?.[`dep_${item}`] ? 'bg-rose-500 border-rose-500' : 'border-gray-700'}`}>
                                            {formData.checklist?.[`dep_${item}`] && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. OBSERVAÇÕES & ANEXOS */}
                <div className="space-y-6">
                    <div className="bg-[#111827] rounded-[32px] p-6 border border-white/5 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-blue-400">
                            <MessageSquare className="w-5 h-5" />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Observações</h2>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">NOTAS ADICIONAIS</p>
                        <textarea 
                            value={formData.observations}
                            onChange={e => updateField('observations', e.target.value)}
                            placeholder="Informações relevantes sobre o voo, tripulação ou passageiros..."
                            rows={4}
                            className="w-full bg-[#1c2636] border border-white/10 rounded-2xl p-6 text-sm text-gray-300 placeholder:text-gray-700 outline-none focus:border-blue-500/30 transition-all resize-none shadow-inner"
                        />
                    </div>

                    <div className="bg-[#111827] rounded-[32px] p-6 border border-white/5 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-blue-400">
                            <Paperclip className="w-5 h-5" />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Anexos</h2>
                        </div>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group"
                        >
                            <input type="file" ref={fileInputRef} className="hidden" />
                            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-blue-500 font-bold text-sm">Anexar Ficheiro</p>
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">PDF, CSV ou XLSX (Máx. 5MB)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. FOOTER REGISTADO POR */}
                <div className="bg-[#111827] rounded-3xl p-6 border border-white/5 shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">REGISTADO POR</p>
                            <p className="text-sm font-bold text-white">{formData.createdBy} <span className="text-gray-500 mx-2">•</span> {formData.createdByCategory}</p>
                        </div>
                    </div>
                    <span className="text-xs font-mono text-gray-600 tracking-widest">{new Date().toLocaleDateString('pt-PT')}</span>
                </div>

                {/* 5. ACTION BUTTONS */}
                <div className="flex gap-4">
                    <button 
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Save className="w-5 h-5" />
                        {savedId ? 'Atualizar Registo' : 'REGISTAR'}
                    </button>
                    {savedId && (
                        <button 
                            type="button"
                            onClick={handleDelete}
                            className="w-20 bg-gray-800/50 hover:bg-red-500/20 text-gray-500 hover:text-red-500 border border-white/5 rounded-[24px] flex items-center justify-center transition-all active:scale-95"
                        >
                            <Trash2 className="w-6 h-6" />
                        </button>
                    )}
                </div>

            </form>
            
            {statusMsg && (
                <div className={`fixed bottom-24 right-10 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 z-50 flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                    {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    <span className="font-bold text-sm tracking-tight">{statusMsg.text}</span>
                </div>
            )}
        </div>
    );
};

export default FlightForm;
