import api from '../api/axiosConfig';
import type { Room } from '../types';

export interface CreateRoomDTO {
    roomNumber: string;
    type: string;
    pricePerNight: number;
    description: string;
    amenities: string[];
    imageUrl?: string;
    viewType: string;
    maxGuests: number;
    bedType: string;
    bedCount: number;
}

export const roomService = {
    getAvailableRooms: async (
        checkInDate?: string,
        checkOutDate?: string,
        type?: string,
        status?: string,
        minPrice?: number,
        maxPrice?: number,
        viewType?: string,
        maxGuests?: number,
        bedCount?: number
    ): Promise<Room[]> => {
        const params: any = {};
        if (checkInDate) params.checkInDate = checkInDate;
        if (checkOutDate) params.checkOutDate = checkOutDate;
        if (type) params.type = type;
        if (status) params.status = status;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (viewType) params.viewType = viewType;
        if (maxGuests) params.maxGuests = maxGuests;
        if (bedCount) params.bedCount = bedCount;

        const response = await api.get<Room[]>('/rooms', { params });
        return response.data;
    },

    updateRoomStatus: async (id: number, status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OUT_OF_ORDER'): Promise<void> => {
        await api.put(`/rooms/${id}/status`, { roomId: id, newStatus: status });
    },

    createRoom: async (room: CreateRoomDTO): Promise<number> => {
        const response = await api.post<number>('/rooms', room);
        return response.data;
    },

    updateRoom: async (id: number, room: any): Promise<void> => {
        await api.put(`/rooms/${id}`, room);
    },

    deleteRoom: async (id: number): Promise<void> => {
        await api.delete(`/rooms/${id}`);
    }
};
