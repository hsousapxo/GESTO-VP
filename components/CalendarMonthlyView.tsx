import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Plus, X, Bell, Clock, AlertTriangle, Plane, Users } from 'lucide-react';
import { Reminder, ReminderType, RecurrenceType } from '../types';
import { getReminders, saveReminder } from '../services/db';

interface Holiday {
    name: string;
    isRegional?: boolean;
}

const getHolidays = (year: number): Record<string, Holiday> => {
    const fixed: Record<string, Holiday> = {
        '1-1': { name: 'Ano Novo' },
        '25-4': { name: 'Dia da Liberdade' },
        '1-5': { name: 'Dia do Trabalhador' },
        '10-6': { name: 'Dia de Portugal' },
        '24-6': { name: 'Dia do Concelho (PXO)', isRegional: true },
        '1-7': { name: 'Dia da Madeira', isRegional: true },
        '15-8': { name: 'Assunção de Nossa Senhora' },
        '5-10': { name: 'Implantação da República' },
        '1-11': { name: 'Dia de Todos os Santos' },
        '1-12': { name: 'Restauração da Independência' },
        '8-12': { name: 'Imaculada Conceição' },
        '25-12': { name: 'Natal' }
    };
    if (year === 2025) {
        fixed['18-4'] = { name: 'Sexta-Feira Santa' };
        fixed['20-4'] = { name: 'Páscoa' };
        fixed['19-6'] = { name: 'Corpo de Deus' };
    } else if (year === 2026) {
        fixed['3-4'] = { name: 'Sexta-Feira Santa' };
        fixed['5-4'] = { name: 'Páscoa' };
        fixed['4-6'] = { name: 'Corpo de Deus' };
    }
    return fixed;
};

const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const CalendarMonthlyView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Form states for new reminder
    const [subject, setSubject] = useState('');
    const [time, setTime] = useState('09:00');
    const [type, setType] = useState<ReminderType>('Alerta');

    const loadData = async () => {
        const data = await getReminders();
        setReminders(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const holidays = getHolidays(year);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const today = () => setCurrentDate(new Date());

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setShowAddModal(true);
    };

    const handleAddReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !selectedDate) return;

        const reminderDate = new Date(selectedDate);
        const [hours, mins] = time.split(':');
        reminderDate.setHours(parseInt(hours), parseInt(mins));

        const newReminder: Reminder = {
            id: crypto.randomUUID(),
            subject,
            date: reminderDate,
            type,
            recurrence: 'Não repetir',
            alarm: true,
            completed: false
        };

        await saveReminder(newReminder);
        setSubject('');
        setShowAddModal(false);
        loadData();
    };

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push({ type: 'empty', key: `empty-${i}` });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${i}-${month + 1}`;
        const dateObj = new Date(year, month, i);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const holiday = holidays[dateStr];
        const isToday = new Date().toDateString() === dateObj.toDateString();

        const dayReminders = reminders.filter(r => 
            new Date(r.date).getDate() === i && 
            new Date(r.date).getMonth() === month && 
            new Date(r.date).getFullYear() === year
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        days.push({
            type: 'day',
            day: i,
            date: dateObj,
            isWeekend,
            holiday,
            isToday,
            reminders: dayReminders,
            key: `day-${i}`
        });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        const weekSlice = days.slice(i, i + 7);
        const firstDayInRow = weekSlice.find(d => d.type === 'day');
        let weekNum = 0;
        if (firstDayInRow && firstDayInRow.type === 'day') {
            weekNum = getWeekNumber(firstDayInRow.date as Date);
        }
        while (weekSlice.length < 7) {
            weekSlice.push({ type: 'empty', key: `empty-end-${weekSlice.length}` });
        }
        weeks.push({ number: weekNum, days: weekSlice });
    }

    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    const getTypeIcon = (type: ReminderType) => {
        switch(type) {
            case 'Alerta': return <AlertTriangle className="w-2.5 h-2.5" />;
            case 'Voo Privado': return <Plane className="w-2.5 h-2.5" />;
            case 'Reunião': return <Users className="w-2.5 h-2.5" />;
            default: return <Bell className="w-2.5 h-2.5" />;
        }
    };

    const getTypeColor = (type: ReminderType) => {
        switch(type) {
            case 'Alerta': return 'bg-red-500 text-white';
            case 'Voo Privado': return 'bg-blue-500 text-white';
            case 'Reunião': return 'bg-purple-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="p-6 h-full flex flex-col relative">
            {/* QUICK ADD MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary dark:bg-blue-900 text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Novo Lembrete
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleAddReminder} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Data Selecionada</label>
                                <div className="text-sm font-bold text-primary dark:text-blue-400">
                                    {selectedDate?.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assunto</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="O que precisa de lembrar?"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Hora</label>
                                    <input 
                                        type="time" 
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tipo</label>
                                    <select 
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                        value={type}
                                        onChange={(e) => setType(e.target.value as ReminderType)}
                                    >
                                        <option value="Alerta">Alerta</option>
                                        <option value="Voo Privado">Voo Privado</option>
                                        <option value="Reunião">Reunião</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-xl font-bold transition-all shadow-lg mt-4">
                                GUARDAR
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 dark:bg-blue-900/30 rounded-lg text-primary dark:text-blue-400">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                            {currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={today} className="px-4 py-1 text-sm font-medium bg-primary dark:bg-blue-600 text-white rounded-md hover:bg-secondary dark:hover:bg-blue-700 transition-colors">
                            Hoje
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden transition-colors">
                    <div className="grid grid-cols-[50px_repeat(7,_1fr)] border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <div className="p-3 text-center text-xs font-bold text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            Sem.
                        </div>
                        {weekDays.map((day, idx) => (
                            <div key={day} className={`p-3 text-center text-sm font-semibold ${idx >= 5 ? 'text-red-400 dark:text-red-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {weeks.map((week, wIdx) => (
                            <div key={wIdx} className="grid grid-cols-[50px_repeat(7,_1fr)] border-b border-gray-100 dark:border-gray-700 min-h-[110px]">
                                <div className="bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500">
                                    {week.number > 0 ? week.number : ''}
                                </div>
                                
                                {week.days.map((item: any) => {
                                    if (item.type === 'empty') {
                                        return <div key={item.key} className="bg-gray-50/30 dark:bg-gray-800/30 border-r border-gray-100 dark:border-gray-700 last:border-r-0"></div>;
                                    }

                                    return (
                                        <div 
                                            key={item.key} 
                                            onClick={() => handleDayClick(item.date)}
                                            className={`
                                                relative p-2 border-r border-gray-100 dark:border-gray-700 last:border-r-0 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group
                                                ${item.isWeekend ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}
                                                ${item.isToday ? 'ring-2 ring-inset ring-primary dark:ring-blue-500' : ''}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span 
                                                    className={`
                                                        text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                                                        ${item.isToday ? 'bg-primary dark:bg-blue-600 text-white' : item.isWeekend ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}
                                                    `}
                                                >
                                                    {item.day}
                                                </span>
                                                <Plus className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            {item.holiday && (
                                                <div className="mb-1 text-[9px] font-black text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1 rounded truncate border border-green-100 dark:border-green-800/30">
                                                    {item.holiday.name}
                                                </div>
                                            )}

                                            {/* Reminders List */}
                                            <div className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                                                {item.reminders?.map((rem: Reminder) => (
                                                    <div 
                                                        key={rem.id} 
                                                        className={`flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-bold truncate ${getTypeColor(rem.type)} shadow-sm`}
                                                        title={`${new Date(rem.date).toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'})} - ${rem.subject}`}
                                                    >
                                                        {getTypeIcon(rem.type)}
                                                        <span className="truncate">{rem.subject}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 px-2 font-medium">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div> Alertas</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"></div> Voos Privados</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-purple-500"></div> Reuniões</div>
                    <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-700 pl-4"><div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900 border border-green-200"></div> Feriado</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border border-primary dark:border-blue-500 ring-1 ring-primary/30"></div> Hoje</div>
                </div>
            </div>
        </div>
    );
};

export default CalendarMonthlyView;