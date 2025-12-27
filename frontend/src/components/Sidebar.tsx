import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarDays, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';


const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuthStore();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: BedDouble, label: 'Rooms', path: '/rooms' },
        { icon: CalendarDays, label: 'Reservations', path: '/reservations' },
        { icon: Users, label: 'Guests', path: '/guests' },
        // { icon: Receipt, label: 'Billing', path: '/billing' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-[#1a202c] text-white flex flex-col h-screen fixed left-0 top-0 z-40 border-r border-gray-800">
            <div className="p-6 border-b border-gray-800">
                <Link to="/" className="flex items-center gap-3">
                    <div className="bg-[#d69e2e] p-2 rounded-lg">
                        <LayoutDashboard className="w-6 h-6 text-[#1a202c]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif font-bold tracking-tight text-white">Grandeur</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Hotel System</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-[#d69e2e] text-[#1a202c] font-bold shadow-lg'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#1a202c]' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
