import api from '../api/axiosConfig';

export interface User {
    id: string;
    // username: string; // Removed confusing field, sticking to name
    name: string;
    email: string;
    role: string;
    phone?: string;
    password?: string;
    gender?: string;
    nationality?: string;
    identityDocument?: string;
}

export const userService = {
    async searchGuests(query: string): Promise<User[]> {
        const response = await api.get<User[]>(`/users/search?q=${query}`);
        return response.data;
    },

    async getGuest(id: string): Promise<User> {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    async getAllUsers(): Promise<User[]> {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    async createGuest(guest: Partial<User>): Promise<User> {
        const response = await api.post<User>('/users/guests', guest);
        return response.data;
    },

    async updateGuest(id: string, guest: Partial<User>): Promise<User> {
        const response = await api.put<User>(`/users/guests/${id}`, guest);
        return response.data;
    },

    async deleteGuest(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    },

    async getNotifications(): Promise<any[]> {
        const response = await api.get('/users/notifications');
        return response.data;
    },

    async createNotification(text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info'): Promise<void> {
        try {
            await api.post('/users/notifications', { text, type });
        } catch (error) {
            console.error("Failed to create notification", error);
        }
    }
};
