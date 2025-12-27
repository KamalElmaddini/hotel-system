import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/authService';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added for isLoading state
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const token = await authService.login({ username, password });
            login(username, token);
            navigate('/');
        } catch (err) {
            console.error(err);
            // @ts-ignore
            const errorMessage = err.response?.data || err.message || 'Login failed';
            setError(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Luxury Hotel Lobby"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center p-12">
                        <h1 className="text-6xl font-serif text-white mb-4 tracking-tight">Grandeur Hotel</h1>
                        <p className="text-white/90 text-lg font-light tracking-wide uppercase">Excellence in Hospitality</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif text-[#1a202c] mb-2">Welcome Back</h2>
                        <div className="h-1 w-16 bg-[#d69e2e] mx-auto rounded-full"></div>
                        <p className="text-gray-500 mt-4 font-light">Please sign in to your dashboard.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-800 p-4 mb-8 text-sm border-l-4 border-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Username</label>
                            <input
                                type="text"
                                className="input-luxury"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Admin"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
                            <input
                                type="password"
                                className="input-luxury"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="btn-primary w-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Signing In...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div className="mt-12 text-center text-xs text-gray-400 uppercase tracking-widest">
                        Protected System • Authorized Personnel Only
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
