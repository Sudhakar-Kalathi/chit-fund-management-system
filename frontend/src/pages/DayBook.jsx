import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { dayBookService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';

const DayBook = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAdmin } = useAuth();

    const loadDayBook = async () => {
        if (!selectedDate) return;
        setLoading(true);
        try {
            const res = await dayBookService.getByDate(selectedDate);
            setSummary(res.data.data);
        } catch (error) {
            console.error('Error loading daybook:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Debit & Credits</h1>

            {/* Date Selector */}
            <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Calendar className="text-primary-600" size={24} />
                    <span>Select Date</span>
                </h2>
                <div className="flex gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input-field flex-1"
                    />
                    <button onClick={loadDayBook} className="btn-primary">
                        View DayBook
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card bg-gradient-to-br from-green-50 to-white border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Credit</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(summary.totalCredit)}</p>
                                </div>
                                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="text-white" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-red-50 to-white border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Debit</p>
                                    <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(summary.totalDebit)}</p>
                                </div>
                                <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center">
                                    <TrendingDown className="text-white" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Balance</p>
                                    <p className={`text-3xl font-bold mt-2 ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(summary.balance)}
                                    </p>
                                </div>
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${summary.balance >= 0 ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                    <span className="text-white font-bold text-2xl">=</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Entries List */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Entries for {formatDate(selectedDate)}</h2>
                        {summary.entries && summary.entries.length > 0 ? (
                            <div className="space-y-3">
                                {summary.entries.map((entry, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${entry.type === 'CREDIT' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{entry.description}</h3>
                                                {entry.category && (
                                                    <p className="text-xs text-gray-600 mt-1">Category: {entry.category}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-bold ${entry.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {entry.type === 'CREDIT' ? '+' : '-'} {formatCurrency(entry.amount)}
                                                </p>
                                                <p className="text-xs text-gray-500">{entry.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No entries for this date</p>
                        )}
                    </div>
                </>
            )}

            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            )}
        </div>
    );
};

export default DayBook;
