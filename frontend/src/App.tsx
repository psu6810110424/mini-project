import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Payment from './pages/Payment'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import MyBookings from './pages/MyBookings';

// ---------------------------------------------------------
// 1. ส่วนการจัดการเส้นทางภายใน (App Content Logic)
// ---------------------------------------------------------
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
      
      <main style={
        isAuthPage 
          ? { minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column' } 
          : { minHeight: '80vh' } // ลบ maxWidth ออกเพื่อให้หน้า Home แสดงผลได้เต็มตา
      }>
        <Routes>
          {/* 2. Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register-secret-access" element={<AdminRegister />} />

          {/* 3. Protected Routes (User & Admin) */}
          <Route 
            path="/payment" 
            element={<ProtectedRoute allowedRole="USER"><Payment /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/my-bookings" 
            element={<ProtectedRoute allowedRole="USER"><MyBookings /></ProtectedRoute>} 
          />

          {/* 4. Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
};

// ---------------------------------------------------------
// 2. ส่วนโครงสร้างหลักของแอป (Main Entry)
// ---------------------------------------------------------
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;