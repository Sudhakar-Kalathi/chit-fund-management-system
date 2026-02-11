import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Customers from './pages/Customers';
import ChitGroups from './pages/ChitGroups';
import Payments from './pages/Payments';
import DayBook from './pages/DayBook';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <div className="min-h-screen flex flex-col">
                                    <Navbar />
                                    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/customers" element={<Customers />} />
                                            <Route path="/chit-groups" element={<ChitGroups />} />
                                            <Route path="/payments" element={<Payments />} />
                                            <Route path="/daybook" element={<DayBook />} />
                                            <Route path="*" element={<Navigate to="/" replace />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                </div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
