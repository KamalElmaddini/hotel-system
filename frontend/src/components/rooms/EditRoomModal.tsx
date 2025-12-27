import { useState, useEffect } from 'react';
import { X, BedDouble, DollarSign, List, Loader2 } from 'lucide-react';
import { roomService } from '../../services/roomService';
import type { Room } from '../../types';

interface EditRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomUpdated: () => void;
    room: Room | null;
}

const EditRoomModal = ({ isOpen, onClose, onRoomUpdated, room }: EditRoomModalProps) => {
    const [formData, setFormData] = useState({
        roomNumber: '',
        type: 'DOUBLE',
        pricePerNight: '',
        description: '',
        amenities: '', // Comma separated
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (room) {
            setFormData({
                roomNumber: room.roomNumber,
                type: room.type,
                pricePerNight: room.pricePerNight.toString(),
                description: room.description || '',
                amenities: room.amenities?.map(a => a.name).join(', ') || '',
                imageUrl: room.imageUrl || ''
            });
        }
    }, [room, isOpen]);

    if (!isOpen || !room) return null;

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
            await roomService.updateRoom(room.id, {
                roomNumber: formData.roomNumber,
                type: formData.type as any,
                pricePerNight: parseFloat(formData.pricePerNight),
                description: formData.description,
                amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean) as any,
                imageUrl: formData.imageUrl
            });
            onRoomUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to update room.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-serif font-bold text-[#1a202c]">Edit Room {room.roomNumber}</h3>
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
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                        value={formData.pricePerNight}
                                        onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Room Type</label>
                            <div className="relative">
                                <List className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all appearance-none"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="SINGLE">Standard Single</option>
                                    <option value="DOUBLE">Standard Double</option>
                                    <option value="SUITE">Suite</option>
                                    <option value="PRESIDENTIAL_SUITE">Presidential Suite</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                            <textarea
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all min-h-[80px]"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amenities (comma separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                value={formData.amenities}
                                onChange={e => setFormData({ ...formData, amenities: e.target.value })}
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
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRoomModal;
