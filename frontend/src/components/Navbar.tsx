import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-[#1a202c] border-b border-gray-800 text-white">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-serif tracking-tight text-white flex items-center gap-2">
                    <span className="text-[#d69e2e]">Grandeur</span>Hotel
                </Link>

                <div className="flex items-center space-x-8">
                    <Link to="/rooms" className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        Rooms
                    </Link>
                    <Link to="/rooms" className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        Bookings
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-6 pl-6 border-l border-gray-700">
                            <span className="text-gray-300 font-serif italic text-sm">
                                Welcome, {user}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold uppercase tracking-widest text-[#d69e2e] hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-[#d69e2e] text-[#1a202c] hover:bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
