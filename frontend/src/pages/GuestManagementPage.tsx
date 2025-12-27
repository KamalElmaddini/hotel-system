import { useState, useEffect } from 'react';
import { Search, UserPlus, Mail, Trash2 } from 'lucide-react';
import { userService } from '../services/userService';
import { bookingService } from '../services/bookingService';
import type { User, Booking } from '../types';
import CreateGuestModal from '../components/guests/CreateGuestModal';
import EditGuestModal from '../components/guests/EditGuestModal';

type GuestStatus = 'Active' | 'Reserved' | 'Reservation Ended' | 'No History';

interface GuestWithStatus extends User {
    status: GuestStatus;
}

const GuestManagementPage = () => {
    const [guests, setGuests] = useState<GuestWithStatus[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<User | null>(null);

    const deriveGuestStatus = (guestBookings: Booking[]): GuestStatus => {
        if (!guestBookings || guestBookings.length === 0) return 'No History';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hasActive = guestBookings.some(b => {
            if (b.status === 'CANCELLED') return false;
            const start = new Date(b.checkInDate);
            const end = new Date(b.checkOutDate);
            return start <= today && end >= today;
        });
        if (hasActive) return 'Active';

        const hasFuture = guestBookings.some(b => {
            if (b.status === 'CANCELLED') return false;
            const start = new Date(b.checkInDate);
            return start > today;
        });
        if (hasFuture) return 'Reserved';

        return 'Reservation Ended';
    };

    const fetchGuests = async () => {
        setIsLoading(true);
        try {
            // Fetch guests and all bookings in parallel
            const [users, allBookings] = await Promise.all([
                userService.searchGuests(searchTerm),
                bookingService.getBookings()
            ]);

            // Map bookings by guestId for O(1) lookup
            const bookingsByGuest: Record<string, Booking[]> = {};
            allBookings.forEach(b => {
                if (!bookingsByGuest[b.guestId]) {
                    bookingsByGuest[b.guestId] = [];
                }
                bookingsByGuest[b.guestId].push(b);
            });

            // Merge status
            const guestsWithStatus: GuestWithStatus[] = users.map(user => {
                const userBookings = bookingsByGuest[user.id.toString()] || []; // guestId in booking is string, user.id might be generic
                // Note: user.id is string in User interface, but typically numeric ID from DB.
                // Checking User type, id is string.
                // Checking Booking entity, guestId is String.
                return {
                    ...user,
                    status: deriveGuestStatus(userBookings)
                };
            });

            setGuests(guestsWithStatus);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchGuests();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const getStatusColor = (status: GuestStatus) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Reserved': return 'bg-blue-100 text-blue-700';
            case 'Reservation Ended': return 'bg-gray-100 text-gray-600';
            case 'No History': return 'bg-gray-50 text-gray-400';
            default: return 'bg-gray-50 text-gray-400';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Guest Directory</h1>
                    <p className="text-gray-500 mt-1">Manage guest profiles, loyalty status, and history.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1a202c] text-white rounded-lg text-sm font-bold hover:bg-[#2d3748] shadow-lg">
                    <UserPlus className="w-4 h-4" /> Add Guest
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1a202c]">{guests.length}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Guests</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1a202c]">{guests.filter(g => g.status === 'Active').length}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase">Active Now</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1a202c]">{guests.filter(g => g.status === 'Reserved').length}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase">Reserved</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search guests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#d69e2e]/50 outline-none"
                        />
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc]">
                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="py-4 px-6">Full Name</th>
                            <th className="py-4 px-6">Gender</th>
                            <th className="py-4 px-6">Nationality</th>
                            <th className="py-4 px-6">ID Document</th>
                            <th className="py-4 px-6">Contact Info</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {guests.map((guest) => (
                            <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 font-bold text-[#1a202c]">{guest.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{guest.gender || '-'}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{guest.nationality || '-'}</td>
                                <td className="py-4 px-6 text-sm text-gray-600 font-mono">{guest.identityDocument || '-'}</td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3 text-gray-400" /> {guest.email}
                                        </div>
                                        {guest.phone && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-400">PH:</span> {guest.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(guest.status)}`}>
                                        {guest.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to delete this guest?')) {
                                                    try {
                                                        await userService.deleteGuest(guest.id);
                                                        fetchGuests();
                                                    } catch (error: any) {
                                                        console.error('Failed to delete guest:', error);
                                                        const message = error.response?.data?.message || 'Failed to delete guest';
                                                        alert(message);
                                                    }
                                                }
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete Guest"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedGuest(guest);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#d69e2e] transition-colors"
                                            title="Edit Guest"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                        <button onClick={() => window.location.href = `/guests/${guest.id}`} className="text-sm font-bold text-[#d69e2e] hover:underline">View Profile</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {guests.length === 0 && !isLoading && (
                            <tr><td colSpan={7} className="py-8 text-center text-gray-500">No guests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CreateGuestModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onGuestCreated={() => {
                    fetchGuests();
                }}
            />

            {selectedGuest && (
                <EditGuestModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedGuest(null);
                    }}
                    onGuestUpdated={() => {
                        fetchGuests();
                    }}
                    initialData={selectedGuest}
                />
            )}
        </div>
    );
};

export default GuestManagementPage;
