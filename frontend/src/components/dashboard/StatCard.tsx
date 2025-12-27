import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color: string;
}

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: StatCardProps) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h2 className="text-3xl font-serif font-bold text-[#1a202c]">{value}</h2>
                        {trend && (
                            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                                trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                <div className={cn("p-3 rounded-lg text-white", color)}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <p className="text-xs text-gray-400">Updated just now</p>
        </div>
    );
};

export default StatCard;
