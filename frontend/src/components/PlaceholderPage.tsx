import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
    title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-lg h-[60vh]">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
                <Construction className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-serif text-[#1a202c] mb-2">{title}</h2>
            <p className="text-gray-500 max-w-md">
                This module is currently under construction as part of the Phase 10 system upgrade.
            </p>
        </div>
    );
};

export default PlaceholderPage;
