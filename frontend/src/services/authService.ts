import type { AuthRequest } from '../types';

export const authService = {
    login: async (_credentials: AuthRequest): Promise<string> => {
        // Fake login for development - bypass backend
        return "fake-jwt-token-for-dev";
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
