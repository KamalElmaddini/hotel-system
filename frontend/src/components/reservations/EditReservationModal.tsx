
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Booking } from '../../types';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';

interface EditReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    booking: Booking | null;
}

const EditReservationModal = ({ isOpen, onClose, onSuccess, booking }: EditReservationModalProps) => {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [roomId, setRoomId] = useState<number | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (booking && isOpen) {
            setCheckInDate(booking.checkInDate);
            setCheckOutDate(booking.checkOutDate);
            setRoomId(booking.roomId);
            fetchRooms();
        }
    }, [booking, isOpen]);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const data = await roomService.getAvailableRooms();
            setRooms(data);
        } catch (error) {
            console.error('Failed to fetch rooms', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!booking || !roomId) return;

        setIsSaving(true);
        try {
            await bookingService.updateBooking(booking.id, {
                checkInDate,
                checkOutDate,
                roomId
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update booking', error);
            alert('Failed to update reservation. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !booking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-serif font-bold text-lg text-[#1a202c]">Edit Reservation #{booking.id}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Check In Date</label>
                        <input
                            type="date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#d69e2e] outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Check Out Date</label>
                        <input
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#d69e2e] outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Room</label>
                        <select
                            value={roomId || ''}
                            onChange={(e) => setRoomId(Number(e.target.value))}
                            disabled={isLoading}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#d69e2e] outline-none"
                        >
                            <option value="" disabled>Select a room</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.roomNumber} ({room.type}) - {room.pricePerNight} MAD
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#1a202c] hover:bg-[#2d3748] rounded-lg shadow-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditReservationModal;
