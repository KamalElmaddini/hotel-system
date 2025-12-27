import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Sidebar />
            <Header />
            <main className="pl-64 pt-16 min-h-screen transition-all duration-300">
                <div className="p-8 animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
