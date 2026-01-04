import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { type AuthResponse } from '../interfaces/types';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3000/auth/login', {
        username,
        password,
      });

      if (response.data.user.role !== 'ADMIN') {
        alert('บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วนของเจ้าหน้าที่');
        return;
      }

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_role', response.data.user.role);
      
      alert('ยินดีต้อนรับ Admin เข้าสู่ระบบ');
      
      navigate('/admin/dashboard');
      window.location.reload(); 
    } catch (error) {
      alert('Admin Username หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '80vh', backgroundColor: '#1f2937' 
    }}>
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px' 
      }}>
        <h2 style={{ textAlign: 'center', color: '#111827', marginBottom: '10px' }}>
          Admin Portal
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px', fontSize: '0.9rem' }}>
          สำหรับเจ้าหน้าที่จัดการสนามเท่านั้น
        </p>

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Admin Username</label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={{ 
            backgroundColor: '#111827', color: 'white', padding: '12px', 
            borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;