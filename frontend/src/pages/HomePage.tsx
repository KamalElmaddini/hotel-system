import StatCard from '../components/dashboard/StatCard';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import RecentActivity from '../components/dashboard/RecentActivity';
import { BadgeDollarSign, BedDouble, Users, CalendarCheck2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';

const HomePage = () => {
    const [stats, setStats] = useState({
        totalGuests: 0,
        reservedGuests: 0,
        totalReservations: 0,
        completedReservations: 0,
        recentActivity: [],
        todaysArrivals: [],
        chartData: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            const data = await dashboardService.getDashboardStats();
            setStats(data as any);
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2">Welcome back! Here's what's happening at Grandeur Hotel today.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/rooms" className="px-4 py-2 bg-white border border-gray-200 text-[#1a202c] rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                        Manage Rooms
                    </Link>
                    <Link to="/reservations/new" className="px-4 py-2 bg-[#1a202c] text-white rounded-lg text-sm font-bold hover:bg-[#2d3748] transition-colors shadow-lg shadow-gray-200">
                        + New Reservation
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Guests"
                    value={stats.totalGuests.toString()}
                    trend="Registered"
                    trendUp={true}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Guests"
                    value={stats.reservedGuests.toString()}
                    trend="With Booking"
                    trendUp={true}
                    icon={Users}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Reservations"
                    value={stats.totalReservations.toString()}
                    trend="All Time"
                    trendUp={true}
                    icon={CalendarCheck2}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Completed Stays"
                    value={stats.completedReservations.toString()}
                    icon={CheckCircle}
                    color="bg-[#d69e2e]"
                />
            </div>

            {/* Charts Section */}
            <DashboardCharts data={stats.chartData} />

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed (Takes 1 Col) */}
                <div className="lg:col-span-1">
                    <RecentActivity activities={stats.recentActivity} />
                </div>

                {/* Quick Actions / Upcoming (Takes 2 Cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-serif font-bold text-[#1a202c] mb-6">Today's Arrivals</h3>
                    <div className="overflow-x-auto">
                        {stats.todaysArrivals.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs uppercase text-gray-400 tracking-wider">
                                        <th className="pb-3 pl-2">Guest</th>
                                        <th className="pb-3">Room Type</th>
                                        <th className="pb-3">Room No.</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3 text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {stats.todaysArrivals.map((arrival: any) => (
                                        <tr key={arrival.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 pl-2 font-medium text-gray-900">{arrival.guestName}</td>
                                            <td className="py-4 text-gray-600">{arrival.roomType.replace('_', ' ')}</td>
                                            <td className="py-4 text-gray-600 font-mono">{arrival.roomNumber}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${arrival.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                    'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {arrival.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-2">
                                                <Link to="/reservations" className="text-[#d69e2e] hover:text-[#1a202c] font-bold text-xs uppercase">
                                                    Process
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No arrivals scheduled for today.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
