import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const DashboardCharts = ({ data = [] }: { data?: any[] }) => {
    // If no data, show empty state or defaults
    if (!data || data.length === 0) {
        return <div className="text-center p-8 text-gray-400">Loading charts...</div>;
    }

    // Calculate Totals for Headers
    const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalBookings = data.reduce((sum, item) => sum + (item.bookings || 0), 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart (Bar) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-serif font-bold text-[#1a202c] flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#d69e2e]" /> Revenue Forecast (Next 7 Days)
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 ml-7 uppercase tracking-wider font-bold">Total Confirmed: <span className="text-[#1a202c] text-sm">{totalRevenue.toLocaleString()} MAD</span></p>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                formatter={(val: number) => `${val.toLocaleString()} MAD`}
                            />
                            <Bar dataKey="revenue" fill="#1a202c" radius={[4, 4, 0, 0]} barSize={40} name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bookings Chart (Line) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-serif font-bold text-[#1a202c] flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#d69e2e]" /> Bookings Volume
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 ml-7 uppercase tracking-wider font-bold">Total Confirmed: <span className="text-[#1a202c] text-sm">{totalBookings}</span></p>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="bookings"
                                stroke="#d69e2e"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                                name="Bookings"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
