import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarRange } from 'lucide-react';

interface Holiday {
    name: string;
    isRegional?: boolean;
}

const getHolidays = (year: number): Record<string, Holiday> => {
    // Reuse logic or import logic (Duplicated here for XML isolation)
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

const MiniCalendar: React.FC<{ year: number; month: number }> = ({ year, month }) => {
    const holidays = getHolidays(year);
    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => {
        const day = new Date(y, m, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = new Date(year, month).toLocaleString('pt-PT', { month: 'long' });

    const cells = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`empty-${i}`} className="h-6"></div>);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${i}-${month + 1}`;
        const dateObj = new Date(year, month, i);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const holiday = holidays[dateStr];
        const isToday = new Date().toDateString() === dateObj.toDateString();

        cells.push(
            <div 
                key={i} 
                className={`
                    h-6 flex items-center justify-center text-[10px] rounded-sm
                    ${isToday ? 'bg-primary text-white font-bold' : ''}
                    ${!isToday && holiday ? 'text-green-700 font-extrabold bg-green-50' : ''}
                    ${!isToday && !holiday && isWeekend ? 'bg-gray-100 text-gray-500' : ''}
                    ${!isToday && !holiday && !isWeekend ? 'text-gray-700' : ''}
                `}
                title={holiday?.name}
            >
                {i}
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-primary mb-2 capitalize text-center">{monthName}</h3>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                    <div key={i} className={`text-[10px] font-bold text-center ${i >= 5 ? 'text-red-400' : 'text-gray-400'}`}>
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {cells}
            </div>
        </div>
    );
};

const CalendarAnnualView: React.FC = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <CalendarRange className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Calendário Anual {year}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setYear(year - 1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-xl text-primary px-2">{year}</span>
                        <button onClick={() => setYear(year + 1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <MiniCalendar key={idx} year={year} month={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarAnnualView;