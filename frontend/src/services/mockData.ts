import { User, LogIn, LogOut, Coffee } from 'lucide-react';

// Dashboard Data
export const DASHBOARD_STATS = [
    { title: 'Total Revenue', value: '54,230 MAD', trend: '+12.5%', trendUp: true, color: 'bg-green-500' },
    { title: 'Occupancy Rate', value: '84%', trend: '+5.2%', trendUp: true, color: 'bg-blue-500' },
    { title: 'Active Guests', value: '128', trend: '-2.4%', trendUp: false, color: 'bg-purple-500' },
    { title: 'Pending Bookings', value: '12', trend: '', trendUp: true, color: 'bg-[#d69e2e]' },
];

export const REVENUE_CHART_DATA = [
    { name: 'Mon', revenue: 4000, occupancy: 65, expenses: 2400 },
    { name: 'Tue', revenue: 3000, occupancy: 55, expenses: 1398 },
    { name: 'Wed', revenue: 5000, occupancy: 78, expenses: 9800 },
    { name: 'Thu', revenue: 2780, occupancy: 49, expenses: 3908 },
    { name: 'Fri', revenue: 6890, occupancy: 90, expenses: 4800 },
    { name: 'Sat', revenue: 9390, occupancy: 98, expenses: 3800 },
    { name: 'Sun', revenue: 7490, occupancy: 85, expenses: 4300 },
];

export const RECENT_ACTIVITIES = [
    { id: 1, type: 'check-in', guest: 'Sarah Johnson', room: '101', time: '10 min ago', icon: LogIn, color: 'bg-green-100 text-green-700' },
    { id: 2, type: 'order', guest: 'Michael Chen', room: '204', time: '25 min ago', desc: 'Ordered Room Service', icon: Coffee, color: 'bg-orange-100 text-orange-700' },
    { id: 3, type: 'check-out', guest: 'Emma Davis', room: '305', time: '1 hour ago', icon: LogOut, color: 'bg-blue-100 text-blue-700' },
    { id: 4, type: 'booking', guest: 'James Wilson', room: 'Suite A', time: '2 hours ago', desc: 'New Presidential Suite Booking', icon: User, color: 'bg-purple-100 text-purple-700' },
];

// Room Data
export const ROOMS_DATA = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    number: `10${i + 1}`,
    type: i % 3 === 0 ? 'Presidential Suite' : i % 2 === 0 ? 'Executive Suite' : 'Standard Room',
    price: i % 3 === 0 ? 850 : i % 2 === 0 ? 450 : 200,
    status: ['Available', 'Occupied', 'Maintenance'][i % 3],
    image: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1590490360182-f33efe80a713?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'
    ][i % 3]
}));

// Reservation Data
export const RESERVATIONS_DATA = [
    { id: 'RES-001', guest: 'Robert Ford', room: '202 (Presidential)', checkIn: '2023-12-24', checkOut: '2023-12-30', status: 'Confirmed', amount: 5100, source: 'Direct' },
    { id: 'RES-002', guest: 'Dolores Abernathy', room: '105 (Double)', checkIn: '2023-12-25', checkOut: '2023-12-27', status: 'Pending', amount: 450, source: 'Booking.com' },
    { id: 'RES-003', guest: 'Bernard Lowe', room: '201 (Suite)', checkIn: '2023-12-20', checkOut: '2023-12-23', status: 'Checked Out', amount: 1200, source: 'Direct' },
    { id: 'RES-004', guest: 'Maeve Millay', room: '108 (Standard)', checkIn: '2023-12-28', checkOut: '2024-01-02', status: 'Confirmed', amount: 800, source: 'Expedia' },
];

// Guest Data
export const GUESTS_DATA = [
    { id: 1, name: 'Robert Ford', email: 'robert.ford@delos.com', tier: 'Platinum', stays: 12, lastStay: '2 weeks ago' },
    { id: 2, name: 'Dolores Abernathy', email: 'dolores@sweetwater.com', tier: 'Gold', stays: 8, lastStay: '1 month ago' },
    { id: 3, name: 'Bernard Lowe', email: 'bernard@delos.com', tier: 'Silver', stays: 5, lastStay: '3 months ago' },
    { id: 4, name: 'Maeve Millay', email: 'maeve@butterfly.com', tier: 'Platinum', stays: 15, lastStay: '1 week ago' },
];

// Invoice Data
export const INVOICES_DATA = [
    { id: 'INV-2024-001', guest: 'Robert Ford', room: '202', date: 'Dec 24, 2023', amount: 5100, status: 'Paid', items: 12 },
    { id: 'INV-2024-002', guest: 'Dolores Abernathy', room: '105', date: 'Dec 25, 2023', amount: 450, status: 'Pending', items: 3 },
    { id: 'INV-2024-003', guest: 'Bernard Lowe', room: '201', date: 'Dec 22, 2023', amount: 1200, status: 'Paid', items: 5 },
    { id: 'INV-2024-004', guest: 'Maeve Millay', room: '108', date: 'Dec 28, 2023', amount: 800, status: 'Overdue', items: 4 },
    { id: 'INV-2024-005', guest: 'William Black', room: 'Suite A', date: 'Dec 29, 2023', amount: 3200, status: 'Paid', items: 8 },
];
