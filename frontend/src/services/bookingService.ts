import api from '../api/axiosConfig';
import type { Booking, CreateBookingCommand } from '../types';

export const bookingService = {
    createBooking: async (command: CreateBookingCommand): Promise<number> => {
        const response = await api.post<number>('/bookings', command);
        return response.data;
    },

    updateBooking: async (id: number, booking: Partial<Booking>): Promise<void> => {
        await api.put(`/bookings/${id}`, booking);
    },

    async getBooking(id: number): Promise<Booking> {
        const response = await api.get<Booking>(`/bookings/${id}`);
        return response.data;
    },

    async getBookings(guestId?: string): Promise<Booking[]> {
        const url = guestId ? `/bookings?guestId=${guestId}` : '/bookings';
        const response = await api.get<Booking[]>(url);
        return response.data;
    },

    async getInvoices(): Promise<any[]> {
        const response = await api.get<any[]>('/invoices');
        return response.data;
    },

    async createInvoice(bookingId: number): Promise<number> {
        const response = await api.post<number>('/invoices', { bookingId });
        return response.data;
    },

    deleteBooking: async (id: number): Promise<void> => {
        await api.delete(`/bookings/${id}`);
    }
};
