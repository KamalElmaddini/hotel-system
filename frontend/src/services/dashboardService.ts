
import { bookingService } from './bookingService';
import { roomService } from './roomService';
import { userService } from './userService';

export interface DashboardStats {
    totalGuests: number;      // All registered guests (role=GUEST)
    reservedGuests: number;   // Unique guests with >0 bookings
    totalReservations: number;// All bookings
    completedReservations: number;
    recentActivity: any[];
    todaysArrivals: any[];
    chartData: any[]; // New field for shared chart data
}

export const dashboardService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            // Fetch all data
            const [rooms, bookings, guests] = await Promise.all([
                roomService.getAvailableRooms(),
                bookingService.getBookings(),
                userService.getAllUsers()
            ]);

            // Create Lookups
            const guestMap = new Map(guests.map(g => [g.id, g]));
            const roomMap = new Map(rooms.map(r => [r.id, r]));

            // 1. Total & Completed Reservations
            const totalReservations = bookings.length;
            const completedReservations = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CHECKED_OUT').length;

            // 2. Guests Logic
            const totalGuests = guests.length; // Registered users
            const uniqueGuestIds = new Set(bookings.map(b => b.guestId));
            const reservedGuests = uniqueGuestIds.size; // Guests who have actually booked

            // 3. Today's Arrivals (Strictly checking in TODAY)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaysArrivals = bookings
                .filter(b => {
                    const checkIn = new Date(b.checkInDate);
                    checkIn.setHours(0, 0, 0, 0);
                    // Match today exactly
                    return checkIn.getTime() === today.getTime() && (b.status === 'CONFIRMED' || b.status === 'PENDING');
                })
                .map(b => ({
                    id: b.id,
                    guestName: guestMap.get(b.guestId)?.name || 'Unknown',
                    roomType: roomMap.get(b.roomId)?.type || 'N/A',
                    roomNumber: roomMap.get(b.roomId)?.roomNumber || 'N/A',
                    status: b.status
                }));

            // 4. Recent Activity
            const recentActivity = [...bookings]
                .sort((a, b) => b.id - a.id)
                .slice(0, 5)
                .map(b => ({
                    id: b.id,
                    type: 'booking',
                    guest: guestMap.get(b.guestId)?.name || `Guest ${b.guestId}`,
                    room: roomMap.get(b.roomId)?.roomNumber || `Room ${b.roomId}`,
                    time: 'Recently',
                    desc: `New Booking (${b.status})`
                }));

            // 5. Chart Data (Upcoming 7 Days Forecast)
            const days: Record<string, { name: string, revenue: number, bookings: number }> = {};
            const chartToday = new Date();
            chartToday.setHours(0, 0, 0, 0);

            // Initialize NEXT 7 days (including Today)
            for (let i = 0; i <= 6; i++) {
                const d = new Date(chartToday);
                d.setDate(d.getDate() + i);
                const key = d.toLocaleDateString('default', { weekday: 'short' });
                days[key] = { name: key, revenue: 0, bookings: 0 };
            }

            bookings.forEach(booking => {
                // Filter for "Sum of Confirmation" (Confirmed + Completed)
                if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' || booking.status === 'CHECKED_IN' || booking.status === 'CHECKED_OUT') {
                    const date = new Date(booking.checkInDate);

                    // Forecast: Booking date - Today should be between 0 and 6
                    const timeDiff = date.getTime() - chartToday.getTime();
                    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

                    if (daysDiff >= 0 && daysDiff <= 6) {
                        const key = date.toLocaleDateString('default', { weekday: 'short' });
                        if (days[key]) {
                            days[key].revenue += booking.totalPrice || 0;
                            days[key].bookings += 1;
                        }
                    }
                }
            });
            const chartData = Object.values(days);

            return {
                totalGuests,
                reservedGuests,
                totalReservations,
                completedReservations,
                recentActivity,
                todaysArrivals,
                chartData
            };
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
            return {
                totalGuests: 0,
                reservedGuests: 0,
                totalReservations: 0,
                completedReservations: 0,
                recentActivity: [],
                todaysArrivals: [],
                chartData: []
            };
        }
    }
};
