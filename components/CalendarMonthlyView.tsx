import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface Holiday {
    name: string;
    isRegional?: boolean;
}

// Map of holidays (Day-Month)
const getHolidays = (year: number): Record<string, Holiday> => {
    // Fixed holidays
    const fixed: Record<string, Holiday> = {
        '1-1': { name: 'Ano Novo' },
        '25-4': { name: 'Dia da Liberdade' },
        '1-5': { name: 'Dia do Trabalhador' },
        '10-6': { name: 'Dia de Portugal' },
        '24-6': { name: 'Dia do Concelho (PXO)', isRegional: true }, // Regional Porto Santo
        '1-7': { name: 'Dia da Madeira', isRegional: true }, // Regional Madeira
        '15-8': { name: 'Assunção de Nossa Senhora' },
        '5-10': { name: 'Implantação da República' },
        '1-11': { name: 'Dia de Todos os Santos' },
        '1-12': { name: 'Restauração da Independência' },
        '8-12': { name: 'Imaculada Conceição' },
        '25-12': { name: 'Natal' }
    };

    // Calculate Easter for dynamic holidays (Simple implementation for 2025/2026 range)
    // Simplified logic or specific overrides for demo purposes
    // Good Friday (Sexta-feira Santa) and Easter Sunday, Corpus Christi (Corpo de Deus)
    // For 2025: Easter Apr 20. Good Friday Apr 18. Corpus Christi Jun 19.
    // For 2026: Easter Apr 5. Good Friday Apr 3. Corpus Christi Jun 4.
    
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

// Get ISO week number
const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const CalendarMonthlyView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday... 
        // We want 0 = Monday, 6 = Sunday for our grid logic
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

    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push({ type: 'empty', key: `empty-${i}` });
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${i}-${month + 1}`;
        const dateObj = new Date(year, month, i);
        const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const holiday = holidays[dateStr];
        const isToday = new Date().toDateString() === dateObj.toDateString();

        days.push({
            type: 'day',
            day: i,
            date: dateObj,
            isWeekend,
            holiday,
            isToday,
            key: `day-${i}`
        });
    }

    // Week rows generation
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells to start if needed to align weeks properly in chunks of 7
    // Actually, 'days' array already has padding. We just slice it.
    
    for (let i = 0; i < days.length; i += 7) {
        const weekSlice = days.slice(i, i + 7);
        // Calculate week number from the first actual day in this row
        const firstDayInRow = weekSlice.find(d => d.type === 'day');
        let weekNum = 0;
        if (firstDayInRow && firstDayInRow.type === 'day') {
            weekNum = getWeekNumber(firstDayInRow.date as Date);
        }
        
        // Pad end of last week
        while (weekSlice.length < 7) {
            weekSlice.push({ type: 'empty', key: `empty-end-${weekSlice.length}` });
        }
        
        weeks.push({ number: weekNum, days: weekSlice });
    }

    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
                {/* Header */}
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

                {/* Calendar Grid */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden transition-colors">
                    {/* Weekday Headers */}
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

                    {/* Days */}
                    <div className="flex-1 overflow-y-auto">
                        {weeks.map((week, wIdx) => (
                            <div key={wIdx} className="grid grid-cols-[50px_repeat(7,_1fr)] border-b border-gray-100 dark:border-gray-700 min-h-[100px]">
                                {/* Week Number */}
                                <div className="bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500">
                                    {week.number > 0 ? week.number : ''}
                                </div>
                                
                                {/* Days */}
                                {week.days.map((item: any) => {
                                    if (item.type === 'empty') {
                                        return <div key={item.key} className="bg-gray-50/30 dark:bg-gray-800/30 border-r border-gray-100 dark:border-gray-700 last:border-r-0"></div>;
                                    }

                                    return (
                                        <div 
                                            key={item.key} 
                                            className={`
                                                relative p-2 border-r border-gray-100 dark:border-gray-700 last:border-r-0 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group
                                                ${item.isWeekend ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}
                                                ${item.isToday ? 'ring-2 ring-inset ring-primary dark:ring-blue-500' : ''}
                                            `}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span 
                                                    className={`
                                                        text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                                        ${item.isToday ? 'bg-primary dark:bg-blue-600 text-white' : item.isWeekend ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}
                                                    `}
                                                >
                                                    {item.day}
                                                </span>
                                            </div>

                                            {item.holiday && (
                                                <div className="mt-2 text-xs font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 p-1 rounded border border-green-200 dark:border-green-800 leading-tight">
                                                    {item.holiday.name}
                                                    {item.holiday.isRegional && <span className="ml-1 text-[9px] uppercase tracking-tighter text-green-800 dark:text-green-200 opacity-70">(Reg.)</span>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex gap-6 text-sm text-gray-600 dark:text-gray-400 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800"></div>
                        <span>Feriado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"></div>
                        <span>Fim de Semana</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-primary dark:border-blue-500"></div>
                        <span>Hoje</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarMonthlyView;