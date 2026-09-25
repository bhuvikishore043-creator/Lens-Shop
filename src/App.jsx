import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UIProvider } from './context/UIContext';
import { initializeStorage } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { RainbowGlassesBackground } from './components/layout/RainbowGlassesBackground';
import { CartDrawer } from './components/ecommerce/CartDrawer';
import { WishlistDrawer } from './components/ecommerce/WishlistDrawer';
import { AIVisionChatbot } from './components/common/AIVisionChatbot';
import { AuthModal } from './components/customer/AuthModal';
import { ExitIntentModal } from './components/ecommerce/ExitIntentModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { BookEyeTest } from './pages/BookEyeTest';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

export default function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <UIProvider>
            <Router>
              <div className="min-h-screen flex flex-col ambient-background text-slate-900 font-sans selection:bg-sky-600 selection:text-white relative overflow-x-hidden">
                {/* Fixed Vibrant Rainbow Diagonal Eyeglasses Background */}
                <RainbowGlassesBackground />

                <Navbar />

                <div className="flex-1 relative z-10">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/book-test" element={<BookEyeTest />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />

                    {/* Customer Protected Route */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <CustomerDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Staff Protected Route */}
                    <Route
                      path="/staff/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['staff']}>
                          <StaffDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin/Owner Protected Route */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>

                <CartDrawer />
                <WishlistDrawer />
                <AuthModal />
                <ExitIntentModal />
                <AIVisionChatbot />

                <Footer />
              </div>
            </Router>
          </UIProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
