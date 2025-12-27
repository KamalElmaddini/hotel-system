import { User, LogIn, LogOut, Coffee, Calendar } from 'lucide-react';

interface ActivityItem {
    id: number;
    type: string;
    guest: string;
    room: string;
    time: string;
    desc: string;
}

const RecentActivity = ({ activities = [] }: { activities?: ActivityItem[] }) => {
    // Fallback if empty, though Dashboard usually provides data
    if (!activities || activities.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-serif font-bold text-[#1a202c] mb-6">Recent Activity</h3>
                <div className="text-gray-400 text-sm italic">No recent activity</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-serif font-bold text-[#1a202c] mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {activities.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className={`p-2 rounded-full ${item.type === 'check-in' ? 'bg-green-100 text-green-700' :
                                item.type === 'check-out' ? 'bg-blue-100 text-blue-700' :
                                    'bg-purple-100 text-purple-700'
                            }`}>
                            {item.type === 'check-in' ? <LogIn className="w-5 h-5" /> :
                                item.type === 'check-out' ? <LogOut className="w-5 h-5" /> :
                                    <Calendar className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-gray-900">{item.guest}</h4>
                                <span className="text-xs text-gray-400">{item.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {item.desc} - {item.room}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
