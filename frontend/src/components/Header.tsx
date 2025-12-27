import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Header = () => {
    const { user } = useAuthStore();

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-30 flex items-center justify-between px-8 shadow-sm">
            {/* Empty spacer to push content to right */}
            <div className="flex-1"></div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">

                <div className="h-8 w-px bg-gray-200"></div>

                <Link
                    to="/settings"
                    className="p-2 text-gray-400 hover:text-[#1a202c] transition-colors rounded-full hover:bg-gray-50 bg-gray-50/50"
                >
                    <Settings className="w-5 h-5" />
                </Link>

                <Link to="/settings" className="flex items-center gap-3 pl-2 cursor-pointer group hover:opacity-80 transition-opacity">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-[#1a202c] group-hover:text-[#d69e2e] transition-colors">{user || 'Admin User'}</p>
                        <p className="text-xs text-gray-500">General Manager</p>
                    </div>
                    <div className="w-10 h-10 bg-[#1a202c] rounded-full flex items-center justify-center text-white ring-4 ring-gray-50 group-hover:ring-[#d69e2e]/20 transition-all">
                        <User className="w-5 h-5" />
                    </div>
                </Link>
            </div>
        </header >
    );
};

export default Header;
