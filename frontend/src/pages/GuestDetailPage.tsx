import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Edit } from 'lucide-react';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import EditGuestModal from '../components/guests/EditGuestModal';

const GuestDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const refreshData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const userData = await userService.getGuest(id);
            setUser(userData);
        } catch (error) {
            console.error("Failed to refresh guest", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const [userData, bookingsData] = await Promise.all([
                    userService.getGuest(id),
                    bookingService.getBookings(id)
                ]);
                setUser(userData);
                setBookings(bookingsData);
            } catch (error) {
                console.error("Failed to fetch guest details", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading && !user) return <div className="p-8 text-center">Loading guest profile...</div>;
    if (!user) return <div className="p-8 text-center">Guest not found.</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Directory
            </button>

            {/* Header / Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row gap-8 items-start relative">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-8 right-8 p-2 text-gray-400 hover:text-[#1a202c] hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <Edit className="w-5 h-5" />
                </button>

                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-serif text-gray-500">
                    {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-serif font-bold text-[#1a202c] mb-2">{user.name}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" /> {user.phone || 'No phone provided'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" /> Member since Jan 2024
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide">
                            Platinum Member
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                            Active
                        </span>
                    </div>
                </div>
            </div>

            <EditGuestModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onGuestUpdated={refreshData}
                initialData={user}
            />

            {/* Booking History */}
            <h2 className="text-xl font-serif font-bold text-[#1a202c] mb-4">Booking History</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc]">
                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="py-4 px-6">Booking ID</th>
                            <th className="py-4 px-6">Dates</th>
                            <th className="py-4 px-6">Room</th>
                            <th className="py-4 px-6">Total</th>
                            <th className="py-4 px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="py-4 px-6 font-mono text-sm">#{booking.id}</td>
                                <td className="py-4 px-6 text-sm">
                                    {/* Format dates properly in a real app */}
                                    {booking.checkInDate} - {booking.checkOutDate}
                                </td>
                                <td className="py-4 px-6 text-sm">Room {booking.roomId}</td>
                                <td className="py-4 px-6 text-sm font-bold">{booking.totalPrice} MAD</td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                        ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">No booking history found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuestDetailPage;
