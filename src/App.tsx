import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BasketPage from './pages/BasketPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import DevelopersPage from './pages/DevelopersPage';
import CategoriesPage from './pages/CategoriesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StaffTrackingPage from './pages/StaffTrackingPage';
import DriverTrackingPage from './pages/DriverTrackingPage';
import StaffLoginPage from './pages/StaffLoginPage';
import StaffDashboardPage from './pages/StaffDashboardPage';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/staff-login" element={<StaffLoginPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        
        {/* Protected customer routes */}
        <Route path="/basket" element={
          <ProtectedRoute>
            <BasketPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/track-order" element={
          <ProtectedRoute>
            <TrackOrderPage />
          </ProtectedRoute>
        } />
        <Route path="/developers" element={
          <ProtectedRoute>
            <DevelopersPage />
          </ProtectedRoute>
        } />
        
        {/* Staff routes */}
        <Route path="/staff" element={<StaffTrackingPage />} />
        <Route path="/driver-tracking" element={<DriverTrackingPage />} />
        <Route path="/staff-dashboard" element={<StaffDashboardPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
