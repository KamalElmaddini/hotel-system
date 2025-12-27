import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { bookingService } from '../services/bookingService';

const BillingPage = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await bookingService.getInvoices();
            setInvoices(data);
        } catch (error) {
            console.error("Failed to load invoices", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateInvoice = async () => {
        const bookingIdStr = prompt("Enter Booking ID to generate invoice for:");
        if (!bookingIdStr) return;

        try {
            await bookingService.createInvoice(parseInt(bookingIdStr));
            alert("Invoice created successfully!");
            loadInvoices();
        } catch (error) {
            alert("Failed to create invoice. Ensure Booking ID exists.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1a202c]">Billing & Invoices</h1>
                    <p className="text-gray-500 mt-1">Manage payments, invoices, and financial disputes.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleCreateInvoice} className="flex items-center gap-2 px-4 py-2 bg-[#1a202c] text-white rounded-lg text-sm font-bold hover:bg-[#2d3748] shadow-lg">
                        <Plus className="w-4 h-4" /> Create Invoice
                    </button>
                </div>
            </div>

            {/* Financial Summary - Placeholder Logic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* ... Keep existing static summary for now or calculate from `invoices` array ... */}
                <div className="bg-[#1a202c] p-6 rounded-xl text-white shadow-lg">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Invoiced</p>
                    <h2 className="text-3xl font-serif font-bold">
                        ${invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0).toFixed(2)}
                    </h2>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc]">
                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <th className="py-4 px-6">Invoice ID</th>
                            <th className="py-4 px-6">Booking ID</th>
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6">Amount</th>
                            <th className="py-4 px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="py-4 px-6 font-mono text-xs text-gray-500 font-bold">{inv.id}</td>
                                <td className="py-4 px-6 font-medium text-[#1a202c]">Booking #{inv.booking?.id || '-'}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{inv.issueDate}</td>
                                <td className="py-4 px-6 font-serif font-bold text-[#1a202c]">${inv.amount}</td>
                                <td className="py-4 px-6">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                                        Pending
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && !isLoading && (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">No invoices found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillingPage;
