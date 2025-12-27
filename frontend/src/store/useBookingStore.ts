import { create } from 'zustand';

interface BookingState {
    bookingDetails: {
        roomId: number | null;
        checkInDate: string | null;
        checkOutDate: string | null;
        guestId: string | null;
    };
    setBookingDetails: (details: Partial<BookingState['bookingDetails']>) => void;
    clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    bookingDetails: {
        roomId: null,
        checkInDate: null,
        checkOutDate: null,
        guestId: null,
    },
    setBookingDetails: (details) =>
        set((state) => ({
            bookingDetails: { ...state.bookingDetails, ...details },
        })),
    clearBooking: () =>
        set({
            bookingDetails: {
                roomId: null,
                checkInDate: null,
                checkOutDate: null,
                guestId: null,
            },
        }),
}));
