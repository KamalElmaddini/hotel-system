import { useState, useEffect } from 'react';
import { LayoutGrid, List, Plus, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import RoomFilters from '../components/rooms/RoomFilters';
import CreateRoomModal from '../components/rooms/CreateRoomModal';
import ManageRoomModal from '../components/rooms/ManageRoomModal';
import { roomService } from '../services/roomService';
import type { Room } from '../types';

const RoomListPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [sortBy, setSortBy] = useState<'roomNumber' | 'pricePerNight' | 'status'>('roomNumber');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            // Pass filters to the service
            const data = await roomService.getAvailableRooms(
                undefined,
                undefined,
                filters.type,
                filters.status,
                filters.minPrice,
                filters.maxPrice,
                filters.viewType,
                filters.maxGuests,
                filters.bedCount
            );
            setRooms(data);
        } catch (error) {
            console.error('Failed to fetch rooms', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
        setCurrentPage(1); // Reset to first page on filter change
    }, [filters]); // Re-fetch when filters change

    const handleDelete = async (room: Room) => {
        if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
            try {
                await roomService.deleteRoom(room.id);
                fetchRooms();
            } catch (error: any) {
                console.error('Failed to delete room', error);
                const message = error.response?.data?.message || 'Failed to delete room';
                alert(message);
            }
        }
    };

    const handleSort = (key: 'roomNumber' | 'pricePerNight' | 'status') => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    // Sorting & Pagination Logic
    const sortedRooms = [...rooms].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        // Handle string comparison for roomNumber or status
        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        // Handle numeric comparison
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    const totalPages = Math.ceil(sortedRooms.length / itemsPerPage);
    const paginatedRooms = sortedRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Helper to get image based on room type
    const getRoomImage = (room: Room) => {
        if (room.imageUrl) return room.imageUrl;

        switch (room.type) {
            case 'PRESIDENTIAL_SUITE': return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800';
            case 'SUITE': return 'https://images.unsplash.com/photo-1590490360182-f33efe80a713?auto=format&fit=crop&q=80&w=800';
            default: return 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800';
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">Loading rooms...</div>;
    }

    return (
        <div className="flex gap-8">
            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedRoom(null);
                }}
                onRoomCreated={fetchRooms}
                initialData={selectedRoom || undefined}
            />
            {/* EditRoomModal removed in favor of unified CreateRoomModal */}
            <ManageRoomModal
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                onStatusUpdated={fetchRooms}
                room={selectedRoom}
            />

            {/* Sidebar Filters */}
            <aside className="w-80 hidden lg:block shrink-0">
                <RoomFilters activeFilters={filters} onFilterChange={setFilters} />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Room Management</h1>
                        <p className="text-gray-500 mt-1">Manage availability, pricing, and maintenance.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                        <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-[#1a202c]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-[#1a202c]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                        <button onClick={() => { setSelectedRoom(null); setIsCreateModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#1a202c] text-white rounded-lg text-sm font-bold hover:bg-[#2d3748] transition-colors shadow-lg">
                            <Plus className="w-4 h-4" /> Add Room
                        </button>
                    </div>
                </div>

                {/* Sort / Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm font-medium text-gray-500">Showing <span className="text-[#1a202c] font-bold">{paginatedRooms.length}</span> of {rooms.length} rooms</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleSort('roomNumber')}
                            className={`text-sm font-bold flex items-center gap-1 ${sortBy === 'roomNumber' ? 'text-[#d69e2e]' : 'text-gray-500 hover:text-[#1a202c]'}`}
                        >
                            Number <ArrowUpDown className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => handleSort('pricePerNight')}
                            className={`text-sm font-bold flex items-center gap-1 ${sortBy === 'pricePerNight' ? 'text-[#d69e2e]' : 'text-gray-500 hover:text-[#1a202c]'}`}
                        >
                            Price <ArrowUpDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedRooms.map((room) => (
                            <div key={room.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                {/* Image Area */}
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm ${room.status === 'AVAILABLE' ? 'bg-green-500' :
                                            room.status === 'OCCUPIED' ? 'bg-blue-500' : 'bg-orange-500'
                                            }`}>
                                            {room.status}
                                        </span>
                                    </div>
                                    <img
                                        src={getRoomImage(room)}
                                        alt={room.type}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Delete Action - Hover Only */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(room);
                                        }}
                                        className="absolute top-4 left-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm transform hover:scale-110"
                                        title="Delete Room"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-serif font-bold text-lg text-[#1a202c]">Room {room.roomNumber}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{room.type.replace('_', ' ')}</p>
                                        </div>
                                        <p className="font-serif font-bold text-xl text-[#d69e2e]">{room.pricePerNight} MAD</p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setIsCreateModalOpen(true);
                                            }}
                                            className="flex-1 px-3 py-2 bg-[#f8fafc] text-[#1a202c] text-center text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setIsManageModalOpen(true);
                                            }}
                                            className="flex-1 px-3 py-2 bg-[#1a202c] text-white text-center text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#2d3748] transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Room Info</th>
                                    <th className="py-4 px-6">Type</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">Price</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRooms.map((room) => (
                                    <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <img src={getRoomImage(room)} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                                <span className="font-bold text-[#1a202c]">Room {room.roomNumber}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{room.type.replace('_', ' ')}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                                room.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-serif font-bold text-[#1a202c]">{room.pricePerNight} MAD</td>
                                        <td className="py-4 px-6 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedRoom(room);
                                                    setIsCreateModalOpen(true);
                                                }}
                                                className="text-gray-400 hover:text-[#d69e2e] font-bold text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room)}
                                                className="text-gray-400 hover:text-red-500 font-bold text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${currentPage === page
                                    ? 'bg-[#1a202c] text-white'
                                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomListPage;
