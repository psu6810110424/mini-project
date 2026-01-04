import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import type { AuthResponse } from '../interfaces/types';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3000/auth/login', {
        username,
        password,
      });

      if (response.data.user.role === 'ADMIN') {
        alert('บัญชีนี้เป็น Admin กรุณาเข้าใช้งานผ่านหน้า Admin Login เท่านั้น');
        return;
      }

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_role', response.data.user.role);
      
      alert('Login Success!');
      
      navigate('/'); 

      window.location.reload();
      
    } catch (error) {
      alert('Username หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '80vh', backgroundColor: '#f3f4f6' 
    }}>
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '16px', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' 
      }}>
        <h2 style={{ textAlign: 'center', color: '#111827', marginBottom: '30px', fontSize: '1.8rem' }}>
          เข้าสู่ระบบ
        </h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>ชื่อผู้ใช้งาน</label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>รหัสผ่าน</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" style={{ 
            backgroundColor: '#111827', color: 'white', padding: '12px', 
            borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' 
          }}>
            Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.85rem' }}>
          ยังไม่มีบัญชี? <a href="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  );
};

export default Login;