import { useState, useEffect } from 'react';
import { Search, Edit2, User, Phone, Mail, X, CheckCircle, AlertCircle, ArrowLeft, Clock, Activity, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { customerService } from '../services';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', keyName: '', phone: '', email: '', whatsappNo: '', address: '', sameAsPhone: false };

const CustomerForm = ({ initial = emptyForm, onSubmit, onCancel, title, submitLabel }) => {
    const [form, setForm] = useState({ ...emptyForm, ...initial });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'sameAsPhone') {
            setForm(f => ({ ...f, sameAsPhone: checked, whatsappNo: checked ? f.phone : '' }));
        } else {
            setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = { ...form };
            delete payload.sameAsPhone;
            await onSubmit(payload);
        } catch (err) {
            setError(err?.response?.data?.message || 'An error occurred. Please try again.');
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="input-field" required placeholder="Enter full name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Name (Introducer)</label>
                    <input name="keyName" value={form.keyName} onChange={handleChange} className="input-field" placeholder="Introducer / Key person name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="input-field" required placeholder="10-digit phone number" maxLength="10" pattern="\d{10}" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input name="whatsappNo" value={form.sameAsPhone ? form.phone : form.whatsappNo} onChange={handleChange} className="input-field" placeholder="WhatsApp number" disabled={form.sameAsPhone} />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                        <input type="checkbox" name="sameAsPhone" checked={form.sameAsPhone} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-600">Same as Phone Number</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Email address (optional)" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} className="input-field" rows="2" placeholder="Full address" />
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                        {submitLabel || 'Submit'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const CustomerCard = ({ customer, onEdit, onView, isAdmin }) => (
    <div onClick={() => onView(customer)} className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow cursor-pointer relative">
        <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow">
                {customer.name.charAt(0).toUpperCase()}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${customer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {customer.active ? 'Active' : 'Inactive'}
            </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg">{customer.name}</h3>
        {customer.keyName && <p className="text-xs text-blue-600 mt-0.5">Introducer: {customer.keyName}</p>}
        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1"><Phone size={13} /> {customer.phone}</p>
        {customer.whatsappNo && customer.whatsappNo !== customer.phone && (
            <p className="text-sm text-green-600 flex items-center gap-1"><Phone size={13} /> WA: {customer.whatsappNo}</p>
        )}
        {customer.email && <p className="text-sm text-gray-500 flex items-center gap-1"><Mail size={13} /> {customer.email}</p>}
        <p className="text-xs text-gray-400 mt-2 font-mono">{customer.customerCode}</p>
        {isAdmin && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(customer); }} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                <Edit2 size={14} /> Edit Customer
            </button>
        )}
    </div>
);

const CustomerProfile = ({ customer, onBack }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        customerService.getDetails(customer.id).then(res => {
            setData(res.data.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [customer.id]);

    if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

    const { groups, payments } = data || { groups: [], payments: [] };

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-fit">
                <ArrowLeft size={18} className="mr-2" /> Back to Customers
            </button>
            <div className="card flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow">
                    {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {customer.name}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${customer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {customer.active ? 'Active' : 'Inactive'}
                        </span>
                    </h2>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /> {customer.phone}</p>
                        {customer.whatsappNo && <p className="flex items-center gap-2"><Phone size={16} className="text-green-500" /> {customer.whatsappNo}</p>}
                        {customer.email && <p className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {customer.email}</p>}
                        {customer.keyName && <p className="flex items-center gap-2"><User size={16} className="text-gray-400" /> Intro: {customer.keyName}</p>}
                        <p className="flex items-center gap-2"><Activity size={16} className="text-gray-400" /> Code: {customer.customerCode}</p>
                        <p className="flex items-center gap-2 md:col-span-2 lg:col-span-3"><FileText size={16} className="text-gray-400" /> Address: {customer.address || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chit Group History */}
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="text-blue-600" size={24} /> Chit Group History
                    </h3>
                    {groups.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {groups.map((group, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{group.groupName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(group.chitAmount)}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${group.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {group.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No groups associated.</p>
                    )}
                </div>

                {/* Payment History */}
                <div className="card lg:row-span-2 h-fit">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="text-green-600" size={24} /> Payment History
                    </h3>
                    {payments.length > 0 ? (
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.reverse().map((payment, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(payment.paymentDate)}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(payment.amountGave)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 max-w-[150px] truncate" title={payment.remarks}>{payment.remarks || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No payments recorded.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const Customers = () => {
    const [activeTab, setActiveTab] = useState('view');
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => { if (activeTab === 'view' && !searched) loadAll(); }, [activeTab]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const res = await customerService.getAll(0, 100);
            setCustomers(res.data.data?.content || []);
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) { setSearched(false); loadAll(); return; }
        setLoading(true);
        setSearched(true);
        try {
            const res = await customerService.search(searchQuery);
            setCustomers(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    const handleCreate = async (data) => {
        await customerService.create(data);
        showSuccess('Customer created successfully!');
        setActiveTab('view');
        setSearched(false);
        loadAll();
    };

    const handleEditSubmit = async (data) => {
        await customerService.update(editCustomer.id, data);
        showSuccess('Customer updated successfully!');
        setEditCustomer(null);
        setActiveTab('view');
        loadAll();
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const tabs = [
        { id: 'view', label: '📋 View Customers' },
        ...(isAdmin ? [{ id: 'create', label: '➕ Create Customer' }, { id: 'edit', label: '✏️ Edit Customer' }] : [])
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                {successMsg && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                        <CheckCircle size={16} />{successMsg}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => { setActiveTab(t.id); setEditCustomer(null); setSelectedCustomer(null); }}
                        className={`whitespace-nowrap px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === t.id ? 'bg-white border border-b-white border-gray-200 text-blue-700 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* View Tab */}
            {activeTab === 'view' && (
                selectedCustomer ? (
                    <CustomerProfile customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} />
                ) : (
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex flex-wrap gap-3">
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search by Name, Key Name, Phone, or Email..."
                                    className="input-field flex-1 min-w-48" />
                                <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
                                    <Search size={18} /> Search
                                </button>
                                {searched && <button onClick={() => { setSearchQuery(''); setSearched(false); loadAll(); }} className="btn-secondary flex items-center gap-1"><X size={16} /> Clear</button>}
                            </div>
                            {searched && <p className="text-sm text-gray-500 mt-2">Found <strong>{customers.length}</strong> customer(s) matching "{searchQuery}"</p>}
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
                        ) : customers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {customers.map(c => <CustomerCard key={c.id} customer={c} isAdmin={isAdmin} onView={(cust) => setSelectedCustomer(cust)} onEdit={c => { setEditCustomer(c); setActiveTab('edit'); }} />)}
                            </div>
                        ) : (
                            <div className="card text-center py-12 text-gray-400">
                                <User size={48} className="mx-auto mb-3 opacity-30" />
                                <p>No customers found</p>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Create Tab - Admin Only */}
            {activeTab === 'create' && isAdmin && (
                <CustomerForm title="Create New Customer" submitLabel="Create Customer"
                    onSubmit={handleCreate} onCancel={() => setActiveTab('view')} />
            )}

            {/* Edit Tab - Admin Only */}
            {activeTab === 'edit' && isAdmin && (
                <div className="space-y-4">
                    {!editCustomer ? (
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4">Search Customer to Edit</h2>
                            <div className="flex flex-wrap gap-3">
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search by Name, Key Name, Phone, or Email..."
                                    className="input-field flex-1 min-w-48" />
                                <button onClick={handleSearch} className="btn-primary flex items-center gap-2"><Search size={18} /> Search</button>
                            </div>
                            {searched && customers.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm text-gray-500">Found <strong>{customers.length}</strong> customer(s). Select to edit:</p>
                                    {customers.map(c => (
                                        <button key={c.id} onClick={() => setEditCustomer(c)}
                                            className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                            <strong>{c.name}</strong> <span className="text-gray-500 text-sm">— {c.phone} {c.customerCode && `(${c.customerCode})`}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <CustomerForm title={`Edit: ${editCustomer.name}`} submitLabel="Save Changes"
                            initial={{ ...editCustomer, sameAsPhone: editCustomer.phone === editCustomer.whatsappNo }}
                            onSubmit={handleEditSubmit} onCancel={() => setEditCustomer(null)} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Customers;
