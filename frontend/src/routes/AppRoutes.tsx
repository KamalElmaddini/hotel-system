import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RoomListPage from '../pages/RoomListPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/MainLayout';
import RoomDetailPage from '../pages/RoomDetailPage';
import ReservationListPage from '../pages/ReservationListPage';
import CreateReservationPage from '../pages/CreateReservationPage';
import BookingCalendarPage from '../pages/BookingCalendarPage';
import GuestManagementPage from '../pages/GuestManagementPage';
import GuestDetailPage from '../pages/GuestDetailPage';
// import BillingPage from '../pages/BillingPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/rooms" element={<RoomListPage />} />
                    <Route path="/rooms/:id" element={<RoomDetailPage />} />
                    <Route path="/reservations" element={<ReservationListPage />} />
                    <Route path="/reservations/new" element={<CreateReservationPage />} />
                    <Route path="/calendar" element={<BookingCalendarPage />} />
                    <Route path="/guests" element={<GuestManagementPage />} />
                    <Route path="/guests/:id" element={<GuestDetailPage />} />
                    {/* <Route path="/billing" element={<BillingPage />} /> */}
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
