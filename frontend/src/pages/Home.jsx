import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Layers, TrendingUp, Calendar } from 'lucide-react';
import { customerService, chitGroupService } from '../services';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../utils/helpers';

const Home = () => {
    const [recentGroups, setRecentGroups] = useState([]);
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [stats, setStats] = useState({ customers: 0, groups: 0, active: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [groupsRes, customersRes] = await Promise.all([
                chitGroupService.getAll(0, 5),
                customerService.getAll(0, 5)
            ]);

            setRecentGroups(groupsRes.data.data?.content || []);
            setRecentCustomers(customersRes.data.data?.content || []);

            setStats({
                customers: customersRes.data.data?.totalElements || 0,
                groups: groupsRes.data.data?.totalElements || 0,
                active: groupsRes.data.data?.content?.filter(g => g.status === 'ACTIVE').length || 0
            });
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Customers', value: stats.customers, icon: Users, color: 'from-blue-500 to-blue-600' },
        { title: 'Total Chit Groups', value: stats.groups, icon: Layers, color: 'from-purple-500 to-purple-600' },
        { title: 'Active Groups', value: stats.active, icon: TrendingUp, color: 'from-green-500 to-green-600' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to Chit Fund Management System</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <Icon className="text-white" size={28} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Chit Groups */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <Layers className="text-primary-600" size={24} />
                        <span>Recently Created Chit Groups</span>
                    </h2>
                    <Link to="/chit-groups" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        View All →
                    </Link>
                </div>

                {recentGroups.length > 0 ? (
                    <div className="space-y-3">
                        {recentGroups.map((group) => (
                            <Link
                                key={group.id}
                                to={`/chit-groups/${group.id}`}
                                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{group.groupName}</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {formatCurrency(group.chitAmount)} • {group.totalMonths} months • {group.totalMembers} members
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${group.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {group.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No chit groups created yet</p>
                )}
            </motion.div>

            {/* Recent Customers */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <Users className="text-primary-600" size={24} />
                        <span>Recently Created Customers</span>
                    </h2>
                    <Link to="/customers" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        View All →
                    </Link>
                </div>

                {recentCustomers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentCustomers.map((customer) => (
                            <div key={customer.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                                        <p className="text-sm text-gray-600 truncate">{customer.phone}</p>
                                        <p className="text-xs text-gray-500">{customer.customerCode}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No customers created yet</p>
                )}
            </motion.div>
        </div>
    );
};

export default Home;
