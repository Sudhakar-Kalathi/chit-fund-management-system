import { useState, useEffect } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { chitGroupService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

const ChitGroups = () => {
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ groupName: '', chitAmount: '', totalMonths: '', startDate: '' });
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        setLoading(true);
        try {
            const res = await chitGroupService.getAll(0, 50);
            setGroups(res.data.data?.content || []);
        } catch (error) {
            console.error('Error loading groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadGroups();
            return;
        }
        setLoading(true);
        try {
            const res = await chitGroupService.search(searchQuery, 0, 50);
            setGroups(res.data.data?.content || []);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await chitGroupService.create(formData);
            setShowCreateModal(false);
            setFormData({ groupName: '', chitAmount: '', totalMonths: '', startDate: '' });
            loadGroups();
        } catch (error) {
            alert('Error creating chit group');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Chit Groups</h1>
                {isAdmin && (
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Create Group</span>
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
                        placeholder="Search by group name or amount..."
                        className="input-field flex-1"
                    />
                    <button onClick={handleSearch} className="btn-primary flex items-center space-x-2">
                        <Search size={20} />
                        <span>Search</span>
                    </button>
                </div>
            </div>

            {/* Groups List */}
            <div className="card">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : groups.length > 0 ? (
                    <div className="space-y-4">
                        {groups.map((group) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-5 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{group.groupName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${group.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {group.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Chit Amount</p>
                                                <p className="text-sm font-semibold text-gray-900">{formatCurrency(group.chitAmount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Monthly Amount</p>
                                                <p className="text-sm font-semibold text-gray-900">{formatCurrency(group.monthlyAmount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Total Months</p>
                                                <p className="text-sm font-semibold text-gray-900">{group.totalMonths}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Members</p>
                                                <p className="text-sm font-semibold text-gray-900">{group.totalMembers}</p>
                                            </div>
                                        </div>
                                        {group.startDate && (
                                            <p className="text-xs text-gray-500 mt-2">Started: {formatDate(group.startDate)}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12">No chit groups found</p>
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
                        <h2 className="text-2xl font-bold mb-4">Create Chit Group</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                                <input
                                    type="text"
                                    value={formData.groupName}
                                    onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chit Amount *</label>
                                <input
                                    type="number"
                                    value={formData.chitAmount}
                                    onChange={(e) => setFormData({ ...formData, chitAmount: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Months *</label>
                                <input
                                    type="number"
                                    value={formData.totalMonths}
                                    onChange={(e) => setFormData({ ...formData, totalMonths: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="input-field"
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

export default ChitGroups;
