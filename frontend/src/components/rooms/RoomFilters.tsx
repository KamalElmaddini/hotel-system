import { Filter } from 'lucide-react';

const RoomFilters = ({ activeFilters, onFilterChange }: { activeFilters: any, onFilterChange: (filters: any) => void }) => {

    const toggleFilter = (category: string, value: string) => {
        // Logic to toggle array based filters or set single value
        // For simplicity, let's assume single selection for now or handle array logic

        onFilterChange({ ...activeFilters, [category]: value === activeFilters[category] ? null : value });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-[#1a202c] flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                </h3>
                <button onClick={() => onFilterChange({})} className="text-xs text-gray-500 hover:text-[#d69e2e] underline">Clear All</button>
            </div>

            {/* Room Type */}
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">Room Type</label>
                <div className="space-y-2">
                    {[
                        { label: 'Standard', value: 'STANDARD' },
                        { label: 'Superior', value: 'SUPERIOR' },
                        { label: 'Deluxe', value: 'DELUXE' },
                        { label: 'Suite', value: 'SUITE' },
                        { label: 'Family', value: 'FAMILY' },
                        { label: 'Accessible', value: 'ACCESSIBLE' },
                        { label: 'Connecting', value: 'CONNECTING' },
                        { label: 'Presidential Suite', value: 'PRESIDENTIAL_SUITE' }
                    ].map((item) => (
                        <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeFilters.type === item.value}
                                onChange={() => toggleFilter('type', item.value)}
                                className="w-4 h-4 rounded border-gray-300 text-[#d69e2e] focus:ring-[#d69e2e]"
                            />
                            <span className={`text-sm group-hover:text-[#1a202c] transition-colors ${activeFilters.type === item.value ? 'font-bold text-[#1a202c]' : 'text-gray-600'}`}>{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* View Type */}
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">View Type</label>
                <div className="space-y-2">
                    {[
                        { label: 'Any View', value: '' },
                        { label: 'City View', value: 'CITY_VIEW' },
                        { label: 'Sea View', value: 'SEA_VIEW' },
                        { label: 'Garden View', value: 'GARDEN_VIEW' },
                        { label: 'Pool View', value: 'POOL_VIEW' },
                        { label: 'Mountain View', value: 'MOUNTAIN_VIEW' },
                        { label: 'No View', value: 'NO_VIEW' }
                    ].map((item) => (
                        <label key={item.value || 'any'} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeFilters.viewType === item.value}
                                onChange={() => toggleFilter('viewType', item.value)}
                                className="w-4 h-4 rounded border-gray-300 text-[#d69e2e] focus:ring-[#d69e2e]"
                            />
                            <span className={`text-sm group-hover:text-[#1a202c] transition-colors ${activeFilters.viewType === item.value ? 'font-bold text-[#1a202c]' : 'text-gray-600'}`}>{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Capacity & Beds */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Guests (Min)</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="Any"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-[#d69e2e] focus:border-[#d69e2e] outline-none"
                        value={activeFilters.maxGuests || ''}
                        onChange={(e) => onFilterChange({ ...activeFilters, maxGuests: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Beds (Min)</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="Any"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-[#d69e2e] focus:border-[#d69e2e] outline-none"
                        value={activeFilters.bedCount || ''}
                        onChange={(e) => onFilterChange({ ...activeFilters, bedCount: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">Status</label>
                <div className="space-y-2">
                    {[
                        { label: 'Available', value: 'AVAILABLE', color: 'bg-green-500' },
                        { label: 'Occupied', value: 'OCCUPIED', color: 'bg-blue-500' },
                        { label: 'Maintenance', value: 'MAINTENANCE', color: 'bg-orange-500' }
                    ].map((status) => (
                        <label key={status.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeFilters.status === status.value}
                                onChange={() => toggleFilter('status', status.value)}
                                className="w-4 h-4 rounded border-gray-300 text-[#d69e2e] focus:ring-[#d69e2e]"
                            />
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                                <span className={`text-sm group-hover:text-[#1a202c] transition-colors ${activeFilters.status === status.value ? 'font-bold text-[#1a202c]' : 'text-gray-600'}`}>{status.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomFilters;
