import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [userType, setUserType] = useState('admin');
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleUserTypeChange = (type) => {
        setUserType(type);
        // Auto-fill credentials based on user type
        if (type === 'admin') {
            setUsername('admin');
            setPassword('admin');
        } else {
            setUsername('staff');
            setPassword('staff');
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">CF</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
                        >
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-red-700">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select User Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleUserTypeChange('admin')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${userType === 'admin'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <UserCog className="mx-auto mb-2" size={24} />
                                    <p className="font-semibold">Admin</p>
                                    <p className="text-xs mt-1">Full Access</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUserTypeChange('staff')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${userType === 'staff'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <User className="mx-auto mb-2" size={24} />
                                    <p className="font-semibold">Staff</p>
                                    <p className="text-xs mt-1">View Only</p>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            {userType === 'admin' ? '🔑 Admin has full access to create, edit, and delete' : '👁️ Staff can only view information'}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
