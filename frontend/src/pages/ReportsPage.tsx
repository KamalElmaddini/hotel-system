import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';

const ReportsPage = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const bookings = await bookingService.getBookings();
                processBookings(bookings);
            } catch (error) {
                console.error("Failed to load report data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const processBookings = (bookings: Booking[]) => {
        // Init last 6 months
        const months: Record<string, { name: string, revenue: number, bookings: number }> = {};
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = d.toLocaleString('default', { month: 'short' }); // e.g., "Dec"
            months[key] = { name: key, revenue: 0, bookings: 0 };
        }

        // Aggregate
        bookings.forEach(booking => {
            if (booking.status !== 'CANCELLED') {
                const date = new Date(booking.checkInDate); // Simple logic: revenue attibuted to check-in month
                const key = date.toLocaleString('default', { month: 'short' });
                if (months[key]) {
                    months[key].revenue += booking.totalPrice || 0;
                    months[key].bookings += 1;
                }
            }
        });

        // Convert to array
        const data = Object.values(months);
        setChartData(data);
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">Loading reports...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Analytics & Reports</h1>
                    <p className="text-gray-500 mt-1">Deep dive into hotel performance and metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => alert('Date range picker coming soon')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm">
                        <Calendar className="w-4 h-4" /> Last 6 Months
                    </button>
                    <button onClick={() => alert('Downloading CSV...')} className="flex items-center gap-2 px-4 py-2 bg-[#1a202c] text-white rounded-lg text-sm font-bold hover:bg-[#2d3748] shadow-lg">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#d69e2e]" /> Revenue Trend
                        </h3>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} MAD`} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(val) => `${val} MAD`} />
                                <Bar dataKey="revenue" fill="#1a202c" radius={[4, 4, 0, 0]} name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Occupancy Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Bookings Volume</h3>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="bookings" stroke="#d69e2e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Bookings" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Performance Breakdown</h3>
                <p className="text-gray-500 text-sm">Revenue calculated based on check-in date for the last 6 months.</p>
                {/* Table could go here */}
            </div>
        </div>
    );
};

export default ReportsPage;
