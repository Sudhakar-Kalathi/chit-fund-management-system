import { useState } from 'react';
import { Search, BookOpen, AlertCircle, CheckCircle, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { dayBookService } from '../services';
import { useAuth } from '../context/AuthContext';

const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];
const formatCurrency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(n || 0);

const TYPES = ['CREDIT', 'DEBIT', 'SUSPENSE'];

const DayBookForm = ({ onSuccess, onCancel }) => {
    const [form, setForm] = useState({
        entryDate: formatDate(today),
        description: '',
        amount: '',
        type: 'CREDIT',
        remarks: '',
        enteredBy: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await dayBookService.create({ ...form, amount: parseFloat(form.amount) });
            onSuccess();
        } catch (err) {
            setError(err?.response?.data?.message || 'Error recording entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Debit / Credit / Suspense</h2>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={18} /><span>{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Date *</label>
                    <input name="entryDate" type="date" value={form.entryDate} onChange={handleChange}
                        className="input-field" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <div className="flex gap-3">
                        {TYPES.map(t => (
                            <label key={t} className={`flex-1 py-2 text-center rounded-lg border-2 cursor-pointer transition-colors select-none text-sm font-medium ${form.type === t
                                ? t === 'CREDIT' ? 'border-green-500 bg-green-50 text-green-700'
                                    : t === 'DEBIT' ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'}`}>
                                <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} className="sr-only" />
                                {t === 'CREDIT' ? '➕' : t === 'DEBIT' ? '➖' : '❓'} {t}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                        className="input-field" rows="2" required placeholder="What is this entry for?" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                    <input name="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={handleChange}
                        className="input-field" required placeholder="0.00" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                    <textarea name="remarks" value={form.remarks} onChange={handleChange}
                        className="input-field" rows="2" placeholder="Additional notes..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entered By</label>
                    <input name="enteredBy" value={form.enteredBy} onChange={handleChange}
                        className="input-field" placeholder="Your name or initials (optional)" />
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        Save Entry
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const EntryRow = ({ entry }) => (
    <tr className="border-b border-gray-50 hover:bg-gray-50">
        <td className="py-3 px-3 text-gray-700 max-w-xs">{entry.description}</td>
        <td className={`py-3 px-3 text-right font-semibold ${entry.type === 'CREDIT' ? 'text-green-600' : entry.type === 'DEBIT' ? 'text-red-600' : 'text-yellow-600'}`}>
            {formatCurrency(entry.amount)}
        </td>
        <td className="py-3 px-3 text-gray-500 text-sm">{entry.remarks || '—'}</td>
        <td className="py-3 px-3 text-gray-400 text-xs">{entry.enteredBy || '—'}</td>
    </tr>
);

const DayBook = () => {
    const [activeTab, setActiveTab] = useState('view');
    const [viewDate, setViewDate] = useState(formatDate(today));
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const { isAdmin } = useAuth();

    const handleSearch = async () => {
        if (!viewDate) return;
        setLoading(true);
        setSearched(true);
        try {
            const d = new Date(viewDate);
            const res = await dayBookService.getByDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
            setData(res.data.data || null);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleEntrySuccess = () => {
        setSuccessMsg('Entry saved successfully!');
        setActiveTab('view');
        handleSearch();
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const tabs = [
        { id: 'view', label: '📖 View Day Book' },
        ...(isAdmin ? [{ id: 'create', label: '➕ Add Entry' }] : [])
    ];

    const SectionTable = ({ entries, title, colorClass, icon: Icon }) => {
        if (!entries || entries.length === 0) return null;
        const total = entries.reduce((s, e) => s + (e.amount || 0), 0);
        return (
            <div className="mb-6">
                <div className={`flex items-center justify-between mb-2 px-3 py-2 rounded-lg ${colorClass}`}>
                    <span className="font-semibold flex items-center gap-2"><Icon size={16} />{title} ({entries.length})</span>
                    <span className="font-bold">{formatCurrency(total)}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Description</th>
                                <th className="text-right py-2 px-3 text-gray-500 font-medium">Amount (₹)</th>
                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Remarks</th>
                                <th className="text-left py-2 px-3 text-gray-500 font-medium">By</th>
                            </tr>
                        </thead>
                        <tbody>{entries.map((e, i) => <EntryRow key={i} entry={e} />)}</tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Debit & Credits</h1>
                {successMsg && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                        <CheckCircle size={16} />{successMsg}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`whitespace-nowrap px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === t.id ? 'bg-white border border-b-white border-gray-200 text-blue-700 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* View Tab */}
            {activeTab === 'view' && (
                <div className="space-y-4">
                    <div className="card">
                        <div className="flex flex-wrap gap-3 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                                <input type="date" value={viewDate} onChange={e => { setViewDate(e.target.value); setSearched(false); }}
                                    className="input-field" style={{ width: 180 }} />
                            </div>
                            <button onClick={handleSearch} className="btn-primary flex items-center gap-2 mb-0.5">
                                <Search size={18} /> View Day Book
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : searched && data ? (
                        <div className="card">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Day Book — {viewDate}</h3>
                            <SectionTable entries={data.credits} title="Credits" colorClass="bg-green-50 text-green-700" icon={TrendingUp} />
                            <SectionTable entries={data.debits} title="Debits" colorClass="bg-red-50 text-red-700" icon={TrendingDown} />
                            <SectionTable entries={data.suspense} title="Suspense" colorClass="bg-yellow-50 text-yellow-700" icon={HelpCircle} />

                            {/* Summary */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Total Credits</p>
                                        <p className="font-bold text-green-700">{formatCurrency(data.totalCredit)}</p>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Total Debits</p>
                                        <p className="font-bold text-red-700">{formatCurrency(data.totalDebit)}</p>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Net Balance</p>
                                        <p className={`font-bold ${(data.netBalance || 0) >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                            {formatCurrency(data.netBalance)}
                                        </p>
                                    </div>
                                    <div className={`text-center p-3 rounded-lg ${data.status === 'GAIN' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <p className="text-xs text-gray-500 mb-1">Status</p>
                                        <p className={`font-bold text-lg ${data.status === 'GAIN' ? 'text-green-700' : 'text-red-700'}`}>
                                            {data.status === 'GAIN' ? '📈 GAIN' : '📉 LOSS'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : searched ? (
                        <div className="card text-center py-12 text-gray-400">
                            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                            <p>No entries found for {viewDate}</p>
                        </div>
                    ) : (
                        <div className="card text-center py-12 text-gray-400">
                            <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
                            <p>Select a date and click "View Day Book" to see records</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Tab - Admin Only */}
            {activeTab === 'create' && isAdmin && (
                <DayBookForm onSuccess={handleEntrySuccess} onCancel={() => setActiveTab('view')} />
            )}
        </div>
    );
};

export default DayBook;
