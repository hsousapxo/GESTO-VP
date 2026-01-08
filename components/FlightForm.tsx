import React, { useState, useRef, useEffect } from 'react';
import { Save, Trash2, FileText, Plus, Minus, CheckCircle, AlertCircle, Shield, PlaneLanding, PlaneTakeoff, ArrowLeftRight, MessageSquare, Paperclip, Upload, X, File, CheckSquare, Square, Globe, Ban, Printer } from 'lucide-react';
import { FlightFormData, FlightType, FlightStatus, FlightNature } from '../types';
import { saveFlight } from '../services/db';

interface FlightFormProps {
    initialData?: FlightFormData | null;
    onClear?: () => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ initialData, onClear }) => {
    const defaultForm: FlightFormData = {
        flightNumber: '',
        flightType: '',
        flightNature: '',
        status: 'Agendado',
        aircraftType: '',
        gesdocNumber: '',
        
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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultForm);
        }
    }, [initialData]);

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
            await saveFlight(formData);
            // Trigger Success Modal
            setShowSuccessModal(true);
            
            // Optional status message (Modal covers this mostly)
            setStatus({ type: 'success', message: `Voo ${formData.flightNumber} guardado com sucesso!` });
            
            // Do not clear immediately if editing, allow user to close modal first
            // But if it's a new flight, maybe clear?
            // Let's keep data in form until user decides to close modal or clear.
            
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Erro ao guardar voo.' });
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        if (!initialData) {
            // Only reset if it was a new creation, otherwise keep data for further editing
             setFormData(defaultForm);
             setErrors({});
             setTouched({});
        }
        setStatus(null);
    };

    const renderInput = (label: string, field: keyof FlightFormData, type: string = "text", placeholder: string = "", disabled: boolean = false, required: boolean = false) => (
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex justify-between">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
                type={type}
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
            default: return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800';
        }
    };

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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-green-100 dark:border-green-900">
                        <div className="bg-green-600 p-6 flex flex-col items-center justify-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">Registo Efetuado!</h2>
                            <p className="opacity-90 mt-1">O voo foi gravado na base de dados.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Voo</span>
                                    <span className="block text-gray-800 dark:text-gray-200 font-bold text-lg">{formData.flightNumber}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Status</span>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                        formData.status === 'Confirmado' ? 'bg-green-100 text-green-700' :
                                        formData.status === 'Realizado' ? 'bg-blue-100 text-blue-700' : 
                                        formData.status === 'Cancelado' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {formData.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Total POB</span>
                                    <span className="block text-gray-800 dark:text-gray-200 font-bold text-lg">
                                        {(formData.arrivalUeCount + formData.arrivalNonSchengenCount + formData.arrivalCrewCount + 
                                          formData.departureUeCount + formData.departureNonSchengenCount + formData.departureCrewCount)}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Operador</span>
                                    <span className="block text-gray-800 dark:text-gray-200 font-bold truncate">{formData.operator}</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button 
                                    onClick={() => window.print()}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <Printer className="w-4 h-4" /> Imprimir
                                </button>
                                <button 
                                    onClick={closeSuccessModal}
                                    className="flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    Fechar Janela
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto transition-colors">
                
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Shield className={`w-8 h-8 ${formData.status === 'Realizado' ? 'text-blue-600' : 'text-primary dark:text-blue-500'}`} />
                        <div>
                            <h1 className="text-lg font-bold text-primary dark:text-blue-400 leading-none">
                                {initialData ? `Editar Voo ${initialData.flightNumber}` : 'Ficha de Controlo de Voo Privado'}
                            </h1>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">ESACFPS / DSAM</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        {initialData && (
                            <button 
                                onClick={() => {
                                    if(onClear) onClear();
                                    setFormData(defaultForm);
                                }}
                                className="mr-2 text-xs text-gray-500 hover:text-red-500 underline"
                            >
                                Cancelar Edição
                            </button>
                        )}
                        <div className={`px-3 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-2 ${getHeaderBadgeClass()}`}>
                            <span>Registo Gesdoc:</span>
                            <input 
                                type="text"
                                className="bg-transparent border-b border-current outline-none w-24 text-center placeholder-current/50 focus:border-current"
                                placeholder="N.º"
                                value={formData.gesdocNumber || ''}
                                onChange={(e) => updateField('gesdocNumber', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* General Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        {renderInput("N.º Voo", "flightNumber", "text", "TP1699", false, true)}
                        {renderInput("Aeronave", "aircraftType", "text", "Cessna 172", false, true)}
                        {renderInput("Operador", "operator", "text", "NetJets", false, true)}
                        
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
                            <select 
                                className={`w-full px-3 py-1.5 text-sm border rounded-md outline-none focus:ring-1 focus:ring-primary font-bold ${
                                    formData.status === 'Realizado' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                    formData.status === 'Confirmado' ? 'bg-green-50 text-green-700 border-green-300' :
                                    formData.status === 'Cancelado' ? 'bg-red-50 text-red-700 border-red-300' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-300'
                                }`}
                                value={formData.status}
                                onChange={(e) => updateField('status', e.target.value)}
                            >
                                <option value="Agendado">Agendado</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Realizado">Realizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
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
                                    <ArrowLeftRight className="w-3 h-3" /> Escala
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