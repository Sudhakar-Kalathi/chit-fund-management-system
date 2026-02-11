import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Layers, CreditCard, BookOpen, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Chit Groups', path: '/chit-groups', icon: Layers },
        { name: 'Payments', path: '/payments', icon: CreditCard },
        { name: 'Debit & Credits', path: '/daybook', icon: BookOpen }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">CF</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hidden sm:block">
                                Chit Fund Manager
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${isActive(item.path)
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive(item.path)
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                            <div className="pt-3 border-t">
                                <div className="px-4 py-2">
                                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                    <p className="text-xs text-gray-500">{user?.role}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
