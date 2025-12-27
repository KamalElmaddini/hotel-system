import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { Booking } from '../../types';

interface CalendarViewProps {
    bookings: Booking[];
    getGuestName: (id: string) => string;
    onEditBooking: (booking: Booking) => void;
}

const CalendarView = ({ bookings, getGuestName, onEditBooking }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    // Helper to get day of week for 1st of month (0-6, 0=Sun)
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const today = () => setCurrentDate(new Date());

    // Filter bookings for this month
    // We include bookings that start in this month OR end in this month OR span the entire month
    const monthBookings = bookings.filter(b => {
        const start = new Date(b.checkInDate);
        const end = new Date(b.checkOutDate);
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);

        return (start <= monthEnd && end >= monthStart);
    });

    const renderCalendarDays = () => {
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="bg-gray-50/50 border-r border-b border-gray-100 min-h-[60px]"></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayDate = new Date(year, month, day);
            const isToday = new Date().toDateString() === currentDayDate.toDateString();

            // Find bookings for this day
            const dayBookings = monthBookings.filter(b => {
                const start = new Date(b.checkInDate);
                const end = new Date(b.checkOutDate);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                currentDayDate.setHours(0, 0, 0, 0);
                return currentDayDate >= start && currentDayDate < end;
            });

            days.push(
                <div key={day} className={`min-h-[60px] border-r border-b border-gray-100 p-0.5 relative group hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
                    <div className={`text-right text-[10px] font-semibold mb-0.5 ${isToday ? 'text-blue-600 bg-blue-100 w-4 h-4 rounded-full flex items-center justify-center ml-auto' : 'text-gray-400'} pr-1 pt-1`}>
                        {day}
                    </div>

                    <div className="flex flex-col gap-0.5 max-h-[50px] overflow-hidden hover:overflow-y-auto no-scrollbar">
                        {dayBookings.map(booking => (
                            <button
                                key={booking.id}
                                onClick={() => onEditBooking(booking)}
                                className={`text-[9px] px-1 py-0.5 rounded truncate text-left font-medium transition-all hover:scale-[1.02] shadow-sm leading-tight
                                    ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border-l-2 border-green-500' :
                                        booking.status === 'PENDING' ? 'bg-orange-100 text-orange-800 border-l-2 border-orange-500' :
                                            booking.status === 'CANCELLED' ? 'bg-red-50 text-red-400 decoration-line-through' :
                                                'bg-gray-100 text-gray-600'
                                    }`}
                                title={`#${booking.id} ${getGuestName(booking.guestId)}`}
                            >
                                {getGuestName(booking.guestId)}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-2 flex items-center justify-between border-b border-gray-100 bg-white shrink-0">
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex gap-2 items-center">
                    <select
                        value={month}
                        onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                        className="text-sm font-serif font-bold text-gray-800 bg-transparent border border-gray-200 rounded p-1 cursor-pointer hover:bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        {monthNames.map((name, index) => (
                            <option key={name} value={index}>{name}</option>
                        ))}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                        className="text-sm font-serif font-bold text-gray-800 bg-transparent border border-gray-200 rounded p-1 cursor-pointer hover:bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 1 + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <button onClick={today} className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                    Today
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50 shrink-0">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="py-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1">
                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default CalendarView;
