import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, startOfDay } from 'date-fns';
import { bookingService } from '../services/bookingService';
import { roomService } from '../services/roomService';
import type { Booking, Room } from '../types';

const BookingCalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Generate array of days for the view (2 weeks)
    const days = eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: addDays(startOfWeek(currentDate), 13)
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [bookingsData, roomsData] = await Promise.all([
                    bookingService.getBookings(),
                    roomService.getAvailableRooms() // Ideally get ALL rooms, but this works for now
                ]);
                setBookings(bookingsData);
                // Sort rooms by number
                setRooms(roomsData.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })));
            } catch (error) {
                console.error("Failed to fetch calendar data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentDate]);

    // Check if a room is booked on a specific date
    const getBookingForRoomAndDate = (roomId: number, date: Date) => {
        return bookings.find(booking => {
            if (booking.roomId !== roomId) return false;

            // Allow checking for dates within the range
            const start = startOfDay(new Date(booking.checkInDate));
            const end = startOfDay(new Date(booking.checkOutDate));
            const check = startOfDay(date);

            return check >= start && check < end;
        });
    };

    const handleDragStart = (e: React.DragEvent, booking: Booking) => {
        e.dataTransfer.setData('bookingId', booking.id.toString());
    };

    const handleDrop = async (e: React.DragEvent, roomId: number, date: Date) => {
        e.preventDefault();
        const bookingId = parseInt(e.dataTransfer.getData('bookingId'));
        const booking = bookings.find(b => b.id === bookingId);

        if (!booking) return;

        // Calculate new end date based on duration
        const oldStart = new Date(booking.checkInDate);
        const oldEnd = new Date(booking.checkOutDate);
        const duration = oldEnd.getTime() - oldStart.getTime();

        const newStart = date;
        const newEnd = new Date(date.getTime() + duration);

        if (window.confirm(`Move booking #${bookingId} to Room ${rooms.find(r => r.id === roomId)?.roomNumber} starting ${format(newStart, 'MMM dd')}?`)) {
            try {
                // Optimistic update
                const updatedBookings = bookings.map(b =>
                    b.id === bookingId
                        ? { ...b, roomId, checkInDate: format(newStart, 'yyyy-MM-dd'), checkOutDate: format(newEnd, 'yyyy-MM-dd') }
                        : b
                );
                setBookings(updatedBookings);

                await bookingService.updateBooking(bookingId, {
                    roomId,
                    checkInDate: format(newStart, 'yyyy-MM-dd'),
                    checkOutDate: format(newEnd, 'yyyy-MM-dd')
                });
            } catch (error) {
                console.error("Failed to move booking", error);
                alert("Failed to move booking. reverting.");
                // Revert would require re-fetching or keeping previous state
                const originalBookings = await bookingService.getBookings(); // Simple revert
                setBookings(originalBookings);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    if (isLoading) return <div className="p-12 text-center text-gray-500">Loading calendar...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-[#1a202c] flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8" /> Reservation Calendar
                </h1>
                <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
                    <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-2 hover:bg-gray-100 rounded-md">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 font-bold text-sm hover:bg-gray-100 rounded-md">
                        Today
                    </button>
                    <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-2 hover:bg-gray-100 rounded-md">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-auto shadow-sm">
                {/* Header Row: Dates */}
                <div className="flex sticky top-0 z-20 bg-gray-50 border-b border-gray-200 min-w-fit">
                    <div className="w-40 shrink-0 p-4 font-bold text-gray-500 bg-gray-50 sticky left-0 z-30 border-r border-gray-200">
                        Room
                    </div>
                    {days.map(day => (
                        <div key={day.toString()} className="flex-1 min-w-[100px] p-4 text-center border-r border-gray-100">
                            <p className="text-xs text-gray-500 uppercase">{format(day, 'EEE')}</p>
                            <p className="font-bold text-[#1a202c]">{format(day, 'd MMM')}</p>
                        </div>
                    ))}
                </div>

                {/* Body: Rooms */}
                <div className="min-w-fit">
                    {rooms.map(room => (
                        <div key={room.id} className="flex border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <div className="w-40 shrink-0 p-4 flex flex-col justify-center sticky left-0 z-10 bg-white border-r border-gray-200">
                                <span className="font-bold text-[#1a202c]">Room {room.roomNumber}</span>
                                <span className="text-xs text-gray-500">{room.type.replace('_', ' ')}</span>
                            </div>
                            {days.map(day => {
                                const booking = getBookingForRoomAndDate(room.id, day);
                                const isStart = booking && isSameDay(startOfDay(new Date(booking.checkInDate)), day);

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className="flex-1 min-w-[100px] h-20 border-r border-gray-100 relative p-1"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, room.id, day)}
                                    >
                                        {booking && isStart && (
                                            <div
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, booking)}
                                                className="absolute top-2 left-1 h-16 bg-[#1a202c] text-white rounded-lg shadow-md p-2 cursor-move hover:bg-[#2d3748] z-10 overflow-hidden"
                                                style={{
                                                    width: `calc(${((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) * 100}% - 8px)`
                                                }}
                                                title={`Guest: ${booking.guestId}`}
                                            >
                                                <p className="font-bold text-xs truncate">#{booking.id}</p>
                                                <p className="text-[10px] truncate opacity-80">Guest {booking.guestId}</p>
                                            </div>
                                        )}
                                        {/* Continue bar for non-start days */}
                                        {booking && !isStart && (
                                            <div className="w-full h-full bg-gray-50/0"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookingCalendarPage;
