import React, { useState, useRef, useEffect } from 'react';
import { Save, Trash2, FileText, Plus, Minus, CheckCircle, AlertCircle, Shield, PlaneLanding, PlaneTakeoff, ArrowLeftRight, MessageSquare, Paperclip, Upload, X, File, CheckSquare, Square, Globe, Ban, Printer, Calendar, Edit, Archive, Users, MapPin, Hash, Tag, UserCheck, ArrowRight } from 'lucide-react';
import { FlightFormData, FlightType, FlightStatus, FlightNature, UserProfile } from '../types';
import { saveFlight, deleteFlight } from '../services/db';

interface FlightFormProps {
    initialData?: FlightFormData | null;
    onClear?: () => void;
    currentUser?: UserProfile | null;
}

const FlightForm: React.FC<FlightFormProps> = ({ initialData, onClear, currentUser }) => {
    const currentYear = new Date().getFullYear();
    const defaultForm: FlightFormData = {
        flightNumber: '',
        flightType: '',
        flightNature: '',
        status: 'Agendado',
        aircraftType: '',
        gesdocNumber: '',
        gesdocYear: currentYear >= 2026 ? currentYear : 2026,
        createdBy: '',
        createdByCategory: '',
        
        regVPArrival: '',
        origin: '',
        scheduleTimeArrival: '',
        dateArrival: '',
        
        arrivalUeCount: 0,
        arrivalNonSchengenCount: 0,
        arrivalCrewCount: 0,

        regVPDeparture: '',
        destination: '',
        scheduleTimeDeparture: '',
        dateDeparture: '',

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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generate years 2026-2050
    const gesdocYears = Array.from({length: 25}, (_, i) => 2026 + i);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setSavedId(initialData.id || null);
        } else {
            // New flight: Set creator and category
            setFormData({
                ...defaultForm,
                createdBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
                createdByCategory: currentUser ? currentUser.category : ''
            });
            setSavedId(null);
        }
    }, [initialData, currentUser]);

    // Checklist Items
    const checklistItemsArrival = [
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

    const checklistItemsDeparture = [
        "DGVP - GEN DEC",
        "Consulta SIS II",
        "Enviar Email (SOA/OPA/Groundforce)",
        "Controlo Documental Obrigatório",
        "Dispensa de Controlo Documental",
        "Registar Voo na Capa de Registos",
        "Registar: Lista de Voos / Lista Paxs",
        "Elaborar Relatório de Turno",
        "Enviar Relatório por Email",
        "Imprimir Relatório de Tráfego Aéreo",
        "Arquivar na Capa de Voos Privados"
    ];

    const toggleChecklist = (key: string) => {
        setFormData(prev => ({
            ...prev,
            checklist: {
                ...prev.checklist,
                [key]: !prev.checklist?.[key]
            }
        }));
    };

    const toggleSchengen = (type: 'arrival' | 'departure', isSchengen: boolean) => {
        const keySch = `${type}_type_sch`;
        const keyNsch = `${type}_type_nsch`;
        
        setFormData(prev => {
            const newChecklist = { ...prev.checklist };
            if (isSchengen) {
                newChecklist[keySch] = true;
                newChecklist[keyNsch] = false;
            } else {
                newChecklist[keySch] = false;
                newChecklist[keyNsch] = true;
            }
            return { ...prev, checklist: newChecklist };
        });

        // Clear error if exists
        if (errors[`${type}_checklist_type`]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[`${type}_checklist_type`];
                return newErrs;
            });
        }
    };

    // Validation Rules
    const validateField = (name: string, value: any) => {
        let error = '';
        switch (name) {
            case 'flightNumber':
                if (!value.trim()) error = 'Obrigatório.';
                break;
            case 'flightType':
                if (!value) error = 'Selecione o movimento.';
                break;
            case 'flightNature':
                if (!value) error = 'Selecione a natureza.';
                break;
            case 'aircraftType':
                if (!value.trim()) error = 'Obrigatório.';
                break;
            case 'operator':
                if (!value.trim()) error = 'Obrigatório.';
                break;
        }
        return error;
    };

    const updateField = (field: keyof FlightFormData, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            
            // Auto-fill defaults based on movement type
            if (field === 'flightType') {
                if (value === FlightType.ARRIVAL) {
                    newData.destination = 'LPPS';
                    newData.origin = '';
                } else if (value === FlightType.DEPARTURE) {
                    newData.origin = 'LPPS';
                    newData.destination = '';
                } else if (value === FlightType.TURNAROUND) {
                    newData.destination = ''; // User sets next leg
                    newData.origin = ''; // User sets prev leg
                }
            }
            return newData;
        });

        if (touched[field]) {
            setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
        }
    };

    const handleBlur = (field: keyof FlightFormData) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({ ...prev, [field]: validateField(field, formData[field]) }));
    };

    const updateCount = (field: keyof FlightFormData, delta: number) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: Math.max(0, (prev[field] as number) + delta) 
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (5MB limit example)
            if (file.size > 5 * 1024 * 1024) {
                alert("O ficheiro excede o limite de 5MB.");
                return;
            }
            updateField('attachmentName', file.name);
        }
    };

    const removeAttachment = () => {
        updateField('attachmentName', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        
        const fields: (keyof FlightFormData)[] = ['flightNumber', 'flightType', 'flightNature', 'aircraftType', 'operator'];
        
        fields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        // Conditional validation based on Flight Type
        if (formData.flightType === FlightType.ARRIVAL || formData.flightType === FlightType.TURNAROUND) {
            if (!formData.origin.trim()) { newErrors.origin = 'Origem obrigatória'; isValid = false; }
            if (!formData.regVPArrival?.trim()) { newErrors.regVPArrival = 'Reg VP obrigatório'; isValid = false; }
            
            // Validate Arrival Checklist Type (SCH vs NSCH)
            if (!formData.checklist?.['arrival_type_sch'] && !formData.checklist?.['arrival_type_nsch']) {
                newErrors.arrival_checklist_type = 'Selecione SCH ou NSCH na checklist de chegada.';
                isValid = false;
            }
        }
        if (formData.flightType === FlightType.DEPARTURE || formData.flightType === FlightType.TURNAROUND) {
            if (!formData.destination.trim()) { newErrors.destination = 'Destino obrigatório'; isValid = false; }
            if (!formData.regVPDeparture?.trim()) { newErrors.regVPDeparture = 'Reg VP obrigatório'; isValid = false; }

             // Validate Departure Checklist Type (SCH vs NSCH)
             if (!formData.checklist?.['departure_type_sch'] && !formData.checklist?.['departure_type_nsch']) {
                newErrors.departure_checklist_type = 'Selecione SCH ou NSCH na checklist de partida.';
                isValid = false;
            }
        }

        setErrors(newErrors);
        setTouched(fields.reduce((acc, curr) => ({...acc, [curr]: true}), {}));
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setStatus({ type: 'error', message: 'Preencha os campos obrigatórios e selecione a natureza da fronteira.' });
            return;
        }

        try {
            const id = await saveFlight(formData);
            setSavedId(id);
            setFormData(prev => ({ ...prev, id })); // Update local state with ID
            
            // Trigger Success Modal
            setShowSuccessModal(true);
            
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Erro ao guardar voo.' });
        }
    };

    // --- Action Handlers ---

    // 1. Continue Editing: Close modal, keep data
    const handleContinueEditing = () => {
        setShowSuccessModal(false);
        setStatus(null);
    };

    // 2. Archive: Close modal, CLEAR data (New Entry)
    const handleArchive = () => {
        setShowSuccessModal(false);
        setFormData({
            ...defaultForm,
            // Re-apply current agent for new form
            createdBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
            createdByCategory: currentUser ? currentUser.category : ''
        });
        setSavedId(null);
        setErrors({});
        setTouched({});
        setStatus({ type: 'success', message: 'Registo arquivado. Pronto para novo registo.' });
        if (onClear) onClear(); // Clear parent editing state if applicable
    };

    // 3. Delete: Remove from DB, CLEAR data
    const handleDeleteAction = async () => {
        if (window.confirm('Tem a certeza que deseja eliminar este registo permanentemente?')) {
            try {
                if (savedId || formData.id) {
                    await deleteFlight(savedId || formData.id || '');
                }
                handleArchive(); // Reset form after delete
                setStatus({ type: 'success', message: 'Registo eliminado.' });
            } catch (error) {
                console.error("Error deleting", error);
                setStatus({ type: 'error', message: 'Erro ao eliminar registo.' });
            }
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const renderInput = (label: string, field: keyof FlightFormData, type: string = "text", placeholder: string = "", disabled: boolean = false, required: boolean = false) => (
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex justify-between">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
                type="text" 
                className={`w-full px-3 py-1.5 text-sm border rounded-md transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 
                ${errors[field] 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-blue-500 focus:border-primary'}`}
                placeholder={placeholder}
                value={formData[field] as string}
                onChange={(e) => updateField(field, e.target.value)}
                onBlur={() => handleBlur(field)}
                disabled={disabled}
            />
            {errors[field] && <span className="text-red-500 text-[10px] block">{errors[field]}</span>}
        </div>
    );

    const isArrival = formData.flightType === FlightType.ARRIVAL;
    const isDeparture = formData.flightType === FlightType.DEPARTURE;
    const isTurnaround = formData.flightType === FlightType.TURNAROUND;

    const enableArrival = isArrival || isTurnaround;
    const enableDeparture = isDeparture || isTurnaround;

    // Helper to get header style based on status
    const getHeaderBadgeClass = () => {
        switch (formData.status) {
            case 'Realizado': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800';
            case 'Cancelado': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800';
            case 'Confirmado': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800';
            case 'Arquivado': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800';
            default: return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800';
        }
    };

    const totalPax = (formData.arrivalUeCount || 0) + (formData.arrivalNonSchengenCount || 0) + (formData.departureUeCount || 0) + (formData.departureNonSchengenCount || 0);
    const totalCrew = (formData.arrivalCrewCount || 0) + (formData.departureCrewCount || 0);

    return (
        <div className="p-4 relative">
            {/* Toast */}
            {status && !showSuccessModal && (
                <div className={`fixed top-20 right-6 p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium text-sm">{status.message}</span>
                </div>
            )}

            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-700 relative">
                        
                        {/* Close Button */}
                        <button 
                            onClick={closeSuccessModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors z-20"
                            title="Fechar Janela"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex gap-5">
                            {/* Blue Icon */}
                            <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <File className="w-7 h-7 text-blue-500" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                                {/* Header: Number + Status */}
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl font-bold text-white leading-tight truncate">
                                        {formData.flightNumber}
                                    </h2>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        formData.status === 'Confirmado' ? 'bg-green-500/20 text-green-400' :
                                        formData.status === 'Realizado' ? 'bg-blue-500/20 text-blue-400' :
                                        formData.status === 'Cancelado' ? 'bg-red-500/20 text-red-400' :
                                        formData.status === 'Arquivado' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {formData.status}
                                    </span>
                                </div>

                                {/* Timings */}
                                <div className="text-gray-300 text-sm space-y-1">
                                    {(isArrival || isTurnaround) && (
                                        <div className="flex items-center gap-2">
                                            <PlaneLanding className="w-3.5 h-3.5 text-blue-400" /> 
                                            <span className="truncate"><span className="font-bold text-gray-400">Che:</span> {formData.scheduleTimeArrival || '--:--'} <span className="text-xs text-gray-500">({formData.dateArrival ? new Date(formData.dateArrival).toLocaleDateString('pt-PT') : '--/--'})</span></span>
                                        </div>
                                    )}
                                    {(isDeparture || isTurnaround) && (
                                        <div className="flex items-center gap-2">
                                            <PlaneTakeoff className="w-3.5 h-3.5 text-orange-400" /> 
                                            <span className="truncate"><span className="font-bold text-gray-400">Par:</span> {formData.scheduleTimeDeparture || '--:--'} <span className="text-xs text-gray-500">({formData.dateDeparture ? new Date(formData.dateDeparture).toLocaleDateString('pt-PT') : '--/--'})</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Route */}
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                    <span>
                                        {isTurnaround ? (
                                            <span className="flex items-center gap-1">
                                                {formData.origin} <ArrowRight className="w-3 h-3" /> LPPS <ArrowRight className="w-3 h-3" /> {formData.destination}
                                            </span>
                                        ) : isArrival ? (
                                            `${formData.origin} → LPPS`
                                        ) : (
                                            `LPPS → ${formData.destination}`
                                        )}
                                    </span>
                                </div>

                                {/* Internal Numbers & Gesdoc */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.gesdocNumber && (
                                        <div className="bg-white/10 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/10 flex items-center gap-1" title="Número Gesdoc">
                                            <Hash className="w-3 h-3 text-white" />
                                            <span className="font-bold text-white">GESDOC:</span> {formData.gesdocNumber}/{formData.gesdocYear}
                                        </div>
                                    )}

                                    {(isArrival || isTurnaround) && formData.regVPArrival && (
                                        <div className="bg-blue-900/40 px-2 py-1 rounded text-[10px] text-blue-200 border border-blue-800/50 flex items-center gap-1" title="Registo VP Chegada">
                                            <Tag className="w-3 h-3" />
                                            <span className="font-bold">VP Che:</span> {formData.regVPArrival}
                                        </div>
                                    )}

                                    {(isDeparture || isTurnaround) && formData.regVPDeparture && (
                                        <div className="bg-orange-900/40 px-2 py-1 rounded text-[10px] text-orange-200 border border-orange-800/50 flex items-center gap-1" title="Registo VP Partida">
                                            <Tag className="w-3 h-3" />
                                            <span className="font-bold">VP Par:</span> {formData.regVPDeparture}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Pax/Crew */}
                                <div className="flex items-center gap-4 text-sm text-gray-400 pt-1">
                                    <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>Pax: <span className="text-white font-bold">{totalPax}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded">
                                        <span className="font-bold text-[10px] border border-gray-600 px-1 rounded-sm">CRW</span>
                                        <span>Trip: <span className="text-white font-bold">{totalCrew}</span></span>
                                    </div>
                                </div>

                                {/* Observations */}
                                {formData.observations && (
                                    <div className="mt-2 bg-gray-800/30 p-2 rounded border-l-2 border-yellow-500/50">
                                        <p className="text-xs text-gray-400 line-clamp-2 italic">"{formData.observations}"</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mt-3 pt-3 border-t border-gray-700/50">
                                    <div className="text-xs">
                                        <span className="text-gray-400 font-bold block mb-0.5">Comp. Aérea / Operadora:</span>
                                        <span className="text-gray-300 font-medium">{formData.operator || '---'}</span>
                                    </div>
                                    <div className="text-xs text-right">
                                        <span className="text-gray-400 font-bold block mb-0.5">Agente:</span>
                                        <div className="text-gray-300 font-medium flex flex-col items-end">
                                            <span className="flex items-center gap-1">
                                                {formData.createdBy || '---'}
                                                <UserCheck className="w-3 h-3 text-blue-400" />
                                            </span>
                                            {formData.createdByCategory && (
                                                <span className="text-[9px] text-gray-500">{formData.createdByCategory}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Icons */}
                        <div className="flex justify-end gap-6 mt-8 border-t border-gray-700/30 pt-4">
                            <button 
                                onClick={() => window.print()} 
                                className="text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-white/5 flex flex-col items-center gap-1"
                                title="Imprimir Ficha"
                            >
                                <Printer className="w-5 h-5" />
                                <span className="text-[10px]">Imprimir</span>
                            </button>
                            <button 
                                onClick={handleContinueEditing} 
                                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded hover:bg-white/5 flex flex-col items-center gap-1"
                                title="Continuar a Editar"
                            >
                                <Edit className="w-5 h-5" />
                                <span className="text-[10px]">Editar</span>
                            </button>
                            <button 
                                onClick={handleArchive} 
                                className="text-gray-400 hover:text-green-400 transition-colors p-2 rounded hover:bg-white/5 flex flex-col items-center gap-1"
                                title="Arquivar e Novo"
                            >
                                <Archive className="w-5 h-5" />
                                <span className="text-[10px]">Arquivar</span>
                            </button>
                            <button 
                                onClick={handleDeleteAction}
                                className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded hover:bg-white/5 flex flex-col items-center gap-1"
                                title="Apagar Registo"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span className="text-[10px]">Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto transition-colors">
                
                {/* Custom PSP Header Layout */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b-2 border-gray-100 dark:border-gray-700 gap-4">
                    
                    {/* LEFT: PSP Logo & Unit */}
                    <div className="flex items-center gap-4 w-full md:w-1/3">
                         <div className="w-14 h-14 bg-[#0e2c6c] rounded-full flex items-center justify-center shadow-md flex-shrink-0 border-2 border-white dark:border-gray-600 relative overflow-hidden">
                            {/* Simple CSS shape or Lucide Shield to simulate PSP logo */}
                             <div className="absolute inset-0 border-[3px] border-red-600 rounded-full opacity-20"></div>
                            <Shield className="w-8 h-8 text-white" fill="currentColor" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-[#0e2c6c] dark:text-blue-400 leading-tight">POLÍCIA SEGURANÇA PÚBLICA</span>
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mt-0.5">ESACFPS / DSAM - PF008</span>
                         </div>
                    </div>

                    {/* CENTER: Title */}
                    <div className="w-full md:w-1/3 text-center">
                        <h1 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight leading-tight">
                            Ficha de Controlo de <br/> Voo Privado
                        </h1>
                         {initialData && (
                            <div className="inline-block bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-2 border border-blue-100 dark:border-blue-800">
                                MODO DE EDIÇÃO: {initialData.flightNumber}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Gesdoc & Status */}
                    <div className="w-full md:w-1/3 flex flex-col items-end justify-center gap-2">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center gap-3">
                             <div className="text-right">
                                <span className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Registo GESDOC</span>
                                <span className="block text-xl font-mono font-bold text-[#0e2c6c] dark:text-white leading-none">
                                    {formData.gesdocNumber ? `${formData.gesdocNumber}/${formData.gesdocYear}` : '---/----'}
                                </span>
                             </div>
                             <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                             <Hash className="w-6 h-6 text-gray-400" />
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                             {initialData && (
                                <button 
                                    onClick={() => {
                                        if(onClear) onClear();
                                        setFormData(defaultForm);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-600 hover:underline font-bold mr-2 transition-colors"
                                >
                                    Cancelar
                                </button>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider shadow-sm ${getHeaderBadgeClass()}`}>
                                {formData.status}
                            </span>
                        </div>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* General Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        {renderInput("N.º Voo", "flightNumber", "text", "TP1699", false, true)}
                        {renderInput("Aeronave", "aircraftType", "text", "Cessna 172", false, true)}
                        {renderInput("Companhia Aérea / Operadora", "operator", "text", "NetJets", false, true)}
                        
                        <div className="flex flex-col gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
                                <select 
                                    className={`w-full px-3 py-1.5 text-sm border rounded-md outline-none focus:ring-1 focus:ring-primary font-bold ${
                                        formData.status === 'Realizado' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                        formData.status === 'Confirmado' ? 'bg-green-50 text-green-700 border-green-300' :
                                        formData.status === 'Cancelado' ? 'bg-red-50 text-red-700 border-red-300' :
                                        formData.status === 'Arquivado' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                                        'bg-yellow-50 text-yellow-700 border-yellow-300'
                                    }`}
                                    value={formData.status}
                                    onChange={(e) => updateField('status', e.target.value)}
                                >
                                    <option value="Agendado">Agendado</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Realizado">Realizado</option>
                                    <option value="Cancelado">Cancelado</option>
                                    <option value="Arquivado">Arquivado</option>
                                </select>
                            </div>

                            {/* GESDOC Field */}
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-md border border-yellow-200 dark:border-yellow-800/30">
                                <label className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase flex items-center gap-1 mb-1">
                                    <Hash className="w-3 h-3" /> GESDOC
                                </label>
                                <div className="flex gap-1">
                                    <input 
                                        type="text"
                                        className="w-full px-2 py-1 text-xs border border-yellow-300 dark:border-yellow-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-yellow-500"
                                        placeholder="N.º Registo"
                                        value={formData.gesdocNumber || ''}
                                        onChange={(e) => updateField('gesdocNumber', e.target.value)}
                                    />
                                    <select 
                                        className="w-20 px-1 py-1 text-xs border border-yellow-300 dark:border-yellow-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-yellow-500"
                                        value={formData.gesdocYear}
                                        onChange={(e) => updateField('gesdocYear', parseInt(e.target.value))}
                                    >
                                        {gesdocYears.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flight Nature & Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Natureza do Voo *</label>
                            <select 
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                                value={formData.flightNature}
                                onChange={(e) => updateField('flightNature', e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="Voo Privado">Voo Privado</option>
                                <option value="Voo Militar">Voo Militar</option>
                                <option value="Voo Divergido">Voo Divergido</option>
                                <option value="Voo de Carga">Voo de Carga</option>
                                <option value="Voo Diplomático">Voo Diplomático</option>
                                <option value="Voo de Instrução">Voo de Instrução</option>
                            </select>
                            {errors.flightNature && <span className="text-red-500 text-[10px]">{errors.flightNature}</span>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tipo de Movimento *</label>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => updateField('flightType', FlightType.ARRIVAL)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded border text-xs font-medium transition-all ${isArrival ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                >
                                    <PlaneLanding className="w-3 h-3" /> Chegada
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateField('flightType', FlightType.DEPARTURE)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded border text-xs font-medium transition-all ${isDeparture ? 'bg-orange-600 text-white border-orange-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                >
                                    <PlaneTakeoff className="w-3 h-3" /> Partida
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateField('flightType', FlightType.TURNAROUND)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded border text-xs font-medium transition-all ${isTurnaround ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                >
                                    <ArrowLeftRight className="w-3 h-3" /> Escala - Voo
                                </button>
                            </div>
                            {errors.flightType && <span className="text-red-500 text-[10px]">{errors.flightType}</span>}
                        </div>
                    </div>

                    {/* Columns: Data + Checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        
                        {/* LEFT SIDE: ARRIVAL */}
                        <div className="flex flex-col gap-6">
                            {/* Arrival Data Box */}
                            <div className={`border rounded-lg p-4 transition-all ${enableArrival ? 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 opacity-50 bg-gray-50 dark:bg-gray-800'}`}>
                                <div className="flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-300 border-b border-blue-100 dark:border-blue-800 pb-2">
                                    <PlaneLanding className="w-4 h-4" />
                                    <span className="font-bold text-sm">DADOS CHEGADA</span>
                                </div>
                                <div className="space-y-3">
                                    {renderInput("Reg VP Chegada", "regVPArrival", "text", "N.º Interno", !enableArrival, enableArrival)}
                                    {renderInput("Origem", "origin", "text", "Aeroporto Origem", !enableArrival, enableArrival)}
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Destino</label>
                                        <input 
                                            type="text" 
                                            value="LPPS" 
                                            disabled 
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {renderInput("Hora Prevista", "scheduleTimeArrival", "time", "", !enableArrival)}
                                        {renderInput("Data Chegada", "dateArrival", "date", "", !enableArrival)}
                                    </div>

                                    {/* Arrival POB */}
                                    <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">POB (Chegada)</span>
                                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 rounded-full font-bold">
                                                {formData.arrivalUeCount + formData.arrivalNonSchengenCount + formData.arrivalCrewCount}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <CountBoxSmall 
                                                label="UE" 
                                                count={formData.arrivalUeCount} 
                                                disabled={!enableArrival}
                                                onInc={() => updateCount('arrivalUeCount', 1)} 
                                                onDec={() => updateCount('arrivalUeCount', -1)} 
                                            />
                                            <CountBoxSmall 
                                                label="Extra" 
                                                count={formData.arrivalNonSchengenCount} 
                                                disabled={!enableArrival}
                                                onInc={() => updateCount('arrivalNonSchengenCount', 1)} 
                                                onDec={() => updateCount('arrivalNonSchengenCount', -1)} 
                                            />
                                            <CountBoxSmall 
                                                label="Trip" 
                                                count={formData.arrivalCrewCount} 
                                                disabled={!enableArrival}
                                                onInc={() => updateCount('arrivalCrewCount', 1)} 
                                                onDec={() => updateCount('arrivalCrewCount', -1)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Arrival Checklist */}
                            {enableArrival && (
                                <div className={`bg-[#1a2332] rounded-lg border overflow-hidden ${errors.arrival_checklist_type ? 'border-red-500' : 'border-gray-700'}`}>
                                    <div className="bg-transparent p-3 border-b border-gray-700 flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4 text-green-400" />
                                            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider">Checklist Chegada</h3>
                                        </div>
                                        {/* Schengen / Non-Schengen Selector */}
                                        <div className="flex gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => toggleSchengen('arrival', true)}
                                                className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1
                                                    ${formData.checklist?.['arrival_type_sch'] 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <Globe className="w-3 h-3" /> SCH
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => toggleSchengen('arrival', false)}
                                                className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1
                                                    ${formData.checklist?.['arrival_type_nsch'] 
                                                        ? 'bg-orange-600 text-white' 
                                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <Ban className="w-3 h-3" /> NSCH
                                            </button>
                                        </div>
                                        {errors.arrival_checklist_type && <span className="text-red-400 text-[10px] font-bold">obrigatório selecionar natureza</span>}
                                    </div>
                                    <div className="p-1">
                                        {checklistItemsArrival.map((item, idx) => {
                                            const key = `arrival-${idx}`;
                                            const isChecked = formData.checklist?.[key] || false;
                                            return (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => toggleChecklist(key)}
                                                    className={`
                                                        flex items-center gap-3 p-3 rounded cursor-pointer transition-colors border-b border-gray-800/50 last:border-0
                                                        ${isChecked ? 'bg-green-900/10' : 'hover:bg-white/5'}
                                                    `}
                                                >
                                                    {isChecked ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                                                    )}
                                                    <span className={`text-xs font-medium ${isChecked ? 'text-green-300' : 'text-gray-400'}`}>
                                                        {item}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE: DEPARTURE */}
                        <div className="flex flex-col gap-6">
                            {/* Departure Data Box */}
                            <div className={`border rounded-lg p-4 transition-all ${enableDeparture ? 'border-orange-200 dark:border-orange-900 bg-orange-50/30 dark:bg-orange-900/10' : 'border-gray-200 dark:border-gray-700 opacity-50 bg-gray-50 dark:bg-gray-800'}`}>
                                <div className="flex items-center gap-2 mb-4 text-orange-800 dark:text-orange-300 border-b border-orange-100 dark:border-orange-800 pb-2">
                                    <PlaneTakeoff className="w-4 h-4" />
                                    <span className="font-bold text-sm">DADOS PARTIDA</span>
                                </div>
                                <div className="space-y-3">
                                    {renderInput("Reg VP Partida", "regVPDeparture", "text", "N.º Interno", !enableDeparture, enableDeparture)}
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Origem</label>
                                        <input 
                                            type="text" 
                                            value="LPPS" 
                                            disabled 
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium"
                                        />
                                    </div>

                                    {renderInput("Destino", "destination", "text", "Aeroporto Destino", !enableDeparture, enableDeparture)}
                                    <div className="grid grid-cols-2 gap-2">
                                        {renderInput("Hora Prevista", "scheduleTimeDeparture", "time", "", !enableDeparture)}
                                        {renderInput("Data Partida", "dateDeparture", "date", "", !enableDeparture)}
                                    </div>

                                     {/* Departure POB */}
                                     <div className="mt-4 pt-3 border-t border-orange-200 dark:border-orange-800/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase">POB (Partida)</span>
                                            <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-1.5 rounded-full font-bold">
                                                {formData.departureUeCount + formData.departureNonSchengenCount + formData.departureCrewCount}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <CountBoxSmall 
                                                label="UE" 
                                                count={formData.departureUeCount} 
                                                disabled={!enableDeparture}
                                                onInc={() => updateCount('departureUeCount', 1)} 
                                                onDec={() => updateCount('departureUeCount', -1)} 
                                            />
                                            <CountBoxSmall 
                                                label="Extra" 
                                                count={formData.departureNonSchengenCount} 
                                                disabled={!enableDeparture}
                                                onInc={() => updateCount('departureNonSchengenCount', 1)} 
                                                onDec={() => updateCount('departureNonSchengenCount', -1)} 
                                            />
                                            <CountBoxSmall 
                                                label="Trip" 
                                                count={formData.departureCrewCount} 
                                                disabled={!enableDeparture}
                                                onInc={() => updateCount('departureCrewCount', 1)} 
                                                onDec={() => updateCount('departureCrewCount', -1)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                             {/* Departure Checklist */}
                             {enableDeparture && (
                                <div className={`bg-[#1a2332] rounded-lg border overflow-hidden ${errors.departure_checklist_type ? 'border-red-500' : 'border-gray-700'}`}>
                                    <div className="bg-transparent p-3 border-b border-gray-700 flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4 text-red-400" />
                                            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">Checklist Partida</h3>
                                        </div>
                                         {/* Schengen / Non-Schengen Selector */}
                                         <div className="flex gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => toggleSchengen('departure', true)}
                                                className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1
                                                    ${formData.checklist?.['departure_type_sch'] 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <Globe className="w-3 h-3" /> SCH
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => toggleSchengen('departure', false)}
                                                className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1
                                                    ${formData.checklist?.['departure_type_nsch'] 
                                                        ? 'bg-orange-600 text-white' 
                                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <Ban className="w-3 h-3" /> NSCH
                                            </button>
                                        </div>
                                        {errors.departure_checklist_type && <span className="text-red-400 text-[10px] font-bold">obrigatório selecionar natureza</span>}
                                    </div>
                                    <div className="p-1">
                                        {checklistItemsDeparture.map((item, idx) => {
                                            const key = `departure-${idx}`;
                                            const isChecked = formData.checklist?.[key] || false;
                                            return (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => toggleChecklist(key)}
                                                    className={`
                                                        flex items-center gap-3 p-3 rounded cursor-pointer transition-colors border-b border-gray-800/50 last:border-0
                                                        ${isChecked ? 'bg-red-900/10' : 'hover:bg-white/5'}
                                                    `}
                                                >
                                                    {isChecked ? (
                                                        <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                                                    )}
                                                    <span className={`text-xs font-medium ${isChecked ? 'text-red-300' : 'text-gray-400'}`}>
                                                        {item}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observations & Attachments Footer */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        
                        {/* Observations */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-5 h-5 text-primary dark:text-blue-400" />
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Observações</h3>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notas Adicionais</label>
                                <textarea 
                                    className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-500 resize-y min-h-[80px]"
                                    placeholder="Informações relevantes sobre o voo, tripulação ou passageiros..."
                                    value={formData.observations}
                                    onChange={(e) => updateField('observations', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Paperclip className="w-5 h-5 text-primary dark:text-blue-400" />
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Anexos</h3>
                            </div>
                            
                            {!formData.attachmentName ? (
                                <div 
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mb-2">
                                        <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-bold text-primary dark:text-blue-400">Anexar Ficheiro</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, CSV ou XLSX (Máx. 5MB)</span>
                                </div>
                            ) : (
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-600 dark:text-red-400">
                                            <File className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formData.attachmentName}</p>
                                            <p className="text-xs text-gray-400">Pronto para envio</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={removeAttachment}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".pdf,.csv,.xlsx,.xls,.docx,.doc" 
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Agent Info Field - Read Only */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
                             <div className="bg-primary/10 dark:bg-blue-900/30 p-2 rounded-full">
                                <UserCheck className="w-5 h-5 text-primary dark:text-blue-400" />
                             </div>
                             <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Registado Por</label>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {formData.createdBy || '---'}
                                    {formData.createdByCategory && <span className="text-gray-500 dark:text-gray-400 text-sm font-normal"> - {formData.createdByCategory}</span>}
                                </div>
                             </div>
                             <div className="text-xs text-gray-400">
                                {new Date().toLocaleDateString('pt-PT')}
                             </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button type="submit" className="flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold shadow-md transition-all text-sm flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" /> {initialData ? 'ATUALIZAR' : 'REGISTAR'}
                        </button>
                        <button type="button" className="px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg font-medium text-sm transition-all" onClick={() => window.confirm('Limpar formulário?') && setFormData({...defaultForm, flightNumber: ''})}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CountBoxSmall: React.FC<{ label: string; count: number; onInc: () => void; onDec: () => void; disabled: boolean }> = ({ label, count, onInc, onDec, disabled }) => (
    <div className={`flex flex-col bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">{label}</span>
        <div className="flex items-center justify-between">
            <button type="button" onClick={onDec} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 text-gray-600 dark:text-gray-300"><Minus className="w-2.5 h-2.5" /></button>
            <span className="text-xs font-bold w-4 text-center">{count}</span>
            <button type="button" onClick={onInc} className="w-5 h-5 flex items-center justify-center bg-blue-50 dark:bg-blue-900/50 rounded hover:bg-blue-100 text-blue-600 dark:text-blue-400"><Plus className="w-2.5 h-2.5" /></button>
        </div>
    </div>
);

export default FlightForm;