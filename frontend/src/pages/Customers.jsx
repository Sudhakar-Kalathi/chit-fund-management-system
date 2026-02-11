import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { customerService } from '../services';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '' });
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const res = await customerService.getAll(0, 50);
            setCustomers(res.data.data?.content || []);
        } catch (error) {
            console.error('Error loading customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadCustomers();
            return;
        }
        setLoading(true);
        try {
            const res = await customerService.search(searchQuery, 0, 50);
            setCustomers(res.data.data?.content || []);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await customerService.create(formData);
            setShowCreateModal(false);
            setFormData({ name: '', phone: '', address: '', email: '' });
            loadCustomers();
        } catch (error) {
            alert('Error creating customer');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                {isAdmin && (
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Create Customer</span>
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="card">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by name, phone, or email..."
                        className="input-field flex-1"
                    />
                    <button onClick={handleSearch} className="btn-primary flex items-center space-x-2">
                        <Search size={20} />
                        <span>Search</span>
                    </button>
                </div>
            </div>

            {/* Customers List */}
            <div className="card">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : customers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customers.map((customer) => (
                            <motion.div
                                key={customer.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {customer.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{customer.customerCode}</p>
                                <p className="text-sm text-gray-600">{customer.phone}</p>
                                {customer.address && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{customer.address}</p>}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12">No customers found</p>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold mb-4">Create Customer</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input-field"
                                    rows="3"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="btn-primary flex-1">Create</button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Customers;
