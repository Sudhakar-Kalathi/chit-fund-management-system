import { useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { paymentService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';

const Payments = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAdmin } = useAuth();

    const loadPaymentsByDate = async () => {
        if (!selectedDate) return;
        setLoading(true);
        try {
            const res = await paymentService.getByDate(selectedDate);
            setPayments(res.data.data || []);
        } catch (error) {
            console.error('Error loading payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPaymentsByMonth = async () => {
        setLoading(true);
        try {
            const res = await paymentService.getByMonth(selectedMonth.year, selectedMonth.month);
            setPayments(res.data.data || []);
        } catch (error) {
            console.error('Error loading payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* View by Date */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Calendar className="text-primary-600" size={24} />
                        <span>View by Date</span>
                    </h2>
                    <div className="space-y-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="input-field"
                        />
                        <button onClick={loadPaymentsByDate} className="btn-primary w-full">
                            View Payments
                        </button>
                    </div>
                </div>

                {/* View by Month */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Calendar className="text-primary-600" size={24} />
                        <span>View by Month</span>
                    </h2>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={selectedMonth.month}
                                onChange={(e) => setSelectedMonth({ ...selectedMonth, month: parseInt(e.target.value) })}
                                className="input-field"
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={selectedMonth.year}
                                onChange={(e) => setSelectedMonth({ ...selectedMonth, year: parseInt(e.target.value) })}
                                className="input-field"
                                placeholder="Year"
                            />
                        </div>
                        <button onClick={loadPaymentsByMonth} className="btn-primary w-full">
                            View Monthly Payments
                        </button>
                    </div>
                </div>
            </div>

            {/* Payments List */}
            {payments.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Payment Records</h2>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalAmount)}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {payments.map((payment, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{payment.customerName}</h3>
                                        <p className="text-sm text-gray-600">{payment.chitGroupName}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatDate(payment.paymentDate)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-primary-600">{formatCurrency(payment.amountPaid)}</p>
                                        <p className="text-xs text-gray-500">{payment.paymentMode}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            )}
        </div>
    );
};

export default Payments;
