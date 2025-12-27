import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Ban, Loader2 } from 'lucide-react';
import { roomService } from '../../services/roomService';
import type { Room } from '../../types';

interface ManageRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdated: () => void;
    room: Room | null;
}

const ManageRoomModal = ({ isOpen, onClose, onStatusUpdated, room }: ManageRoomModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !room) return null;

    const handleStatusChange = async (newStatus: 'AVAILABLE' | 'MAINTENANCE' | 'OCCUPIED') => {
        setIsLoading(true);
        try {
            await roomService.updateRoomStatus(room.id, newStatus);
            onStatusUpdated();
            onClose();
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statusOptions = [
        { value: 'AVAILABLE', label: 'Available', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 hover:bg-green-100', border: 'border-green-200' },
        { value: 'OCCUPIED', label: 'Occupied', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-200' },
        { value: 'MAINTENANCE', label: 'Maintenance', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100', border: 'border-orange-200' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-serif font-bold text-[#1a202c]">Manage Room {room.roomNumber}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">Current Status: <span className="font-bold text-[#1a202c]">{room.status}</span></p>

                    <div className="grid gap-3">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value as any)}
                                disabled={isLoading}
                                className={`flex items-center gap-3 p-4 rounded-xl border ${option.border} ${option.bg} transition-all text-left group`}
                            >
                                <div className={`p-2 rounded-lg bg-white ${option.color} shadow-sm`}>
                                    <option.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold ${option.color}`}>{option.label}</h4>
                                    <p className="text-xs text-gray-500">Set room status to {option.label.toLowerCase()}</p>
                                </div>
                                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRoomModal;
