import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Trash2, CheckCircle2, Circle, Clock, AlertTriangle, Plane, Users, Calendar, Bell, Repeat } from 'lucide-react';
import { Reminder, ReminderType, RecurrenceType } from '../types';
import { getReminders, saveReminder, deleteReminder as dbDeleteReminder } from '../services/db';

const RemindersView: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [subject, setSubject] = useState('');
    const [dateStr, setDateStr] = useState('');
    const [timeStr, setTimeStr] = useState('09:00');
    const [selectedType, setSelectedType] = useState<ReminderType>('Alerta');
    const [recurrence, setRecurrence] = useState<RecurrenceType>('Não repetir');
    const [hasAlarm, setHasAlarm] = useState(false);

    const loadReminders = async () => {
        try {
            const data = await getReminders();
            setReminders(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReminders();
    }, []);

    const addReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !dateStr || !timeStr) return;

        const dateTime = new Date(`${dateStr}T${timeStr}`);

        const newItem: Reminder = {
            id: crypto.randomUUID(),
            subject: subject,
            date: dateTime,
            type: selectedType,
            recurrence: recurrence,
            alarm: hasAlarm,
            completed: false
        };

        await saveReminder(newItem);
        await loadReminders();
        
        // Reset Form
        setSubject('');
        setDateStr('');
        setTimeStr('09:00');
        setHasAlarm(false);
        setSelectedType('Alerta');
        setRecurrence('Não repetir');
    };

    const toggleComplete = async (id: string) => {
        const item = reminders.find(r => r.id === id);
        if (item) {
            await saveReminder({ ...item, completed: !item.completed });
            await loadReminders();
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Remover este lembrete?")) {
            await dbDeleteReminder(id);
            await loadReminders();
        }
    };

    const getTypeConfig = (type: ReminderType) => {
        switch(type) {
            case 'Alerta': 
                return { color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: <AlertTriangle className="w-4 h-4" /> };
            case 'Voo Privado': 
                return { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: <Plane className="w-4 h-4" /> };
            case 'Reunião': 
                return { color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', icon: <Users className="w-4 h-4" /> };
            default: 
                return { color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800', icon: <BellRing className="w-4 h-4" /> };
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Carregando dados...</div>;

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-6">
                     <div className="p-2 bg-primary/10 dark:bg-blue-900/30 rounded-lg text-primary dark:text-blue-400 transition-colors">
                        <BellRing className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Lembretes & Tarefas</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Gestão de pendentes do turno</p>
                    </div>
                </div>

                {/* Add New Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Novo Lembrete</h3>
                    <form onSubmit={addReminder} className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Assunto</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Verificar Voo TP168..." 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-primary dark:focus:border-blue-500 outline-none transition-all"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-48 space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tipo</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none transition-all"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value as ReminderType)}
                                >
                                    <option value="Alerta">Alerta</option>
                                    <option value="Voo Privado">Voo Privado</option>
                                    <option value="Reunião">Reunião</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="w-full md:w-40 space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Data</label>
                                <input 
                                    type="date" 
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none transition-all"
                                    value={dateStr}
                                    onChange={(e) => setDateStr(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-32 space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Hora</label>
                                <input 
                                    type="time" 
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none transition-all"
                                    value={timeStr}
                                    onChange={(e) => setTimeStr(e.target.value)}
                                    required
                                />
                            </div>

                             <div className="w-full md:w-44 space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Repetir</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none transition-all"
                                    value={recurrence}
                                    onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                                >
                                    <option value="Não repetir">Não repetir</option>
                                    <option value="Diariamente">Diariamente</option>
                                    <option value="Semanalmente">Semanalmente</option>
                                    <option value="Mensalmente">Mensalmente</option>
                                    <option value="Anualmente">Anualmente</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-2 py-2">
                                <button
                                    type="button"
                                    onClick={() => setHasAlarm(!hasAlarm)}
                                    className={`h-[42px] flex items-center gap-2 px-4 rounded-lg border transition-colors ${hasAlarm ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
                                    title="Ativar Alarme"
                                >
                                    <Bell className={`w-5 h-5 ${hasAlarm ? 'fill-red-600 dark:fill-red-300' : ''}`} />
                                </button>
                            </div>

                            <button 
                                type="submit"
                                className="w-full md:w-auto ml-auto bg-primary dark:bg-blue-600 text-white px-6 py-2 h-[42px] rounded-lg hover:bg-secondary dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                                Adicionar
                            </button>
                        </div>
                    </form>
                </div>

                {/* Lists */}
                <div className="space-y-4 pb-12">
                    {/* Active */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">A Fazer ({reminders.filter(r => !r.completed).length})</h3>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden transition-colors">
                        {reminders.filter(r => !r.completed).length === 0 && (
                            <div className="p-8 text-center text-gray-400 dark:text-gray-500 italic">Sem tarefas pendentes!</div>
                        )}
                        {reminders.filter(r => !r.completed).map(item => {
                            const config = getTypeConfig(item.type);
                            const itemDate = new Date(item.date);
                            return (
                                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => toggleComplete(item.id)} className="text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                                            <Circle className="w-6 h-6" />
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-gray-800 dark:text-gray-100">{item.subject}</p>
                                                {item.alarm && (
                                                    <Bell className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${config.color}`}>
                                                    {config.icon}
                                                    {item.type}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {itemDate.toLocaleDateString('pt-PT')}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {itemDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {item.recurrence !== 'Não repetir' && (
                                                     <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                                                        <Repeat className="w-3 h-3" />
                                                        {item.recurrence}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Completed */}
                    {reminders.some(r => r.completed) && (
                        <>
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-8 mb-2">Concluído</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden opacity-75 transition-colors">
                                {reminders.filter(r => r.completed).map(item => (
                                    <div key={item.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => toggleComplete(item.id)} className="text-green-600 dark:text-green-500">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </button>
                                            <div>
                                                <p className="font-medium text-gray-500 dark:text-gray-400 line-through">{item.subject}</p>
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex gap-2">
                                                    <span>{item.type} • {new Date(item.date).toLocaleDateString('pt-PT')}</span>
                                                    {item.recurrence !== 'Não repetir' && <span>(Repete: {item.recurrence})</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(item.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-2">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RemindersView;