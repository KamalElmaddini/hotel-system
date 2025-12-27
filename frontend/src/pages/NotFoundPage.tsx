import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-serif font-bold text-[#d69e2e]/20">404</h1>
            <div className="-mt-12 relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#1a202c] mb-4">Page Not Found</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a202c] text-white font-bold rounded-xl hover:bg-[#2d3748] shadow-lg transition-transform active:scale-95"
                >
                    <Home className="w-4 h-4" /> Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
