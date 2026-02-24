import { useState } from 'react';
import { Search, Plus, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { paymentService } from '../services';
import { useAuth } from '../context/AuthContext';

const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];
const formatCurrency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(n || 0);

const PaymentForm = ({ initialData, onSubmit, onCancel, title = "Record New Payment" }) => {
    const [form, setForm] = useState(initialData || {
        customerName: '',
        amountGave: '',
        balance: '',
        paymentDate: formatDate(today),
        paymentTime: '',
        remarks: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSubmit({
                ...form,
                amountGave: parseFloat(form.amountGave),
                balance: form.balance ? parseFloat(form.balance) : null
            });
        } catch (err) {
            setError(err?.response?.data?.message || 'Error recording payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={18} /><span>{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                    <input name="customerName" value={form.customerName} onChange={handleChange}
                        className="input-field" required placeholder="Name of person who paid" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹) *</label>
                        <input name="amountGave" type="number" step="0.01" min="0" value={form.amountGave} onChange={handleChange}
                            className="input-field" required placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Balance (₹)</label>
                        <input name="balance" type="number" step="0.01" min="0" value={form.balance} onChange={handleChange}
                            className="input-field" placeholder="0.00 (optional)" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
                        <input name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange}
                            className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Time</label>
                        <input name="paymentTime" type="time" value={form.paymentTime} onChange={handleChange}
                            className="input-field" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea name="remarks" value={form.remarks} onChange={handleChange}
                        className="input-field" rows="2" placeholder="Any optional notes..." />
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {title.includes('Edit') ? 'Save Changes' : 'Record Payment'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const Payments = () => {
    const [activeTab, setActiveTab] = useState('view');
    const [payments, setPayments] = useState([]);
    const [viewDate, setViewDate] = useState(formatDate(today));
    const [monthView, setMonthView] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
    const [monthlyPayments, setMonthlyPayments] = useState([]);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [monthlySearched, setMonthlySearched] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [editingPayment, setEditingPayment] = useState(null);
    const { isAdmin } = useAuth();

    const handleSearch = async () => {
        if (!viewDate) return;
        setLoading(true);
        setSearched(true);
        try {
            const d = new Date(viewDate);
            const res = await paymentService.getByDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
            setPayments(res.data.data || []);
        } catch {
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchMonthly = async () => {
        setMonthlyLoading(true);
        setMonthlySearched(true);
        try {
            const res = await paymentService.getByMonth(monthView.year, monthView.month);
            setMonthlyPayments(res.data.data || []);
        } catch {
            setMonthlyPayments([]);
        } finally {
            setMonthlyLoading(false);
        }
    };

    const handlePaymentCreate = async (data) => {
        await paymentService.create(data);
        handlePaymentSuccess('Payment recorded successfully!');
    };

    const handlePaymentUpdate = async (data) => {
        await paymentService.update(editingPayment.id, data);
        handlePaymentSuccess('Payment updated successfully!');
        setEditingPayment(null);
        if (activeTab === 'view') handleSearch();
        if (activeTab === 'monthly') handleSearchMonthly();
    };

    const handlePaymentSuccess = (msg) => {
        setSuccessMsg(msg);
        setActiveTab('view');
        handleSearch();
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const is2WeeksLocked = (dateStr) => {
        const d = new Date(dateStr);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return d < twoWeeksAgo;
    };

    const tabs = [
        { id: 'view', label: '📋 View Daily' },
        { id: 'monthly', label: '📅 Monthly View' },
        ...(isAdmin ? [{ id: 'create', label: '➕ Record Payment' }] : [])
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                {successMsg && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                        <CheckCircle size={16} />{successMsg}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => { setActiveTab(t.id); setEditingPayment(null); }}
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
                                <Search size={18} /> View Payments
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : searched ? (
                        payments.length > 0 ? (
                            <div className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-800">Payments on {viewDate} ({payments.length} records)</h3>
                                    <span className="text-sm font-semibold text-green-700">
                                        Total: {formatCurrency(payments.reduce((s, p) => s + (p.amountGave || 0), 0))}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Customer</th>
                                                <th className="text-right py-2 px-3 text-gray-500 font-medium">Amount (₹)</th>
                                                <th className="text-right py-2 px-3 text-gray-500 font-medium">Balance (₹)</th>
                                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Time</th>
                                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Remarks</th>
                                                <th className="text-center py-2 px-3 text-gray-500 font-medium">Status / Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map(p => {
                                                const locked = is2WeeksLocked(p.paymentDate);
                                                return (
                                                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="py-3 px-3 font-medium text-gray-900">{p.customerName}</td>
                                                        <td className="py-3 px-3 text-right text-green-700 font-semibold">{formatCurrency(p.amountGave)}</td>
                                                        <td className="py-3 px-3 text-right text-orange-600">{p.balance ? formatCurrency(p.balance) : '—'}</td>
                                                        <td className="py-3 px-3 text-gray-500 flex items-center gap-1">
                                                            <Clock size={13} />{p.paymentTime || '—'}
                                                        </td>
                                                        <td className="py-3 px-3 text-gray-500 max-w-xs truncate" title={p.remarks}>{p.remarks || '—'}</td>
                                                        <td className="py-3 px-3 text-center">
                                                            {locked && !isAdmin ? (
                                                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 flex items-center gap-1 justify-center"><X size={11} /> Locked</span>
                                                            ) : (
                                                                <button onClick={() => setEditingPayment(p)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="card text-center py-12 text-gray-400">
                                <p>No payments found for {viewDate}</p>
                            </div>
                        )
                    ) : (
                        <div className="card text-center py-12 text-gray-400">
                            <Search size={40} className="mx-auto mb-3 opacity-20" />
                            <p>Select a date and click "View Payments" to see records</p>
                        </div>
                    )}
                </div>
            )}

            {/* Monthly View Tab */}
            {activeTab === 'monthly' && (
                <div className="space-y-4">
                    <div className="card flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input type="number" value={monthView.year} onChange={e => setMonthView(m => ({ ...m, year: parseInt(e.target.value) }))} className="input-field" style={{ width: 100 }} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <select value={monthView.month} onChange={e => setMonthView(m => ({ ...m, month: parseInt(e.target.value) }))} className="input-field" style={{ width: 150 }}>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleSearchMonthly} className="btn-primary flex items-center gap-2 mb-0.5">
                            <Search size={18} /> View Monthly Summary
                        </button>
                    </div>

                    {monthlyLoading ? (
                        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : monthlySearched ? (
                        monthlyPayments.length > 0 ? (
                            <div className="card space-y-4">
                                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-gray-800 text-lg">
                                        Summary: {new Date(2000, monthView.month - 1).toLocaleString('default', { month: 'long' })} {monthView.year}
                                    </h3>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total Collected</p>
                                        <p className="text-2xl font-bold text-green-700">{formatCurrency(monthlyPayments.reduce((s, p) => s + (p.amountGave || 0), 0))}</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50 sticky top-0 shadow-sm">
                                            <tr>
                                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                                                <th className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Customer Name</th>
                                                <th className="text-right py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Amount (₹)</th>
                                                <th className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Remarks</th>
                                                {isAdmin && <th className="text-center py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyPayments.map(p => {
                                                const locked = is2WeeksLocked(p.paymentDate);
                                                return (
                                                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{p.paymentDate}</td>
                                                        <td className="py-2.5 px-3 font-medium text-gray-900 whitespace-nowrap">{p.customerName}</td>
                                                        <td className="py-2.5 px-3 text-right text-green-700 font-semibold whitespace-nowrap">{formatCurrency(p.amountGave)}</td>
                                                        <td className="py-2.5 px-3 text-gray-500 max-w-xs truncate" title={p.remarks}>{p.remarks || '—'}</td>
                                                        {isAdmin && (
                                                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                                                <button onClick={() => setEditingPayment(p)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                                                {locked && <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700">Locked bypass</span>}
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="card text-center py-12 text-gray-400">
                                <p>No payments found for this month.</p>
                            </div>
                        )
                    ) : null}
                </div>
            )}

            {/* Edit Modal Context (Can sit outside tabs) */}
            {editingPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="w-full">
                        <PaymentForm
                            title={`Edit Payment: ${editingPayment.customerName}`}
                            initialData={editingPayment}
                            onSubmit={handlePaymentUpdate}
                            onCancel={() => setEditingPayment(null)}
                        />
                    </div>
                </div>
            )}

            {/* Create Tab - Admin Only */}
            {activeTab === 'create' && isAdmin && (
                <div className="pt-2">
                    <PaymentForm onSubmit={handlePaymentCreate} onCancel={() => setActiveTab('view')} />
                </div>
            )}
        </div>
    );
};

export default Payments;
