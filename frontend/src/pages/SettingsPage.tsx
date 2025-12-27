import { useState } from 'react';
import { User, Bell, Lock, Globe, Moon, Save } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const TABS = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
];

const SettingsPage = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences and system configurations.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors border-l-4 ${activeTab === tab.id
                                    ? 'border-[#d69e2e] bg-gray-50 text-[#1a202c]'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                    {activeTab === 'general' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-[#1a202c] mb-4">System Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                        <div>
                                            <p className="font-bold text-gray-900">Hotel Name</p>
                                            <p className="text-xs text-gray-500">Visible on invoices and emails</p>
                                        </div>
                                        <input type="text" value="Grandeur Luxury Hotel" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium w-64" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                        <div>
                                            <p className="font-bold text-gray-900">Currency</p>
                                            <p className="text-xs text-gray-500">Default currency for pricing</p>
                                        </div>
                                        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium w-64">
                                            <option>MAD (DH)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Moon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Dark Mode</p>
                                                <p className="text-xs text-gray-500">Toggle system theme</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d69e2e]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a202c]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-400">
                                {user ? user.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{user || 'Admin User'}</h3>
                            <p className="text-gray-500">General Manager</p>
                            <button onClick={() => alert('Edit Profile coming soon')} className="mt-6 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50">Edit Profile</button>
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                        <button onClick={() => alert('Settings saved successfully!')} className="flex items-center gap-2 px-6 py-3 bg-[#1a202c] text-white font-bold rounded-lg hover:bg-[#2d3748] shadow-lg">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
