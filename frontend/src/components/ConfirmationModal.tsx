import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmStyle?: 'danger' | 'primary' | 'success';
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    confirmStyle = 'primary'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    const getButtonStyle = () => {
        switch (confirmStyle) {
            case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
            case 'success': return 'bg-green-600 hover:bg-green-700 text-white';
            default: return 'bg-[#1a202c] hover:bg-[#2d3748] text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${confirmStyle === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 text-sm font-bold rounded-lg shadow-sm transition-all ${getButtonStyle()}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
