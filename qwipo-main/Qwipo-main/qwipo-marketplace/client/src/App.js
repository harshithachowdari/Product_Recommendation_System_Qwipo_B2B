import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomerLanding from './pages/CustomerLanding';
import Home from './pages/Home';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import LoyaltyDashboard from './pages/LoyaltyDashboard';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import LoadingSpinner from './components/LoadingSpinner';
import RetailerDashboard from './pages/RetailerDashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is not logged in, show B2B landing and B2B registration with navbar
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CustomerLanding />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  // If user is logged in, show main app with navbar
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Authenticated routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loyalty" element={<LoyaltyDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard/retailer" element={user?.userType === 'retailer' ? <RetailerDashboard /> : <Navigate to="/" />} />
          <Route path="/dashboard/distributor" element={user?.userType === 'distributor' ? <DistributorDashboard /> : <Navigate to="/" />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
