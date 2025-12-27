import { create } from 'zustand';


interface AuthState {
    token: string | null;
    user: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user'),
    login: (username, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        set({ token, user: username });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
    },
}));
