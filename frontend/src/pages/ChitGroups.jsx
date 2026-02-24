import { useState, useEffect } from 'react';
import { Search, Plus, Users, Calendar, ChevronRight, X, AlertCircle, CheckCircle, UserPlus, Layers, Edit2, Save, Banknote } from 'lucide-react';
import { chitGroupService, customerService, payoutService } from '../services';
import { useAuth } from '../context/AuthContext';

const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];

const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n || 0);

// ─── Create Group Form ────────────────────────────────────────────────────────
const CreateGroupForm = ({ onSuccess, onCancel }) => {
    const [form, setForm] = useState({ groupName: '', chitAmount: '', totalMonths: '', startDate: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                groupName: form.groupName,
                chitAmount: parseFloat(form.chitAmount),
                totalMonths: parseInt(form.totalMonths),
                startDate: form.startDate || null
            };
            const res = await chitGroupService.create(payload);
            onSuccess(res.data.data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Error creating group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const monthly = form.chitAmount && form.totalMonths
        ? (parseFloat(form.chitAmount) / parseInt(form.totalMonths)).toFixed(2)
        : null;

    return (
        <div className="card max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Chit Group</h2>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={18} /> <span>{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name * (must be unique)</label>
                    <input name="groupName" value={form.groupName} onChange={handleChange}
                        className="input-field" required placeholder="e.g. Gold Group Jan 2025" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chit Amount (₹) *</label>
                        <input name="chitAmount" type="number" step="1" min="1" value={form.chitAmount} onChange={handleChange}
                            className="input-field" required placeholder="e.g. 100000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Months) *</label>
                        <input name="totalMonths" type="number" min="1" max="120" value={form.totalMonths} onChange={handleChange}
                            className="input-field" required placeholder="e.g. 20" />
                    </div>
                </div>
                {monthly && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-700">
                        Monthly contribution: <strong>₹{monthly}</strong> &nbsp;·&nbsp; Total members = {form.totalMonths}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                    <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input-field" />
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        Create Group
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        </div>
    );
};

// ─── Add Member Panel ─────────────────────────────────────────────────────────
const AddMemberPanel = ({ groupId, existingMemberIds, onAdded, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(null);
    const [msg, setMsg] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await customerService.search(query);
            setResults(res.data.data || []);
        } finally { setLoading(false); }
    };

    const addMember = async (customerId) => {
        setAdding(customerId);
        try {
            await chitGroupService.addMember(groupId, customerId);
            setMsg('Member added!');
            onAdded(customerId);
            setTimeout(() => setMsg(''), 2000);
        } catch (err) {
            setMsg(err?.response?.data?.message || 'Error adding member');
        } finally { setAdding(null); }
    };

    return (
        <div className="border border-indigo-100 bg-indigo-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-indigo-800 flex items-center gap-2"><UserPlus size={16} /> Add Member</h4>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            {msg && <p className={`text-sm mb-2 font-medium ${msg.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
            <div className="flex gap-2 mb-3">
                <input value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name or phone..." className="input-field flex-1 text-sm" />
                <button onClick={handleSearch} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1">
                    <Search size={14} /> Search
                </button>
            </div>
            {loading && <div className="flex justify-center py-2"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}
            {results.map(c => {
                const alreadyIn = existingMemberIds.includes(c.id);
                return (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b border-indigo-100 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.phone} · {c.customerCode}</p>
                        </div>
                        {alreadyIn ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={12} /> In Group</span>
                        ) : (
                            <button onClick={() => addMember(c.id)} disabled={adding === c.id}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                                {adding === c.id ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={12} />}
                                Add
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ─── Group Detail View ────────────────────────────────────────────────────────
const GroupDetail = ({ groupId, onBack, isAdmin }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);
    const [activeSection, setActiveSection] = useState('summary');
    const [payouts, setPayouts] = useState([]);
    const [editingCycle, setEditingCycle] = useState(null);
    const [payingPayout, setPayingPayout] = useState(null);
    const [paymentForm, setPaymentForm] = useState({ amount: '', date: formatDate(new Date()), remarks: '' });
    const [paymentError, setPaymentError] = useState('');
    const [savingPayment, setSavingPayment] = useState(false);
    const [cycleForm, setCycleForm] = useState({});
    const [cycleError, setCycleError] = useState('');
    const [savingCycle, setSavingCycle] = useState(false);

    const loadDetails = async () => {
        setLoading(true);
        try {
            const [groupRes, payoutRes] = await Promise.all([
                chitGroupService.getById(groupId),
                payoutService.getByGroup(groupId).catch(() => ({ data: { data: [] } }))
            ]);
            setDetails(groupRes.data.data);
            setPayouts(payoutRes.data.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { loadDetails(); }, [groupId]);

    if (loading) return (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
    );

    if (!details) return <div className="text-center py-12 text-gray-400">Group not found.</div>;

    const { groupDetails: g, cycles, members } = details;
    const memberIds = members?.map(m => m.id) || [];

    const handleMemberAdded = () => loadDetails();

    const handleEditCycleClick = (cycle) => {
        setEditingCycle(cycle.id);
        setCycleForm({
            auctionDate: cycle.auctionDate || '',
            winnerId: cycle.winnerId || '',
            chitPayoutAmount: cycle.chitPayoutAmount || '',
            auctionAmount: cycle.auctionAmount || '',
            commissionAmount: cycle.commissionAmount || '',
            dividendAmount: cycle.dividendAmount || '',
            finalMonthlyAmount: cycle.finalMonthlyAmount || ''
        });
        setCycleError('');
    };

    const handleCycleFormChange = (e) => {
        setCycleForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSaveCycle = async (e) => {
        e.preventDefault();
        setCycleError('');
        setSavingCycle(true);
        try {
            await chitGroupService.updateCycle(editingCycle, cycleForm);
            setEditingCycle(null);
            loadDetails();
        } catch (err) {
            setCycleError(err?.response?.data?.message || 'Error updating cycle.');
        } finally {
            setSavingCycle(false);
        }
    };

    const handleSavePayment = async (e) => {
        e.preventDefault();
        setPaymentError('');
        setSavingPayment(true);
        try {
            await payoutService.recordPayment(payingPayout.id, paymentForm);
            setPayingPayout(null);
            loadDetails();
        } catch (err) {
            setPaymentError(err?.response?.data?.message || 'Error recording payout payment.');
        } finally {
            setSavingPayment(false);
        }
    };

    const completedCycles = cycles?.filter(c => c.status === 'COMPLETED').length || 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-sm text-blue-600 hover:underline flex items-center gap-1">← Back to Groups</button>
            </div>

            {/* Group Summary Card */}
            <div className="card">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{g.groupName}</h2>
                        <span className={`mt-1 inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${g.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{g.status}</span>
                    </div>
                    {g.startDate && <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> Started: {g.startDate}</p>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                    {[
                        { label: 'Chit Amount', value: formatCurrency(g.chitAmount), color: 'blue' },
                        { label: 'Monthly Amount', value: formatCurrency(g.monthlyAmount), color: 'indigo' },
                        { label: 'Total Months', value: g.totalMonths, color: 'purple' },
                        { label: 'Members', value: `${members?.length || 0} / ${g.totalMembers}`, color: 'teal' }
                    ].map(s => (
                        <div key={s.label} className={`text-center p-3 bg-${s.color}-50 rounded-xl border border-${s.color}-100`}>
                            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                            <p className={`font-bold text-${s.color}-700`}>{s.value}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span><span>{completedCycles} / {g.totalMonths} months completed</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${(completedCycles / (g.totalMonths || 1)) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {[
                    { id: 'summary', label: '👥 Members' },
                    { id: 'cycles', label: '📅 Monthly Cycles' },
                    { id: 'payouts', label: '🏦 Company Payouts' }
                ].map(t => (
                    <button key={t.id} onClick={() => setActiveSection(t.id)}
                        className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeSection === t.id ? 'bg-white border border-b-white border-gray-200 text-indigo-700 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Members Section */}
            {activeSection === 'summary' && (
                <div className="card space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Users size={16} /> Members ({members?.length || 0})</h3>
                        {isAdmin && members?.length < g.totalMembers && (
                            <button onClick={() => setShowAddMember(s => !s)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                                <UserPlus size={14} /> {showAddMember ? 'Hide' : 'Add Member'}
                            </button>
                        )}
                    </div>

                    {showAddMember && (
                        <AddMemberPanel groupId={groupId} existingMemberIds={memberIds}
                            onAdded={handleMemberAdded} onClose={() => setShowAddMember(false)} />
                    )}

                    {members?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {members.map((m, i) => (
                                <div key={m.id || i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {(m.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.phone} · {m.customerCode}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No members added yet.</p>
                    )}
                </div>
            )}

            {/* Cycles Section */}
            {activeSection === 'cycles' && (
                <div className="card">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><Layers size={16} /> Monthly Cycles</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Month</th>
                                    <th className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Auction Date</th>
                                    <th className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Winner</th>
                                    <th className="text-right py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Payout (₹)</th>
                                    <th className="text-right py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Monthly Amt (₹)</th>
                                    <th className="text-center py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Status</th>
                                    {isAdmin && <th className="text-center py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {cycles?.map(c => (
                                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-2.5 px-3 font-medium text-gray-700 whitespace-nowrap">Month {c.monthNumber}</td>
                                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{c.auctionDate || '—'}</td>
                                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{c.winnerName || '—'}</td>
                                        <td className="py-2.5 px-3 text-right text-green-700 font-medium whitespace-nowrap">{c.chitPayoutAmount ? formatCurrency(c.chitPayoutAmount) : '—'}</td>
                                        <td className="py-2.5 px-3 text-right text-blue-700 whitespace-nowrap">{c.finalMonthlyAmount ? formatCurrency(c.finalMonthlyAmount) : '—'}</td>
                                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                                <button onClick={() => handleEditCycleClick(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Cycle">
                                                    <Edit2 size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Cycle Modal */}
            {editingCycle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mt-10 md:mt-0 p-6 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Edit Cycle</h3>
                            <button onClick={() => setEditingCycle(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        {cycleError && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm flex gap-2 items-center">
                                <AlertCircle size={16} /> {cycleError}
                            </div>
                        )}
                        <form onSubmit={handleSaveCycle} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Auction Date</label>
                                    <input type="date" name="auctionDate" value={cycleForm.auctionDate} onChange={handleCycleFormChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Winner</label>
                                    <select name="winnerId" value={cycleForm.winnerId} onChange={handleCycleFormChange} className="input-field" required>
                                        <option value="">Select Winner...</option>
                                        {members?.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Auction Amount (₹)</label>
                                    <input type="number" step="0.01" name="auctionAmount" value={cycleForm.auctionAmount} onChange={handleCycleFormChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chit Payout (₹)</label>
                                    <input type="number" step="0.01" name="chitPayoutAmount" value={cycleForm.chitPayoutAmount} onChange={handleCycleFormChange} className="input-field" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission (₹)</label>
                                    <input type="number" step="0.01" name="commissionAmount" value={cycleForm.commissionAmount} onChange={handleCycleFormChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dividend Total (₹)</label>
                                    <input type="number" step="0.01" name="dividendAmount" value={cycleForm.dividendAmount} onChange={handleCycleFormChange} className="input-field" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Final Monthly Amt (₹) *</label>
                                <input type="number" step="0.01" name="finalMonthlyAmount" value={cycleForm.finalMonthlyAmount} onChange={handleCycleFormChange} className="input-field" required />
                                <p className="text-xs text-gray-500 mt-1">Amount each member has to pay for this month.</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={savingCycle} className="btn-primary flex-1 flex justify-center items-center gap-2">
                                    {savingCycle ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />} Save Cycle
                                </button>
                                <button type="button" onClick={() => setEditingCycle(null)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payouts Section */}
            {activeSection === 'payouts' && (
                <div className="card">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><Banknote size={16} /> Company Payouts to Winners</h3>
                    {payouts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Month</th>
                                        <th className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Winner</th>
                                        <th className="text-right py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Target (₹)</th>
                                        <th className="text-right py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Paid (₹)</th>
                                        <th className="text-right py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Balance (₹)</th>
                                        <th className="text-center py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Status</th>
                                        <th className="text-left py-2 px-3 text-gray-500 font-medium">Remarks</th>
                                        {isAdmin && <th className="text-center py-2 px-3 text-gray-500 font-medium whitespace-nowrap">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {payouts.map(p => (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-2.5 px-3 font-medium text-gray-700 whitespace-nowrap">Month {p.monthNumber}</td>
                                            <td className="py-2.5 px-3 font-medium text-gray-900 whitespace-nowrap">{p.customerName}</td>
                                            <td className="py-2.5 px-3 text-right text-gray-700 whitespace-nowrap">{formatCurrency(p.targetAmount)}</td>
                                            <td className="py-2.5 px-3 text-right text-green-700 font-semibold whitespace-nowrap">{formatCurrency(p.paidAmount)}</td>
                                            <td className="py-2.5 px-3 text-right text-orange-600 font-semibold whitespace-nowrap">{formatCurrency(p.balanceAmount)}</td>
                                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : p.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-gray-500 max-w-[200px] truncate" title={p.remarks}>{p.remarks || '—'}</td>
                                            {isAdmin && (
                                                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                                    {p.status !== 'COMPLETED' ? (
                                                        <button onClick={() => { setPayingPayout(p); setPaymentForm({ amount: p.balanceAmount, date: formatDate(new Date()), remarks: '' }); }} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded transition-colors font-medium">
                                                            Pay
                                                        </button>
                                                    ) : <span className="text-xs text-gray-400">Done</span>}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-6">No payouts generated yet. Complete a cycle to generate a payout.</p>
                    )}
                </div>
            )}

            {/* Pay Payout Modal */}
            {payingPayout && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mt-10 md:mt-0 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Record Payout</h3>
                            <button onClick={() => setPayingPayout(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Paying <strong>{payingPayout.customerName}</strong> for Month {payingPayout.monthNumber}</p>
                        {paymentError && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm flex gap-2 items-center">
                                <AlertCircle size={16} /> {paymentError}
                            </div>
                        )}
                        <form onSubmit={handleSavePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                                <input type="date" value={paymentForm.date} onChange={e => setPaymentForm(f => ({ ...f, date: e.target.value }))} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                                <input type="number" step="0.01" max={payingPayout.balanceAmount} value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} className="input-field" required />
                                <p className="text-xs text-gray-500 mt-1">Max: {formatCurrency(payingPayout.balanceAmount)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea value={paymentForm.remarks} onChange={e => setPaymentForm(f => ({ ...f, remarks: e.target.value }))} className="input-field" rows="2" placeholder="e.g. Bank Transfer ID..." />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={savingPayment} className="btn-primary flex-1 flex justify-center items-center gap-2">
                                    {savingPayment ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Record'}
                                </button>
                                <button type="button" onClick={() => setPayingPayout(null)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Group Card ───────────────────────────────────────────────────────────────
const GroupCard = ({ group, onView }) => (
    <div className="p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(group.id)}>
        <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow">
                {group.groupName.charAt(0).toUpperCase()}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${group.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {group.status}
            </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg">{group.groupName}</h3>
        <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
                <p className="text-xs text-gray-400">Chit Amount</p>
                <p className="text-sm font-semibold text-indigo-700">{formatCurrency(group.chitAmount)}</p>
            </div>
            <div>
                <p className="text-xs text-gray-400">Monthly</p>
                <p className="text-sm font-semibold text-indigo-700">{formatCurrency(group.monthlyAmount)}</p>
            </div>
            <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-sm font-medium text-gray-700">{group.totalMonths} months</p>
            </div>
            <div>
                <p className="text-xs text-gray-400">Members</p>
                <p className="text-sm font-medium text-gray-700">{group.totalMembers}</p>
            </div>
        </div>
        {group.startDate && <p className="text-xs text-gray-400 mt-3 flex items-center gap-1"><Calendar size={11} /> {group.startDate}</p>}
        <div className="mt-3 flex items-center justify-end text-indigo-600 text-xs font-medium gap-1">
            View Details <ChevronRight size={14} />
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ChitGroups = () => {
    const [activeTab, setActiveTab] = useState('view');
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (activeTab === 'view' && !selectedGroupId) loadAll();
    }, [activeTab, selectedGroupId]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const res = await chitGroupService.getAll();
            setGroups(res.data.data?.content || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) { setSearched(false); loadAll(); return; }
        setLoading(true);
        setSearched(true);
        try {
            const res = await chitGroupService.search(searchQuery);
            setGroups(res.data.data?.content || res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreateSuccess = (newGroup) => {
        setSuccessMsg(`Group "${newGroup?.groupName}" created!`);
        setActiveTab('view');
        setSearched(false);
        loadAll();
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const tabs = [
        { id: 'view', label: '📋 View Groups' },
        ...(isAdmin ? [{ id: 'create', label: '➕ Create Group' }] : [])
    ];

    if (selectedGroupId) {
        return (
            <GroupDetail groupId={selectedGroupId} isAdmin={isAdmin}
                onBack={() => { setSelectedGroupId(null); loadAll(); }} />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Chit Groups</h1>
                {successMsg && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                        <CheckCircle size={16} /> {successMsg}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`whitespace-nowrap px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === t.id ? 'bg-white border border-b-white border-gray-200 text-indigo-700 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* View Tab */}
            {activeTab === 'view' && (
                <div className="space-y-4">
                    <div className="card">
                        <div className="flex flex-wrap gap-3">
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by group name..."
                                className="input-field flex-1 min-w-48" />
                            <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
                                <Search size={18} /> Search
                            </button>
                            {searched && (
                                <button onClick={() => { setSearchQuery(''); setSearched(false); loadAll(); }}
                                    className="btn-secondary flex items-center gap-1"><X size={16} /> Clear</button>
                            )}
                        </div>
                        {searched && <p className="text-sm text-gray-500 mt-2">Found <strong>{groups.length}</strong> group(s)</p>}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groups.map(g => <GroupCard key={g.id} group={g} onView={setSelectedGroupId} />)}
                        </div>
                    ) : (
                        <div className="card text-center py-12 text-gray-400">
                            <Layers size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No chit groups found</p>
                            {isAdmin && <button onClick={() => setActiveTab('create')} className="mt-3 btn-primary inline-flex items-center gap-2"><Plus size={16} /> Create First Group</button>}
                        </div>
                    )}
                </div>
            )}

            {/* Create Tab - Admin Only */}
            {activeTab === 'create' && isAdmin && (
                <CreateGroupForm onSuccess={handleCreateSuccess} onCancel={() => setActiveTab('view')} />
            )}
        </div>
    );
};

export default ChitGroups;
