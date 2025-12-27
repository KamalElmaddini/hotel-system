import { create } from 'zustand';
import api from '../services/api';

interface Room {
    id: number;
    roomNumber: string;
    type: string;
    pricePerNight: number;
    status: string;
}

interface RoomState {
    rooms: Room[];
    isLoading: boolean;
    error: string | null;
    fetchRooms: () => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    isLoading: false,
    error: null,
    fetchRooms: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/rooms');
            set({ rooms: response.data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch rooms', isLoading: false });
            console.error(error);
        }
    },
}));
