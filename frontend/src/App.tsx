import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Payment from './pages/Payment'; 
import ProtectedRoute from './components/ProtectedRoute'; 

const AdminDashboard = () => <div style={{ textAlign: 'center' }}><h1>Admin Management System</h1><p>เฉพาะ Admin เท่านั้นที่เห็นหน้านี้</p></div>;

function App() {
  return (
    <Router>
      <Navbar /> 
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Login (ถ้าสร้างไฟล์แล้วให้เปิดใช้งาน) */}
         <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Routes สำหรับ User */}
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute allowedRole="USER">
                <Payment />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes สำหรับ Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* ป้องกัน URL มั่ว */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;