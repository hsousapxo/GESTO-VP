
import React, { useState, useRef, useEffect } from 'react';
import { 
    Save, Trash2, Plus, Minus, CheckCircle, PlaneLanding, PlaneTakeoff, MessageSquare, 
    Calendar, Clock, Plane, Globe, Shield, FileText, Printer, Eye, Pencil, Archive, AlertCircle, 
    ArrowLeftRight, Hash, User, Star
} from 'lucide-react';
import { FlightFormData, FlightType, UserProfile, FlightStatus, RouteType } from '../types';
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
        checklist: {}
    };

    const [formData, setFormData] = useState<FlightFormData>(defaultForm);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [arrivalError, setArrivalError] = useState<boolean>(false);
    const [departureError, setDepartureError] = useState<boolean>(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setSavedId(initialData.id || null);
        } else {
            setFormData({
                ...defaultForm,
                createdBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Agente',
                createdByCategory: currentUser ? currentUser.category : 'Operacional'
            });
            setSavedId(null);
        }
        setArrivalError(false);
        setDepartureError(false);
    }, [initialData, currentUser]);

    const updateField = (field: keyof FlightFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'arrivalRouteType') setArrivalError(false);
        if (field === 'departureRouteType') setDepartureError(false);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        let hasError = false;
        if (!formData.arrivalRouteType) {
            setArrivalError(true);
            hasError = true;
        }
        if (!formData.departureRouteType) {
            setDepartureError(true);
            hasError = true;
        }

        if (hasError) {
            setStatusMsg({ type: 'error', text: 'Selecione a classificação da rota para Chegada e Partida.' });
            setTimeout(() => setStatusMsg(null), 3000);
            return;
        }

        try {
            const id = await saveFlight(formData);
            setSavedId(id);
            setFormData(prev => ({ ...prev, id }));
            setStatusMsg({ type: 'success', text: 'Voo registado com sucesso!' });
            setTimeout(() => {
                setStatusMsg(null);
                if (onSaved) onSaved();
            }, 1000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Erro ao guardar no sistema.' });
        }
    };

    const getStatusStyles = (status?: FlightStatus) => {
        switch (status) {
            case 'Agendado': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/30';
            case 'Confirmado': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
            case 'Realizado': return 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/30';
            case 'Cancelado': return 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/30';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#0a0e17] min-h-full font-sans text-gray-900 dark:text-white transition-colors duration-300 relative">
            
            {/* OFFICIAL PRINT DOCUMENT */}
            <div className="hidden print:block bg-white text-black p-12 font-sans official-document">
                <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-black text-white p-2 rounded">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Polícia de Segurança Pública</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Comando Regional da Madeira</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Divisão de Segurança Aeroportuária</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Posto de Fronteira do Porto Santo - PF008</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-gray-100 p-4 rounded border border-gray-300">
                            <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Auto de Controlo n.º / Voo</p>
                            <p className="text-lg font-black">{formData.gesdocNumber || 'PENDENTE'} / {formData.flightNumber || '---'}</p>
                        </div>
                        <p className="text-[10px] mt-2 font-bold text-gray-500 uppercase">Emissão: {new Date().toLocaleDateString('pt-PT')}</p>
                    </div>
                </div>

                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tighter border-b-2 border-gray-200 pb-2 inline-block px-12 italic">Auto de Controlo de Fronteira</h2>
                </div>

                <div className="mb-10">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black mb-4 pb-1">Informações Gerais</h3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>N.º Voo:</b> <span>{formData.flightNumber}</span></div>
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>Natureza:</b> <span className="font-bold">{formData.flightNature}</span></div>
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>Operador:</b> <span>{formData.operator}</span></div>
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>Estado:</b> <span className="uppercase font-bold">{formData.status}</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="border-2 border-black p-5 rounded-xl">
                        <h4 className="text-center font-black uppercase text-xs mb-4 bg-gray-100 py-1">Movimento de Chegada ({formData.arrivalRouteType})</h4>
                        <div className="space-y-2 text-[11px]">
                            <p className="flex justify-between"><b>Origem:</b> <span>{formData.origin}</span></p>
                            <p className="flex justify-between"><b>Registo Voo:</b> <span>{formData.regVPArrival}</span></p>
                            <p className="flex justify-between"><b>Data/Hora:</b> <span>{formData.dateArrival} {formData.scheduleTimeArrival}</span></p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-center font-bold text-[9px] mb-2 uppercase">Passageiros (POB)</p>
                                <div className="grid grid-cols-3 text-center border border-gray-300">
                                    <div className="border-r border-gray-300 p-1"><b>UE</b><br/>{formData.arrivalUeCount}</div>
                                    <div className="border-r border-gray-300 p-1"><b>NON-UE</b><br/>{formData.arrivalNonSchengenCount}</div>
                                    <div className="p-1"><b>TRIP.</b><br/>{formData.arrivalCrewCount}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 border-black p-5 rounded-xl">
                        <h4 className="text-center font-black uppercase text-xs mb-4 bg-gray-100 py-1">Movimento de Partida ({formData.departureRouteType})</h4>
                        <div className="space-y-2 text-[11px]">
                            <p className="flex justify-between"><b>Destino:</b> <span>{formData.destination}</span></p>
                            <p className="flex justify-between"><b>Registo Voo:</b> <span>{formData.regVPDeparture}</span></p>
                            <p className="flex justify-between"><b>Data/Hora:</b> <span>{formData.dateDeparture} {formData.scheduleTimeDeparture}</span></p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-center font-bold text-[9px] mb-2 uppercase">Passageiros (POB)</p>
                                <div className="grid grid-cols-3 text-center border border-gray-300">
                                    <div className="border-r border-gray-300 p-1"><b>UE</b><br/>{formData.departureUeCount}</div>
                                    <div className="border-r border-gray-300 p-1"><b>NON-UE</b><br/>{formData.departureNonSchengenCount}</div>
                                    <div className="p-1"><b>TRIP.</b><br/>{formData.departureCrewCount}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black mb-2 pb-1">Observações Operacionais</h3>
                    <div className="border border-gray-300 rounded-lg p-4 min-h-[120px] text-xs italic">
                        {formData.observations || 'Sem observações adicionais.'}
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-2 gap-20">
                    <div className="text-center">
                        <div className="border-b border-black h-12 mb-2"></div>
                        <p className="text-[9px] font-black uppercase text-gray-500">Agente Responsável</p>
                        <p className="text-xs font-bold">{formData.createdBy}</p>
                    </div>
                    <div className="text-center">
                        <div className="border-b border-black h-12 mb-2"></div>
                        <p className="text-[9px] font-black uppercase text-gray-500">Visto / Comando</p>
                    </div>
                </div>
            </div>

            {/* SCREEN VIEW */}
            <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-6 pb-32 print:hidden animate-in fade-in duration-500">
                
                {/* 1. IDENTIFICAÇÃO GLOBAL */}
                <div className="bg-white dark:bg-[#111827] rounded-[24px] p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-2xl transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 text-primary dark:text-blue-400">
                            <Plane className="w-6 h-6" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Identificação do Voo</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Estado Global:</span>
                            <select 
                                value={formData.status}
                                onChange={e => updateField('status', e.target.value as FlightStatus)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border outline-none cursor-pointer transition-all shadow-sm ${getStatusStyles(formData.status)}`}
                            >
                                <option value="Agendado">Agendado</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Realizado">Realizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">N.º de Voo *</label>
                            <input 
                                type="text"
                                value={formData.flightNumber}
                                onChange={e => updateField('flightNumber', e.target.value.toUpperCase())}
                                placeholder="Ex: TP1699"
                                className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                                required
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Operadora</label>
                            <input 
                                type="text"
                                value={formData.operator}
                                onChange={e => updateField('operator', e.target.value)}
                                placeholder="Companhia Aérea"
                                className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Natureza do Voo</label>
                            <select 
                                value={formData.flightNature}
                                onChange={e => updateField('flightNature', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none appearance-none cursor-pointer transition-all"
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
                                placeholder="N.º Registo"
                                className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 text-sm text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. COLUNAS PRINCIPAIS: CHEGADA VS PARTIDA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* COLUNA DADOS DE CHEGADA */}
                    <div className="bg-white dark:bg-[#111827] rounded-[32px] border-l-8 border-emerald-500 p-8 shadow-sm dark:shadow-2xl space-y-6 flex flex-col transition-colors">
                        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                            <PlaneLanding className="w-7 h-7" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Movimento Chegada</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Origem</label>
                                <input 
                                    type="text" 
                                    value={formData.origin} 
                                    onChange={e => updateField('origin', e.target.value)} 
                                    placeholder="Ex: LPPT"
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">N.º Registo Voo</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={formData.regVPArrival} 
                                        onChange={e => updateField('regVPArrival', e.target.value)} 
                                        placeholder="Ex: VP-123"
                                        className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Data de Chegada</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="date" 
                                        value={formData.dateArrival} 
                                        onChange={e => updateField('dateArrival', e.target.value)} 
                                        className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Hora (ETA)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="time" 
                                        value={formData.scheduleTimeArrival} 
                                        onChange={e => updateField('scheduleTimeArrival', e.target.value)} 
                                        className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Passageiros na Chegada (POB)</p>
                            <div className="grid grid-cols-3 gap-3">
                                <CounterField label="UE" val={formData.arrivalUeCount} onChange={v => updateField('arrivalUeCount', v)} color="blue" />
                                <CounterField label="EXT" val={formData.arrivalNonSchengenCount} onChange={v => updateField('arrivalNonSchengenCount', v)} color="red" />
                                <CounterField label="TRI" val={formData.arrivalCrewCount} onChange={v => updateField('arrivalCrewCount', v)} color="emerald" />
                            </div>
                        </div>

                        {/* CLASSIFICAÇÃO DA ROTA - CHEGADA */}
                        <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-auto">
                            <RouteToggle 
                                label="CLASSIFICAÇÃO DA ROTA (CHEGADA) *"
                                value={formData.arrivalRouteType}
                                onChange={v => updateField('arrivalRouteType', v)}
                                error={arrivalError}
                            />
                        </div>
                    </div>

                    {/* COLUNA DADOS DE PARTIDA */}
                    <div className="bg-white dark:bg-[#111827] rounded-[32px] border-l-8 border-rose-500 p-8 shadow-sm dark:shadow-2xl space-y-6 flex flex-col transition-colors">
                        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-2">
                            <PlaneTakeoff className="w-7 h-7" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Movimento Partida</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Destino</label>
                                <input 
                                    type="text" 
                                    value={formData.destination} 
                                    onChange={e => updateField('destination', e.target.value)} 
                                    placeholder="Ex: GCRR"
                                    className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">N.º Registo Voo</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={formData.regVPDeparture} 
                                        onChange={e => updateField('regVPDeparture', e.target.value)} 
                                        placeholder="Ex: VP-124"
                                        className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Data de Partida</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="date" 
                                        value={formData.dateDeparture} 
                                        onChange={e => updateField('dateDeparture', e.target.value)} 
                                        className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Hora (ETD)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="time" 
                                        value={formData.scheduleTimeDeparture} 
                                        onChange={e => updateField('scheduleTimeDeparture', e.target.value)} 
                                        className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Passageiros na Partida (POB)</p>
                            <div className="grid grid-cols-3 gap-3">
                                <CounterField label="UE" val={formData.departureUeCount} onChange={v => updateField('departureUeCount', v)} color="blue" />
                                <CounterField label="EXT" val={formData.departureNonSchengenCount} onChange={v => updateField('departureNonSchengenCount', v)} color="red" />
                                <CounterField label="TRI" val={formData.departureCrewCount} onChange={v => updateField('departureCrewCount', v)} color="emerald" />
                            </div>
                        </div>

                        {/* CLASSIFICAÇÃO DA ROTA - PARTIDA */}
                        <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-auto">
                            <RouteToggle 
                                label="CLASSIFICAÇÃO DA ROTA (PARTIDA) *"
                                value={formData.departureRouteType}
                                onChange={v => updateField('departureRouteType', v)}
                                error={departureError}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. OBSERVAÇÕES E REGISTO */}
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
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-[#1c2636] border border-gray-200 dark:border-white/10 rounded-[24px] p-6 text-sm text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-primary shadow-inner resize-none transition-all"
                        />
                    </div>
                    
                    <div className="bg-white dark:bg-[#111827] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-2xl flex flex-col justify-center items-center text-center transition-colors">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-primary dark:text-blue-400 mb-4 shadow-inner">
                            <User className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Responsável pelo Registo</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{formData.createdBy}</p>
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">{formData.createdByCategory}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 w-full">
                            <p className="text-[10px] font-mono text-gray-400">{new Date().toLocaleDateString('pt-PT')} • {new Date().toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                </div>

                {/* 4. AÇÕES DE RODAPÉ */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-[#111827] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-2xl transition-all transition-colors">
                    <button 
                        type="submit"
                        className={`w-full md:flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${(arrivalError || departureError) ? 'bg-red-500' : 'bg-primary hover:bg-secondary dark:bg-blue-600 dark:hover:bg-blue-500 text-white'}`}
                    >
                        <Save className="w-5 h-5" />
                        {savedId ? 'Atualizar Processo' : 'Finalizar Registo de Voo'}
                    </button>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-gray-200 dark:border-white/5">
                        <button type="button" onClick={() => window.print()} className="p-4 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors" title="Imprimir Auto">
                            <Printer className="w-6 h-6 stroke-[1.5]" />
                        </button>
                        <button type="button" onClick={() => window.print()} className="p-4 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" title="Ver Documento">
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
        {error && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest ml-1">Seleção obrigatória</p>}
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
