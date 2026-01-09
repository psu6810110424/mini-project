import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Payment from './pages/Payment'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import MyBookings from './pages/MyBookings';

// NOTE: `AdminDashboard` is imported from pages and contains the full admin UI.

const AppContent = () => {
  const location = useLocation();
  
  const authPaths = [
    '/login', 
    '/register', 
    '/admin/login', 
    '/admin/register-secret-access'
  ];

  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <>
      {/* 1. แสดง Navbar เฉพาะหน้าที่ไม่ใช่หน้า Auth */}
      {!isAuthPage && <Navbar />} 
      
      <main style={
        isAuthPage 
          ? { 
              minHeight: '100vh', 
              backgroundColor: '#f3f4f6', // สีพื้นหลังเฉพาะหน้า Login/Register ให้ดูสะอาดตา
              display: 'flex',
              flexDirection: 'column'
            } 
          : { 
              maxWidth: '1200px', 
              margin: '0 auto', 
              padding: '20px', 
              minHeight: '80vh' 
            } 
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register-secret-access" element={<AdminRegister />} />

          {/* User Protected Routes */}
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute allowedRole="USER">
                <Payment />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          {/* My Bookings Route */}
          <Route 
            path="/my-bookings" 
            element={
            <ProtectedRoute allowedRole="USER">
              <MyBookings />
            </ProtectedRoute>
            } 
          />
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;