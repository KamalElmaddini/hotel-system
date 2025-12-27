import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

const RoomDetailPage = () => {
    const { id } = useParams();

    // Mock Data (In real app, fetch by ID)
    const room = {
        number: id || '101',
        type: 'Presidential Suite',
        price: 850,
        status: 'Available',
        description: 'Experience ultimate luxury in our Presidential Suite. Featuring panoramic city views, a private terrace, and a separate living area tailored for VIP guests.',
        amenities: ['High-Speed WiFi', 'Climate Control', 'Espresso Machine', 'Jacuzzi', '65" OLED TV', 'Mini Bar', 'Safe', 'Room Service'],
        images: [
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1590490360182-f33efe80a713?auto=format&fit=crop&q=80&w=800'
        ],
        history: [
            { id: 1, guest: 'John Doe', checkIn: '2023-12-01', checkOut: '2023-12-05', status: 'Completed' },
            { id: 2, guest: 'Jane Smith', checkIn: '2023-11-20', checkOut: '2023-11-25', status: 'Completed' }
        ],
        maintenance: [
            { id: 1, date: '2023-11-15', issue: 'AC Repair', status: 'Fixed', technician: 'Mike' }
        ]
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/rooms" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Room {room.number}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>{room.type}</span>
                        <span>•</span>
                        <span className="font-bold text-[#d69e2e]">{room.price} MAD / night</span>
                    </div>
                </div>
                <div className="ml-auto flex gap-3">
                    <button onClick={() => alert('Maintenance request logged!')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50">
                        Schedule Maintenance
                    </button>
                    <button onClick={() => alert('Edit room details...')} className="px-4 py-2 bg-[#1a202c] text-white rounded-lg text-sm font-bold hover:bg-[#2d3748]">
                        Edit Room
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image Gallery */}
                    <div className="rounded-2xl overflow-hidden shadow-sm h-[400px] relative group">
                        <img src={room.images[0]} alt="Room" className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 text-white text-xs rounded-full">
                            View All Photos
                        </div>
                    </div>

                    {/* Overview */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-serif font-bold text-lg mb-4">Room Overview</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">{room.description}</p>

                        <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide mb-4">Amenities</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {room.amenities.map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-[#d69e2e]" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Maintenance Log */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-gray-400" /> Maintenance History
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Issue</th>
                                        <th className="p-3">Technician</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {room.maintenance.map((log) => (
                                        <tr key={log.id} className="border-b border-gray-50 last:border-0">
                                            <td className="p-3 font-medium text-gray-900">{log.date}</td>
                                            <td className="p-3">{log.issue}</td>
                                            <td className="p-3 text-gray-500">{log.technician}</td>
                                            <td className="p-3">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900">Current Status</h3>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> {room.status}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Floor</span>
                                <span className="font-medium">2nd Floor</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Max Capacity</span>
                                <span className="font-medium">4 Guests</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Last Cleaned</span>
                                <span className="font-medium">Today, 10:00 AM</span>
                            </div>
                        </div>
                    </div>

                    {/* Reservation History */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" /> Recent Stays
                        </h3>
                        <div className="space-y-4">
                            {room.history.map((stay) => (
                                <div key={stay.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                        {stay.guest.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{stay.guest}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {stay.checkIn} - {stay.checkOut}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/reservations" className="block w-full mt-4 py-2 text-sm text-[#d69e2e] hover:bg-[#d69e2e]/5 rounded-lg font-bold text-center">
                            View All Reservations
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailPage;
