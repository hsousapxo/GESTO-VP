
import React, { useState, useRef, useEffect } from 'react';
import { 
    Save, Trash2, Plus, Minus, CheckCircle, PlaneLanding, PlaneTakeoff, MessageSquare, 
    Calendar, Clock, Plane, Globe, Shield, FileText, Printer, Eye, Pencil, Archive, AlertCircle, 
    ArrowLeftRight, Hash, User, Star, ClipboardList, X, Check, Activity
} from 'lucide-react';
import { FlightFormData, FlightType, UserProfile, FlightStatus, RouteType } from '../types';
import { saveFlight, deleteFlight } from '../services/db';
import FlightDocument from './FlightDocument';

interface FlightFormProps {
    initialData?: FlightFormData | null;
    onClear?: () => void;
    onSaved?: () => void;
    currentUser?: UserProfile | null;
}

const CHECKLIST_ITEMS = [
    "DGVP - GEN DEC",
    "Consulta SIS II",
    "Enviar Email (SOA/OPA/Groundforce)",
    "Controlo Documental Obrigatório",
    "Dispensa de Controlo Documental",
    "Registar Voo na Capa de Registos",
    "Registar: Lista de Voos / Lista Paxs",
    "Elaborar Relatório de Turno",
    "Enviar Relatório por Email",
    "Imprimir Relatório de Tráfego Aéreo"
];

const FlightForm: React.FC<FlightFormProps> = ({ initialData, onClear, onSaved, currentUser }) => {
    const currentYear = new Date().getFullYear();
    const defaultForm: FlightFormData = {
        flightNumber: '',
        flightType: FlightType.TURNAROUND,
        flightNature: 'Voo Privado',
        arrivalRouteType: undefined,
        departureRouteType: undefined,
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
        arrivalChecklist: {},
        departureChecklist: {},
        checklist: {}
    };

    const [formData, setFormData] = useState<FlightFormData>(defaultForm);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof FlightFormData, string>>>({});
    const [activeChecklist, setActiveChecklist] = useState<'arrival' | 'departure' | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...defaultForm,
                ...initialData,
                arrivalChecklist: initialData.arrivalChecklist || {},
                departureChecklist: initialData.departureChecklist || {}
            });
            setSavedId(initialData.id || null);
        } else {
            setFormData({
                ...defaultForm,
                createdBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Agente',
                createdByCategory: currentUser ? currentUser.category : 'Operacional'
            });
            setSavedId(null);
        }
        setErrors({});
    }, [initialData, currentUser]);

    const validateField = (field: keyof FlightFormData, value: any): string => {
        switch(field) {
            case 'flightNumber':
                return !value || value.trim() === '' ? 'O número de voo é obrigatório.' : '';
            case 'origin':
                return !value || value.trim() === '' ? 'Origem obrigatória.' : '';
            case 'destination':
                return !value || value.trim() === '' ? 'Destino obrigatório.' : '';
            case 'arrivalRouteType':
                return !value ? 'Classificação de rota (Chegada) necessária.' : '';
            case 'departureRouteType':
                return !value ? 'Classificação de rota (Partida) necessária.' : '';
            default:
                return '';
        }
    };

    const updateField = (field: keyof FlightFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validação em tempo real para campos críticos
        if (['flightNumber', 'origin', 'destination', 'arrivalRouteType', 'departureRouteType'].includes(field)) {
            const errorMsg = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: errorMsg }));
        }
    };

    const toggleChecklistItem = (type: 'arrival' | 'departure', item: string) => {
        const field = type === 'arrival' ? 'arrivalChecklist' : 'departureChecklist';
        const current = formData[field] || {};
        updateField(field, { ...current, [item]: !current[item] });
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Validação completa antes de guardar
        const newErrors: Partial<Record<keyof FlightFormData, string>> = {};
        newErrors.flightNumber = validateField('flightNumber', formData.flightNumber);
        newErrors.origin = validateField('origin', formData.origin);
        newErrors.destination = validateField('destination', formData.destination);
        newErrors.arrivalRouteType = validateField('arrivalRouteType', formData.arrivalRouteType);
        newErrors.departureRouteType = validateField('departureRouteType', formData.departureRouteType);

        // Remove chaves sem erro
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key as keyof FlightFormData]) delete newErrors[key as keyof FlightFormData];
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStatusMsg({ type: 'error', text: 'Por favor, corrija os erros assinalados antes de guardar.' });
            setTimeout(() => setStatusMsg(null), 3000);
            return;
        }

        try {
            const id = await saveFlight(formData);
            setSavedId(id);
            setFormData(prev => ({ ...prev, id }));
            setStatusMsg({ type: 'success', text: 'Voo registado com sucesso!' });
            setErrors({});
            setTimeout(() => {
                setStatusMsg(null);
                if (onSaved) onSaved();
            }, 1000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Erro ao guardar no sistema.' });
        }
    };

    // --- SISTEMA DE CORES DE STATUS ---
    const getStatusStyles = (status?: FlightStatus) => {
        switch (status) {
            case 'Agendado': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/30 focus:ring-yellow-500/50';
            case 'Confirmado': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 focus:ring-blue-500/50';
            case 'Realizado': return 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/30 focus:ring-green-500/50';
            case 'Cancelado': return 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/30 focus:ring-red-500/50';
            case 'Arquivado': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 focus:ring-purple-500/50';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    };

    const getInputClass = (fieldName: keyof FlightFormData, baseClass: string) => {
        const hasError = !!errors[fieldName];
        return `${baseClass} ${hasError ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : ''}`;
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#0a0e17] min-h-full font-sans text-gray-900 dark:text-white transition-colors duration-300 relative">
            
            {/* CHECKLIST MODAL */}
            {activeChecklist && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
                    <div className="bg-[#111827] rounded-[32px] shadow-2xl w-full max-w-md border border-white/10 overflow-hidden flex flex-col transition-all border-l-8 border-primary">
                        <div className="p-6 flex justify-between items-center border-b border-white/5">
                            <div className="flex items-center gap-3 text-blue-400">
                                <ClipboardList className="w-6 h-6" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Protocolo Checklist</h3>
                            </div>
                            <button onClick={() => setActiveChecklist(null)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 bg-[#0a0e17]/50 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">MOVIMENTO DE {activeChecklist === 'arrival' ? 'CHEGADA' : 'PARTIDA'}</span>
                            <div className="space-y-2">
                                {CHECKLIST_ITEMS.map((item, idx) => {
                                    const isChecked = activeChecklist === 'arrival' 
                                        ? !!formData.arrivalChecklist?.[item] 
                                        : !!formData.departureChecklist?.[item];
                                    return (
                                        <button 
                                            key={idx}
                                            type="button"
                                            onClick={() => toggleChecklistItem(activeChecklist, item)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#1f2937]/50 border border-white/5 hover:bg-[#1f2937] transition-all group text-left"
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                {isChecked && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                            </div>
                                            <span className={`text-sm font-bold tracking-tight transition-colors ${isChecked ? 'text-white' : 'text-gray-400'}`}>
                                                {item}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 bg-[#111827]">
                            <button 
                                onClick={() => setActiveChecklist(null)}
                                className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all"
                            >
                                Confirmar e Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OFFICIAL PRINT DOCUMENT CONTAINER (REFACTORED) */}
            <div className={`${showPreview ? 'fixed inset-0 z-[200] overflow-y-auto bg-gray-900/95 flex justify-center' : 'hidden'} print:block print:static print:bg-white print:p-0`}>
                {/* Floating Toolbar (Preview Only) */}
                {showPreview && (
                    <div className="fixed top-6 right-6 z-[210] flex gap-3 print:hidden animate-in fade-in slide-in-from-top-4 duration-500">
                        <button 
                            onClick={() => window.print()} 
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            <Printer className="w-5 h-5" /> Imprimir
                        </button>
                        <button 
                            onClick={() => setShowPreview(false)} 
                            className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            <X className="w-5 h-5" /> Fechar
                        </button>
                    </div>
                )}

                {/* Shared Print Component */}
                <div className={showPreview ? "my-10 shadow-2xl rounded-sm" : ""}>
                    <FlightDocument flight={formData} />
                </div>
            </div>

            {/* SCREEN VIEW - MAIN FORM (Hidden during print) */}
            <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-6 pb-32 print:hidden animate-in fade-in duration-500 no-print">
                
                {/* 1. IDENTIFICAÇÃO GLOBAL DO PROCESSO */}
                <div className="bg-white dark:bg-[#111827] rounded-[24px] p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-2xl transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 text-primary dark:text-blue-400">
                            <Plane className="w-6 h-6" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Processo de Voo</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <div className="space-y-1.5 relative">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">N.º de Voo *</label>
                            <input 
                                type="text"
                                value={formData.flightNumber}
                                onChange={e => updateField('flightNumber', e.target.value.toUpperCase())}
                                placeholder="Ex: TP1699"
                                className={getInputClass('flightNumber', "w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all")}
                                required
                            />
                            {errors.flightNumber && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.flightNumber}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Operadora</label>
                            <input 
                                type="text"
                                value={formData.operator}
                                onChange={e => updateField('operator', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Natureza</label>
                            <select 
                                value={formData.flightNature}
                                onChange={e => updateField('flightNature', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-primary"
                            >
                                <option value="Voo Privado">Voo Privado</option>
                                <option value="Voo Comercial">Voo Comercial</option>
                                <option value="Voo Militar">Voo Militar</option>
                                <option value="Voo Carga">Voo Carga</option>
                                <option value="Voo Diplomático">Voo Diplomático</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">GESDOC</label>
                            <input 
                                type="text"
                                value={formData.gesdocNumber}
                                onChange={e => updateField('gesdocNumber', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Estado Global</label>
                            <select 
                                value={formData.status}
                                onChange={e => updateField('status', e.target.value as FlightStatus)}
                                className={`w-full px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest border outline-none cursor-pointer transition-all shadow-inner focus:ring-2 ${getStatusStyles(formData.status)}`}
                            >
                                <option value="Agendado">Agendado</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Realizado">Realizado</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Arquivado">Arquivado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. DUAS COLUNAS PRINCIPAIS: CHEGADA VS PARTIDA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* COLUNA ESQUERDA: CHEGADA */}
                    <div className="bg-white dark:bg-[#111827] rounded-[32px] border-l-8 border-emerald-500 p-8 shadow-sm dark:shadow-2xl space-y-6 flex flex-col transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <PlaneLanding className="w-32 h-32 text-emerald-500" />
                        </div>
                        
                        <div className="flex items-center justify-between relative z-10">
                             <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                <PlaneLanding className="w-7 h-7" />
                                <h2 className="text-xl font-black uppercase tracking-tight">Movimento Chegada</h2>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setActiveChecklist('arrival')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-emerald-600 hover:text-white transition-all"
                            >
                                <ClipboardList className="w-4 h-4" /> Checklist
                            </button>
                        </div>
                        
                        {/* Status Específico Chegada */}
                        <div className="space-y-1.5 relative z-10">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Status Chegada</label>
                            <select 
                                value={formData.arrivalStatus}
                                onChange={e => updateField('arrivalStatus', e.target.value as FlightStatus)}
                                className={`w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border outline-none cursor-pointer transition-all shadow-sm focus:ring-2 ${getStatusStyles(formData.arrivalStatus)}`}
                            >
                                <option value="Agendado">Agendado</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Realizado">Realizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>

                        {/* Registo Interno Chegada */}
                        <div className="space-y-1.5 relative z-10">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Registo Interno (VP Chegada)</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={formData.regVPArrival} 
                                    onChange={e => updateField('regVPArrival', e.target.value)} 
                                    placeholder="Ex: VP-123/25"
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Data Chegada</label>
                                <input 
                                    type="date" 
                                    value={formData.dateArrival} 
                                    onChange={e => updateField('dateArrival', e.target.value)} 
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Hora (ETA)</label>
                                <input 
                                    type="time" 
                                    value={formData.scheduleTimeArrival} 
                                    onChange={e => updateField('scheduleTimeArrival', e.target.value)} 
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 relative z-10">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Origem *</label>
                            <input 
                                type="text" 
                                value={formData.origin} 
                                onChange={e => updateField('origin', e.target.value)} 
                                placeholder="Aeroporto de Origem"
                                className={getInputClass('origin', "w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all")}
                            />
                            {errors.origin && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.origin}</p>}
                        </div>

                        <div className="pt-2 relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Passageiros (POB)</p>
                            <div className="grid grid-cols-3 gap-3">
                                <CounterField label="UE" val={formData.arrivalUeCount} onChange={v => updateField('arrivalUeCount', v)} color="blue" />
                                <CounterField label="EXT" val={formData.arrivalNonSchengenCount} onChange={v => updateField('arrivalNonSchengenCount', v)} color="red" />
                                <CounterField label="TRI" val={formData.arrivalCrewCount} onChange={v => updateField('arrivalCrewCount', v)} color="emerald" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-auto relative z-10">
                            <RouteToggle 
                                label="CLASSIFICAÇÃO DA ROTA (CHEGADA) *"
                                value={formData.arrivalRouteType}
                                onChange={v => updateField('arrivalRouteType', v)}
                                error={!!errors.arrivalRouteType}
                            />
                            {errors.arrivalRouteType && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.arrivalRouteType}</p>}
                        </div>
                    </div>

                    {/* COLUNA DIREITA: PARTIDA */}
                    <div className="bg-white dark:bg-[#111827] rounded-[32px] border-l-8 border-rose-500 p-8 shadow-sm dark:shadow-2xl space-y-6 flex flex-col transition-colors relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <PlaneTakeoff className="w-32 h-32 text-rose-500" />
                        </div>

                         <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                                <PlaneTakeoff className="w-7 h-7" />
                                <h2 className="text-xl font-black uppercase tracking-tight">Movimento Partida</h2>
                            </div>
                             <button 
                                type="button"
                                onClick={() => setActiveChecklist('departure')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-rose-600 hover:text-white transition-all"
                            >
                                <ClipboardList className="w-4 h-4" /> Checklist
                            </button>
                        </div>
                        
                        {/* Status Específico Partida */}
                        <div className="space-y-1.5 relative z-10">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Status Partida</label>
                            <select 
                                value={formData.departureStatus}
                                onChange={e => updateField('departureStatus', e.target.value as FlightStatus)}
                                className={`w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border outline-none cursor-pointer transition-all shadow-sm focus:ring-2 ${getStatusStyles(formData.departureStatus)}`}
                            >
                                <option value="Agendado">Agendado</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Realizado">Realizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>

                        {/* Registo Interno Partida */}
                        <div className="space-y-1.5 relative z-10">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Registo Interno (VP Partida)</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={formData.regVPDeparture} 
                                    onChange={e => updateField('regVPDeparture', e.target.value)} 
                                    placeholder="Ex: VP-124/25"
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Data Partida</label>
                                <input 
                                    type="date" 
                                    value={formData.dateDeparture} 
                                    onChange={e => updateField('dateDeparture', e.target.value)} 
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Hora (ETD)</label>
                                <input 
                                    type="time" 
                                    value={formData.scheduleTimeDeparture} 
                                    onChange={e => updateField('scheduleTimeDeparture', e.target.value)} 
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 relative z-10">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Destino *</label>
                            <input 
                                type="text" 
                                value={formData.destination} 
                                onChange={e => updateField('destination', e.target.value)} 
                                placeholder="Aeroporto de Destino"
                                className={getInputClass('destination', "w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all")}
                            />
                            {errors.destination && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.destination}</p>}
                        </div>

                        <div className="pt-2 relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Passageiros (POB)</p>
                            <div className="grid grid-cols-3 gap-3">
                                <CounterField label="UE" val={formData.departureUeCount} onChange={v => updateField('departureUeCount', v)} color="blue" />
                                <CounterField label="EXT" val={formData.departureNonSchengenCount} onChange={v => updateField('departureNonSchengenCount', v)} color="red" />
                                <CounterField label="TRI" val={formData.departureCrewCount} onChange={v => updateField('departureCrewCount', v)} color="emerald" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-auto relative z-10">
                            <RouteToggle 
                                label="CLASSIFICAÇÃO DA ROTA (PARTIDA) *"
                                value={formData.departureRouteType}
                                onChange={v => updateField('departureRouteType', v)}
                                error={!!errors.departureRouteType}
                            />
                            {errors.departureRouteType && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.departureRouteType}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. RODAPÉ DE REGISTO E AÇÕES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-2xl space-y-4 transition-colors">
                        <div className="flex items-center gap-3 text-primary dark:text-blue-400">
                            <MessageSquare className="w-6 h-6" />
                            <h2 className="text-sm font-black uppercase tracking-widest">Observações de Turno</h2>
                        </div>
                        <textarea 
                            value={formData.observations}
                            onChange={e => updateField('observations', e.target.value)}
                            placeholder="Informações relevantes sobre passageiros, vistos ou ocorrências..."
                            rows={3}
                            className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-[24px] p-6 text-sm text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-primary shadow-inner resize-none transition-all"
                        />
                    </div>
                    
                    {/* CARTÃO DO RESPONSÁVEL */}
                    <div className="bg-[#1e293b] rounded-[32px] p-6 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Shield className="w-16 h-16 text-white/5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Responsável pelo Registo</h3>
                            </div>
                            <p className="text-lg font-bold text-white mb-1">{formData.createdBy || 'Agente'}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{formData.createdByCategory || 'Operacional'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Calendar className="w-3 h-3" />
                                <span className="text-[10px] font-mono">{formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px] font-mono">{formData.createdAt ? new Date(formData.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. BOTÕES DE AÇÃO */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-[#111827] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-2xl transition-all transition-colors">
                    <button 
                        type="submit"
                        className={`w-full md:flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${(Object.keys(errors).length > 0) ? 'bg-red-500' : 'bg-primary hover:bg-secondary dark:bg-blue-600 dark:hover:bg-blue-500 text-white'}`}
                    >
                        <Save className="w-5 h-5" />
                        {savedId ? 'Atualizar Processo' : 'Finalizar Registo de Voo'}
                    </button>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-gray-200 dark:border-white/5">
                        <button type="button" onClick={() => window.print()} className="p-4 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors" title="Imprimir Auto">
                            <Printer className="w-6 h-6 stroke-[1.5]" />
                        </button>
                        <button type="button" onClick={() => setShowPreview(true)} className="p-4 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" title="Ver Documento">
                            <Eye className="w-6 h-6 stroke-[1.5]" />
                        </button>
                        {savedId && (
                            <button type="button" onClick={() => { if(window.confirm('Eliminar permanentemente?')) deleteFlight(savedId).then(() => onSaved?.()); }} className="p-4 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors" title="Eliminar">
                                <Trash2 className="w-6 h-6 stroke-[1.5]" />
                            </button>
                        )}
                    </div>
                </div>

            </form>
            
            {statusMsg && (
                <div className={`fixed bottom-10 right-10 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 z-[60] flex items-center gap-4 border border-white/10 ${statusMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                    {statusMsg.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    <span className="font-black text-sm tracking-widest uppercase">{statusMsg.text}</span>
                </div>
            )}
        </div>
    );
};

const RouteToggle: React.FC<{ label: string; value: RouteType | undefined; onChange: (v: RouteType) => void; error?: boolean }> = ({ label, value, onChange, error }) => (
    <div className="space-y-2">
        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
            {label}
        </label>
        <div className={`flex p-1 bg-gray-100 dark:bg-[#131b2e] rounded-xl border transition-all h-[54px] ${error ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-white/5'}`}>
            <button 
                type="button"
                onClick={() => onChange('Schengen')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${value === 'Schengen' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                <Star className={`w-3.5 h-3.5 ${value === 'Schengen' ? 'fill-current' : ''}`} />
                SCHENGEN
            </button>
            <button 
                type="button"
                onClick={() => onChange('Não Schengen')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${value === 'Não Schengen' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                <Globe className="w-3.5 h-3.5" />
                NÃO SCHENGEN
            </button>
        </div>
    </div>
);

const CounterField: React.FC<{ label: string; val: number; onChange: (v: number) => void; color: string }> = ({ label, val, onChange, color }) => (
    <div className="bg-gray-50 dark:bg-[#1c2636] p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-center shadow-sm flex-1 transition-colors">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-center justify-center gap-3">
            <button type="button" onClick={() => onChange(Math.max(0, val - 1))} className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
            <span className={`text-xl font-black min-w-[1.5rem] ${color === 'red' ? 'text-red-500' : color === 'emerald' ? 'text-emerald-500' : 'text-primary dark:text-blue-400'}`}>{val}</span>
            <button type="button" onClick={() => onChange(val + 1)} className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
    </div>
);

export default FlightForm;
