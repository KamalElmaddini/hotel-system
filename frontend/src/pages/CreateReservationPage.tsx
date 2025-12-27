import { useState, useEffect } from 'react';
import { User, Calendar, BedDouble, CheckCircle, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import type { User as GuestUser } from '../services/userService';
import type { Room } from '../types';

const STEPS = [
    { id: 1, title: 'Guest Selection', icon: User },
    { id: 2, title: 'Dates & Room', icon: Calendar },
    { id: 3, title: 'Confirmation', icon: CheckCircle },
];

const CreateReservationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);

    // Form State
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guestId, setGuestId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [bookingId, setBookingId] = useState<number | null>(null);

    // Guest Search State
    const [searchResults, setSearchResults] = useState<GuestUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (currentStep === 2) {
            const fetchRooms = async () => {
                const data = await roomService.getAvailableRooms(checkInDate, checkOutDate);
                setRooms(data);
            };
            fetchRooms();
        }
    }, [currentStep, checkInDate, checkOutDate]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length > 2) {
            setIsSearching(true);
            try {
                const results = await userService.searchGuests(query);
                setSearchResults(results);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleCreateBooking = async () => {
        if (!selectedRoom || !checkInDate || !checkOutDate || !guestId) {
            return alert('Please select a guest, dates and a room');
        }

        setIsLoading(true);
        try {
            const id = await bookingService.createBooking({
                guestId,
                roomId: selectedRoom,
                checkInDate,
                checkOutDate
            });

            // Automatically mark room as OCCUPIED
            try {
                await roomService.updateRoomStatus(selectedRoom, 'OCCUPIED');
            } catch (err) {
                console.warn('Failed to auto-update room status', err);
            }

            userService.createNotification(`New Reservation #${id} created via Wizard`, 'success');

            setBookingId(id);
            setCurrentStep(3);
        } catch (error) {
            console.error('Booking failed', error);
            alert('Failed to create booking');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-[#1a202c] mb-8">New Reservation</h1>

            {/* Stepper */}
            <div className="flex items-center justify-between relative mb-12 max-w-3xl mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-50 px-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${isActive ? 'border-[#d69e2e] bg-white text-[#d69e2e]' :
                                isCompleted ? 'border-[#1a202c] bg-[#1a202c] text-white' :
                                    'border-gray-200 bg-white text-gray-300'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-bold ${isActive ? 'text-[#1a202c]' : 'text-gray-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] p-8">
                {currentStep === 1 && (
                    <div className="max-w-xl mx-auto space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold font-serif">Select Guest</h2>
                            <p className="text-gray-500 text-sm">Search for an existing guest or create a new profile.</p>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                            />
                        </div>

                        <div className="border border-gray-100 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                            {isSearching && <div className="p-4 text-center text-gray-500">Searching...</div>}

                            {!isSearching && searchResults.map(guest => (
                                <div
                                    key={guest.id}
                                    onClick={() => setGuestId(guest.id)}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between group transition-colors ${guestId === guest.id ? 'bg-gray-50' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1a202c] text-white flex items-center justify-center font-bold">
                                            {guest.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-[#d69e2e] transition-colors">{guest.name}</p>
                                            <p className="text-xs text-gray-500">{guest.email}</p>
                                        </div>
                                    </div>
                                    <button className={`px-3 py-1 text-xs font-bold border border-gray-200 rounded-lg transition-colors ${guestId === guest.id ? 'bg-[#1a202c] text-white' : 'group-hover:bg-[#1a202c] group-hover:text-white'}`}>
                                        {guestId === guest.id ? 'Selected' : 'Select'}
                                    </button>
                                </div>
                            ))}

                            {!isSearching && searchResults.length === 0 && searchQuery.length > 2 && (
                                <div className="p-4 text-center text-gray-500">No guests found.</div>
                            )}

                            {!isSearching && searchResults.length === 0 && searchQuery.length <= 2 && (
                                <div className="p-4 text-center text-gray-400 text-sm">Type to search guests...</div>
                            )}
                        </div>

                        <div className="text-center pt-4">
                            <button className="text-[#d69e2e] font-bold text-sm hover:underline">+ Create New Guest Profile</button>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-serif font-bold text-lg mb-4">Dates & Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Check In</label>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                                value={checkInDate}
                                                onChange={(e) => setCheckInDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Check Out</label>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                                value={checkOutDate}
                                                onChange={(e) => setCheckOutDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-serif font-bold text-lg mb-4">Select Room</h3>
                                <div className="space-y-3 h-[300px] overflow-y-auto pr-2">
                                    {rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => setSelectedRoom(room.id)}
                                            className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${selectedRoom === room.id
                                                ? 'border-[#d69e2e] bg-[#d69e2e]/5 shadow-md'
                                                : 'border-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${selectedRoom === room.id ? 'bg-[#d69e2e] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <BedDouble className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Room {room.roomNumber}</p>
                                                    <p className="text-xs text-gray-500">{room.type.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                            <p className="font-serif font-bold text-[#1a202c]">{room.pricePerNight} MAD</p>
                                        </div>
                                    ))}
                                    {rooms.length === 0 && <p className="text-gray-500 italic">No rooms available for selected dates.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="text-center max-w-md mx-auto py-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#1a202c] mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-500 mb-8">Reservation #{bookingId} has been created successfully. A confirmation email has been sent to the guest.</p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/reservations" className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">
                                View Booking
                            </Link>
                            <Link to="/" className="px-6 py-3 bg-[#1a202c] text-white font-bold rounded-xl hover:bg-[#2d3748]">
                                Return to Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {currentStep < 3 && (
                <div className="flex justify-between mt-8">
                    <button
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold disabled:opacity-30 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    {currentStep === 2 ? (
                        <button
                            onClick={handleCreateBooking}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3 bg-[#1a202c] text-white font-bold rounded-xl hover:bg-[#2d3748] shadow-lg transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Confirm Booking'} <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                            className="flex items-center gap-2 px-8 py-3 bg-[#1a202c] text-white font-bold rounded-xl hover:bg-[#2d3748] shadow-lg transition-transform active:scale-95"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreateReservationPage;
