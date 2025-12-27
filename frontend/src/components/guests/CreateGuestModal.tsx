import { useState } from 'react';
import { X, User, Mail, Phone, Lock, Loader2 } from 'lucide-react';
import { userService } from '../../services/userService';

interface CreateGuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGuestCreated: () => void;
}

const CreateGuestModal = ({ isOpen, onClose, onGuestCreated }: CreateGuestModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        gender: '',
        nationality: '',
        identityDocument: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                password: formData.password || `Guest${Math.floor(Math.random() * 10000)}!`
            };
            await userService.createGuest(payload);

            userService.createNotification(`Guest ${formData.name} added to the directory`, 'success');

            onGuestCreated();
            onClose();
            setFormData({ name: '', email: '', phone: '', password: '', gender: '', nationality: '', identityDocument: '' });
        } catch (err) {
            console.error(err);
            setError('Failed to create guest. Email might be in use.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-serif font-bold text-[#1a202c]">Add New Guest</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="text"
                                placeholder="e.g. John Doe"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Gender</label>
                            <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                value={formData.gender || ''}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Nationality</label>
                            <input
                                type="text"
                                placeholder="e.g. American"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                value={formData.nationality || ''}
                                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">CIN or Passport</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-bold text-xs border border-gray-400 rounded flex items-center justify-center">ID</div>
                            <input
                                type="text"
                                placeholder="Document ID Number"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                value={formData.identityDocument || ''}
                                onChange={e => setFormData({ ...formData, identityDocument: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="email"
                                placeholder="e.g. john@example.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="e.g. +1 555 000 0000"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d69e2e]/50 outline-none transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
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
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Guest'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CreateGuestModal;
