import { useState } from 'react';
import { X, BedDouble, DollarSign, Loader2 } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { userService } from '../../services/userService';
// import { ROOM_TYPES } from '../../types';

import type { Room } from '../../types';

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomCreated: () => void;
    initialData?: Room;
}

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated, initialData }: CreateRoomModalProps) => {
    const [formData, setFormData] = useState({
        roomNumber: initialData?.roomNumber || '',
        type: initialData?.type || 'STANDARD',
        pricePerNight: initialData?.pricePerNight.toString() || '',
        description: initialData?.description || '',
        amenities: initialData?.amenities ? initialData.amenities.map(a => a.name) : [] as string[],
        imageUrl: initialData?.imageUrl || '',
        viewType: initialData?.viewType || 'CITY_VIEW',
        maxGuests: initialData?.maxGuests || 2,
        bedCount: initialData?.bedCount || 1
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (initialData && initialData.id) {
                await roomService.updateRoom(initialData.id, {
                    ...formData,
                    pricePerNight: parseFloat(formData.pricePerNight),
                    // Ensure enums are cast if needed, though strings should work
                });
            } else {
                await roomService.createRoom({
                    roomNumber: formData.roomNumber,
                    type: formData.type as any,
                    pricePerNight: parseFloat(formData.pricePerNight),
                    description: formData.description,
                    amenities: formData.amenities,
                    imageUrl: formData.imageUrl,
                    viewType: formData.viewType as any,
                    maxGuests: formData.maxGuests,
                    bedType: 'KING', // Default ignored by backend now
                    bedCount: formData.bedCount
                });
            }

            // Notify System
            const action = initialData ? 'updated' : 'created';
            userService.createNotification(`Room ${formData.roomNumber} has been ${action} successfully.`, 'success');

            onRoomCreated();
            onClose();
            // Reset form only if creating
            if (!initialData) {
                setFormData({
                    roomNumber: '',
                    type: 'STANDARD',
                    pricePerNight: '',
                    description: '',
                    amenities: [],
                    imageUrl: '',
                    viewType: 'CITY_VIEW',
                    maxGuests: 2,
                    bedCount: 1
                });
            }
        } catch (err: any) {
            console.error('Error creating room:', err);
            const message = err.response?.data?.message || err.response?.data || 'Failed to save room. Check inputs.';
            setError(typeof message === 'string' ? message : JSON.stringify(message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-serif font-bold text-[#1a202c]">{initialData ? 'Edit Room' : 'Add New Room'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Room Number</label>
                                <div className="relative">
                                    <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. 101"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                        value={formData.roomNumber}
                                        onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Price Per Night</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g. 150.00"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                        value={formData.pricePerNight}
                                        onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Room Type</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="STANDARD">Standard</option>
                                    <option value="SUPERIOR">Superior</option>
                                    <option value="DELUXE">Deluxe</option>
                                    <option value="SUITE">Suite</option>
                                    <option value="FAMILY">Family Room</option>
                                    <option value="ACCESSIBLE">Accessible</option>
                                    <option value="CONNECTING">Connecting</option>
                                    <option value="PRESIDENTIAL_SUITE">Presidential Suite</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">View Type</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                    value={formData.viewType}
                                    onChange={e => setFormData({ ...formData, viewType: e.target.value as any })}
                                >
                                    <option value="NO_VIEW">No View / Internal</option>
                                    <option value="CITY_VIEW">City View</option>
                                    <option value="SEA_VIEW">Sea / Ocean View</option>
                                    <option value="GARDEN_VIEW">Garden View</option>
                                    <option value="POOL_VIEW">Pool View</option>
                                    <option value="MOUNTAIN_VIEW">Mountain View</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Max Guests</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                    value={formData.maxGuests}
                                    onChange={e => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Bed Count</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                    value={formData.bedCount}
                                    onChange={e => setFormData({ ...formData, bedCount: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amenities</label>
                            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                {['Air Conditioning', 'Heating', 'Wi-Fi', 'Television', 'Safe Deposit Box', 'Coffee/Tea Maker', 'Iron/Ironing Board', 'Hair Dryer', 'Telephone'].map(amenity => (
                                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-[#1a202c] rounded focus:ring-[#d69e2e]"
                                            checked={formData.amenities.includes(amenity)}
                                            onChange={e => {
                                                const newAmenities = e.target.checked
                                                    ? [...formData.amenities, amenity]
                                                    : formData.amenities.filter(a => a !== amenity);
                                                setFormData({ ...formData, amenities: newAmenities });
                                            }}
                                        />
                                        <span className="text-sm text-gray-600">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                            <textarea
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all min-h-[80px]"
                                placeholder="Enter room description..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Room Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1a202c] file:text-white hover:file:bg-gray-700"
                                onChange={handleImageChange}
                            />
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-200" />
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-[#1a202c] text-white font-bold rounded-xl hover:bg-[#2d3748] shadow-lg shadow-gray-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialData ? 'Save Changes' : 'Create Room')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;
