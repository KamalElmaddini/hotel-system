import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Eye, XCircle, CheckCircle, Loader2, Pencil, Trash2 } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import { roomService } from '../services/roomService';
import type { Booking, User, Room } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import EditReservationModal from '../components/reservations/EditReservationModal';
import CalendarView from '../components/reservations/CalendarView';

const ReservationListPage = () => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [guests, setGuests] = useState<Record<string, User>>({});
    const [rooms, setRooms] = useState<Record<number, Room>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null);

    // Edit Modal State
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        booking: Booking | null;
    }>({
        isOpen: false,
        booking: null
    });

    const handleEditClick = (booking: Booking) => {
        setEditModal({
            isOpen: true,
            booking
        });
    };

    const handleEditSuccess = () => {
        fetchData();
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [bookingsData, guestsData, roomsData] = await Promise.all([
                bookingService.getBookings(),
                userService.searchGuests(''), // Fetch all guests (or use a better endpoint if available)
                roomService.getAvailableRooms()
            ]);

            setBookings(bookingsData);

            // Create a lookup map for guests
            const guestMap: Record<string, User> = {};
            guestsData.forEach(guest => {
                if (guest.id) guestMap[guest.id] = guest;
            });
            setGuests(guestMap);

            // Create a lookup map for rooms
            const roomMap: Record<number, Room> = {};
            roomsData.forEach(room => {
                roomMap[room.id] = room;
            });
            setRooms(roomMap);

        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        bookingId: number | null;
        action: 'CONFIRMED' | 'CANCELLED' | null;
    }>({
        isOpen: false,
        bookingId: null,
        action: null
    });

    const initiateStatusUpdate = (id: number, status: 'CONFIRMED' | 'CANCELLED') => {
        setConfirmModal({
            isOpen: true,
            bookingId: id,
            action: status
        });
    };

    const handleConfirmUpdate = async () => {
        if (!confirmModal.bookingId || !confirmModal.action) return;

        const id = confirmModal.bookingId;
        const status = confirmModal.action;

        setIsActionLoading(id);
        try {
            await bookingService.updateBooking(id, { status });
            // Refresh local state without full reload
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

            // Sync Room Status
            if (status === 'CONFIRMED') {
                const booking = bookings.find(b => b.id === id);
                if (booking) {
                    try {
                        await roomService.updateRoomStatus(booking.roomId, 'OCCUPIED');
                    } catch (err) {
                        console.warn('Failed to auto-update room occupancy', err);
                    }
                }
            } else if (status === 'CANCELLED') {
                const booking = bookings.find(b => b.id === id);
                if (booking) {
                    try {
                        await roomService.updateRoomStatus(booking.roomId, 'AVAILABLE');
                    } catch (err) {
                        console.warn('Failed to free up room', err);
                    }
                }
            }

        } catch (error) {
            console.error(`Failed to update booking ${id}`, error);
        } finally {
            setIsActionLoading(null);
        }
    };

    const getGuestName = (guestId: string) => {
        return guests[guestId]?.name || `Guest #${guestId}`;
    };

    const filteredBookings = statusFilter === 'All'
        ? bookings
        : bookings.filter(b => b.status === statusFilter);

    const handleDelete = async (booking: Booking) => {
        if (window.confirm(`Are you sure you want to delete the booking for ${getGuestName(booking.guestId)}?`)) {
            try {
                // Free up the room before deleting
                try {
                    await roomService.updateRoomStatus(booking.roomId, 'AVAILABLE');
                } catch (err) {
                    console.warn('Failed to reset room status', err);
                }

                await bookingService.deleteBooking(booking.id);
                fetchData(); // Refresh list after delete
            } catch (error) {
                console.error('Failed to delete booking', error);
                alert('Failed to delete booking');
            }
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin mb-2" />Loading reservations...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleConfirmUpdate}
                title={confirmModal.action === 'CANCELLED' ? 'Cancel Reservation' : 'Confirm Reservation'}
                message={confirmModal.action === 'CANCELLED'
                    ? 'Are you sure you want to cancel this reservation? This action cannot be undone.'
                    : 'Are you sure you want to confirm this reservation? The guest will be notified.'}
                confirmText={confirmModal.action === 'CANCELLED' ? 'Yes, Cancel' : 'Yes, Confirm'}
                confirmStyle={confirmModal.action === 'CANCELLED' ? 'danger' : 'success'}
            />

            <EditReservationModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ ...editModal, isOpen: false })}
                onSuccess={handleEditSuccess}
                booking={editModal.booking}
            />

            {/* Calendar Modal */}
            {isCalendarOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-serif font-bold text-base text-[#1a202c]">Reservation Calendar</h3>
                            <button onClick={() => setIsCalendarOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-all shadow-sm">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-0">
                            <CalendarView bookings={bookings} getGuestName={getGuestName} onEditBooking={(b) => {
                                setIsCalendarOpen(false); // Close calendar when selecting to edit
                                handleEditClick(b);
                            }} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Reservations</h1>
                    <p className="text-gray-500 mt-1">Manage bookings, check-ins, and guest schedules.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCalendarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-all"
                    >
                        <Calendar className="w-4 h-4" /> Calendar View
                    </button>
                    <Link to="/reservations/new" className="px-4 py-2 bg-[#1a202c] text-white rounded-lg text-sm font-bold hover:bg-[#2d3748] shadow-lg flex items-center justify-center">
                        + New Booking
                    </Link>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['All', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-[#1a202c] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reservation ID or guest..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#d69e2e]/50 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Reservation Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-gray-100">
                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="py-4 px-6">Res. ID</th>
                            <th className="py-4 px-6">Guest</th>
                            <th className="py-4 px-6">Room</th>
                            <th className="py-4 px-6">Dates</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Amount</th>
                            <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredBookings.map((res) => (
                            <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="py-4 px-6 font-mono text-xs text-gray-500 font-bold max-w-[100px] truncate" title={res.id.toString()}>
                                    {res.id}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#d69e2e]/10 text-[#d69e2e] flex items-center justify-center text-xs font-bold">
                                            {getGuestName(res.guestId).charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{getGuestName(res.guestId)}</span>
                                            <span className="text-xs text-gray-400 font-mono">{res.guestId}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs font-bold transform transition-transform hover:scale-105 inline-block">
                                        {rooms[res.roomId]?.roomNumber || `ID: ${res.roomId}`}
                                    </span>
                                    <span className="block text-xs text-gray-400 mt-1">{rooms[res.roomId]?.type?.replace('_', ' ') || 'Unknown Type'}</span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{new Date(res.checkInDate).toLocaleDateString()}</span>
                                        <span className="text-gray-400 text-xs">to {new Date(res.checkOutDate).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                        res.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            res.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                                                res.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {res.status || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right font-serif font-bold text-[#1a202c]">{res.totalPrice ?? '0.00'} MAD</td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-center items-center gap-2 transition-opacity">
                                        {/* Confirm Action */}
                                        {res.status === 'PENDING' && (
                                            <button
                                                onClick={() => initiateStatusUpdate(res.id, 'CONFIRMED')}
                                                disabled={isActionLoading === res.id}
                                                className="p-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                                                title="Confirm Reservation"
                                            >
                                                {isActionLoading === res.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                            </button>
                                        )}

                                        {/* Cancel Action */}
                                        {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                                            <button
                                                onClick={() => initiateStatusUpdate(res.id, 'CANCELLED')}
                                                disabled={isActionLoading === res.id}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                title="Cancel Reservation"
                                            >
                                                {isActionLoading === res.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                            </button>
                                        )}

                                        {/* Edit Action (Replaces generic View) */}
                                        <button
                                            onClick={() => handleEditClick(res)}
                                            className="p-1 text-gray-400 hover:text-blue-600"
                                            title="Edit Reservation"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(res)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete Reservation"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredBookings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Calendar className="w-12 h-12 text-gray-300" />
                                        <p className="font-medium">No reservations found</p>
                                        <p className="text-sm">Try adjusting your filters or create a new booking.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationListPage;
